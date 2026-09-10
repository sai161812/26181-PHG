# SIH26181 Requirements Traceability Matrix

**Product:** Personal Health Companion for the Integrated AI Health Belt  
**Team:** Elite Crew  
**Problem Statement ID:** SIH26181  
**Category:** Hardware / MedTech / HealthTech  
**Binding Architecture Rule:** Desktop-First Application Demonstrated on a Laptop (Primary Target: 1366×768 at 100% zoom; Secondary: 1920×1080)

---

## 1. Traceability Matrix: R1 – R28 Requirements

| Req ID | Requirement Description | Implementation Phase | Current Status | Acceptance & Verification Criteria |
|:---:|---|:---:|:---:|---|
| **R1** | Health and environment inputs, personal baseline, local risk analysis, emergency and hardware story | Phases 2–7 | **Phase 2 Verified** (Engine & Store) | All 11 destinations functional locally; coherent local data flow connecting vitals, environment, baseline, risk, alerts, and belt telemetry. |
| **R2** | Contextual explanations rather than generic fitness tracking | Phases 2–4 | **Phase 3 Delivered** (AI Analysis) | 5-stage inference pipeline and factor decomposition cite exact baseline deviations and environmental stressors rather than generic fitness advice. |
| **R3** | Readable desktop workstation interface for older/vulnerable users and judges | Phases 1, 8 | **Phase 8 Verified** (1366×768 & 1920×1080) | High contrast, min 16px body copy, tabular numerals for vitals, 44px+ click targets, no clipping or horizontal scroll, verified at 1366×768 and 1920×1080. |
| **R4** | All 11 main destinations reachable via fixed desktop sidebar replacing mobile bottom nav | Phases 1, 3–6 | **Phase 1 Delivered** | Fixed 216px left sidebar with Overview, Health, AI Analysis, Environment, Alerts, Devices, Emergency, Privacy, Profile & Settings; plus Onboarding wizard and Demo Controls drawer. |
| **R5** | Four onboarding stages and required profile/permission choices | Phase 6 | **Phase 6 Delivered & Verified** | 4 steps (Welcome, Profile, Permissions/Consents, Review); supports "Use demo profile" (Ravi, 62) and "Not now" for permissions; zero blocking on denied browser permissions. |
| **R6** | Workstation greeting, overall health status, seven metrics and small trend indicators | Phases 1–3 | **Phase 3 Delivered** (Overview & Health) | Overview and Health workspace display live vitals: HR, SpO₂, body temp, activity with live deviation badges, hardware freshness, and dual streaming buffers. |
| **R7** | Standardized 0–100 risk bands and transparent "Prototype AI Risk Score" disclosure | Phases 2–3 | **Phase 3 Delivered** (AI Analysis) | Standardized 0–30 Low, 31–60 Moderate, 61–80 High, 81–100 Critical. Prominently labeled "Prototype AI Risk Score — Rule-based demonstration". |
| **R8** | Five analysis stages, input/context explanation, replaceable engine interface | Phases 2–3 | **Phase 3 Delivered** (AI Analysis) | Stages: Sensor Receipt → Baseline Comparison → Environmental Context → Pattern Analysis → Risk Assessment. Stages display actual live processing state. |
| **R9** | Personal baseline (HR, SpO₂, activity, sleep) and live percentage / percentage-point comparison | Phases 2–3 | **Phase 3 Delivered** (Health Baseline) | Medians computed from 30-day history; HR relative % deviation; SpO₂ pp drop. Manual resting HR labeled `(User Defined)` and protected from silent overwrite. |
| **R10** | Five anomaly categories: cardiovascular, respiratory, heat stress, fatigue, and fall/motion | Phases 2–5 | **Phase 3 Delivered** (AI Analysis) | Transparent breakdown for all 5 anomaly categories. Settled scores: Normal 18, Heat 78, Pollution 68, Fatigue 58, Extreme Heat 93. Null confidence disclosed. |
| **R11** | Environmental Safety workspace with 4 hazard summaries and curated non-diagnostic advice | Phase 4 | **Phase 4 Delivered & Verified** | 2×2 hazard matrix (Heat, AQI, Flood, Cyclone); source freshness and validUntil timestamps; cached/offline fallback; CDC/NDMA non-clinical guidance. |
| **R12** | Pollution scenario visibly links AQI and personal SpO₂ baseline drop | Phases 2–4 | **Phase 3 Verified** (Test & Engine) | AQI 185 + SpO₂ drops from 98% to 94% (4 percentage points); respiratory score reaches 68 (High); transparent factor contribution displayed. |
| **R13** | Heat scenario changes physiological and environmental values and produces explained high risk | Phases 2–4 | **Phase 3 Verified** (Test & Engine) | Ambient 40°C, humidity 78%, HR 108 (+50%), body temp 37.7°C, 45 min exposure → Heat score reaches 78 (High); 90 min exposure test reaches 93 (Critical). |
| **R14** | Flood and cyclone modes with appropriate cached disaster information | Phase 4 | **Phase 4 Delivered & Verified** | Physiological metrics remain nominal baseline (Score: 18 / Low); disaster advisory banner active; emergency preparedness checklist; cached snapshot freshness shown. |
| **R15** | Demo offline switch plus actual production PWA offline reload and local operation | Phases 2, 7 | **Phase 7 Delivered & Verified** | PWA service worker precaches all 17 assets/chunks; app reloads under real browser network-offline; 4 states separated (Belt, Demo offline, Browser hint, App cache); synthetic offline context distinguished from cached bulletins; local monitoring, analysis, alerts, and SOS preparation continue uninterrupted. |
| **R16** | Privacy Center with functional local sharing choices and confirmed data deletion | Phases 6–7 | **Phase 6 Delivered & Verified** | Discloses local laptop processing; cloud upload permanently disabled; granular SOS field toggles enforced in payload; confirmed data deletion resets store and returns to onboarding. |
| **R17** | SOS confirmation dialog, consent-filtered payload preview, simulated local preparation | Phases 5–6 | **Phase 5 Delivered & Verified** | Confirmation modal ("Send SOS - demo" / Cancel); prepares local record with contact, timestamp, vitals, location (if permitted); deduplicated; status: "Prepared — demonstration only; nothing sent". |
| **R18** | Integrated Health Belt view, 10 component status rows, Connect Device flow and adapter boundary | Phases 2, 5 | **Phase 5 Delivered & Verified** | Vector SVG belt illustration with bilateral airbags; 12 component status channels; Connect flow with simulated pairing, disconnect and reconnect. |
| **R19** | Six metric trend charts with Today / 7 Days / 30 Days and truthful insights | Phase 3 | **Phase 3 Delivered** (Health Trends) | Interactive Recharts area chart for all 6 metrics (HR, SpO₂, temp, activity, sleep, risk score); genuine window filtering; derived narrative insights; illustrative seed banner. |
| **R20** | Dynamic Alerts workspace with deduplication, episode lifecycle, input snapshots, acknowledgement | Phase 4 | **Phase 4 Delivered & Verified** | Trigger after 2 consecutive qualifying samples; resolve after 3 normal samples; deduplicated by category episode; frozen input snapshots; escalation; superseded scenario resolution; works offline. |
| **R21** | Professional accessible desktop design; complete light theme | Phases 1, 8 | **Phase 8 Verified** (Tokens & Usability) | Off-white background (`#F4F6F5`), white surfaces, restrained teal accent (`#0E6B62`), high-contrast text, clear focus rings, reduced-motion compliance. |
| **R22** | Modular domain architecture with named managers and replaceable inference boundary | Phases 0, 2 | **Phase 2 Delivered** | Managers: Sensor, HealthData, Baseline, RiskEngine, Environmental, Alert, Emergency, Privacy, Offline, Device. Replaceable TypeScript interfaces. |
| **R23** | Local versioned persistence for profile, baseline, recent readings, alerts, and settings | Phases 2, 6–7 | **Phase 2 Delivered** (LocalRepository) | Versioned LocalStorage repository with debounced writes (~2s); graceful hydration and corruption recovery fallback. |
| **R24** | Changing realistic demo inputs, including scripted motion followed by inactivity | Phases 2, 5 | **Phase 5 Delivered & Verified** | Root 2-second simulator; Possible Fall scripts acceleration spike followed by inactivity; 20-second escalation countdown; protection timeline. |
| **R25** | Named demo actions in Demo Controls drawer (Normal, Heat, Pollution, Fatigue, Fall, Flood, Cyclone, Offline, Reset) | Phases 2, 4–5, 7 | **Phase 2 Delivered** (Store Actions) | Topbar button opens right drawer accessible globally; scenario switching cleanly resets active timers and previous episodes. |
| **R26** | Non-diagnostic terminology and mandatory medical disclaimer | Phases 3, 5–6, 8 | **Phase 8 Verified** | Prominently rendered non-diagnostic disclaimer in footer; truthful confidence disclosure; emergency demonstration disclaimer across all relevant screens. |
| **R27** | Future Qualcomm Snapdragon NPU deployment architecture note | Phases 3, 5, 9 | **Phase 5 Documented & Verified** | Transparent notes in AI Analysis, Devices, and Emergency on Snapdragon NPU / Qualcomm AI Hub ONNX runtime edge execution contract. |
| **R28** | Functional screens, coherent local state, zero dead buttons or fake toasts | Phases 7–9 | **Phase 8 Verified** | Every clickable button executes a real state change, modal, or drawer. Toasts never substitute for promised workflows. Verified across all routes. |

