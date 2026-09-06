# Vehicle Proximity Alert Platform — Functional Requirements Document (FRD)

**Version:** 2.0
**Status:** Locked Functional Definition
**Backend:** Firebase

## 1. Roles
- SUBSCRIBER
- PROVIDER
- DRIVER
- ADMIN

## 2. Authentication

### FR-AUTH-001
Support Google Sign-In as default authentication.

### FR-AUTH-002
Require mobile number collection for providers/drivers and subscribers.

### FR-AUTH-003
Support mobile verification.

### FR-AUTH-004
Support persistent login and logout.

### FR-AUTH-005
Enforce role-based access to private data.

## 3. Provider Registration

### FR-PRO-001
Collect name, email, mobile, service type, vehicle information, and price.

### FR-PRO-002
Support service types SCHOOL_TRANSPORT and GARBAGE_COLLECTION.

### FR-PRO-003
Support school vehicle types VAN, TEMPO, CAR, BUS, OTHER.

### FR-PRO-004
Allow vehicle updates.

### FR-PRO-005
Material vehicle/provider updates create history/audit records.

## 4. Routes

### FR-ROUTE-001
Allow a maximum of 5 active routes per provider.

### FR-ROUTE-002
Primary route creation method is Record by Driving.

### FR-ROUTE-003
Capture GPS path until the driver ends recording.

### FR-ROUTE-004
Save start point, end point, path/polyline, route name, direction, and timestamps.

### FR-ROUTE-005
Allow separate return routes.

### FR-ROUTE-006
Allow outbound and return routes to be linked.

### FR-ROUTE-007
Optional map-based creation supports start, waypoints, and end.

### FR-ROUTE-008
Allow route metadata edits.

### FR-ROUTE-009
Allow route deletion from active use.

### FR-ROUTE-010
Route deletion must be soft deletion.

## 5. Route Recording

### FR-REC-001
Request location permission.

### FR-REC-002
Clearly show Recording Route state.

### FR-REC-003
Continue recording until explicitly ended.

### FR-REC-004
Use finer GPS sampling than normal runs.

### FR-REC-005
Allow route simplification/compression before storage.

### FR-REC-006
Route recording does not trigger subscriber alerts.

## 6. Subscriber Profile

### FR-SUBR-001
Register using Google and verified mobile.

### FR-SUBR-002
Collect name, email, and mobile.

### FR-SUBR-003
Save service location using Google search or current location once.

### FR-SUBR-004
Save address and coordinates.

### FR-SUBR-005
Do not require continuous subscriber GPS.

### FR-SUBR-006
Preserve material location history.

## 7. Discovery and Subscription

### FR-SUB-001
Allow discovery/selection of providers and routes.

### FR-SUB-002
Before subscription display provider, driver, verification, service type, vehicle, registration number, route, route map, price, and active status.

### FR-SUB-003
Subscription is route-specific.

### FR-SUB-004
Allow multiple active subscriptions per subscriber.

### FR-SUB-005
Allow labels such as child name.

### FR-SUB-006
Allow one garbage subscription plus multiple school transport subscriptions.

### FR-SUB-007
Snapshot applicable price at subscription creation.

### FR-SUB-008
Allow unsubscribe/cancel.

### FR-SUB-009
Preserve cancelled subscription history.

## 8. Route Runs

### FR-RUN-001
Show driver active saved routes.

### FR-RUN-002
Driver selects a route and presses START.

### FR-RUN-003
START creates a RouteRun.

### FR-RUN-004
Only one active RouteRun per driver/vehicle in MVP.

### FR-RUN-005
Active run screen shows route, map, start time, status, and END ROUTE.

### FR-RUN-006
Driver explicitly ends route.

### FR-RUN-007
Ending route stops tracking and alert generation.

### FR-RUN-008
Support backend/admin abnormal run closure.

## 9. Vehicle Tracking

### FR-TRK-001
Track vehicle only during route recording or active RouteRun.

### FR-TRK-002
Normal active tracking initially targets approximately 1-minute updates.

### FR-TRK-003
Allow adaptive intervals later.

### FR-TRK-004
Maintain latest active vehicle location separately from saved route path.

### FR-TRK-005
Reject or ignore stale location updates.

## 10. Alert Eligibility

