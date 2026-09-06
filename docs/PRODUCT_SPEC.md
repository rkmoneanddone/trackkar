# Garbage Collection Alert System — Product Specification

**Document:** Product Requirements & System Design  
**Version:** 1.0  
**Status:** Initial Product Definition  
**Purpose:** Working specification for development

---

## 1. Product Overview

The Garbage Collection Alert System is a lightweight mobile application that alerts residents when their garbage collection vehicle is approaching their location.

The core promise is simple:

> **When the garbage vehicle starts a route and is approximately the user's selected alert time away, the user receives a notification and optionally a voice announcement.**

The system is designed around **dynamic daily route selection**, not fixed alternate-day schedules.

A driver may operate multiple routes. Each morning, the driver selects whichever route is actually being serviced that day. Only subscribers of that active route are eligible to receive alerts.

The system must support:

- One garbage truck → many route subscribers
- Many garbage trucks → many subscribers
- Multiple routes per truck
- Dynamic route selection each day
- Optional agency-to-driver/truck mapping
- Optional mobile numbers
- Optional email addresses
- Configurable alert timing
- Optional voice alerts
- Automatic route shutdown
- Low-cost GPS operation
- Future payment tracking
- Future multi-agency / multi-city expansion

---

# 2. Core Product Principles

## 2.1 Route-driven, not calendar-driven

Do **not** hard-code:

- Monday = Route A
- Tuesday = Route B
- Alternate day logic
- Fixed weekly route schedules

Instead:

> The driver chooses the route being serviced today.

This handles real-world changes.

### Example

Normally:

- Monday → Route A
- Tuesday → Route B
- Wednesday → Route A

But if Wednesday's collection does not happen, the driver can go on Thursday and simply select:

> **Route A → START**

The system follows the driver's actual selection.

---

# 3. Main Actors

## 3.1 Admin / Operator

Responsible for configuring the service.

Can manage:

- Agencies
- Trucks
- Drivers
- Routes
- Route pricing
- Route timings
- Alert settings
- Users/subscribers
- Daily runs
- Service status

---

## 3.2 Agency — Optional

An agency represents a garbage collection contractor or organization.

Agency mapping is **optional**.

Possible structure:

```text
Agency
  ├── Driver 1
  ├── Driver 2
  ├── Truck 1
  ├── Truck 2
  └── Routes
```

The system must also work without an agency.

For example:

```text
Independent Driver
      ↓
Truck
      ↓
Routes
      ↓
Subscribers
```

Therefore, `agencyId` should be nullable/optional.

---

## 3.3 Driver

The driver operates the garbage vehicle.

Driver information may include:

- Driver ID
- Name
- Mobile number — optional
- Email — optional
- Agency ID — optional
- Assigned Truck ID
- Active/inactive status

The driver's primary daily responsibility is:

1. Open the app
2. See available routes
3. Select today's actual route
4. Press START ROUTE
5. GPS tracking begins
6. Press STOP ROUTE when finished

The system automatically stops the route at 10:00 AM if the driver forgets.

---

## 3.4 User / Subscriber

A subscriber receives alerts for one selected collection route.

User information may include:

- User ID / device-generated ID
- Name — optional depending on registration method
- Mobile number — optional
- Email — optional
- Home/collection location
- Selected route
- Alert preference
- Voice alert preference
- Payment information

### Important

A user does **not** need continuous GPS tracking.

The user's collection location can be captured once and stored.

---

# 4. Truck-to-Subscriber Relationship

The system must support:

```text
ONE TRUCK
    ↓
MANY ROUTES
    ↓
MANY SUBSCRIBERS
```

and:

```text
MANY TRUCKS
    ↓
MANY ROUTES
    ↓
MANY SUBSCRIBERS
```

A subscriber should be associated with a **specific collection route/service**, rather than simply subscribing to a truck.

This is important because the same truck can service different routes on different days.

---

# 5. Route Model

A truck may have multiple routes.

Example:

```text
Truck 01

Route A
  Main Road
  Start: Point A
  End: Point B

Route B
  Upper Colony
  Start: Point C
  End: Point D

Route C
  Market Area
  Start: Point E
  End: Point F
```

Each route should have its own configuration.

### Route fields

