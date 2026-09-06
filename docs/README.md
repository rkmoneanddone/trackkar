# Garbage Collection Alert System

## Codex Project

**Local path:** `E:\codex\GarbageCollection\`

This repository contains the MVP implementation of the Garbage Collection Alert System.

---

# Read First

Before writing or changing code, read:

1. `docs/PRODUCT_SPEC.md`
2. `docs/CODEX_RULES.md`
3. `docs/ARCHITECTURE.md`
4. `docs/PROJECT_STATUS.md`
5. `docs/README.md`

These documents define the current project boundaries.

---

# Product in One Sentence

A driver selects the route being serviced today, starts it from the configured GPS start point, the system tracks the active route, subscribers receive approaching-vehicle alerts, and the driver ends the route at the configured GPS end point.

---

# Core User Flows

## Driver

```text
Login once
   ↓
Open app
   ↓
Select today's route
   ↓
Reach START
   ↓
GPS validation
   ↓
START ROUTE
   ↓
Drive
   ↓
GPS tracking
   ↓
Reach END
   ↓
GPS validation
   ↓
END ROUTE
```

## User

```text
Onboard
   ↓
Save collection location
   ↓
Select one route
   ↓
Set alert timing
   ↓
Receive alert
```

## Admin

```text
Create Agency (optional)
       ↓
Create Truck
       ↓
Create Driver
       ↓
Create Route
       ↓
Set START on map
       ↓
Set END on map
       ↓
Configure operating settings
```

---

# Technology

- React Native + TypeScript
- Firebase Authentication
- Cloud Firestore
- Firebase Cloud Messaging
- Firebase Cloud Functions
- React + Vite
- Google Maps
- Device GPS
- Native Android Text-to-Speech

---

# Important Rules

- Driver does not log in every day.
- Driver start/end locations are never manual.
- Admin configures route start/end locations on a map.
- GPS validates driver proximity to start/end.
- Driver explicitly confirms START and END.
- User is not continuously tracked.
- GPS target is approximately one update per minute.
- DailyRun controls whether GPS/alerts are active.
- Route automatically closes at 10:00 AM.
- No payment gateway in MVP.
- No AI voice generation.
- No unnecessary paid routing calls.

---

# Project Structure

Documentation belongs inside `docs\`.

Recommended structure:

```text
E:\codex\GarbageCollection\

├── docs\
│   ├── PRODUCT_SPEC.md
│   ├── CODEX_RULES.md
│   ├── ARCHITECTURE.md
│   ├── PROJECT_STATUS.md
│   └── README.md
│
├── mobile/
├── admin/
└── functions/
```

The documentation files above are the project guidance documents.

Codex should inspect the actual repository before assuming the application directories exist.

---

# Development Rule

Do not begin broad implementation blindly.

First:

1. Read all project documents inside `docs\`.
2. Inspect the repository.
3. Inspect installed tools.
4. Check whether the project already contains code.
5. Check Git status.
6. Identify Firebase configuration.
7. Identify Android/React Native readiness.
8. Report findings.
9. Propose the next small implementation step.

---

# MVP Target

The first meaningful milestone is:

> A real driver can start a real route from the configured GPS start location and a real subscriber can receive one correct approaching-vehicle notification.

Everything else is secondary until this flow is reliable.

---

**End of README**