---

## 2. Hardware Features from Pitch Presentation (`Elite Crew - SIH.pdf`)

The presentation establishes the project identity as a **Hardware category** entry for **SIH26181**:

| Presentation Slide | Stated Hardware / Concept Feature | Prototype UI Implementation | Future Hardware Implementation |
|---|---|---|---|
| **Slide 1** | Team Elite Crew, Problem Statement SIH26181, MedTech/HealthTech, Hardware Category | App title, branding, header tags, and build documentation | Physical device production and certification |
| **Slide 2** | Smart wearable Personal Health Companion belt for elderly/rural/outdoor workers; Edge-AI processing via ESP32 | Desktop workstation companion UI; scenario simulation of elderly/vulnerable user (Ravi, 62) | Physical wearable belt; ESP32 firmware development |
| **Slide 3: Stack** | **MPU6050 6-axis motion sensor** | Simulated motion telemetry (acceleration vectors, fall spike) | I2C MPU6050 reading on ESP32 |
| **Slide 3: Stack** | **ESP32 controller** | Simulated controller status, link quality, firmware version | Physical ESP32 micro-controller board |
| **Slide 3: Stack** | **Buzzer, Battery, GPS** | Battery status (84%), simulated buzzer indicator, demo location provenance | Hardware piezo buzzer, LiPo battery circuit, NEO-6M GPS module |
| **Slide 3: Stack** | **Relay, Solenoid valve, CO₂ cartridge, Airbag** | Simulated protection event timeline: Fall detected → Solenoid activated → Gas released → Airbag deployed | Physical 5V relay, 12V solenoid valve, 16g threaded CO₂ cylinder, inflatable hip airbag cushion |
| **Slide 4** | Belt concept 3D renders, prototype photograph, Arduino/ESP32 code implementation | SVG vector belt illustration showing waist-worn form factor; component status indicators | Industrial design manufacturing, flexible PCB, ergonomic belt strap |
| **Slide 5** | Impact: Injury reduction, early detection, automatic protection, ultra-fast response | Dedicated "Devices" view with timeline logging simulated fall-to-deployment sequence | Certified biomechanical impact reduction testing |
| **Slide 6** | Research references (5 IEEE papers from 2024–2025 on fall detection and wearable IoT) | Documented in architecture notes and research references | Clinical trials and empirical sensitivity/specificity validation |

