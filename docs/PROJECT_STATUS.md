# TrackKar Project Status

**Repository:** `rkmoneanddone/trackkar`

**Development branch:** `wip/vehicle-foundation`

**Backend:** Firebase project `trackkar-b89dd`

**Mobile:** React Native CLI + TypeScript, Android first

**Admin:** Web-only (not part of the mobile application)

## Current outcome

TrackKar is a general vehicle/service proximity platform. It is not limited to
school transport or garbage collection. Operators publish services and routes,
drivers run those routes, and subscribers track one or more services.

## Implemented foundation

- Google and phone authentication with persisted sessions
- Role flows for operator, operator-driver, driver and subscriber
- Provider creation and one-time driver invite linkage
- Vehicle creation with registration validation and immutable history baseline
- Route creation, outbound/return identity and five-route limit
- Three-completed-trip route learning and learned start/end points
- Driver route listing, run start/end and periodic foreground GPS capture
- Start/end proximity validation for active learned routes
- Subscriber fixed-location capture without continuous subscriber tracking
- Active route discovery and multiple subscriptions
- Per-subscription mute, resume and stop-tracking controls
- Six-minute/three-minute proximity alert calculation engine
- Firestore access rules for the implemented mobile collections
- Account display and logout for all mobile roles
- Android native location bridge

## Deliberately excluded from mobile

- Admin login and dashboard. Administration will be a separate secured web app.
- Payments. Data structures must remain payment-ready, but checkout is deferred.

## Remaining before end-to-end MVP acceptance

1. Add Firebase Cloud Functions for server-authoritative run processing.
2. Add FCM device-token registration and background push delivery.
3. Persist one alert state per subscription per run and enforce at-most-once sends.
4. Add Android notification channels, sound/voice preferences and permission flow.
5. Make driver tracking resilient when the app is backgrounded.
6. Add route-run recovery, automatic timeout and operational error states.
7. Complete provider pricing/public-service details and subscriber presentation.
8. Build the separate web-admin project with custom-claim authorization.
9. Add emulator-backed Firestore rules tests and real-device acceptance testing.

## Required acceptance flow

```text
Operator creates vehicle and route
  -> driver connects and completes three learning runs
  -> route becomes discoverable
  -> subscriber saves a location and subscribes
  -> driver starts the learned route near its start
  -> backend processes location updates
  -> subscriber receives the 6-minute and 3-minute alerts once per run
  -> driver ends the route near its endpoint
```

## Validation checkpoint

The previous checkpoint passed TypeScript, Jest and ESLint with warnings only.
After every new checkpoint run:

```powershell
cd F:\codex\GarbageCollection\mobile
.\node_modules\.bin\tsc.cmd --noEmit
npm test -- --runInBand
npm run lint
```

Native Android rebuilds are required only after Kotlin, Android manifest, Gradle
or native dependency changes. TypeScript/UI changes should use Metro Fast Refresh.
