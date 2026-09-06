# Vehicle Proximity Alert Platform — Technical Specification & Database Design

**Version:** 2.0
**Status:** Locked Technical Baseline
**Architecture:** Modular Firebase Serverless Architecture
**Mobile:** React Native 0.86.2 + TypeScript
**Admin:** React + Vite
**Database:** Cloud Firestore
**Authentication:** Firebase Authentication
**Push:** Firebase Cloud Messaging
**Backend:** Firebase Cloud Functions
**Maps/Places:** Google Maps Platform
**Voice:** Native Android Text-to-Speech

## 1. Architecture Decision

Use **Firebase**, not Supabase, for MVP.

Why:
- Firebase Authentication fits mobile/web identity.
- Firestore fits document/event-oriented operational state.
- FCM provides the required push channel.
- Cloud Functions provides trusted server-side processing.
- Firestore Security Rules provide client authorization.
- Firebase App Check adds client-abuse protection.
- No always-on custom server is required.

Supabase is technically capable, but this project already benefits more from Firebase's integrated Auth + Firestore + FCM + Functions mobile stack.

## 2. High-Level Architecture

```text
Firebase
├── Authentication
├── Firestore
├── Cloud Functions
├── Cloud Messaging
└── App Check

Clients
├── React Native Mobile
│   ├── Provider / Driver
│   └── Subscriber
└── React + Vite Admin

External
├── Device GPS
├── Google Maps
└── Google Places
```

## 3. Module Boundaries

Recommended modules:
- auth
- profiles
- providers
- drivers
- vehicles
- routes
- routeRecording
- routeRuns
- tracking
- subscriptions
- alerts
- audit
- admin
- transactions
- payments (future)

## 4. Identity Model

Firebase Authentication UID is the primary account identity.

```text
accounts/{uid}
```

Roles:
- SUBSCRIBER
- PROVIDER
- DRIVER
- ADMIN

Google Sign-In is default.

Do not store passwords.

## 5. Recommended Firestore Collections

```text
accounts/{accountId}
accountPrivate/{accountId}

providers/{providerId}
drivers/{driverId}

vehicles/{vehicleId}
vehicleVersions/{versionId}

routes/{routeId}
routeVersions/{versionId}
routePaths/{routeId}/chunks/{chunkId}

routeRuns/{routeRunId}
vehicleLocations/{vehicleId}

subscribers/{subscriberId}
subscriberLocations/{locationId}

subscriptions/{subscriptionId}
subscriptionAlertStates/{stateId}

deviceTokens/{tokenId}

auditEvents/{auditEventId}
servicePricing/{pricingId}
systemConfig/{configId}
reports/{reportId}

transactions/{transactionId}        future-compatible
payments/{paymentId}                future
paymentEvents/{paymentEventId}      future
```

## 6. accounts

```text
accountId
authUid
displayName
roles[]
status                  // ACTIVE / SUSPENDED / DISABLED
emailVerified
mobileVerified
createdAt
updatedAt
lastLoginAt
schemaVersion
```

Private contact values should not be stored here if broader access is needed.

## 7. accountPrivate

```text
accountId
emailProtected
emailLookupHash
mobileProtected
mobileLookupHash
countryCode
createdAt
updatedAt
```

Rules:
- tightly restricted
- unrelated clients denied
- no encryption key inside mobile app

For searchable/unique data use:
```text
protected/encrypted canonical value
+
normalized irreversible lookup hash
```

## 8. providers

```text
providerId
ownerAccountId
serviceType
businessDisplayName
publicDisplayName
verificationStatus
status
currentPricingId
createdAt
updatedAt
```

## 9. drivers

```text
driverId
accountId
providerId          optional
displayName
verificationStatus
status
createdAt
updatedAt
```

The same account may act as both owner and driver.

## 10. vehicles

```text
vehicleId
providerId
currentDriverId     optional
serviceType
vehicleType
currentRegistrationNumber
currentVersionId
publicDescription
status
createdAt
updatedAt
```

## 11. vehicleVersions

```text
versionId
vehicleId
versionNumber
registrationNumber
vehicleType
description
validFrom
validTo              nullable
createdBy
createdAt
changeReason         optional
```

Prior versions are immutable.

## 12. servicePricing

```text
pricingId
providerId
routeId              optional
amountMinor          // paise, not floating rupees
currency             // INR
billingFrequency
validFrom
validTo              nullable
status
createdBy
createdAt
```

Price changes create new records.

## 13. routes

```text
routeId
providerId
vehicleId                    optional
routeName
serviceType
directionType                // OUTBOUND / RETURN / CUSTOM
pairedRouteId                optional
creationMethod               // RECORDED / MAP
startPoint                   GeoPoint
endPoint                     GeoPoint
startAddress
endAddress
pathRef
distanceMeters               optional
estimatedNormalDurationSec   optional
status                       // ACTIVE / INACTIVE / DELETED
currentVersionId
createdBy
createdAt
updatedAt
deletedAt                    optional
deletedBy                    optional
```

