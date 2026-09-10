# Personal Health Companion for the Integrated AI Health Belt

> **Desktop Companion Workstation for Early Physiological Risk Awareness & Fall Protection**  
> Problem Statement: **SIH26181** | Category: **Hardware / MedTech / HealthTech**

---

## 1. Executive Summary

The **Personal Health Companion** is a desktop-first workstation application designed to pair with the **Integrated AI Health Belt** — a waist-worn smart wearable with dual bilateral hip airbags, MPU6050 6-axis motion classification, and ESP32 edge telemetry.

Built specifically for laptop demonstration (optimized for **1366×768** base displays at 100% zoom, scaling smoothly to **1920×1080** Full HD), this companion provides elderly and vulnerable outdoor workers with:
- Transparent, explainable early-risk awareness rather than opaque clinical assertions.
- Continuous comparison against a personalized 30-day physiological baseline.
- Dual environmental context fusion (ambient heat, humidity, AQI, municipal disaster bulletins).
- Simulated fall impact detection with a chronological 200ms protection sequence and a human "Are you okay?" 20-second escalation countdown.
- Consent-filtered, locally prepared emergency dispatch records (zero external transmission).
- Full offline PWA operability powered by service worker precaching.

---

## 2. Visual Identity & Design System

In strict accordance with `SIH26181_UI_PREFERENCE.md`, the interface employs a calm, non-distracting clinical palette:
- **Canvas / Background:** Soft clinical off-white (`#F4F6F5` / `--canvas`)
- **Cards & Surfaces:** Pure crisp white surfaces (`#FFFFFF` / `--surface`) with subtle borders (`#E2E8F0` / `--border`)
- **Primary Accent:** Restrained medical teal (`#0E6B62` / `--teal-700`)
- **Semantic Risk Bands:**
  - **Low Risk (0–30):** Calm green (`#16A34A` / `--risk-low`)
  - **Moderate Risk (31–60):** Amber (`#D97706` / `--risk-moderate`)
  - **High Risk (61–80):** Deep orange (`#EA580C` / `--risk-high`)
  - **Critical Risk (81–100):** Urgent crimson (`#DC2626` / `--risk-critical`)
- **Typography & Ergonomics:** High-contrast 16px body copy, `tabular-nums` monospace numeral stability, 44px+ touch/click targets, and complete keyboard `:focus-visible` outline rings.

---

## 3. Technology Stack & Exact Recorded Versions

This project adheres to a strict **zero-extra-dependency freeze** established during Phase 0:

| Dependency | Type | Recorded Version | Purpose |
|---|---|---|---|
| `react` | runtime | `19.3.0` | Declarative component framework |
| `react-dom` | runtime | `19.3.0` | Web DOM renderer |
| `zustand` | runtime | `5.0.15` | Single centralized reactive state store |
| `recharts` | runtime | `3.10.1` | Accessible analytical charts and vitals streaming |
| `lucide-react` | runtime | `1.44.0` | Cohesive outlined desktop workstation icon set |
| `vite` | dev | `6.4.3` | High-speed bundler & local dev server |
| `@vitejs/plugin-react` | dev | `4.7.0` | React Fast Refresh integration |
| `typescript` | dev | `5.7.3` | Strict static type checking and domain records |
| `vite-plugin-pwa` | dev | `1.3.0` | Production service worker app-shell generator |
| `vitest` | dev | `5.0.0` | High-speed unit testing suite |

**Runtime Environment:**
- **Node.js:** `v24.19.0`
- **npm:** `11.17.0`
- **Platform:** Windows 11 / Desktop / Laptop (1366×768 base target)

---

## 4. Quick Start & Execution Commands

### Prerequisites
Ensure Node.js `v20+` (`v24` recommended) and npm are installed.

### Installation
```bash
# Clone the repository and install locked dependencies
npm install
```

### Development Server
```bash
# Start local development server with HMR on port 5173
npm run dev
```

