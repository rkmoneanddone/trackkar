# Garbage Collection Alert System
## MVP Technical Architecture

**Project Path:** `E:\codex\GarbageCollection\`  
**Architecture:** Lightweight Firebase-based architecture  
**Mobile:** React Native + TypeScript

---

# 1. Architecture Goal

Build the smallest reliable architecture that can support:

```text
Driver
  ↓
Daily Route
  ↓
GPS Tracking
  ↓
Distance / ETA
  ↓
Subscriber
  ↓
Push Alert
```

The architecture must not require a continuously running custom server.

---

# 2. High-Level Architecture

```text
                    ┌──────────────────────┐
                    │       Firebase       │
                    │                      │
                    │ Auth / Firestore     │
                    │ FCM / Functions      │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
        React Native Mobile             React + Vite
                 │                           │
          ┌──────┴──────┐                 Admin
          │             │
       Driver          User
          │
      Device GPS
          │
     Google Maps UI
```

---

# 3. Applications

## 3.1 Mobile Application

One React Native + TypeScript application.

Use role-based screens.

### Driver screens

- Login
- Today's Routes
- Route Details
- Route Map
- Start Validation
- Active Route
- End Validation
- Route Status

### User screens

- Onboarding
- Collection Location
- Route Selection
- Alert Settings
- Voice Settings
- Notification handling

Do not create two separate mobile applications for MVP unless a technical limitation makes it necessary.

---

# 4. Admin Application

React + Vite web application.

Admin pages:

```text
Dashboard

Agencies
Trucks
Drivers
Routes
Subscribers
Daily Runs
Alert Settings
```

Route configuration must provide map-based start/end selection.

---

# 5. Firebase Services

## Authentication

Firebase Authentication is used for driver authentication.

### Driver

- Authentication is required.
- The authenticated session is persistent.
- The driver should not log in every day.

### Resident / User

Traditional login is **not mandatory for MVP**.

The MVP may use a lightweight user/device identity for the resident unless traditional authentication is explicitly approved later.

## Firestore

Primary application database.

## Firebase Cloud Messaging

Push notifications.

## Cloud Functions

Use for server-side processing that must not depend on a user's device.

Potential responsibilities:

- DailyRun validation/processing
- alert processing
- scheduled 10:00 AM closure
- notification dispatch
- protected server-side calculations

Do not create a Cloud Function merely because something can be done client-side.

---

# 6. Logical Data Model

Recommended logical collections:

```text
agencies/{agencyId}

trucks/{truckId}

drivers/{driverId}

routes/{routeId}

users/{userId}

subscriptions/{subscriptionId}

dailyRuns/{dailyRunId}

truckLocations/{truckId}

alertStates/{alertStateId}

alertSettings/{settingsId}
```

Future:

```text
payments/{paymentId}
```

Payment collection is not required for MVP unless needed for basic pricing records.

---

# 7. Agency

```text
agencyId
name
address                 optional
contactPerson           optional
mobile                  optional
email                   optional
active
createdAt
updatedAt
```

---

# 8. Truck

```text
truckId
truckName
vehicleRegistrationNumber   optional
agencyId                    optional
assignedDriverId
active
createdAt
updatedAt
```

---

# 9. Driver

```text
driverId
name
mobileNumber                optional
email                       optional
agencyId                    optional
assignedTruckId
active
createdAt
updatedAt
```

Authentication UID should map to the driver record.

---

# 10. Route

```text
routeId
routeName
description                     optional

truckId
agencyId                        optional

startLatitude
startLongitude

endLatitude
endLongitude

startValidationRadiusMeters
endValidationRadiusMeters

normalStartTime
normalEndTime

collectionWindowStart
collectionWindowEnd

price

active
createdAt
updatedAt
```

---

# 11. Route Location Architecture

Admin configures route locations.

```text
Admin Map
    ↓
Select START
    ↓
Save coordinates
    ↓
Select END
    ↓
Save coordinates
```

Driver uses device GPS to validate those coordinates.

The driver never writes the route coordinates.

---

# 12. Driver START Architecture

```text
Driver opens app
       ↓
Firebase Auth session available
       ↓
Load assigned truck/routes
       ↓
Driver selects route
       ↓
Load route START coordinates
       ↓
Request device location
       ↓
Calculate distance to START
       ↓
Distance <= validation radius?
       ├── NO → START disabled
       └── YES
             ↓
       Driver confirms START
             ↓
       Create DailyRun
             ↓
       status = RUNNING
             ↓
       Start active location tracking
```

---

# 13. Driver END Architecture

```text
DailyRun = RUNNING
       ↓
Read device location
       ↓
Load route END coordinates
       ↓
Calculate distance to END
       ↓
Distance <= validation radius?
       ├── NO → END disabled
       └── YES
             ↓
       Driver confirms END
             ↓
       DailyRun = COMPLETED
             ↓
       Stop active location tracking