- routeId
- truckId
- agencyId — optional
- routeName
- description — optional
- start point
- end point
- route geometry/path — future enhancement
- normal start time
- normal end time
- collection operating window
- price
- active/inactive
- alert settings
- createdAt
- updatedAt

---

# 6. Master Configuration Page

The Master Page is the central configuration area.

## 6.1 Agency Master

Fields:

- Agency Name
- Agency ID
- Address — optional
- Contact Person — optional
- Mobile — optional
- Email — optional
- Active/Inactive

Agency mapping remains optional.

---

## 6.2 Truck Master

Fields:

- Truck ID
- Truck Name/Number
- Vehicle Registration Number — optional
- Agency ID — optional
- Driver ID — optional
- Active/Inactive

Example:

```text
Truck: TRUCK-001
Vehicle No: JH01AB1234
Agency: ABC Waste Services
Driver: Ramesh
Status: Active
```

---

## 6.3 Driver Master

Fields:

- Driver ID
- Driver Name
- Mobile Number — OPTIONAL
- Email — OPTIONAL
- Agency ID — OPTIONAL
- Assigned Truck ID
- Active/Inactive

Mobile number and email must not be mandatory system-wide.

### Driver Authentication

The driver should authenticate **once**, not every day.

After successful login, the app should securely remember the authenticated session on the device. On subsequent days, the driver opens the app directly and selects the route for that day.

The driver should only need to authenticate again if the session is explicitly logged out, the app/device authentication state is cleared, the device is changed, or reauthentication is otherwise required by the authentication system.

The app should support drivers who only use an authenticated device/account.

---

## 6.4 Route Master

Fields:

- Route ID
- Route Name
- Truck ID
- Agency ID — optional
- Start location
- End location
- Normal start time
- Normal end time
- Collection active-from time
- Collection active-until time
- Price
- Active/inactive
- Subscriber count

Example:

```text
Route A
Name: Main Road
Truck: TRUCK-001
Normal Start: 07:00
Normal End: 09:00
Collection Window: 06:00–10:00
Monthly Price: ₹100
```

---

# 7. Dynamic Daily Route Selection

This is one of the most important parts of the product.

The driver must not manually enter route start or end locations. Route start and end locations are configured by the Admin using map-based coordinates and are validated against the driver's live GPS location.

The driver should never be forced into a pre-defined alternate-day route.

Every morning the driver sees the routes available to that truck.

Example:

```text
TODAY'S ROUTE

Route A — Main Road
Route B — Upper Colony
Route C — Market Area

[ START ROUTE ]
```

The driver selects the route he is actually going to service.

After selection:

```text
Route B
Status: READY

[ START ROUTE ]
```

After START:

```text
Route B
Status: RUNNING
Started: 07:04 AM
GPS: ACTIVE

[ END ROUTE ]
```

---

# 8. Google Maps / GPS-Based Route Start and End

Route start and end locations must be **map/GPS based**. Manual location entry by the driver is not permitted.

## 8.1 Route Master Location Configuration

When an Admin creates or edits a route, the Admin defines:

- Route start location using a map
- Route end location using a map
- Start latitude
- Start longitude
- End latitude
- End longitude
- Start/end validation radius

The initial validation radius may be approximately 50–100 metres and should be configurable after real-world testing.

## 8.2 Driver Start Validation

The driver:

1. Logs in once and the session is remembered.
2. Selects today's route.
3. The app displays the configured route and start location on the map.
4. The driver's live GPS location is checked against the configured start coordinates.
5. When the driver is within the permitted start radius, the **START ROUTE** action becomes available.
6. The driver explicitly confirms by pressing **START ROUTE**.
7. The system creates the DailyRun and begins active GPS tracking.

The driver must not be able to manually type or substitute a different start location.

## 8.3 Driver End Validation

When the driver approaches the configured route end location:

1. The app checks the driver's live GPS location against the configured end coordinates.
2. When the driver is within the permitted end radius, the **END ROUTE** action becomes available.
3. The driver explicitly confirms by pressing **END ROUTE**.
4. The DailyRun is completed and active GPS tracking stops.

The end location must not be manually entered by the driver.

## 8.4 Important Safety/Accuracy Rule

GPS location determines whether START/END is geographically valid, but the action is **not fully automatic**.

The driver must explicitly confirm START and END.

This prevents an accidental GPS trigger from starting or ending a collection run.

