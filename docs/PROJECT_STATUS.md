# Garbage Collection Alert System
## Project Status

**Project Path:** `E:\codex\GarbageCollection\`

**Documentation Path:** `E:\codex\GarbageCollection\docs\`  
**Current Phase:** Environment / Development Setup  
**MVP Status:** Not yet implemented

---

# 1. Product Status

The product definition is substantially locked.

## Locked

- Dynamic daily route selection
- One user → one route for MVP
- Driver authentication required
- Driver logs in once
- Driver session remembered
- Resident traditional login is NOT mandatory for MVP
- Google Maps/map-based route start
- Google Maps/map-based route end
- Driver cannot manually enter route start/end locations
- Driver GPS validation at start
- Driver GPS validation at end
- Driver explicitly confirms START after GPS validation
- Driver explicitly confirms END after GPS validation
- Explicit START confirmation
- Explicit END confirmation
- Approximately one-minute GPS updates
- Automatic 10:00 AM shutdown
- One alert per subscriber per DailyRun
- Optional voice alert
- Optional agency mapping
- Optional contact information
- Route pricing
- Payment integration deferred

---

# 2. Technology Status

Target:

```text
Mobile:
React Native + TypeScript

Admin:
React + Vite

Backend:
Firebase

Database:
Firestore

Authentication:
Firebase Authentication

Notifications:
FCM

Server-side processing:
Cloud Functions

Maps:
Google Maps

GPS:
Device GPS

Voice:
Native Android TTS
```

---

# 3. Current Development Phase

Before implementation, Codex must inspect:

- repository contents
- documentation in `docs\`
- Git status
- Node.js
- npm
- React Native/Expo tooling as applicable
- Android SDK
- Java/JDK
- Firebase CLI
- Firebase project configuration
- Google Maps configuration
- available emulators/devices

Do not change architecture during inspection.

---

# 4. Immediate Goal

Prepare the development environment.

The first implementation milestone should be the development-environment and authentication foundation:

```text
Project starts
      ↓
Driver can authenticate once
      ↓
Driver session persists
      ↓
Driver sees assigned routes
```

Then move to:

```text
Route map
      ↓
GPS START validation
      ↓
DailyRun
      ↓
GPS tracking
      ↓
Subscriber location
      ↓
Alert
      ↓
GPS END validation
```

---

# 5. Important Constraint

Do not implement Version 2.

Do not implement payments yet.

Do not add unnecessary infrastructure.

Do not introduce a new technology without approval.

---

# 6. Definition of MVP Completion

MVP is complete only when the complete real-world flow works:

```text
Admin configures route
       ↓
Driver logs in once
       ↓
Driver selects route
       ↓
Driver reaches GPS START
       ↓
START ROUTE
       ↓
GPS tracking
       ↓
Subscriber ETA threshold
       ↓
One push alert
       ↓
Driver reaches GPS END
       ↓
END ROUTE
       ↓
GPS stops
```

---

# 7. Current Next Action

Codex should first inspect the existing repository and environment.

It should NOT immediately create a large application.

It should report:

- what already exists
- what is installed
- what is missing
- what credentials/configuration are required
- whether any credentials are sensitive and where they should be configured
- recommended next step

Then wait for approval before major changes.

---

**End of Project Status**
