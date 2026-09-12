const {initializeApp} = require('firebase-admin/app');
const {getFirestore, FieldValue} = require('firebase-admin/firestore');
const {getMessaging} = require('firebase-admin/messaging');
const {onDocumentUpdated} = require('firebase-functions/v2/firestore');
const {logger} = require('firebase-functions');
const {distanceMeters, estimateMinutes, nextStage, projectPointOntoRoute} = require('./alertLogic');

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
  if (!Array.isArray(stages)) return DEFAULT_STAGES;
  const valid = stages.filter(stage => stage && typeof stage.id === 'string'
    && stage.id.length <= 40 && Number.isFinite(stage.minutes)
    && stage.minutes >= 1 && stage.minutes <= 30).slice(0, 5);
  return valid.length ? valid : DEFAULT_STAGES;
}

exports.evaluateRouteAlerts = onDocumentUpdated({document: 'routeRuns/{runId}', region: 'asia-south1',
  timeoutSeconds: 60, memory: '256MiB', concurrency: 10, maxInstances: 3}, async event => {
  const before = event.data.before.data();
  const run = event.data.after.data();
  if (!run || run.status !== 'ACTIVE' || !run.latestPoint) return;
  if (before?.latestPoint?.capturedAtMs === run.latestPoint.capturedAtMs) return;
  if (Date.now() - run.latestPoint.capturedAtMs > 5 * 60 * 1000) return;
  if (before?.latestPoint && run.latestPoint.capturedAtMs - before.latestPoint.capturedAtMs < 120000
    && distanceMeters(before.latestPoint, run.latestPoint) < 15) return;
  const stages = await alertStages();
  const routeSnapshot = await db.doc(`routes/${run.routeId}`).get();
  const path = routeSnapshot.exists ? routeSnapshot.data().learnedPath : null;
  const projection = projectPointOntoRoute(run.latestPoint, path);
  if (!projection || projection.distanceFromPathMeters > 1500) return;
  const speed = Math.max(3, Math.min(25, Number(run.latestSpeedMetersPerSecond) || 3));
  const maxMinutes = Math.max(...stages.filter(stage => stage.enabled !== false).map(stage => stage.minutes), 0);
  const maximumProgress = projection.progressMeters + maxMinutes * 60 * speed + 500;

  const subscriptions = await db.collection('routeSubscriptions')
    .where('routeId', '==', run.routeId).where('status', '==', 'ACTIVE')
    .where('routeProgressMeters', '>=', Math.max(0, projection.progressMeters - 100))
    .where('routeProgressMeters', '<=', maximumProgress).get();

  await Promise.all(subscriptions.docs.map(async subscriptionDoc => {
    const subscription = subscriptionDoc.data();
    const subscriberPoint = subscription.subscriberPoint;
    if (!subscriberPoint) return;
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
