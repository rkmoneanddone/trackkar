# Garbage Collection Alert System
## Windows Development Environment Setup & Verification Guide

**Project:** Garbage Collection Alert System  
**Project Path:** `E:\codex\GarbageCollection\`  
**Documentation Path:** `E:\codex\GarbageCollection\docs\`

## 1. Purpose

This document is the controlled setup guide for Codex while preparing the Windows development environment.

The goal is a **reusable, lightweight, secure development environment** that can also be used by other projects.

Rules:
- Inspect before installing.
- Install one logical prerequisite at a time.
- Verify after every installation.
- Do not install unnecessary heavy software.
- Do not modify application source during environment setup.
- Do not request or expose credentials until they are actually required.
- Stop after each major step and report the result.

This document guides environment preparation. Product requirements remain in `PRODUCT_SPEC.md`, development boundaries in `CODEX_RULES.md`, and technical design in `ARCHITECTURE.md`.

## 2. Project Documentation Location

All project documentation belongs in:

```text
E:\codex\GarbageCollection\docs\
```

Expected structure:

```text
E:\codex\GarbageCollection\
│
├── docs\
│   ├── PRODUCT_SPEC.md
│   ├── CODEX_RULES.md
│   ├── ARCHITECTURE.md
│   ├── PROJECT_STATUS.md
│   ├── README.md
│   └── ENVIRONMENT_SETUP_GUIDE.md
│
└── application files
```

## 3. Shared vs Project-Specific

### Shared Windows tools

These are normally installed once and can serve many projects:

```text
Node.js
npm
JDK
Git
Android SDK
Firebase CLI
```

### Project-specific configuration

These belong to the individual project:

```text
React Native dependencies
Firebase project configuration
Google Maps configuration
Application IDs
Environment configuration
Firestore rules
Cloud Functions
Application source
```

Do not put project credentials into shared tool configuration unless the tool specifically requires authenticated access.

## 4. Inspect Before Install

Before installing any tool:

1. Check whether it already exists.
2. Check its version.
3. Check its executable path.
4. Check relevant environment variables.
5. Determine compatibility with the intended stack.
6. Install only if required.

Never install a tool merely because it appears in this guide.

## 5. One-Step-at-a-Time Rule

Use:

```text
Inspect
  ↓
Report
  ↓
Approve / decide
  ↓
Install one logical prerequisite
  ↓
Verify
  ↓
Report
  ↓
Proceed
```

If installation fails:

```text
STOP
↓
Report exact error
↓
Do not make unrelated changes
```

Do not run one large setup script that installs the entire stack.

## 6. Current Verified Baseline

### Node.js / npm

Verified:

```text
Node.js: v24.19.0
npm:     11.17.0
```

Commands:

```text
node --version
npm --version
```

Status:

```text
READY
```

### JDK

Microsoft OpenJDK 17 LTS is installed at:

```text
C:\Program Files\Microsoft\jdk-17.0.20.8-hotspot
```

Verified:

```text
java --version
```

Result:

```text
openjdk 17.0.20 2026-07-21 LTS
```

`JAVA_HOME` points to that directory.

Status:

```text
READY
```

### Git

Verified:

```text
git version 2.49.0.windows.1
```

Executable:

```text
C:\Program Files\Git\cmd\git.exe
```

Commands:

```text
git --version
where git
```

Git is installed and available on PATH.

Important:

> Git being installed does not mean `E:\codex\GarbageCollection\` is already a Git repository.

Repository initialization is a separate, deliberate step.

Status:

```text
READY
```

## 7. Android Environment

Current inspection confirmed that the Android development environment is absent.

Missing:

```text
Android SDK
Android command-line tools
Android platform-tools
Android build-tools
Android platform packages
adb
emulator
```

Also not configured:

```text
ANDROID_HOME
ANDROID_SDK_ROOT
```

## 8. Android Installation Strategy

Prefer a lightweight command-line Android setup.

Target:

```text
Node.js
   ↓
JDK
   ↓
Android SDK Command-line Tools
   ↓
Android Platform Tools
   ↓
Android Build Tools
   ↓
Compatible Android Platform
   ↓