---

## 3. Desktop Navigation Architecture (Laptop Demonstration)

Binding user instruction overrides mobile bottom-navigation:
- **Primary Viewport:** 1366 × 768 at 100% browser zoom (standard laptop display).
- **Secondary Viewport:** 1920 × 1080 (FHD display).
- **Sidebar:** Fixed left navigation (~216px).
- **Top Bar:** Global status header (~64px) with scenario pill, belt connection status, and SIH Demo Controls toggle.
- **Main Viewport:** Responsive grid, max content width ~1440px.

```
+---------------------------------------------------------------------------------------+
|  TOP BAR (64px): [Brand] | Active Scenario Pill | Belt Status | [SIH Demo Controls]  |
+-------------------+-------------------------------------------------------------------+
| FIXED SIDEBAR     | MAIN CONTENT WORKSPACE                                            |
| (216px)           | (Responsive grid, 1366x768 base, 1440px max width)                |
|                   |                                                                   |
| [1] Overview      | [ Active Viewport Content ]                                       |
| [2] Health        | - Metric Cards (HR, SpO2, Temp, Activity, Ambient, Hum, AQI)      |
| [3] AI Analysis   | - Prototype AI Risk Score & Factor Decomposition                  |
| [4] Environment   | - Analytical Recharts Trend Panels                                |
| [5] Alerts        | - Belt SVG Schematic & Simulated Telemetry Timeline              |
| [6] Devices       |                                                                   |
| [7] Emergency     |                                                                   |
| [8] Privacy       |                                                                   |
| [9] Profile       |                                                                   |
|                   |                                                                   |
| [Laptop 1366x768] | [Non-Diagnostic Medical Disclaimer Footer]                       |
+-------------------+-------------------------------------------------------------------+
```