```

---

# 14. Distance Calculation

For MVP, calculate straight-line geographic distance between:

```text
Driver GPS
       ↕
Configured route coordinate
```

Use an appropriate geographic distance calculation such as Haversine distance.

Do not call Google routing APIs simply to determine whether the driver is within 50–100 metres of a point.

---

# 15. Active GPS

When DailyRun becomes RUNNING:

```text
GPS ON
   ↓
approximately 1 update/minute
   ↓
latest truck location
```

The system should maintain the latest useful truck location.

Do not store every GPS point permanently by default.

---

# 16. Truck Location

`truckLocations/{truckId}` represents the **latest known location of the truck**, not a permanent GPS history.

Logical latest-location record:

```text
truckId
dailyRunId
latitude
longitude
timestamp
```

The `dailyRunId` identifies which active DailyRun produced the latest location.

The latest location is the important MVP value.

Historical GPS tracking is future functionality and must not be stored by default.

---

# 17. Subscriber Location

User location:

```text
userId
latitude
longitude
address              optional
locationLabel        optional
```

This is a collection location, not a live tracking location.

---

# 18. Subscription

MVP:

```text
subscriptionId
userId
routeId
active
createdAt
updatedAt
```

One user should have one active route subscription.

---

# 19. Alert Processing

Conceptual flow:

```text
DailyRun RUNNING
       ↓
Latest truck location
       ↓
Find active subscribers for route
       ↓
Read subscriber collection location
       ↓
Calculate distance / ETA
       ↓
Compare with alert threshold
       ↓
Threshold crossed?
       ├── NO → wait
       └── YES
             ↓
       Has alert already been sent?
             ├── YES → do nothing
             └── NO
                   ↓
               Send FCM
                   ↓
               Record alert state
```

---

# 20. Alert State

A logical alert state should identify:

```text
dailyRunId
subscriptionId
alertSent
alertSentAt
```

This prevents repeated notifications.

---

# 21. ETA

MVP should avoid expensive routing infrastructure.

Possible first implementation:

```text
distance
+
recent movement speed
+
route operating context
=
estimated arrival
```

If real-world testing shows that this is insufficient, Google routing can be considered later.

Do not make a routing API call for every one-minute GPS update without approval.

---

# 22. FCM

Use Firebase Cloud Messaging.

Notification should contain enough information for the user to understand:

- garbage vehicle approaching
- approximate minutes
- route/service context where appropriate

Voice playback can use the device's native TTS after the notification is received, subject to Android notification/app lifecycle behavior.

---

# 23. Automatic 10:00 AM Closure

A server-side mechanism should ensure active DailyRuns do not remain open indefinitely.

At 10:00 AM:

```text
Find active DailyRuns
        ↓
AUTO_CLOSED
        ↓
Stop alert processing
        ↓
Driver app detects closed DailyRun
        ↓
Driver app stops active location tracking
```

The backend does not directly switch off the phone's GPS hardware.

The backend closes the DailyRun and stops server-side alert processing. The driver application must respond to the closed DailyRun state and stop its active location-tracking process.

---

# 24. False Alert Protection

Every alert-processing operation must verify:

```text
DailyRun.status == RUNNING
AND
current time within permitted operating window
AND
route active
```

No active DailyRun:

```text
No alert
```

This prevents later driver movement from being interpreted as collection movement.

---

# 25. Security Model

Roles:

```text
ADMIN
DRIVER
USER
```

### Admin

Full configuration access.

### Driver

Access only to:

- own driver record
- assigned truck
- permitted routes
- own DailyRuns

### User

Access only to:

- own user profile
- own subscription
- own location
- own alert settings

Firestore security rules must enforce these boundaries.

Client-side checks alone are insufficient.

---

# 26. Technology Stack

```text
Mobile:
React Native + TypeScript

Admin:
React + Vite

Backend:
Firebase

Database:
Cloud Firestore

Authentication:
Firebase Authentication

Push:
Firebase Cloud Messaging

Server processing:
Firebase Cloud Functions

Maps:
Google Maps

Location:
Device GPS

Voice:
Native Android Text-to-Speech
```

---

# 27. Architecture Exclusions

Do not introduce:

- Kubernetes
- microservices
- Redis
- Kafka
- custom always-on server
- per-second GPS
- continuous user tracking
- payment gateway in MVP
- AI voice generation
- paid routing calls for every GPS update

---

# 28. Scalability

The logical relationship must support:

```text
City
  ↓
Agency (optional)
  ↓
Truck
  ↓
Driver
  ↓
Route
  ↓
DailyRun
  ↓
Subscribers
```

MVP may operate with a small number of trucks.

Do not prematurely build multi-city infrastructure.

---

# 29. Key Architecture Principle

Keep the system simple:

```text
React Native
      ↓
Firebase
      ↓
Firestore + FCM + Functions
```

The complexity should live in well-defined business logic, not in unnecessary infrastructure.

---

**End of Architecture**