Maximum 5 active routes per provider.

## 14. routePaths

Use chunked path storage:

```text
routePaths/{routeId}/chunks/{chunkId}
```

Fields:
```text
chunkIndex
encodedPolyline
pointCount
createdAt
```

Avoid thousands of raw GeoPoints in one Firestore document.

## 15. routeVersions

```text
routeVersionId
routeId
versionNumber
routeName
startPoint
endPoint
pathRevisionRef
directionType
pairedRouteId
status
validFrom
validTo
createdBy
createdAt
changeReason
```

Editing the route produces a new version.

## 16. Route Recording Pipeline

```text
START RECORDING
  ↓
capture GPS roughly every 5–10 sec or movement threshold
  ↓
buffer locally
  ↓
periodic safe persistence
  ↓
END RECORDING
  ↓
validate route quality
  ↓
simplify/compress polyline
  ↓
save route + version + chunks
```

Do not write every raw sample permanently as an individual Firestore document.

## 17. routeRuns

This supersedes the old garbage-specific DailyRun terminology.

```text
routeRunId
routeId
routeVersionId
providerId
driverId
vehicleId
serviceType
startedAt
endedAt             optional
status              // READY/RUNNING/COMPLETED/CANCELLED/AUTO_CLOSED
startLocation
endLocation         optional
endedBy             // DRIVER / ADMIN / SYSTEM
createdAt
updatedAt
```

## 18. vehicleLocations

Latest location only:

```text
vehicleLocations/{vehicleId}
```

Fields:
```text
vehicleId
routeRunId
latitude
longitude
accuracyMeters
heading             optional
speedMps            optional
recordedAt
receivedAt
sequence
```

Ignore updates not associated with the active RouteRun.

## 19. subscribers

```text
subscriberId
accountId
displayName
status
defaultLocationId
createdAt
updatedAt
```

## 20. subscriberLocations

```text
locationId
subscriberId
label
addressProtectedOrScoped
placeId             optional
latitude
longitude
status
validFrom
validTo             optional
createdAt
updatedAt
```

Subscriber location is saved, not continuously tracked.

## 21. subscriptions

```text
subscriptionId
subscriberId
providerId
vehicleId
routeId
label
serviceType
locationId
pricingId
priceSnapshotMinor
currency
billingFrequency
status              // ACTIVE / CANCELLED / SUSPENDED
createdAt
cancelledAt         optional
updatedAt
```

Subscribers may have multiple active subscriptions.

## 22. subscriptionAlertStates

Recommended key:
```text
{routeRunId}_{subscriptionId}
```

Fields:
```text
stateId
routeRunId
subscriptionId
routeId
muted
mutedAt              optional
alert6MinSent
alert6MinSentAt      optional
alert3MinSent
alert3MinSentAt      optional
lastEvaluatedAt
createdAt
updatedAt
```

This isolates alert state per subscription per run.

## 23. deviceTokens

```text
tokenId
accountId
fcmToken
platform
deviceIdHash
enabled
createdAt
updatedAt
lastSeenAt
```

Invalid tokens should be disabled/cleaned.

## 24. Alert Processing

```text
Driver App
  ↓
GPS update
  ↓
trusted endpoint / validated write
  ↓
validate active RouteRun
  ↓
update latest vehicle location
  ↓
query active subscriptions for route
  ↓
calculate route progress / proximity / ETA
  ↓
load alert state
  ↓
trigger 6-minute alert if crossed
  ↓
trigger 3-minute alert if crossed
  ↓
persist state transactionally
  ↓
send FCM
```

## 25. ETA / Proximity Strategy

Avoid paid Google routing API calls for every update.

Initial route-aware strategy:
1. Use recorded route polyline.
2. Project vehicle position onto route.
3. Project subscriber saved location onto route.
4. Calculate forward distance along route.
5. Estimate ETA from recent/rolling vehicle speed with sensible bounds.
6. Trigger ~6-minute and ~3-minute threshold crossings.

If a saved subscriber location is materially outside the selected route corridor, warn/flag the subscription instead of generating unreliable alerts.

## 26. Alert Trigger Rules

Send only when all are true:

```text
routeRun.status == RUNNING
subscription.status == ACTIVE
subscription.routeId == routeRun.routeId
alertState.muted == false
vehicle location is fresh
subscriber lies ahead on route direction
threshold crossed
threshold has not already been sent
```

Maximum:
```text
2 alerts / subscription / routeRun
```

Use idempotent server transactions to prevent duplicates.

## 27. Voice Alert

FCM payload may contain:
```text
subscriptionId
routeRunId
serviceType
subscriptionLabel
alertStage
displayMessage
voiceText
```

Mobile uses native Android TTS when voice is enabled.

## 28. auditEvents

```text
auditEventId
actorAccountId
actorRole
action
entityType
entityId
routeRunId             optional
beforeRefOrSnapshot    optional
afterRefOrSnapshot     optional
metadata               optional
createdAt
```

Ordinary clients cannot edit/delete audit records.

## 29. Public Service Profile