Alerts require:
- RouteRun = RUNNING
- Subscription = ACTIVE
- subscription.routeId = routeRun.routeId
- current location data is fresh
- alert stage not already sent
- current subscription/run is not muted

## 11. Alerts

### FR-ALT-001
Default alert stages are ~6 minutes and ~3 minutes.

### FR-ALT-002
Maximum two alerts per subscription per RouteRun.

### FR-ALT-003
Persist alert state server-side to prevent duplicates.

### FR-ALT-004
Identify subscription/service in alert.

### FR-ALT-005
Use FCM for push notification.

### FR-ALT-006
Support native Android TTS voice alert.

### FR-ALT-007
Multiple subscriptions maintain separate alert state.

## 12. Mute

### FR-MUTE-001
Allow mute for current subscription/run instance.

### FR-MUTE-002
Mute is never global by default.

### FR-MUTE-003
Mute expires when RouteRun ends.

### FR-MUTE-004
New RouteRun starts unmuted.

## 13. Pricing

### FR-PRICE-001
Provider sets service price.

### FR-PRICE-002
Price changes create history.

### FR-PRICE-003
Current price is visible before subscription.

### FR-PRICE-004
Support billing frequency concept.

### FR-PRICE-005
MVP does not require online payment.

## 14. Audit

### FR-AUD-001
Record critical business actions.

### FR-AUD-002
Audit event captures actor, role, action, entity type/id, timestamp, and before/after references where applicable.

### FR-AUD-003
Ordinary clients cannot edit audit records.

### FR-AUD-004
Admin actions are audited.

## 15. Admin

### FR-ADM-001
Dashboard includes providers, drivers, vehicles, subscribers, routes, subscriptions, active runs, alerts, and audit events.

### FR-ADM-002
Admin can inspect full profile/history.

### FR-ADM-003
Admin can suspend/reactivate accounts.

### FR-ADM-004
Admin can force-close abnormal RouteRuns.

### FR-ADM-005
Admin can review reports/complaints.

### FR-ADM-006
Normal admin UI does not physically erase history.

## 16. Security

### FR-SEC-001
All protected reads/writes require authorization.

### FR-SEC-002
Role and relationship determine access.

### FR-SEC-003
Private email/mobile/location data is not exposed in public provider listings.

### FR-SEC-004
Public discovery uses dedicated safe public fields.

### FR-SEC-005
Sensitive searchable identifiers may use protected values plus secure lookup hashes.

### FR-SEC-006
Sensitive cross-document actions execute server-side.

### FR-SEC-007
Use App Check where practical.

## 17. Soft Delete

Historical entities support:
- status
- isDeleted
- deletedAt
- deletedBy

Physical deletion is reserved for legal/privacy workflows, test cleanup, or explicitly approved maintenance.

## 18. Future Payment Hooks

Reserve functional concepts for:
- billing period
- invoice
- transaction
- payment
- payment status
- gateway reference
- refund
- provider settlement
- commission

## 19. Primary Screens

### Provider/Driver
- Login
- Home
- Profile
- Vehicle
- Routes
- Add Route
- Record Route
- Route Preview
- Today's Routes
- Active Run
- History
- Settings / Logout

### Subscriber
- Login
- Profile
- Saved Location
- Discover Services
- Provider/Vehicle Detail
- Route Detail
- Subscribe
- My Subscriptions
- Current Alerts
- Subscription Settings
- History
- Settings / Logout

### Admin Web
- Login
- Dashboard
- Providers
- Drivers
- Vehicles
- Routes
- Runs
- Subscribers
- Subscriptions
- Audit
- Reports
- Configuration
- Payments (future)

## 20. Critical Acceptance Scenario

1. Driver signs in.
2. Driver enters verified mobile and vehicle details.
3. Driver records Route 1.
4. Driver records Return Route.
5. Parent signs in and verifies mobile.
6. Parent saves pickup/home location once.
7. Parent views provider, vehicle, route, and price.
8. Parent subscribes with label “Riya”.
9. Driver starts Route 1.
10. Vehicle tracking begins.
11. Parent GPS remains off.
12. Parent receives 6-minute alert.
13. Parent receives 3-minute alert.
14. No third alert occurs.
15. Mute affects only that subscription/run.
16. Driver ends route.
17. Tracking and alerts stop.
18. Driver later starts Return Route.
19. Return route alerts are independent.
20. Significant actions remain in history/audit.