## 8.5 Location Concepts

The system has four distinct location concepts:

1. **Route Start Location** — fixed by Admin using map coordinates.
2. **Route End Location** — fixed by Admin using map coordinates.
3. **Driver Live GPS Location** — used while the DailyRun is active.
4. **Subscriber Collection Location** — captured/stored for ETA and alert calculations.

## 8.6 Google Maps API Scope

Google Maps should initially be used for map-based route location configuration and map display.

The MVP should not require a paid Google Maps Directions/ETA request for every GPS update. Initial proximity and ETA calculations should use the available GPS coordinates and the driver's recent movement data where practical.

A routing API can be introduced later if real-world ETA accuracy requires it.

---

# 8. Daily Run

Every time a driver starts a route, the system creates a `DailyRun`.

Example:

```text
DailyRun
  date: 2026-08-16
  truckId: TRUCK-001
  driverId: DRIVER-001
  routeId: ROUTE-B
  startTime: 07:04
  endTime: null
  status: RUNNING
```

When the driver explicitly reaches the configured route end, passes GPS END validation, and presses **END ROUTE**:

```text
status: COMPLETED
endTime: 08:58
```

If the system automatically stops it:

```text
status: AUTO_CLOSED
endTime: 10:00
```

DailyRun provides the historical record of what actually happened.

---

# 9. Driver Morning Reminder

At approximately 6:30 AM, the driver should receive a reminder.

Example:

> Good Morning! Please select today's garbage collection route and press START when you reach the configured starting point.

The reminder is intended to prompt the driver.

It must NOT automatically start GPS tracking.

The driver must explicitly press:

> **START ROUTE**

---

# 10. GPS Tracking Rules

GPS tracking should be active only for an active DailyRun.

### Normal flow

```text
Driver
  ↓
Select Route
  ↓
START ROUTE
  ↓
GPS ACTIVE
  ↓
Location update approximately every 1 minute
  ↓
ETA processing
  ↓
Subscriber alerts
  ↓
STOP ROUTE
```

### Automatic shutdown

If the driver does not press STOP:

> **10:00 AM = automatic route shutdown**

At 10:00 AM:

- DailyRun is closed
- GPS tracking is stopped
- No new subscriber alerts are generated
- Route becomes inactive for the day

---

# 11. Protection Against False Alerts

A major requirement is preventing false alerts when the driver's phone moves outside collection activity.

Example:

The driver forgets to stop something, then walks somewhere at 6:00 PM.

The system must NOT interpret that movement as garbage truck movement.

Therefore a valid collection tracking session requires:

```text
START ROUTE = TRUE
AND
DailyRun = RUNNING
AND
Current time is within the permitted collection window
AND
Selected route is active
```

Outside the allowed time window:

```text
IGNORE GPS FOR ALERT PURPOSES
```

Recommended operational window:

```text
06:00 AM – 10:00 AM
```

Subscriber alert generation should normally stop earlier, e.g.:

```text
06:00 AM – 09:00 AM
```

These values should be configurable from Master Settings.

---

# 12. GPS Update Frequency

Initial target:

> **One GPS update approximately every 1 minute.**

Do not send GPS every second.

The driver app should send location only while the route is active.

Example:

```text
07:01 → GPS update
07:02 → GPS update
07:03 → GPS update
07:04 → GPS update
...
```

At STOP or automatic 10:00 AM shutdown:

```text
GPS tracking stops
```

This keeps network usage and backend costs under control.

---

# 13. Subscriber Location

The user does NOT need continuous GPS.

During setup:

```text
Use Current Location
```

The app captures the collection/home location once.

Store:

- latitude
- longitude
- address/label — optional
- routeId
- userId

The user's phone can then have GPS turned OFF after setup.

---

# 14. Subscriber Route Selection

A subscriber selects the route that serves their home.

Example:

```text
Select Collection Route

Route A — Main Road
₹100/month

Route B — Upper Colony
₹120/month

[ CONFIRM ]
```

The user should not be required to subscribe to multiple trucks/routes.

The intended initial model is:

> **One user → one selected collection route/service.**

If a user needs to change service later, provide:

> Change Route

with appropriate validation.

---

# 15. Alert Logic

The subscriber chooses an alert lead time.

Initial options:

- 5 minutes
- 10 minutes
- 15 minutes

