# Vehicle Proximity Alert Platform — Business Requirements Document (BRD)

**Version:** 2.0
**Status:** Locked Product Definition
**Initial Services:** School Transport + Garbage Collection
**Backend Direction:** Firebase

## 1. Business Overview

The platform is a shared vehicle-proximity alert system for recurring local services. Initial supported service types are School Transport and Garbage Collection / Safai Wala.

The business promise is:

> A service provider records and operates a known route. Subscribers save a fixed pickup/home/service location. When an active vehicle approaches that saved location, the subscriber receives up to two alerts for that specific route run without needing to keep their own GPS active.

## 2. Actors

### Service Provider / Driver
A driver or owner may provide school transport or garbage collection. The same person may be owner and driver, but owner, driver, vehicle, and route remain separable entities for future scalability.

### Parent / Subscriber
A subscriber may subscribe to one garbage service and multiple school transport services, including separate subscriptions for different children.

### Admin
Admin is required for safety, moderation, account controls, route/run review, audit history, complaints, and future payment oversight.

## 3. Registration and Identity

### Provider / Driver
- Google Sign-In is the default authentication method.
- Name is required.
- Email is captured from the Google account.
- Mobile number is required and should be verified.
- Service type is required.
- Vehicle details are required.
- Fixed service rate is required.
- Login, persistent session, and logout are supported.

### Parent / Subscriber
- Google Sign-In.
- Name.
- Email.
- Mobile number with verification.
- Saved service/pickup/home location.
- Login, persistent session, and logout.

Parent live GPS must not remain active continuously.

## 4. Service Types

Initial:
- SCHOOL_TRANSPORT
- GARBAGE_COLLECTION

School vehicle types may include:
- VAN
- TEMPO
- CAR
- BUS
- OTHER

The architecture must remain service-type driven and reusable for future services.

## 5. Vehicle Management

Providers can register and update:
- Vehicle registration number
- Vehicle type
- Vehicle description
- Service type
- Fixed rate
- Active/inactive status

Critical updates must preserve history. Old vehicle numbers and prior vehicle details must not be overwritten.

## 6. Route Management

Each provider may have up to **5 active routes** in MVP.

### Primary Route Creation — Record by Driving
1. Tap Add Route.
2. Enter route name.
3. Tap Start Route Recording.
4. Drive the normal route.
5. App records GPS path.
6. Tap End Recording at destination.
7. Route is saved.

This is the recommended method for drivers who are not comfortable configuring Google Maps manually.

### Optional Map-Based Route Creation
- Set start point
- Add optional waypoints
- Set end point
- Preview path
- Save

### Outbound and Return
Morning and return journeys are separate routes, although they may be linked as a pair.

Example:
- Route 1 — Booty More → Manan Vidya
- Route 2 — Manan Vidya → Booty More

### Delete Route
Deletion is a soft delete:
- status = DELETED
- deletedAt
- deletedBy

Deleted routes disappear from normal lists but remain in history.

## 7. Route Runs

A saved route is reusable. Every START creates a separate RouteRun.

Statuses:
- READY
- RUNNING
- COMPLETED
- CANCELLED
- AUTO_CLOSED

Driver flow:
Open App → Select Route → START → Drive → END ROUTE

Active tracking and alert processing stop when the run ends.

## 8. Subscriber Location

Subscribers can save a location using:
- Google place search, or
- Use Current Location once

The app saves the confirmed address plus latitude/longitude.

Subscriber GPS does not remain continuously active.

## 9. Subscription Model

A subscriber may have multiple active subscriptions.

Examples:
- Home Garbage Vehicle
- Riya School Van
- Rahul School Van

Each subscription references:
- subscriber
- provider
- vehicle
- route
- optional label/child name
- price snapshot
- alert state/settings

Subscriptions are route-specific.

## 10. Provider Details Before Subscription

Before subscribing, users should see:
- Provider/owner name
- Driver name where applicable
- Verification status
- Service type
- Vehicle type
- Vehicle registration number
- Route name
- Route map/start/end
- Approximate operating time
- Fixed rate
- Active status

Private contact information must not be exposed unnecessarily.

## 11. Pricing

Providers set a fixed service rate.

Examples:
- Garbage service: ₹150/month
- School van: ₹1,800/month