### Unit Tests
```bash
# Run the complete 59-test domain and manager test suite
npm test
```

### Production Build
```bash
# Type check and build optimized PWA assets to dist/
npm run build
```

### Production Preview (Evaluator Mode)
```bash
# Serve production bundle on port 4173 with PWA Service Worker active
npm run preview -- --port 4173 --host
```

---

## 5. Offline PWA Warm-Up & Verification Workflow

The companion features an active Workbox Service Worker that precaches the complete application shell (17 assets, ~909 KiB). To verify real offline execution:

1. **Build & Start Preview:**
   ```bash
   npm run build
   npm run preview -- --port 4173 --host
   ```
2. **Warm the Cache:**
   - Open `http://localhost:4173/` in Google Chrome.
   - Observe the top-bar indicator switch from `Cache: Local` to `Cache: Ready`.
   - Traverse at least two destinations (`#overview`, `#health`, `#devices`) to register routes.
3. **Simulate Real Browser Offline Mode:**
   - Open Chrome DevTools (`F12`) → Navigate to the **Network** tab.
   - Change the throttling dropdown from **No throttling** to **Offline**.
   - Perform a normal hard page reload (`Ctrl + R` or `F5`).
4. **Inspect Local Execution:**
   - The application reloads instantaneously from the service worker cache.
   - The top-bar indicates `Network: Offline` while `Cache: Ready` remains green.
   - Open **Demo Controls** → Switch between scenarios (Heat Wave, Pollution, Fall).
   - Physiological risk scores, 5-stage inference, alerts, and emergency SOS payload preparation continue functioning 100% locally on the laptop without external network access.

---

## 6. Architecture & System Boundaries

The application enforces clean hexagonal architecture with swappable boundaries:

```
+-------------------------------------------------------------------------+
|                         ZUSTAND COMPANION STORE                         |
|   (Single root-owned 2-second simulation loop, deterministic state)    |
+-------------------+--------------------+-------------------+------------+
        |                    |                   |                 |
        v                    v                   v                 v
[ SensorAdapter ]    [ EnvironmentProvider ] [ RiskEngine ] [ LocalRepository ]
  - Demo (ESP32 sim)   - Fixture provider      - 5-factor rule - Versioned storage
  - (Future BLE GATT)  - (Future live API)       engine        - Debounced writes
                                               - (Future NPU)
```

### Four Independent States
1. **Device Connection:** Connected (`ESP32-BELT-26181`) vs. Disconnected. Disconnection freezes telemetry and displays "No feed" warnings.
2. **Demo-Offline Mode:** In-app evaluator toggle that freezes external weather/AQI updates and marks environmental data as `(Cached)`.
3. **Browser Network Hint:** `navigator.onLine` live listener reporting actual physical network connectivity.
4. **App-Cache Readiness:** Service worker controller status indicating full offline reload capability.

---

## 7. Scenarios & Expected Settled Scores

The rule engine calculates composite risk as the maximum of five independent factor sub-scores:  
`Score = Math.max(Cardiovascular, Respiratory, Heat, Fatigue, Fall)`

| Scenario | Primary Factors | Expected Settled Score | Severity Band | Expected UI Behavior |
|---|---|:---:|:---:|---|
| **Normal (Baseline)** | Nominal vitals, indoor ambient 30°C, 60% hum, AQI 60 | **18 / 100** | **LOW** | System Nominal badge, empty factors note. |
| **Heat Wave** | Ambient 40°C, 78% hum, HR 108 (+50%), Temp 37.7°C (+1.0°C) | **78 / 100** | **HIGH** | Heat stress factor active, heat alert triggered. |
| **Pollution Event** | AQI 185 (Severe), SpO₂ 94% (-4 pp drop below baseline) | **68 / 100** | **HIGH** | Respiratory stress factor active, air quality advisory. |
| **Fatigue / Exhaustion** | Sleep 4h 10m (low), 90 min continuous high activity | **58 / 100** | **MODERATE** | Fatigue factor active, rest recommendation. |
| **Possible Fall** | MPU6050 impact vector spike followed by immobility | **65 / 100** | **HIGH** | Bilateral airbag deployment timeline + 20s check-in. |
| **Flood Warning** | Municipal advisory; physiological vitals remain nominal | **18 / 100** | **LOW** | Disaster advisory banner active; vitals untouched. |
| **Cyclone Warning** | Municipal advisory; physiological vitals remain nominal | **18 / 100** | **LOW** | Evacuation advisory banner active; vitals untouched. |

