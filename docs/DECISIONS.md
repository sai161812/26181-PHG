# SIH26181 Architectural & Implementation Decisions

**Product:** Personal Health Companion for the Integrated AI Health Belt  
**Team:** Elite Crew  
**Problem Statement ID:** SIH26181  
**Category:** Hardware / MedTech / HealthTech  

---

## 1. Architectural Decisions Log

### Decision 1: Desktop-First Laptop Layout over Mobile-First Layout
- **Context:** The original requirements attachment described a mobile health companion with bottom navigation. However, the latest user instruction explicitly dictates: *"this is a DESKTOP-FIRST application demonstrated on a LAPTOP, not a mobile-first application."*
- **Decision:** Build a full desktop workstation layout:
  - Fixed left sidebar (~216px) containing all 9 core view destinations plus system indicators.
  - Global top bar (~64px) with persistent scenario indicator, belt simulator status badge, and global SIH Demo Controls drawer toggle.
  - Responsive main viewport optimized for **1366×768 at 100% zoom** (standard laptop) and expanding gracefully to **1920×1080** without stretching cards or leaving giant empty voids.
  - No mobile emulation frame or phone mockup container.

### Decision 2: Frontend Tech Stack & Runtime
- **Context:** We require high developer velocity, type safety, modular boundaries, zero external CDN dependencies (for offline compliance), and crisp analytical visualizations within a 15-hour implementation budget.
- **Decision:**
  - **Framework:** React 19 (`19.3.0`) with TypeScript (`5.7.3`).
  - **Build Tool:** Vite 6 (`6.4.3`) with `@vitejs/plugin-react` (`4.7.0`).
  - **State Management:** Zustand (`5.0.15`) for a single coordinated application store with isolated selectors.
  - **Charts:** Recharts (`3.10.1`) for responsive SVG time-series visualizations.
  - **Icons:** Lucide React (`1.44.0`) for clean, outlined medical and workstation iconography bundled locally.
  - **Offline PWA:** `vite-plugin-pwa` (`1.3.0`) for generating a standalone service worker that precaches all app chunks and assets.
  - **Runtime:** Node.js `v24.19.0` and npm `11.17.0`.

### Decision 3: Modular Folder Boundaries
- **Context:** Code must be cleanly structured so presentation, domain logic, state management, and adapters remain decoupled and replaceable.
- **Decision:**
  - `src/app/`: Shell layout, routing, global error boundary, top bar, and sidebar.
  - `src/components/`: Atomic UI primitives (cards, badges, metric displays, drawers, dialogs, form controls).
  - `src/features/`: Feature modules matching the 9 main destinations (Overview, Health, AIAnalysis, Environment, Alerts, Devices, Emergency, Privacy, Profile).
  - `src/domain/`: Core entities, TypeScript contracts, and domain managers (`SensorManager`, `BaselineManager`, `RiskEngine`, `AlertManager`, `EmergencyManager`, `DeviceManager`).
  - `src/domain/risk/`: Rule definitions, score calculations, factor contributions, and disclaimer definitions.
  - `src/adapters/`: Replaceable adapter implementations (`DemoSensorAdapter`, `FixtureEnvironmentProvider`).
  - `src/data/`: Deterministic seed profile (Ravi, 62), 30-day illustrative history fixtures, scenario definitions, curated health guidance.
  - `src/store/`: Coordinated Zustand store driving live feeds, scenarios, and user preferences.
  - `src/storage/`: Versioned localStorage repository with debouncing (~2s) and safe corruption recovery.
  - `src/styles/`: Design tokens (`tokens.css`), base styles (`index.css`), and accessibility definitions.
  - `docs/`: Build status, requirements traceability, architectural decisions, and demo guides.

### Decision 4: Replaceable Architectural Contracts
- **Context:** To cleanly separate prototype demo logic from future hardware and cloud backends, clean interfaces must be established.
- **Decision:** Define four key replaceable interfaces:
  ```ts
  export interface SensorAdapter {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    subscribe(onReading: (reading: SensorReading) => void): () => void;
  }

  export interface RiskEngine {
    evaluate(input: RiskInput): RiskAssessment;
  }

  export interface EnvironmentProvider {
    getSnapshot(): Promise<EnvironmentSnapshot>;
  }

  export interface LocalRepository {
    load(): Promise<PersistedState | null>;
    save(state: PersistedState): Promise<void>;
    clear(): Promise<void>;
  }
  ```