React Native Android build
```

Do **not** automatically install:

```text
Android Studio
Android Emulator
```

A physical Android phone is preferred for initial real-world testing if available.

Android Studio or an emulator may be introduced later only if a real requirement is demonstrated and approved.

## 9. Android Version Selection

Do not blindly install the newest Android platform.

First determine the React Native/Expo version that will be used and its Android requirements.

Then install only the minimum compatible:

- command-line tools
- platform-tools
- Android platform
- build-tools

The selected versions must be verified as mutually compatible.

## 10. Android Verification

After Android setup, verify:

```text
sdkmanager --version
adb version
```

Also verify:

```text
ANDROID_HOME
ANDROID_SDK_ROOT
```

Report:

- SDK location
- command-line tools version
- platform-tools version
- Android platform version
- build-tools version
- environment variables
- PATH configuration
- whether `adb` works

Do not continue if the environment is inconsistent.

## 11. Physical Android Phone

If a physical phone is available, eventually verify:

```text
adb devices
```

The phone may require:

- USB debugging enabled
- user approval of the computer
- an appropriate Windows device driver

Do not install random drivers automatically.

The emulator is not required for initial setup.

## 12. React Native / Expo

The mobile framework decision has now been made.

### Approved MVP framework

```text
React Native Community CLI
TypeScript
React Native 0.86.2
```

Do NOT install Expo for this project unless the owner explicitly changes the architecture decision.

The decision is based on the project's requirements for:

- Android-first development
- active-route GPS tracking
- GPS-based START validation
- GPS-based END validation
- persistent driver authentication
- Firebase Authentication / FCM
- Google Maps
- physical Android device testing

The selected framework must remain consistent with:

- `PRODUCT_SPEC.md`
- `ARCHITECTURE.md`
- `CODEX_RULES.md`

Do not change the mobile framework silently.

### Important

Do NOT install a global React Native CLI.

The project should use the React Native Community CLI through the project creation workflow and its local dependencies.

## 13. Node Compatibility

Current Node.js:

```text
v24.19.0
```

Before creating the mobile project, verify that the selected React Native/Expo version supports this Node version.

If another Node version is required:

1. Explain why.
2. Prefer a supported LTS release.
3. Do not silently change the shared Node environment.
4. Ask before changing it.

## 15. Verified React Native 0.86.2 Compatibility Baseline

The React Native 0.86.2 preflight has been completed and approved.

Required baseline:

```text
React Native:        0.86.2
Node.js:             >= 22.11.0
JDK:                 17
Android Platform:    36
Android Build Tools: 36.0.0
Android NDK:         27.1.12297006
```

Current Windows environment:

```text
Node.js              24.19.0         READY
npm                  11.17.0         READY
JDK                  17.0.20         READY
Git                  2.49.0          READY