---

## 8. Hardware Identity & Future Integration Boundary

### Current Laptop Demonstration vs. Production Roadmap

- **Integrated Health Belt Hardware:**
  - Prototype features waist-worn vector SVG schematic with dual bilateral hip cushions, central buckle housing (ESP32 240MHz MCU, LiPo battery, piezo buzzer), and lateral solenoid valve actuators with 16g CO₂ cartridges.
  - In this browser prototype, sensor values and protection deployments are software-simulated via `DemoSensorAdapter` and `DeviceManager`.
- **Qualcomm Snapdragon NPU Contract:**
  - The `RiskEngine` interface is strictly decoupled from the presentation layer.
  - In future hardware trials, lightweight quantized ONNX models will execute directly on the **Qualcomm Snapdragon Neural Processing Unit (NPU)** via Qualcomm AI Hub runtime, achieving sub-10ms fall classification latency without altering UI code.
- **Actuator Safety Decoupling:**
  - Safety-critical airbag deployment decisions will execute purely on-belt within the ESP32 / MPU6050 FreeRTOS real-time loop. Deployment commands will **never** be routed across wireless browser links.

---

## 9. Mandatory Non-Diagnostic Disclaimer

> **IMPORTANT MEDICAL NOTICE:**  
> This software is a technology concept demonstrator designed for early risk awareness and wellness monitoring. It is **not** a certified medical diagnostic tool or a medical-grade device. The "Prototype AI Risk Score" is a rule-based computational simulation and does not compute clinical probabilities. Emergency features prepare local records for presentation purposes only and do **not** dispatch real-world emergency responders or ambulances. Users must consult qualified healthcare professionals for medical diagnoses and treatment.

---

## 10. Repository Structure

```
d:/Workspace/SIH-UI-EC/
├── docs/
│   ├── BUILD_STATUS.md              # Phase tracking & milestone audit
│   ├── REQUIREMENTS_TRACEABILITY.md # Comprehensive R1–R28 coverage matrix
│   ├── DECISIONS.md                 # Key architectural decisions log
│   ├── DEMO_SCRIPT.md               # 5-minute evaluator walkthrough guide
│   ├── VERIFICATION.md              # Detailed verification evidence & checklist
│   ├── FUTURE_INTEGRATION.md        # Hardware & Qualcomm NPU roadmap
│   └── screenshots/                 # Verified 1366x768 and 1920x1080 captures
├── src/
│   ├── adapters/                    # Replaceable Sensor & Environment boundaries
│   ├── app/                         # Shell layout: Sidebar, TopBar, Navigation
│   ├── components/                  # Reusable atomic UI cards and primitives
│   ├── config/                      # Application configuration & metadata
│   ├── data/                        # Static fixtures, scenarios & initial seeds
│   ├── domain/                      # Domain types, risk rules, and business managers
│   ├── features/                    # Feature workspaces (Overview, Health, AI, etc.)
│   ├── store/                       # Unified companion Zustand store
│   └── styles/                      # Semantic tokens, typography & animations
├── public/                          # Static icons, favicons & PWA webmanifest
├── package.json                     # Locked dependencies
├── vite.config.ts                   # Vite bundler & PWA Workbox configuration
└── tsconfig.json                    # Strict TypeScript configuration
```