### Decision 5: Prototype AI Risk Engine Architecture
- **Context:** The risk assessment must be honest, reproducible, and clearly labeled. No LLM APIs or fabricated ML models can be used.
- **Decision:**
  - Rule-based demonstration engine with fixed, testable mathematical factor weights.
  - Category scores start with a base offset of **18**, add explicit contributions from input conditions, and clamp to `[0, 100]`.
  - Settled benchmark scores:
    - **Normal:** 18 (Low)
    - **Heat Wave:** 78 (High)
    - **Pollution Event:** 68 (High)
    - **Fatigue:** 58 (Moderate)
  - Overall score is the **maximum** of valid physiological category scores (Cardiovascular, Respiratory, Heat Stress, Fatigue), never an arbitrary sum.
  - Confidence field returns `null` and displays: *"Confidence: not estimated by this demo engine."*
  - Prominent non-diagnostic wellness disclaimer displayed in analysis, onboarding, and emergency views.

### Decision 6: Belt Identity & Two Independent Fall Flows
- **Context:** Pitch presentation `Elite Crew - SIH.pdf` centers on an Integrated Health Belt with MPU6050, ESP32, buzzer, GPS, battery, relay, solenoid valve, CO₂ cartridge, and airbag.
- **Decision:**
  - In the **Devices** screen, render a waist-worn SVG belt illustration with status rows for all 10 hardware components.
  - Implement two completely independent flows for the **Possible Fall** scenario:
    1. **Flow A (Simulated Protection Telemetry):** Display-only event timeline (Motion event received → Fall pattern classified → Solenoid activated → CO₂ released → Airbag deployed → Inspection/reset required). No physical actuation.
    2. **Flow B (Human Response & Caregiver Escalation):** Accessible modal *"Are you okay?"* with a 20-second demo countdown timer. Clicking *"I'm OK"* cancels escalation while keeping the telemetry log intact; *"Need Help"* or timeout triggers local SOS preparation.

### Decision 7: Offline Operation Strategy
- **Context:** The application must prove genuine offline operation during judge evaluation.
- **Decision:**
  - Clearly distinguish three separate states in the architecture:
    1. **In-App Demo Offline Toggle:** presenter switches to simulate network disruption; environmental provider switches to cached mode; local analysis continues.
    2. **Browser Connectivity Hint (`navigator.onLine`):** displayed as an informational network badge; does not disable local sensor simulation or analysis.
    3. **Cached PWA Readiness:** Service Worker generated via `vite-plugin-pwa` precaches all assets, bundles, and fonts.
  - Offline acceptance requires a production build (`vite build && vite preview`) to reload and operate without network access.

### Decision 8: Privacy, Consent & Local Data Lifecycle
- **Context:** Privacy preservation is a core hackathon theme.
- **Decision:**
  - Health analysis runs 100% locally on the laptop.
  - Cloud upload is labeled: *"Disabled — not implemented in this prototype."*
  - Emergency sharing permissions (location, vitals, risk level) are user-configurable and strictly enforced during SOS payload compilation.
  - Confirmed data deletion clears the repository, halts simulation timers, and returns to onboarding without silent automatic reseeding.

### Decision 9: Future Qualcomm Snapdragon Platform Integration Boundary
- **Context:** Requirements specify future Qualcomm Snapdragon on-device intelligence deployment.
- **Decision:**
  - Current implementation uses the local TypeScript rule engine in the browser.
  - The `RiskEngine` interface defines the exact boundary where an ONNX Runtime / Snapdragon Neural Processing SDK (SNPE) inference adapter will be plugged in for on-device NPU acceleration on Snapdragon X Elite / Snapdragon wearables.

### Decision 10: Binding Visual Design System (`SIH26181_UI_PREFERENCE.md`)
- **Context:** User provided explicit binding visual design instructions in `SIH26181_UI_PREFERENCE.md` for laptop demonstration (1366×768 base, 1920×1080 responsive).
- **Decision:**
  - Strict calm health-safety workstation aesthetic: `--canvas: #F4F6F5`, `--surface: #FFFFFF`, `--border: #D9E3DF`, `--text: #162B2B`, `--teal-700: #0E6B62`.
  - Zero neon, glassmorphism, floating particles, emoji icons, or fake chatbot panels.
  - 7/5 column balance for Overview Row 2 (Personal Risk Status on left, Integrated Health Belt SVG on right).
  - Four risk levels with semantic text chips, never full-card red backgrounds.
  - At the end of each phase, a local host preview will be provided if the code is runnable.