Default:

> **10 minutes**

Example:

```text
Truck ETA to subscriber = 9 minutes
Subscriber alert setting = 10 minutes

→ SEND ALERT
```

---

# 16. One Alert Per Collection Run

The same user must not receive repeated alerts every minute.

Example:

```text
ETA 11 min → no alert
ETA 10 min → SEND ALERT
ETA 9 min  → no alert
ETA 8 min  → no alert
ETA 7 min  → no alert
```

Maintain a per-run alert state.

Example:

```text
alertSent = true
```

It resets for the next DailyRun.

---

# 17. Voice Alert

Voice alert is an optional feature.

User setting:

```text
Voice Alert
[ ON ]

Language
Hindi / English

Alert
10 minutes before
```

Example Hindi message:

> कचरा गाड़ी लगभग 10 मिनट में आपके स्थान पर पहुँचने वाली है। कृपया अपना कचरा तैयार रखें।

Example English message:

> The garbage collection vehicle will arrive at your location in approximately 10 minutes. Please keep your garbage ready.

### Initial implementation

Use the phone's native Text-to-Speech capability rather than generating a new AI voice for every alert.

This avoids unnecessary voice-generation costs.

---

# 18. Alert Message Master

The operator should be able to configure the default alert message.

Fields:

- Default Hindi message
- Default English message
- Voice enabled/disabled
- Alert lead time
- Notification title

Example:

```text
Notification Title:
Kachra Gadi Alert

Hindi:
कचरा गाड़ी लगभग {MINUTES} मिनट में पहुँचने वाली है।
कृपया कचरा तैयार रखें।

English:
Garbage vehicle will arrive in approximately
{MINUTES} minutes. Please keep your garbage ready.
```

`{MINUTES}` is dynamically replaced.

---

# 19. Payment / Pricing

Route pricing should be maintained in the Route Master.

Example:

```text
Route A
Monthly Price: ₹100
```

Subscriber payment information should be maintained separately.

Example:

```text
Subscriber
Route: Route A
Monthly Fee: ₹100
Payment Status: PAID
Paid Till: 31-Aug-2026
```

Possible future payment fields:

- paymentId
- userId
- routeId
- amount
- paymentDate
- paymentMethod
- status
- billingPeriod
- paidTill
- transactionReference

Payment integration and payment management can be added after the alert system is stable. They are NOT part of the MVP.

Possible future payment provider:

- UPI
- Razorpay
- Other supported payment gateway

---

# 20. User Contact Information

Mobile number:

> **OPTIONAL**

Email:

> **OPTIONAL**

The system must not depend on both being present.

Possible combinations:

```text
Mobile only
Email only
Both
Neither
```

Push notifications should be based on the app/device notification token rather than requiring a mobile number.

Mobile/email can later be useful for:

- account recovery
- payment receipts
- service announcements
- support
- optional SMS/email notifications

---

# 21. Driver Contact Information

Driver mobile number:

> **OPTIONAL**

Driver email:

> **OPTIONAL**

The driver can operate through the authenticated app/device without requiring both contact fields.

---

# 22. Driver–Agency Mapping

Agency mapping:

> **OPTIONAL**

Possible configurations:

### Independent operator

```text
Agency: NONE

Truck
  ↓
Driver
  ↓
Routes
```

### Agency model

```text
Agency
  ↓
Truck
  ↓
Driver
  ↓
Routes
  ↓
Subscribers
```

The database should allow `agencyId = null`.

---

# 23. Recommended Core Data Model

A future Firebase implementation can use collections similar to:

```text
agencies/
  {agencyId}

trucks/
  {truckId}

drivers/
  {driverId}

routes/
  {routeId}

users/
  {userId}

subscriptions/
  {subscriptionId}

dailyRuns/
  {dailyRunId}

truckLocations/
  {truckId}

payments/
  {paymentId}

alertSettings/
  {settingsId}
```

This is a logical model, not a requirement to use these exact Firebase paths.

---

# 24. Important Relationship Model

The core runtime relationship is:

```text
AGENCY (optional)
      ↓
   TRUCK
      ↓
   ROUTE
      ↓
 DAILY RUN
      ↓
 ACTIVE GPS
      ↓
     ETA
      ↓
 ROUTE SUBSCRIBERS
      ↓
 NOTIFICATION / VOICE
```