MVP stores pricing but does not require payment collection.

Architecture should later support:
- MONTHLY
- QUARTERLY
- ANNUAL
- PER_TRIP
- OTHER

## 12. Alerts

Each subscription receives a maximum of **two alerts per RouteRun**:
1. Approximately 6 minutes away
2. Approximately 3 minutes away

Alert state is independent per subscription.

## 13. Voice Alarm

Voice alerts use native device text-to-speech.

Examples:
- “Riya's school van is approximately 6 minutes away.”
- “Your garbage vehicle is approximately 3 minutes away.”

No AI voice generation is required.

## 14. Mute

Mute applies only to the current subscription + RouteRun.

Muting one run must not mute:
- another subscription
- another child
- garbage service
- the next run of the same route

## 15. Route Recording Accuracy

Initial route recording should use finer GPS sampling than normal run tracking.

Recommended:
- Route recording: roughly every 5–10 seconds or meaningful movement threshold
- Normal run: cost-optimized tracking, initially around 1 minute

Recorded routes may be simplified/compressed before long-term storage.

## 16. History and Audit Trail

Critical changes must preserve history, including:
- Vehicle number changes
- Driver assignment changes
- Owner/profile changes
- Phone/email changes
- Price changes
- Route create/edit/delete
- Subscription create/cancel
- Run start/end
- Admin actions
- Future payment events

Audit events should capture:
- actor
- entity type
- entity ID
- action
- timestamp
- previous/reference state where needed
- resulting/reference state where needed

## 17. Admin

Admin web application should support:
- Dashboard
- Subscribers
- Providers
- Drivers
- Vehicles
- Routes
- Active RouteRuns
- Subscriptions
- Audit History
- Reports/Complaints
- System Configuration
- Future Payments/Transactions

Admin may suspend/reactivate accounts and force-close abnormal runs. Admin actions are audited.

## 18. Privacy and Security

Sensitive data includes:
- Email
- Mobile
- Saved location
- Private identity details

Requirements:
- TLS in transit
- Firebase Authentication
- strict role-based Firestore Security Rules
- App Check where applicable
- no unnecessary public exposure
- application-level encryption only where appropriate
- searchable contact data should use a secure lookup strategy instead of naïve encryption

Passwords must never be stored by application code.

## 19. Modular Architecture Principle

Core modules:
- AUTH
- PROFILE
- PROVIDER
- DRIVER
- VEHICLE
- ROUTE
- ROUTE_RECORDING
- ROUTE_RUN
- TRACKING
- SUBSCRIPTION
- ALERT
- AUDIT
- ADMIN
- TRANSACTION
- PAYMENT (future)

The system must not hard-code garbage-only assumptions.

## 20. Transaction-Oriented Events

Important business events include:
- ACCOUNT_REGISTERED
- VEHICLE_CREATED
- VEHICLE_UPDATED
- ROUTE_CREATED
- ROUTE_RECORDED
- ROUTE_UPDATED
- ROUTE_DELETED
- ROUTE_RUN_STARTED
- ROUTE_RUN_ENDED
- SUBSCRIPTION_CREATED
- SUBSCRIPTION_CANCELLED
- ALERT_6_MIN_SENT
- ALERT_3_MIN_SENT
- RUN_MUTED
- PRICE_CHANGED
- future payment events

## 21. Future Payment Integration

The system should later support:
- Billing periods
- Payments
- Provider settlements
- Commission
- Refunds
- Receipts
- UPI/payment gateway integration

Route/alert logic must not depend on a payment gateway.

## 22. MVP Success Criteria

MVP is successful when:
1. Provider registers using Google and verifies mobile.
2. Provider adds vehicle and price.
3. Provider records a real route by driving.
4. Provider can record a return route.
5. Parent registers and verifies mobile.
6. Parent saves location once.
7. Parent views provider/vehicle/route/price and subscribes.
8. Parent may have multiple independent subscriptions.
9. Driver starts a saved route.
10. Vehicle GPS tracks only during the run.
11. Parent GPS remains off.
12. Parent receives 6-minute alert.
13. Parent receives 3-minute alert.
14. No third alert occurs.
15. Mute is scoped only to that subscription/run.
16. Driver ends route.
17. Tracking and alert processing stop.
18. History remains available.
19. Admin can review system state.