Use a safe public projection rather than exposing provider private records:

```text
publicServiceProfiles/{providerId_routeId}
```

Fields may include:
```text
providerDisplayName
serviceType
driverDisplayName
verificationStatus
vehicleType
vehicleRegistrationDisplay
routeName
routeStartDisplay
routeEndDisplay
publicRouteGeometryRef
price
currency
billingFrequency
status
```

Never expose:
- private email
- private mobile
- private home address
- Firebase UID
- internal audit data

## 30. Admin Architecture

React + Vite web admin.

Use an ADMIN claim/role.

Sensitive admin operations should execute via trusted Cloud Functions.

Admin actions:
- SUSPEND_ACCOUNT
- REACTIVATE_ACCOUNT
- FORCE_CLOSE_RUN
- REVIEW_PROVIDER
- REVIEW_VEHICLE_HISTORY
- REVIEW_ROUTE_HISTORY
- REVIEW_AUDIT

Every admin action is audited.

## 31. Security Rules Principle

Default deny.

Conceptually:

```text
accounts:
  owner accesses permitted account fields

accountPrivate:
  owner/admin/trusted backend only

providers/vehicles/routes:
  provider writes own permitted records
  public users read only safe projection

subscriptions:
  subscriber owns subscription
  provider reads only operationally necessary relationship data

routeRuns:
  assigned driver/provider can start/end permitted runs
  subscriber cannot create runs

vehicleLocations:
  active assigned driver may update only current run

auditEvents:
  clients cannot mutate history
```

Test Security Rules in Firebase Emulator before production.

## 32. Cloud Functions Responsibilities

Recommended trusted functions:
- registerOrFinalizeProfile
- createRouteFromRecordedPath
- startRouteRun
- endRouteRun
- updateVehicleLocation
- evaluateRouteAlerts
- muteSubscriptionForRun
- changeVehicleVersion
- changeRouteVersion
- changePricing
- cancelSubscription
- adminSuspendAccount
- adminForceCloseRun
- scheduledRunCleanup
- sendPushNotification

Use Functions for sensitive, transactional, cross-document, audited, admin, or FCM operations.

## 33. Firestore Transactions / Batched Writes

### Start Run
- validate route ownership
- validate no conflicting active run
- create RouteRun
- associate active vehicle
- create audit event

### End Run
- validate active run
- mark completed
- clear active vehicle run
- create audit event

### Vehicle Change
- close previous version
- create new version
- update currentVersionId
- audit

### Subscription
- validate route/provider
- snapshot pricing
- create subscription
- audit

## 34. Likely Firestore Indexes

```text
routes:
  providerId + status

routeRuns:
  vehicleId + status
  driverId + status
  routeId + startedAt desc

subscriptions:
  subscriberId + status
  routeId + status
  providerId + status

auditEvents:
  entityType + entityId + createdAt desc
  actorAccountId + createdAt desc

servicePricing:
  providerId + status
  routeId + status
```

Create only indexes needed by real queries.

## 35. Cost Controls

Avoid:
- per-second normal-run GPS writes
- permanent normal-run GPS history
- subscriber polling every few seconds
- paid ETA API per location update
- duplicate alert processing
- broad unbounded listeners

Prefer:
- tracking only during active run
- latest vehicle location overwrite
- server-side threshold processing
- route-based subscription queries
- local route recording buffer
- compressed route geometry
- pagination in admin
- push-driven subscriber UX

## 36. Data Retention

Long-lived:
- account history
- vehicle versions
- route versions
- subscriptions
- routeRuns
- audit events
- future financial records

Short-lived/replaceable:
- latest vehicle location
- invalid FCM tokens
- transient processing state

Retention periods should be configurable before production.

## 37. Future Payment Model

Reserved collections:
```text
transactions/{transactionId}
payments/{paymentId}
paymentEvents/{eventId}
settlements/{settlementId}
```

Example transaction:
```text
transactionId
subscriptionId
providerId
subscriberId
type
amountMinor
currency
status
billingPeriodStart
billingPeriodEnd
gateway
gatewayReference
createdAt
updatedAt
```

Core route/alert behavior must remain independent of payment gateway availability.

## 38. Recommended Repository Structure

```text
E:\codex\GarbageCollection\

docs\
  BRD.md
  FRD.md
  TECHNICAL_SPEC.md
  existing governance/setup docs

mobile\
admin\
functions\
firebase\
  firestore.rules
  firestore.indexes.json
```

## 39. MVP Technical Milestones

1. Stable React Native scaffold
2. Firebase project + environment separation
3. Auth + roles
4. Provider profile + vehicle
5. Route recording
6. Route geometry storage
7. Subscriber profile + saved location
8. Public provider/route discovery
9. Multiple subscriptions
10. RouteRun start/end
11. Active vehicle location
12. Route-aware ETA/proximity
13. 6-minute alert
14. 3-minute alert
15. Per-run mute
16. Audit/version history
17. Admin MVP
18. Physical-device end-to-end testing
19. Security Rules/Emulator tests
20. Production hardening