The most important runtime object is the:

> **DailyRun**

because it identifies what route is actually operating today.

---

# 25. Example Complete Day

## 06:30 AM

Driver receives:

> Please select today's route.

## 06:55 AM

Driver opens app.

Available:

```text
Route A — Main Road
Route B — Upper Colony
```

## 07:02 AM

Driver selects:

> Route B

and presses:

> START ROUTE

DailyRun becomes:

```text
RUNNING
```

## 07:03 AM onward

GPS updates approximately once per minute.

## 07:35 AM

System determines that Truck B is approximately 10 minutes from User X.

User X receives:

> 🔔 Kachra Gadi Alert  
> Garbage vehicle is approximately 10 minutes away.  
> Please keep your garbage ready.

If voice is enabled:

> 🔊 The garbage vehicle will arrive in approximately 10 minutes...

## 08:10 AM

User X does not receive another alert for the same DailyRun.

## 09:00 AM

Subscriber alert generation window closes.

## 09:20 AM

Driver finishes.

Driver presses:

> STOP ROUTE

GPS stops.

DailyRun becomes:

```text
COMPLETED
```

## If driver forgets

At 10:00 AM:

```text
AUTO_CLOSED
```

GPS stops automatically.

---

# 26. MVP — Version 1

The first version should focus only on the core value.

### Admin/Master

- [ ] Create truck
- [ ] Create driver
- [ ] Optional agency
- [ ] Create routes
- [ ] Set route start/end
- [ ] Set route timing
- [ ] Set route price
- [ ] Configure alert message
- [ ] Configure default alert lead time
- [ ] Enable/disable voice alert

### Driver

- [ ] Driver login
- [ ] Remember authenticated driver session; no daily login
- [ ] 6:30 AM reminder
- [ ] Show available routes
- [ ] Select today's route
- [ ] Display configured route start/end on map
- [ ] Validate driver GPS against configured START location
- [ ] START ROUTE confirmation
- [ ] GPS tracking every ~1 minute
- [ ] Validate driver GPS against configured END location
- [ ] END ROUTE confirmation
- [ ] Automatic 10:00 AM shutdown
- [ ] Show current route status

### User

- [ ] User onboarding/device registration
- [ ] Save collection location
- [ ] Select route
- [ ] Select alert lead time
- [ ] Enable/disable voice
- [ ] Receive push notification

### Backend

- [ ] DailyRun creation
- [ ] Latest truck location
- [ ] ETA calculation
- [ ] Route subscriber lookup
- [ ] Alert deduplication
- [ ] Push notifications
- [ ] Automatic route shutdown

---

# 27. Version 2 Features

After the MVP proves reliable:

- [ ] Online payments
- [ ] Payment history
- [ ] Payment reminders
- [ ] Multiple agencies
- [ ] Agency dashboard
- [ ] Multiple trucks per driver
- [ ] Multiple drivers per agency
- [ ] Route map
- [ ] Historical route tracking
- [ ] Better ETA based on historical movement
- [ ] Service holidays
- [ ] Emergency route changes
- [ ] Missed collection reporting
- [ ] User feedback
- [ ] SMS/email notifications
- [ ] Admin analytics
- [ ] Collection performance reports

---

# 28. Cost-Control Principles

The application should be designed to avoid unnecessary Firebase operations.

### Do NOT

- Send GPS every second
- Continuously poll Firebase from every user phone
- Store every GPS point permanently unless required
- Continuously track user GPS

### Prefer

- GPS approximately every 1 minute while route is active
- Store/maintain latest truck location
- Use server-side/event-driven processing where practical
- Send push notification only when the alert threshold is crossed
- One alert per subscriber per DailyRun
- Stop tracking automatically at 10:00 AM

The user's phone should generally be passive until a notification arrives.

---

# 29. Security and Privacy

The system should follow minimum necessary data collection.

### Driver

Only collect location while:

```text
START ROUTE
+
permitted collection window
```

### User

Store only the collection location required for ETA calculation.

The system should not continuously track the user's movements.

### Access control

A driver should only be able to:

- See their assigned truck(s)
- See their permitted routes
- Start/stop permitted routes

An admin/operator can manage configuration.

Users should only see their own subscription/payment/profile information.

---

# 30. Key Product Decisions — LOCKED