Android Platform     36              READY
Build Tools          36.0.0          READY
NDK                  27.1.12297006   READY
Platform Tools / adb                 READY
```

Android Platform 35 also remains installed:

```text
android-35            INSTALLED
```

Do not remove Android Platform 35 merely because Platform 36 is now the React Native 0.86.2 target.

The compatibility check established that:

- Node.js 24.19.0 satisfies the stated Node requirement.
- JDK 17 matches the required JDK.
- Android Platform 36 is required.
- Build Tools 36.0.0 is required.
- NDK 27.1.12297006 is required.

This baseline is now locked for project creation unless a later verified compatibility issue requires a change.

Do not silently change these versions.

## 15. Firebase CLI

Before installing:

```text
firebase --version
where firebase
```

If missing, install the official Firebase CLI.

Then verify:

```text
firebase --version
```

Do not automatically:

- create a Firebase project
- select a Firebase project
- deploy anything
- change production resources

Authentication should be deliberate.

## 16. Firebase Project

Firebase project configuration is project-specific.

When ready, the owner must identify the intended Firebase project/account.

Only then should Codex configure:

```text
Firebase Authentication
Cloud Firestore
Firebase Cloud Messaging
Cloud Functions
```

Enable only required services.

## 17. Credential Rules

Never:

- request passwords for placement in source code
- hard-code secrets
- commit service-account private keys
- commit sensitive environment files
- print credentials in logs
- push credentials to GitHub

If account authentication is required:

```text
STOP
↓
Explain what authentication is needed
↓
Tell the owner what action to perform
↓
Wait for completion
```

## 18. Google Maps

Google Maps configuration is project-specific.

Before configuration:

1. Identify the required map capability.
2. Determine the minimum APIs needed.
3. Configure appropriate API restrictions.
4. Keep keys out of source control.

MVP uses Google Maps primarily for:

- Admin map-based route START configuration
- Admin map-based route END configuration
- Driver map display

Do not use a paid routing API for every GPS update.

## 19. Location and Notification Setup

Application permissions are separate from machine setup.

Eventually the app must handle:

- location permission
- background/active route location behavior
- GPS disabled
- inaccurate GPS
- notification permission
- Android app lifecycle

Do not configure these merely as part of Windows environment preparation.

## 20. Git Repository Setup

Git is installed, but repository initialization is separate.

Do not initialize or push the project repository during prerequisite installation unless explicitly instructed.

When approved:

```text
E:\codex\GarbageCollection\
```

becomes the repository root.

Before the first commit:

- inspect `.gitignore`
- exclude generated folders
- exclude secrets
- inspect files
- verify no credentials are present

Never push secrets.

## 21. Heavy Software Policy

Do not install heavy software unless necessary.

Especially:

```text
Android Studio
Android Emulator
```

Preferred initial approach:

```text
Android command-line SDK
+
Physical Android phone
```

If Android Studio or an emulator becomes necessary:

1. Explain why.
2. Explain the expected impact.
3. Ask for approval.
4. Install only then.

## 22. No Blind Automation

Codex must not execute a large setup script that simultaneously:

- downloads many tools
- changes many environment variables
- installs multiple SDK versions
- modifies application files
- creates cloud resources
- authenticates accounts
- initializes Git
- pushes code

Each major layer must be independently verified.

## 23. Environment Checklist

### Base tools

```text
[x] Node.js
[x] npm
[x] JDK
[x] Git
```

### Android

```text
[x] Android SDK
[x] Command-line tools
[x] Platform tools
[x] Build tools
[x] Android Platform 36
[x] NDK 27.1.12297006
[x] adb
```

### Mobile framework

```text
[x] React Native Community CLI decision
[x] React Native 0.86.2 selected
[x] Compatibility verified
[ ] Project scaffold
[ ] Android build verified
```

### Firebase

```text
[ ] Firebase CLI
[ ] Firebase authentication
[ ] Firebase project selected
[ ] Authentication configured
[ ] Firestore configured
[ ] FCM configured
[ ] Functions configured
```

### Google Maps

```text
[ ] Google Cloud project identified
[ ] Required Maps capability identified
[ ] Required API enabled
[ ] API key created
[ ] API key restricted
[ ] Application configuration completed
```

### Device

```text
[ ] Physical Android phone available
[ ] USB debugging enabled
[ ] adb detects device
[ ] Development build installs
```

## 24. Verification Report Format

After each installation, Codex should report:

```text
Tool:
Version:
Install location:
Executable path:
Environment variables changed:
Verification commands:
Verification result:
Status:
Remaining prerequisites:
```

Example:

```text
Tool: JDK
Version: 17.0.20
Install location: C:\Program Files\Microsoft\...
JAVA_HOME: configured
Verification: java --version
Status: READY
```

## 25. Stop Conditions

Codex must stop and ask the owner when:

- a version choice affects architecture
- a paid service is required
- credentials are required
- a cloud resource must be created
- a destructive command is proposed
- production data could be affected
- a shared environment change could affect other projects
- heavy software is proposed
- React Native/Expo compatibility is uncertain

## 26. Recommended Setup Order

Use this order:

```text
1. Inspect environment
       ↓
2. Node.js/npm
       ↓
3. JDK
       ↓
4. Git
       ↓
5. Android SDK command-line environment
       ↓
6. Decide React Native/Expo version
       ↓
7. Create minimal mobile project
       ↓
8. Verify Android build
       ↓
9. Connect physical Android phone
       ↓
10. Firebase CLI
       ↓
11. Firebase project configuration
       ↓
12. Google Maps configuration
       ↓
13. FCM
       ↓
14. Begin product implementation
```

This is an order, not permission to install everything automatically.

## 27. Current Next Action

Current verified status:

```text
Node.js              READY
npm                  READY
JDK                  READY
Git                  READY

Android SDK          READY
Android Platform 36  READY
Build Tools 36.0.0   READY
NDK 27.1.12297006    READY
adb                  READY
```

The environment preflight is complete.

The next task is to create the React Native 0.86.2 TypeScript project using the React Native Community CLI.

Do NOT install Android Studio or an emulator unless a later requirement justifies them.

Do NOT install Firebase CLI, configure Firebase, or configure Google Maps as part of the project-scaffolding step unless explicitly approved.

## 28. Final Environment Goal

```text
Windows
   │
   ├── Node.js + npm
   ├── JDK
   ├── Git
   ├── Android SDK command-line tools
   ├── Firebase CLI
   │
   └── Physical Android phone
            │
            ▼
      React Native App
            │
            ▼
         Firebase
            │
       ┌────┴────┐
       │         │
   Firestore    FCM
       │
   Cloud Functions
```

Android Studio and emulator remain optional.

## 29. Operating Principle

The environment must be:

> **Reliable, reusable, lightweight, secure, and verified step-by-step.**

Codex may perform installation/configuration when authorized, but must always follow:

```text
Inspect → Explain → Change → Verify → Report → Stop
```

---

**End of Environment Setup Guide**