---

## 4. Actual vs. Simulated Behavior Delineation

| System Capability | Implemented in 15-Hour Prototype | Represented as Future Work |
|---|---|---|
| **Sensor Readings** | Seeded, changing local 2s simulator; pause, disconnect, and reconnect controls | Physical BLE / USB serial telemetry from ESP32 / MPU6050 |
| **Personal Baseline** | Calculated median from 30-day normal history fixture; user manual resting HR override | Continuous longitudinal adaptive baseline learning |
| **Risk Analysis** | Transparent deterministic rule engine with factor contributions and 0–100 score | Trained deep-learning / clinical model on device or edge |
| **Environmental Context** | Simulated snapshots (Heat 40°C/78%, Pollution AQI 185, Flood/Cyclone advisories) | Live feeds from OpenWeatherMap, CPCB AQI, NDMA disaster APIs |
| **Belt Actuation** | Ordered display-only protection event timeline in Devices view | Real relay energizing, solenoid valve opening, CO₂ inflating airbag |
| **Fall Escalation** | Accessible "Are you okay?" 20s countdown; I'm OK / Need Help buttons | Hardware accelerometer shock trigger + physical buzzer audio |
| **Emergency SOS** | Consent-filtered local payload preparation with inspection viewer | Real GSM / SMS / Twilio / 112 emergency caregiver dispatch |
| **Offline Operation** | Service Worker PWA app-shell cache; offline reload; local state | Hardware-level standalone offline logging when laptop is closed |
| **Data Privacy** | Versioned localStorage repository; explicit field toggles; confirmed deletion | Hardware secure element / encrypted native SQLite storage |
| **Qualcomm / Edge Platform** | Documented modular inference contract (`RiskEngine` interface) | Snapdragon Neural Processing SDK / ONNX runtime on Snapdragon X Elite |
