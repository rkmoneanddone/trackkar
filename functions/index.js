const {initializeApp} = require('firebase-admin/app');
const {getFirestore, FieldValue} = require('firebase-admin/firestore');
const {getMessaging} = require('firebase-admin/messaging');
const {onDocumentUpdated} = require('firebase-functions/v2/firestore');
const {logger} = require('firebase-functions');
const {estimateMinutes, nextStage} = require('./alertLogic');

initializeApp();
const db = getFirestore();

exports.evaluateRouteAlerts = onDocumentUpdated('routeRuns/{runId}', async event => {
  const before = event.data.before.data();
  const run = event.data.after.data();
  if (!run || run.status !== 'ACTIVE' || !run.latestPoint) return;
  if (before?.latestPoint?.capturedAtMs === run.latestPoint.capturedAtMs) return;

  const subscriptions = await db.collection('routeSubscriptions')
    .where('routeId', '==', run.routeId).where('status', '==', 'ACTIVE').get();

  await Promise.all(subscriptions.docs.map(async subscriptionDoc => {
    const subscription = subscriptionDoc.data();
    const locationDoc = await db.doc(`subscriberLocations/${subscription.subscriberAccountId}`).get();
    if (!locationDoc.exists) return;
    const subscriberPoint = locationDoc.data().point;
    const currentMinutes = estimateMinutes(run.latestPoint, subscriberPoint,
      run.latestSpeedMetersPerSecond);
    const previousMinutes = before?.latestPoint
      ? estimateMinutes(before.latestPoint, subscriberPoint, before.latestSpeedMetersPerSecond)
      : null;
    const stateRef = db.doc(`subscriptionAlertStates/${run.id}_${subscription.id}`);
    let claimedStage = null;

    await db.runTransaction(async transaction => {
      const snapshot = await transaction.get(stateRef);
      const state = snapshot.exists ? snapshot.data() : {alert6MinSent: false, alert3MinSent: false};
      claimedStage = nextStage(previousMinutes, currentMinutes, state);
      if (!claimedStage) return;
      transaction.set(stateRef, {
        id: stateRef.id, routeRunId: run.id, subscriptionId: subscription.id,
        routeId: run.routeId, subscriberAccountId: subscription.subscriberAccountId,
        alert6MinSent: claimedStage === 'SIX_MINUTE' || state.alert6MinSent === true,
        alert3MinSent: claimedStage === 'THREE_MINUTE' || state.alert3MinSent === true,
        lastEvaluatedAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp(),
        ...(snapshot.exists ? {} : {createdAt: FieldValue.serverTimestamp()}),
      }, {merge: true});
    });
    if (!claimedStage) return;

    const tokens = await db.collection('deviceTokens')
      .where('accountId', '==', subscription.subscriberAccountId)
      .where('enabled', '==', true).get();
    if (tokens.empty) return;
    const minutes = claimedStage === 'SIX_MINUTE' ? '6' : '3';
    const response = await getMessaging().sendEachForMulticast({
      tokens: tokens.docs.map(item => item.data().fcmToken),
      notification: {title: 'TrackKar service approaching', body: `Your service is approximately ${minutes} minutes away.`},
      data: {type: 'ROUTE_ALERT', routeRunId: run.id, subscriptionId: subscription.id,
        routeId: run.routeId, alertStage: claimedStage},
      android: {priority: 'high', notification: {channelId: 'trackkar_arrivals', sound: 'default'}},
    });
    logger.info('Route alerts evaluated', {runId: run.id, subscriptionId: subscription.id,
      stage: claimedStage, successCount: response.successCount, failureCount: response.failureCount});
  }));
});