The following decisions are considered core product requirements:

1. **Dynamic route selection — YES**
2. **Hard-coded alternate-day scheduling — NO**
3. **One user subscribing to multiple routes — NO for initial model**
4. **One-minute driver GPS update — YES**
5. **User continuous GPS — NO**
6. **Driver must explicitly START — YES**
7. **Driver must explicitly END after GPS validation — YES**
8. **Automatic route closure at 10:00 AM — YES**
9. **Morning driver reminder around 6:30 AM — YES**
10. **Subscriber alert window limited to morning collection period — YES**
11. **Evening driver movement must never trigger garbage alerts — YES**
12. **Voice alert — OPTIONAL**
13. **Mobile number for driver — OPTIONAL**
14. **Email for driver — OPTIONAL**
15. **Mobile number for user — OPTIONAL**
16. **Email for user — OPTIONAL**
17. **Agency-to-driver/truck mapping — OPTIONAL**
18. **Route pricing — YES**
19. **Payment tracking — YES, with payment integration after MVP**
20. **DailyRun records actual route selection — YES**
21. **Driver login every day — NO; authenticate once and remember the session — YES**
22. **Route start location manually entered by driver — NO**
23. **Route end location manually entered by driver — NO**
24. **Route START validated against Admin-configured map/GPS coordinates — YES**
25. **Route END validated against Admin-configured map/GPS coordinates — YES**
26. **Driver explicitly confirms START after GPS validation — YES**
27. **Driver explicitly confirms END after GPS validation — YES**

---

# 31. Initial Technology Direction

The implementation should remain lightweight and avoid unnecessary infrastructure.

### Recommended initial stack

- **Mobile application:** React Native + TypeScript
- **Backend:** Firebase
- **Database:** Cloud Firestore
- **Authentication:** Firebase Authentication for drivers; resident authentication may remain lightweight in the MVP
- **Push notifications:** Firebase Cloud Messaging (FCM)
- **Admin panel:** React + Vite
- **Voice alerts:** Native Android Text-to-Speech
- **Maps/location:** Google Maps-based map UI and device GPS

### Authentication principle

The driver authenticates once and the app remembers the session. A new `DailyRun` is created each day; daily route selection is separate from authentication.

### Development boundary

The MVP should avoid:

- Kubernetes or microservices
- A continuously running custom server
- Continuous user GPS tracking
- GPS updates every second
- Permanent storage of every GPS point unless required
- AI voice generation for routine alerts
- Payment integration before the core alert workflow is proven
- Paid routing/ETA API calls on every GPS update

The implementation should prioritize reliability, low operating cost, and a simple driver workflow.

# 32. Product Philosophy

The app should remain simple for the people actually using it.

### Driver

> **Select Route → START → Drive → STOP**

### User

> **Select Route → Set Location → Wait for Alert**

### Admin

> **Configure Trucks → Drivers → Routes → Pricing → Alerts**

The complexity should remain inside the system rather than being pushed onto the driver or resident.

---

# 33. Future Scalability

The architecture should not assume a single truck or single locality.

It should eventually support:

```text
City
  ↓
Multiple Agencies
  ↓
Multiple Trucks
  ↓
Multiple Drivers
  ↓
Multiple Routes
  ↓
Thousands of Subscribers
```

The initial implementation can remain small while preserving these relationships.

---

# 34. Success Criteria for MVP

The MVP is successful if the following scenario works reliably:

1. Admin creates a truck.
2. Admin creates a driver.
3. Admin creates two routes.
4. Users subscribe to Route A or Route B.
5. At 6:30 AM driver receives reminder.
6. Driver chooses Route B.
7. App validates the driver's GPS against Route B's configured START location.
8. Driver explicitly presses START ROUTE.
9. GPS updates approximately every minute.
10. Backend determines subscriber ETA.
11. Subscriber receives one alert at the configured threshold.
12. Optional voice announcement plays.
13. Driver reaches the configured END location and the app enables END ROUTE after GPS validation.
14. Driver explicitly presses END ROUTE and GPS stops.
15. If driver forgets to end the route, the system automatically stops at 10:00 AM.
16. If driver later walks somewhere, no garbage alert is generated.
17. Next day the driver can choose either Route A or Route B independently of the previous day's route.

---

**End of Product Specification**
