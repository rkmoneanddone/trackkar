const {initializeApp} = require('firebase-admin/app');
const {getFirestore, FieldValue} = require('firebase-admin/firestore');
const {getMessaging} = require('firebase-admin/messaging');
const {onDocumentUpdated} = require('firebase-functions/v2/firestore');
const {logger} = require('firebase-functions');
const {estimateMinutes, nextStage} = require('./alertLogic');

initializeApp();
const db = getFirestore();
const DEFAULT_STAGES = [
  {id: 'SIX_MINUTE', minutes: 6, enabled: true,
    title: 'TrackKar service approaching', body: 'Your service is approximately {minutes} minutes away.'},
  {id: 'THREE_MINUTE', minutes: 3, enabled: true,
    title: 'TrackKar service approaching', body: 'Your service is approximately {minutes} minutes away.'},
];

async function alertStages() {
  const snapshot = await db.doc('appConfig/alerts').get();
  const stages = snapshot.exists ? snapshot.data().stages : null;
  return Array.isArray(stages) && stages.length ? stages : DEFAULT_STAGES;
}

exports.evaluateRouteAlerts = onDocumentUpdated('routeRuns/{runId}', async event => {
  const before = event.data.before.data();
  const run = event.data.after.data();
  if (!run || run.status !== 'ACTIVE' || !run.latestPoint) return;
  if (before?.latestPoint?.capturedAtMs === run.latestPoint.capturedAtMs) return;
  const stages = await alertStages();

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
      const state = snapshot.exists ? snapshot.data() : {sentStageIds: []};
      const sentStageIds = Array.isArray(state.sentStageIds) ? state.sentStageIds : [];
      claimedStage = nextStage(previousMinutes, currentMinutes, sentStageIds, stages);
      if (!claimedStage) return;
      transaction.set(stateRef, {
        id: stateRef.id, routeRunId: run.id, subscriptionId: subscription.id,
        routeId: run.routeId, subscriberAccountId: subscription.subscriberAccountId,
        sentStageIds: [...sentStageIds, claimedStage.id],
        lastEvaluatedAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp(),
        ...(snapshot.exists ? {} : {createdAt: FieldValue.serverTimestamp()}),
      }, {merge: true});
    });
    if (!claimedStage) return;

    const tokens = await db.collection('deviceTokens')
      .where('accountId', '==', subscription.subscriberAccountId)
      .where('enabled', '==', true).get();
    if (tokens.empty) return;
    const minutes = String(claimedStage.minutes);
    const body = String(claimedStage.body || 'Your service is approximately {minutes} minutes away.')
      .replaceAll('{minutes}', minutes);
    const response = await getMessaging().sendEachForMulticast({
      tokens: tokens.docs.map(item => item.data().fcmToken),
      notification: {title: String(claimedStage.title || 'TrackKar service approaching'), body},
      data: {type: 'ROUTE_ALERT', routeRunId: run.id, subscriptionId: subscription.id,
        routeId: run.routeId, alertStage: claimedStage.id, alertMinutes: minutes},
      android: {priority: 'high', notification: {channelId: 'trackkar_arrivals', sound: 'default'}},
    });
    logger.info('Route alerts evaluated', {runId: run.id, subscriptionId: subscription.id,
      stage: claimedStage.id, successCount: response.successCount, failureCount: response.failureCount});
  }));
});
