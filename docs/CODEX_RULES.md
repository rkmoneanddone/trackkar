# Garbage Collection Alert System
## Codex Development Rules

**Project Path:** `E:\codex\GarbageCollection\`  
**Primary Product Document:** `PRODUCT_SPEC.md`  
**Status:** Mandatory development boundaries

---

# 1. Purpose

This file defines how Codex must work on this project.

`PRODUCT_SPEC.md` defines **what the product must do**.

This file defines **what Codex may and may not do while building it**.

---

# 2. Source of Truth

Before making changes, Codex must read:

1. `PRODUCT_SPEC.md`
2. `CODEX_RULES.md`
3. `ARCHITECTURE.md`
4. `PROJECT_STATUS.md`

If the repository contains an existing implementation, inspect it before changing it.

Do not assume that existing code is correct.

---

# 3. Owner Decision Boundary

The project owner makes decisions about:

- product behavior
- scope
- architecture
- paid services
- production deployment
- security-sensitive changes
- database migrations
- credentials
- major dependencies

Codex is responsible for implementation.

If a major decision is not defined:

> STOP and ask before implementing.

Do not invent a product decision.

---

# 4. No Silent Architecture Changes

Codex must NOT silently:

- replace React Native
- replace Firebase
- add another backend
- add another database
- introduce microservices
- introduce a custom server
- add Redis
- add Kafka
- add Kubernetes
- add a new paid provider

If a technology change appears necessary:

1. Explain why.
2. Explain alternatives.
3. Explain cost/security implications.
4. Ask for approval.

---

# 5. MVP Scope

Build ONLY the MVP defined in `PRODUCT_SPEC.md`.

Do not implement future features because they appear useful.

Specifically do not implement yet:

- payment gateway
- advanced analytics
- SMS
- email notification infrastructure
- AI voice
- multi-city administration
- advanced route optimization
- complex reporting
- unnecessary historical GPS storage

---

# 6. Driver Authentication Rule

The driver authenticates once.

Resident/user authentication is NOT locked as a mandatory MVP requirement. Do not impose a traditional user login flow unless it is explicitly approved.



The application must preserve the session.

Do NOT create a daily-login workflow.

Do NOT ask the driver to enter username/password every morning.

Daily route selection is separate from authentication.

---

# 7. GPS START/END Rule

This is a hard boundary.

Driver cannot manually enter:

- START location
- END location

Admin configures route locations using a map.

Driver GPS is checked against configured coordinates.

START:

```text
GPS valid
   ↓
START ROUTE enabled
   ↓
Driver confirms START
```

END:

```text
GPS valid
   ↓
END ROUTE enabled
   ↓
Driver confirms END
```

Do not make either action fully automatic.

---

# 8. GPS Frequency

Target approximately one update per minute while a DailyRun is active.

Do NOT:

- send GPS every second
- continuously track the user
- continuously poll Firestore from every phone
- write unnecessary GPS history

Prefer maintaining the latest truck location.

---

# 9. Route Closure

At 10:00 AM:

```text
DailyRun → AUTO_CLOSED
Alert processing → STOPPED
Driver app → stops active route tracking
```

Driver movement after closure must not generate garbage alerts.

---

# 10. Security Rules

Never:

- hard-code secrets
- commit API keys
- commit private service-account keys
- print credentials to logs
- disable security rules to make development easier
- expose production credentials in source files

Use appropriate environment/configuration mechanisms.

---

# 11. Firebase Safety

Never delete production data without explicit approval.

Never run destructive production migrations without explicit approval.

Development/test data must be clearly identifiable.

Firestore rules must be tested before production deployment.

---

# 12. Cost Control

Use the simplest implementation that satisfies the product.

Avoid unnecessary:

- Firestore writes
- Cloud Functions
- paid APIs
- routing calls
- GPS updates
- stored location history
- polling

If an implementation may materially increase cost:

> STOP and ask.

---

# 13. Google Maps

Google Maps is required for map-based route location configuration and map display.

Do not assume that Google Directions/Routes API is required for every GPS update.

Start with coordinate-based distance/proximity logic.

Only introduce paid routing if real-world testing proves it is necessary and the owner approves it.

---

# 14. Coding Standards

Use:

- TypeScript
- clear naming
- small modules
- simple functions
- minimal dependencies
- explicit error handling

Avoid:

- unnecessary abstractions
- over-engineering
- unused libraries
- duplicated business logic
- dead code

---

# 15. Required Error Handling

The implementation must handle at least:

- GPS permission denied
- GPS disabled
- inaccurate GPS
- location unavailable
- network unavailable
- notification permission denied
- authentication failure
- expired authentication
- Firestore failure
- Cloud Function failure
- invalid route
- invalid DailyRun state

Errors shown to drivers/users should be understandable.

---

# 16. Testing

Before considering a feature complete:

1. Run type checks.
2. Run lint checks if configured.
3. Run tests.
4. Build the relevant application.
5. Test the happy path.
6. Test important failure cases.

Critical driver test:

```text
Login once
→ Select route
→ Reach start
→ GPS validates
→ START
→ GPS updates
→ Alert processing
→ Reach end
→ GPS validates
→ END
```

---

# 17. Git Rules

Use small meaningful commits.

Never:

- commit secrets
- force push without approval
- delete repository history
- delete important branches
- rewrite shared history without approval

Production deployment requires explicit authorization.

---

# 18. Dependency Rules

Before installing a new dependency:

- confirm it is necessary
- check whether the platform/Firebase already provides the capability
- prefer established maintained packages
- avoid adding a dependency for a trivial function

If the dependency introduces cost, licensing concerns, native complexity, or security implications:

> Ask before adding it.

---

# 19. Documentation Rules

When architecture or behavior changes, update the appropriate documentation.

Do not modify `PRODUCT_SPEC.md` to hide implementation problems.

If implementation reveals a genuine product ambiguity:

> Ask the owner.

---

# 20. No Fake Completion

Codex must not say a feature is complete merely because the code compiles.

Completion requires:

- requirements satisfied
- tests/checks passed
- security considered
- error handling implemented
- no known critical issue hidden
- documentation updated where necessary

---

# 21. When Blocked

If Codex needs:

- credentials
- Firebase project information
- Google Maps configuration
- GitHub permission
- Android SDK
- a product decision
- an architectural decision

STOP.

Clearly state:

1. What is missing.
2. Why it is needed.
3. Where it will be used.
4. Whether it is sensitive.
5. What the owner needs to do.

Never invent credentials or pretend access exists.

---

# 22. Development Order

Preferred order:

1. Inspect repository.
2. Confirm environment.
3. Confirm React Native/Android setup.
4. Confirm Firebase project.
5. Create basic project structure.
6. Implement driver authentication and persistent driver session.
7. Implement Admin masters.
8. Implement route map configuration.
9. Implement driver route selection.
10. Implement GPS START validation.
11. Implement DailyRun.
12. Implement active GPS tracking.
13. Implement subscriber location.
14. Implement ETA/proximity.
15. Implement FCM alert.
16. Implement GPS END validation.
17. Implement automatic 10:00 AM closure.
18. Test end-to-end.
19. Harden security.
20. Prepare deployment.

Do not skip directly to advanced features.

---

# 23. Definition of Success

The first major milestone is:

> A real driver can select a real route, reach the configured start point, start the route, move with the vehicle, and a real subscriber receives one correct approaching-vehicle notification.

Only after that is reliable should the project expand.

---

**End of Codex Rules**
