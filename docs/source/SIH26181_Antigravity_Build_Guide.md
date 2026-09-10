# SIH26181 — Antigravity UI Build Guide

**Product:** Personal Health Companion for the Integrated AI Health Belt  
**Team:** Elite Crew  
**Delivery:** Desktop-first interactive frontend, demonstrated on a laptop  
**Budget:** 15 hours, including integration, verification, and rehearsal  
**Working app name:** Health Companion. Keep this in one configuration value so renaming is trivial.

## 1. Start here

Build a polished desktop companion application that makes the belt's intended operation understandable: simulated sensor readings change, local prototype analysis compares them with a personal baseline and environmental context, explanations and alerts update, and emergency workflows respond.

This is a frontend assignment. Implement the small amount of local logic necessary for a convincing, coherent demonstration. Real sensors, clinical model training, firmware, remote notifications, and physical protection are future integrations.

**The demonstration is on a laptop. This overrides the attachment's mobile-first layout and bottom-navigation suggestion.** Use a full desktop workspace with a sidebar. Do not put the application inside a phone frame or stretch a mobile screen across a laptop.

### How you should use this guide

1. Put this file and both original attachments in the Antigravity project workspace, preferably under `docs/source/`. Keep their contents intact.
2. Start with an empty application folder, or let the agent inspect an existing React project before modifying it.
3. Paste **Prompt 0** from section 10. It establishes the project contract; it does not request the whole application.
4. Paste each subsequent prompt separately. Check its visible acceptance gate before moving forward.
5. Keep the same project and conversation where practical. If context is lost, use the recovery prompt in section 11.
6. Each phase ends with a working build, a brief handoff, and a local checkpoint. Do not accept “implemented” without opening the result.

Read sections 2–4 yourself. Antigravity should read the entire guide. The remaining sections are the implementation specification and staged instructions.

## 2. What the supplied material actually requires

The requirements text describes a privacy-preserving health companion with simulated sensors, baseline comparison, local risk analysis, environmental context, disasters, offline operation, trends, SOS, and future wearable integration.

The presentation adds a specific hardware identity:

- Page 1: SIH26181, HealthTech, Hardware category, Elite Crew, and the integrated health belt.
- Page 2: early risk warnings, ESP32 processing, physical protection, GPS and caregiver assistance.
- Page 3: MPU6050 motion sensor, ESP32, buzzer, battery, GPS, relay, solenoid valve, CO₂ cartridge, and airbag.
- Page 4: belt concept renders and a prototype photograph. These illustrate the proposal; they do not establish that the laptop app is connected to that hardware.
- Pages 5–6: intended impact and research references. Do not turn those into measured performance claims.

**Therefore the UI must include a meaningful belt/device view and a simulated protection-event timeline.** A dashboard consisting only of heart-rate and temperature cards misses the presentation's central product.

The supplied files use different problem-statement titles. Use `SIH26181` and the descriptive product name consistently. Preserve the Qualcomm future-platform positioning from the requirements in an architecture note. Do not invent an official title, partnership, certification, measured accuracy, or current hardware integration. Official SIH eligibility and submission rules are outside this UI guide.

### Delivery boundary

| Capability | Implement in these 15 hours | Represent as future work |
|---|---|---|
| All required screens | Real navigation, inputs, detail views and state | Native mobile packaging |
| Sensors | Seeded, changing local simulator; pause, disconnect and reconnect | BLE, serial/USB, wearable SDK feeds |
| Personal baseline | Stored demo history, baseline calculation, provenance and comparison | Validated longitudinal baseline learning |
| Risk analysis | Replaceable deterministic demonstration engine, real explanations | Trained and clinically evaluated models |
| Environment/disasters | Timestamped simulated and cached context | Live weather, AQI and official disaster feeds |
| Offline | Cached app shell, local data, functional scenarios without network | Guaranteed monitoring while browser/OS is suspended |
| Fall and protection | Motion-event simulation, belt telemetry timeline, response dialog | Physical deployment and protection effectiveness |
| SOS | Confirmation, consent-filtered local payload, prepared status | Actual SMS, calling, caregiver delivery |
| Privacy | Local demo records, working settings and deletion | Encrypted native storage, production access controls |
| Qualcomm | Documented inference integration boundary | Actual supported Snapdragon runtime integration |

“UI-only” does not mean disconnected static screens. It means that every visible workflow runs locally without needing production services.

## 3. The 15-hour execution plan

These are implementation timeboxes, not a promise that any agent can finish an arbitrary codebase in exactly 15 hours. Keep the total fixed by avoiding optional additions and solving shared components once.

| Phase | Time | Cumulative | Finished outcome |
|---|---:|---:|---|
| 0. Read, reconcile, initialize | 30 min | 0:30 | Scope, traceability, runnable scaffold |
| 1. Desktop visual foundation | 90 min | 2:00 | Approved shell and polished Overview |
| 2. Local domain and simulation | 120 min | 4:00 | Shared state, scenarios, persistence, risk engine |
| 3. Health and explanation experience | 120 min | 6:00 | Live readings, baseline, six trends, AI Analysis |
| 4. Environment and alerts | 90 min | 7:30 | Four hazard modes and complete alert workflows |
| 5. Belt, fall and SOS | 90 min | 9:00 | Device simulation, protection timeline, emergency flow |
| 6. Onboarding, profile and privacy | 90 min | 10:30 | Four-step onboarding and working settings |
| 7. Offline and integration | 120 min | 12:30 | Production-build offline reload and coherent app |
| 8. Visual and interaction finish | 60 min | 13:30 | Laptop layout and usability sweep |
| 9. Verification and rehearsal | 90 min | 15:00 | Evidence, resettable demo and final handoff |

**At hour 2:** lock the visual direction. Do not redesign the shell after that.  
**At hour 4:** all pages must be able to consume the same domain state.  
**At hour 9:** the main demonstration must run end to end.  
**At hour 12:30:** freeze features and dependency changes.  
**Final 2.5 hours:** fixes, readability, verification, rehearsal.

If behind, remove optional dark mode, decorative transitions, elaborate illustrations, custom calendar pickers and extra dashboards first. Retain every required workflow, the belt story, offline verification, and emergency cancellation. Combine related content into tabs or drawers to save implementation time without deleting requirements.

## 4. Desktop product and visual specification

### Navigation

Use a fixed left sidebar with these destinations:

| Destination | Content |
|---|---|
| Overview | Overall status, personal risk, live metrics, belt summary, recent alerts |
| Health | Live monitoring / Personal baseline / Trends tabs |
| AI Analysis | Processing stages, factor explanations, five anomaly categories |
| Environment | Environmental Safety / Disaster alerts tabs |
| Alerts | Health, environmental, fall and recovery events |
| Devices | Belt illustration, component telemetry, connect/disconnect simulation |
| Emergency | SOS, contact, location state, event details and prepared payload |
| Privacy | Local processing, offline/cache status, sharing choices, deletion |
| Profile & Settings | Profile editing, consent states, accessibility and demo setup |

Onboarding is an initial full-width wizard. SIH Demo Controls is a top-bar button opening a right drawer, accessible from every destination. Keep only the active scenario, pause/resume, connectivity badge and reset shortcut in the global top bar. Avoid a permanent giant control panel consuming the product's screen space.

### Layout contract

- Primary target: **1366 × 768**, 100% browser zoom. Also inspect **1920 × 1080**.
- Sidebar: approximately 216 px. Top bar: approximately 64 px. Main page padding: 24 px; 20 px on the smaller laptop if needed.
- Use a responsive grid and maximum content width around 1440 px. At 1920 px, use the space for wider charts and balanced columns, not oversized empty cards.
- Overview: top status summary; one compact row of primary vitals; a main chart beside a risk explanation/belt summary column; environmental strip and recent events below.
- On the first 768 px-high viewport, judges must see overall status, current risk, the main vitals, belt connection state, and the Demo Controls button. Secondary history may scroll.
- The seven required metrics must all appear on Overview: HR, SpO₂, body temperature, activity, ambient temperature, humidity, AQI. Group environmental metrics together rather than forcing seven equal oversized cards.
- Health and Environment are spacious analytical workspaces. Alerts is a readable list with a detail drawer. Devices uses an illustration/status panel alongside telemetry. Emergency uses a focused central action area with a clear event summary beside it.
- No horizontal page scrolling. Tables may have a deliberate local overflow container if truly necessary. Charts resize to their parent.
- Dialogs must remain inside the viewport, have visible close/cancel controls, restore focus, and handle keyboard navigation.
- Retain a usable single-column fallback at narrow widths, but do not spend the deadline building a separate mobile application.

### Visual direction

Aim for a calm, precise health-monitoring workstation with a distinct belt identity.

| Token | Direction |
|---|---|
| Page background | Warm off-white, e.g. `#F5F7F6` |
| Surface | White with a subtle neutral border |
| Main text | Deep charcoal, e.g. `#172A2B` |
| Secondary text | Slate, e.g. `#526566` |
| Main accent | Restrained deep teal, e.g. `#0F766E` |
| Low / Moderate / High / Critical | Green / amber / orange / red, always with text labels |
| Typography | Locally bundled Inter if convenient, otherwise a good system sans-serif |
| Body | 16 px preferred; supporting data labels 13–14 px |
| Headings | 24–28 px page titles; 16–18 px section headings |
| Main numbers | 28–36 px, tabular numerals |
| Spacing | Consistent 4/8/12/16/24/32 scale |
| Corners | 12–16 px cards; 8–10 px controls |
| Icons | One consistent outlined icon set |
| Motion | Short 150–250 ms transitions; respect reduced motion |

Use small inline trend lines, baseline markers and meaningful device details for character. Avoid giant gradients, neon, glass panels, emoji icons, excessive red, animated ECG decoration unrelated to data, and repeating a colored strip on every card. Do not add a chatbot, marketing landing page, sign-in system, or decorative “AI assistant.”

Use 44 px or larger main interaction targets, visible keyboard focus and readable contrast. Severity must remain understandable in grayscale. Screen-reader announcements should cover new alerts, not every sensor tick.

Light mode is the required polished theme. Dark mode is optional only after the full acceptance matrix passes.

### Required screen behavior

| Screen | Concrete interactions and states |
|---|---|
| Onboarding | Four steps, back/next, profile validation, explicit demo profile option, permission choices, persistent completion |
| Overview | Click a vital to open its Health detail; click risk to open explanation; click belt to Devices; click alert to its exact detail |
| Health: Live | Six-minute live window, selectable metric, last reading time, source and quality, pause/disconnected/stale states |
| Health: Baseline | Resting HR, typical SpO₂, activity and sleep; current comparison; sample/source explanation; explicit recalculation |
| Health: Trends | HR, SpO₂, body temperature, activity, sleep, risk; Today / 7 Days / 30 Days; meaningful axes and summaries |
| AI Analysis | Current inputs, five processing stages, category results, individual contributing factors, prototype confidence disclosure |
| Environment | Heat, air quality, flood, cyclone; source/freshness; relevant recommendations; disaster detail |
| Alerts | All / Active / Acknowledged / Resolved filters, severity/type filters, detail, acknowledge, recovery events, empty state |
| Devices | Simulated belt, connect dialog, sensor quality/battery, disconnect/reconnect, protection timeline, future adapter explanation |
| Emergency | SOS confirmation, cancel, contact validation, location choice, payload preview and local prepared record |
| Privacy | Working local-sharing choices, cache/online state, clear local data, explicit limitation text |
| Profile | Save/cancel edits, resting HR input provenance, contact editing, location/notification states, demo defaults |
| Demo Controls | Normal, Heat Wave, Pollution, Fatigue, Possible Fall, Flood, Cyclone; offline toggle; pause/resume; reset |

Do not use a toast as the entire implementation of an action that promises a workflow. For example, Connect Device opens a real local connection flow; Save persists values; View Details opens the selected record.

## 5. Technical implementation contract

### Stack

Use **React + TypeScript + Vite**, CSS variables with CSS Modules or ordinary scoped styles, **Zustand** for shared application state, **Recharts** for charts, **Lucide React** for icons, and **vite-plugin-pwa** for the offline app shell. Use **Vitest** for the few meaningful domain tests and **Playwright** for the final core journeys if available.

If a working project already uses an equivalent library, retain it instead of migrating. Do not install both a reducer architecture and several competing state libraries. Avoid backend setup, API keys, hosted authentication, external font CDNs, live map dependencies, and heavy 3D rendering.

Use a simple hash router so the local static build and cached navigation are predictable. A small, well-defined route map is sufficient. Do not build a custom framework.

Before scaffolding, check Node and the chosen Vite version's engine requirement; current Vite documentation lists Node 20.19+ or 22.12+. Record installed versions and commit the lockfile; do not repeatedly upgrade during the build. [Vite setup documentation](https://vite.dev/guide/)

Use one app-shell service worker generated by the PWA plugin, bundle needed assets locally, and provide a manifest. [Vite PWA guide](https://vite-pwa-org.netlify.app/guide/)

### Suggested modules

| Area | Responsibility |
|---|---|
| `src/app/` | Shell, router, bootstrap, global error boundary |
| `src/components/` | Reusable cards, badges, charts, tables, dialogs, form controls |
| `src/features/` | One folder per destination; presentation and interaction |
| `src/domain/types.ts` | Shared data and event contracts |
| `src/domain/managers/` | The managers listed below |
| `src/domain/risk/` | Replaceable inference interface, demo implementation, factor rules |
| `src/adapters/sensors/` | Sensor adapter contract and DemoSensorAdapter |
| `src/adapters/environment/` | Fixture and cached environmental provider |
| `src/data/` | Seed profiles, historical fixtures, scenario definitions, guidance text |
| `src/store/` | One coordinated application store and selectors |
| `src/storage/` | Versioned local repository and recovery from corrupt data |
| `src/styles/` | Tokens, global layout and accessibility styles |
| `docs/` | Build status, traceability, demo script and integration notes |

Managers may be focused functions; they do not need large classes:

- **SensorManager:** one subscription, timestamps, source and connection quality.
- **HealthDataManager:** validates readings, live buffers and historical aggregates.
- **BaselineManager:** baseline calculation and provenance; refuses abnormal demo samples.
- **RiskEngine:** consumes inputs and returns category scores and explanations.
- **EnvironmentalManager:** source, scenario, cached bulletin and expiry.
- **AlertManager:** transitions, deduplication, acknowledgement and history.
- **EmergencyManager:** fall response state and consent-filtered SOS preparation.
- **PrivacyManager:** local choices, data minimization and deletion.
- **OfflineManager:** simulated connectivity, browser hint and cache readiness.
- **DeviceManager:** belt telemetry and simulated protection events.

Sensor processing flows into validated health/environment data, then baseline comparison and risk analysis. Results update alerts and the UI; the repository persists selected records. Do not treat the attachment's linear layer sketch as a requirement to place storage after every computation.

### Core records

Define these before building page-specific logic:

| Record | Essential fields |
|---|---|
| `UserProfile` | id, name, age, optional gender, restingHR, emergencyContact, profileOrigin |
| `Baseline` | restingHR, spo2, bodyTemperatureC, activity, sleepMinutes, sampleCount, timeWindow, source, computedAt |
| `SensorReading` | id, sequence, observedAt, source, hr, spo2, bodyTemperatureC, activity, activityMinutes, sleepMinutes, motion, quality |
| `EnvironmentSnapshot` | id, ambientC, humidityPct, aqi, locationLabel, outdoor, exposureMinutes, source, observedAt, validUntil, disasterType, disasterSeverity |
| `RiskAssessment` | id, computedAt, inputReadingId, environmentId, engineVersion, categoryResults, overallScore, severity, factors, guidanceIds, confidence, missingInputs |
| `Alert` | id, episodeId, type, severity, title, reason, actions, inputSnapshot, createdAt, lastSeenAt, acknowledgedAt, resolvedAt |
| `DeviceStatus` | id, name, source, connection, batteryPct, lastSeenAt, componentStates, protectionState |
| `SOSRecord` | id, incidentId, preparedAt, contact, consent-filtered location/vitals/risk, status |
| `Settings` | schemaVersion, onboardingComplete, sharingChoices, notificationPreference, simulatedOffline, accessibilityChoices |
| `DemoState` | scenarioId, scenarioRunId, seed, running, transitionProgress, demoClock |

Use numbers or `null` for missing readings, never a fabricated zero. Store timestamps consistently as epoch milliseconds or ISO strings. Use explicit Celsius, bpm, percent and minutes. Label demo location and demo history wherever presented as evidence.

### Replaceable boundaries

```ts
interface SensorAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  subscribe(onReading: (reading: SensorReading) => void): () => void;
}

interface RiskEngine {
  evaluate(input: RiskInput): RiskAssessment;
}

interface EnvironmentProvider {
  getSnapshot(): Promise<EnvironmentSnapshot>;
}

interface LocalRepository {
  load(): Promise<PersistedState | null>;
  save(state: PersistedState): Promise<void>;
  clear(): Promise<void>;
}
```

These interfaces describe boundaries; extend types as needed. The actual demo engine must be replaceable without editing page components. Create no fake hardware adapters that report successful real pairing.

### State and persistence rules

- A single root-managed simulator drives every page. Route changes never create another interval.
- Generate a reading every two seconds while connected and running. Pause and unsubscribe cleanly; React development remounts must not double the stream.
- Keep 180 live samples per metric, at most 200 alerts, and bounded risk history. Persist compact aggregates for long-term trends rather than every simulated tick.
- Use a versioned localStorage repository for bounded fictional demo records, debounced around two seconds. Isolate it behind the repository interface for later IndexedDB/native storage replacement.
- Hydrate first, then start simulation. Catch JSON/schema/quota failures and offer a clear local recovery action.
- Privacy switches and contact/profile saves survive reload. Do not claim browser storage is encrypted or suitable for real clinical records.
- Reset Demo stops timers, clears pending incident/countdown state, restores seed data and starts Normal deterministically. Retain the user's profile and privacy choices; a separate confirmed Reset Everything clears those too.
- Deleting local data stops writes and simulation, clears the app's records, and returns to onboarding. It must not silently reseed the user's data immediately afterward.
- Distinguish active data, paused data, disconnected data and stale data. A stale reading is not “Stable.”
- On page visibility loss, pause and resume without inventing missed readings. Expired response deadlines become a single prepared-demo event on resume, with a truthful timestamp note. Never imply continuous background protection.

## 6. Demonstration logic that stays coherent

### Seed profile and history

Use a clearly fictional user, for example **Ravi, 62**, with resting HR **72 bpm**, typical SpO₂ **98%**, body temperature **36.7°C**, usual moderate activity and typical sleep **7 h 20 m**. Use a fictional contact display such as “Demo caregiver” and a masked non-dialable phone value. The seeded contact can support demo payload preparation; a user-entered contact must pass form validation.

Generate deterministic 30-day demo history once using a fixed seed. Mark it “Illustrative demo history.” Aggregate it for Today, 7 Days and 30 Days without regenerating it when a tab changes. Use separate series and units for heart rate, SpO₂, temperature, active minutes, sleep duration and prototype risk. Construct the normal resting fixture so its medians match the stated seed baseline; random noise must not quietly change the expected demo scores.

Baseline calculation uses valid resting samples from the normal-history fixture; use medians for numeric metrics. Label the sample window and count. Exclude scenario anomalies. A user-entered resting HR is explicitly labeled as user-provided and takes precedence until the user chooses Recalculate from demo history. Do not silently learn a new normal during a heat event.

For HR show percentage deviation: `(current − baseline) / baseline × 100`. At 104 versus 72, display approximately **+44%**. For SpO₂, use **percentage points**: 98% to 94% is a drop of **4 percentage points**, not 4% relative change.

### Scenario fixtures

Numbers below are artificial UI-demo inputs. They are not clinical thresholds or validated simulations of human physiology. Smooth transitions are compressed demonstrations, not predictions of how quickly a real condition changes.

| Scenario | Fixture inputs at settled state | Required visible result |
|---|---|---|
| Normal | HR 72, SpO₂ 98, body 36.7°C, ambient 30°C, humidity 60%, AQI 60, moderate activity, sleep 440 min | Low prototype risk, no active anomaly |
| Heat Wave | HR 108, SpO₂ 97, body 37.7°C, ambient 40°C, humidity 78%, AQI 60, high activity, 45 min exposure | High heat-stress demo result, personal HR deviation and environment factors |
| Pollution Event | HR 82, SpO₂ 94, body 36.7°C, ambient 30°C, humidity 60%, AQI 185, moderate outdoor activity | Elevated respiratory demo result with baseline SpO₂ drop and air-quality context |
| Fatigue | HR 94, SpO₂ 97, body 36.8°C, ambient 30°C, humidity 60%, AQI 60, high accumulated activity, sleep 240 min | Moderate fatigue demo result with sleep, activity and recovery explanation |
| Possible Fall | Otherwise Normal vitals, scripted abrupt motion followed by inactivity | Fall incident, simulated protection timeline, “Are you okay?” interaction |
| Flood | Normal physiological inputs, simulated high flood bulletin | Disaster warning and cached preparedness information; no fabricated vital anomaly |
| Cyclone | Normal physiological inputs, simulated high cyclone bulletin | Disaster warning and cached preparedness information; no fabricated vital anomaly |
| Offline | Orthogonal toggle, keeps current physiological scenario | Local readings/analysis/alerts continue; environmental feed becomes cached |

Every scenario selection cancels the previous transition, replaces all fixture inputs, clears active incident timers, and creates a new scenario run. Keep prior alerts as history, resolving old scenario episodes with reason “Demo scenario changed.” Do not call that a medical recovery. Selecting Normal may produce a “Demo readings returned to baseline” event.

For deterministic fatigue inputs, set accumulated active minutes to Normal 30, Heat 90, Pollution 30 and Fatigue 180. Set `outdoor` true for Heat and Pollution, false for Normal and Fatigue. Flood/Cyclone use Normal physiological inputs. The normal exposure fixture is 10 minutes; Heat uses the stated 45 minutes. Unspecified physiological fields inherit Normal explicitly when the scenario definition is constructed, not whichever scenario previously ran.

For a readable demonstration, transition values over approximately six seconds and then use small seeded variation. Provide Pause to inspect explanations. When paused, show an explicit paused badge rather than quietly freezing “live” numbers.

Offline does not disconnect the belt simulator. Device disconnect does not imply internet loss. Treat those as separate states.

### Prototype risk engine

Implement transparent rules for demonstration only. Never use an LLM API or claim that a trained medical model is running.

Keep rule configuration in one file. A category score starts at 18 and adds contributions based on the **input values**, then clamps to 0–100. The engine must not receive `scenarioId`; scenario buttons only change inputs. Use the following demo factor definitions to make expected behavior testable:

| Category | Demo input condition | Contribution |
|---|---|---:|
| Heat | Ambient ≥38°C | +15 |
| Heat | Humidity ≥75% | +10 |
| Heat | HR ≥35% above personal resting baseline | +10 |
| Heat | Body temperature ≥ baseline +0.8°C | +10 |
| Heat | Activity high | +5 |
| Heat | Exposure ≥30 minutes | +10 |
| Heat | Exposure ≥90 minutes, in addition to the previous exposure contribution | +15 |
| Respiratory | AQI ≥150 | +20 |
| Respiratory | SpO₂ ≥3 percentage points below baseline | +25 |
| Respiratory | Outdoor activity present | +5 |
| Fatigue | Sleep at least 120 minutes below typical baseline | +20 |
| Fatigue | Accumulated active minutes ≥120 | +10 |
| Fatigue | HR ≥25% above baseline | +10 |
| Cardiovascular pattern | Low/resting activity AND HR ≥35% above baseline | +35 |
| Cardiovascular pattern | Same unexplained HR deviation persists across three valid samples | +15 |

These values are deliberately arbitrary demonstration weights. Add a comment at the rule file and an explanation in the analysis detail stating that they are not medical thresholds and must not be reused for real monitoring.

Settled demo scores: Normal **18**, Heat **78**, Pollution **68**, Fatigue **58**. Overall numeric score is the maximum available physiological category score, not the sum. This avoids inventing clinical significance by adding unrelated domains.

Use the requested bands exactly: **0–30 Low; 31–60 Moderate; 61–80 High; 81–100 Critical**. Define them once. Display the exact label **“Prototype AI Risk Score”** with nearby **“Rule-based demonstration”** text. Include one engine test fixture using the Heat inputs but 90 minutes of exposure, which produces **93 / Critical**; it need not become another prominent scenario button.

Fall and disaster urgency are separate from the physiological score. A flood bulletin must not turn normal HR into “Critical health.” During a possible fall, make the overall headline “Possible fall — check-in needed” and keep the physiological score in secondary context. Do not arbitrarily force it to 100.

Evaluate the five requested analysis categories: cardiovascular pattern, respiratory, heat stress, fatigue and fall/motion. Fall is event-based. Each result exposes the input values, baseline comparison, matched factors and missing data.

For matched heat factors at the specified fixture, the displayed contributions total 60 plus the starting 18. The UI explanation and numeric result must come from the same result object.

Support the requested confidence field honestly: the current rule engine returns `confidence: null`; render **“Confidence: not estimated by this demo engine.”** Do not fabricate the attachment's illustrative 82% as a model output. Future model confidence requires actual calibration and validation.

Require all inputs needed for a category to be present and fresh; otherwise mark that category “Insufficient data.” Do not replace missing inputs with zero or show “Low” as proof of safety. If some categories remain available, label the overall assessment “Partial assessment.”

### Alerts

- Create a physiological alert after two consecutive qualifying samples. Use three samples below the alert threshold to resolve it and avoid flicker.
- Deduplicate by risk category and active episode. Update `lastSeenAt` instead of creating an alert every two seconds.
- Acknowledgement does not change underlying risk. Acknowledged active alerts remain identifiable until resolved.
- A severity escalation updates the episode and its timeline; it does not produce a flood of duplicates.
- Each alert stores its input snapshot so opening yesterday's alert does not show today's readings.
- Disaster bulletins and possible-fall events have their own event logic and deduplication IDs.
- Acknowledge works offline. Alerts include what happened, why, and a short recommended action.

### Advice and environmental claims

Use a compact, curated guidance catalog rather than generating medical prose. Heat guidance can say “Take a break and move to a cooler place.” General cooling and break guidance is supported by [CDC heat guidance](https://www.cdc.gov/heat-health/about/index.html). Keep instructions brief and avoid medication advice or personalized fluid prescriptions.

Pollution guidance can preserve the supplied wording about reducing strenuous outdoor activity and considering moving indoors. Flood/cyclone guidance should direct the user to local official instructions and previously saved emergency details; do not invent a safe route, nearby shelter, official alert source or live hazard map.

AQI uses the numerical index supplied by the fixture. Do not copy a US severity label onto an Indian AQI value. For this deadline, show the number, source “Demo environmental feed,” and its contribution to the prototype result; standardized AQI classification can be added after selecting and verifying a specific index system.

Show this short disclaimer in onboarding, analysis details and Emergency, not as a huge banner covering every screen:

> This prototype provides wellness and early-risk awareness and is not a medical diagnostic device. Seek professional medical advice when necessary.

## 7. Belt, fall and emergency behavior

### Device presentation

Create a clean locally rendered SVG belt illustration or a simple vector product schematic informed by the PDF. The illustration should look like a waist-worn belt, not a wristwatch. A restrained component diagram is enough; skip 3D animation.

The primary connected device is **“Integrated Health Belt — Demo Sensor.”** The device page may explain future compatibility with watches, bands and specialized wearables, but the belt is the main device.

Show these component rows with readable labels:

- Motion / MPU6050 — simulated telemetry.
- Heart rate, SpO₂ and body temperature — simulated channels, actual sensor choice pending.
- ESP32 controller — simulated status.
- Buzzer, GPS and battery — simulated status or explicitly unavailable.
- Relay, solenoid valve, CO₂ cartridge and airbag — simulated protection telemetry.

Use a realistic seeded battery value such as 84% without making it drain implausibly over a five-minute demo. Connect Device opens a dialog with **Connect demo belt** and an informational Future hardware integrations area. After a brief bounded pairing state, mark the demo connected. Disconnect stops readings and changes every dependent status coherently.

### Two independent fall flows

**A. Simulated protection telemetry**

Represent a recorded conceptual sequence: motion event received → prototype fall event → simulated protection event → airbag status “Deployed — simulation.” Log a clear ordered timeline with illustrative timing, not measured deployment latency. Relay/valve/cartridge transitions are display-only events. End with “Inspection/reset required — demo state.” Only an explicit simulation reset restores its ready illustration.

Do not add a control that could actuate real hardware. Do not make heat, pollution or a generic high risk score deploy the simulated airbag. Do not claim that post-impact detection proves pre-impact protection.

**B. Human response and assistance**

1. Possible Fall opens an accessible check-in: **“Are you okay?”**
2. Show **I'm OK** and **Need Help** with a clearly labeled 20-second **demo escalation** timer.
3. I'm OK cancels the timer and records user acknowledgement. It does not erase the belt protection event.
4. Need Help opens the SOS confirmation immediately.
5. No response prepares one local demo SOS payload if a demo contact is configured; otherwise show “Emergency contact missing” and retain the incident.
6. No real message is sent. A timer must not start multiple times when switching pages or re-rendering.

Store one deadline and incident ID. Cancel/acknowledge/reset clear it. In a hidden or suspended tab, do not pretend the browser is providing a reliable emergency watchdog.

### Manual SOS

Emergency → large SOS action → **“Emergency Assistance — Do you need help?”** → Cancel / **Send SOS (demo)**.

Confirming prepares a record containing contact, event time, risk and selected vitals, plus location only when permitted. Final status: **“SOS notification prepared — demonstration only; nothing sent.”**

Location has explicit provenance: “Demo location,” “Browser location” if separately permitted and implemented, “Last known location” with age, or “Not shared.” Default to a demo location for the presentation. Never present demo coordinates as the user's current GPS location. Avoid an online map dependency; a local location summary works offline.

Provide a payload detail view. A repeated click must not create duplicate records for the same incident. Cancel must have no sending/preparation side effect. With no valid contact, offer Edit contact and prevent a misleading success state.

Emergency sharing choices actually determine the prepared payload fields. A UI toggle that changes its appearance but still includes excluded fields fails acceptance.

## 8. Offline, permissions and privacy

### Three separate concepts

| State | Meaning | UI consequence |
|---|---|---|
| Demo offline toggle | Presenter deliberately simulates losing connectivity | Environmental provider uses cached state; local analysis continues |
| Browser connectivity hint | Browser reports apparent online/offline state | Informational connection badge; no disabling of local monitoring |
| Cached app readiness | Production app shell/assets are available locally | “Ready for offline reload” only after service-worker readiness |

`navigator.onLine` is a hint and cannot prove internet reachability. Do not call a third-party server repeatedly just to paint a green badge. [MDN connectivity guidance](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine)

Service workers require a secure context; localhost is allowed for development. Run and test the built application over localhost or HTTPS, not by double-clicking `index.html`. [MDN service-worker requirements](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

### Real offline acceptance procedure

1. Build the production app and run its local preview server.
2. Open it while connected. Wait for cache readiness, then reload once under service-worker control.
3. Visit every route; all lazy chunks and local assets must be included in the precache, not merely the currently visited page.
4. Turn on the browser's network-offline mode and perform a normal reload.
5. Navigate among Overview, Devices, AI Analysis, Environment and Emergency.
6. Trigger Heat Wave and confirm sensor changes, local analysis and one alert.
7. Acknowledge it, prepare a demo SOS, reload and confirm persisted state.
8. Restore connectivity and verify no queued real emergency action is sent.

The UI toggle is a useful demonstration control; it does not substitute for this production-build network-offline test.

Environmental data always has `observedAt`, `validUntil` and source. Offline, retain the last cached snapshot without advancing its update timestamp. Expired bulletins say **“Outdated — current conditions unavailable.”** Never continue labeling an old flood status “Live” or “All clear.”

A scenario triggered while offline can inject **synthetic demo context** so judges can still explore the UI. Label it “Simulated locally”; do not claim a new real disaster bulletin arrived without a network. Distinguish this from the unchanged cached external-context record.

Local monitoring works while the loaded application is active. Browser/OS suspension and background monitoring are future native/firmware concerns.

### Privacy controls

- Health processing: **On this laptop — local demo engine**.
- Cloud health upload: **Disabled; not implemented in this prototype**. Do not create a fake enabled cloud state.
- Location sharing: user-controlled and enforced in SOS payloads.
- Emergency sharing: user-controlled field selection and explicit preparation confirmation.
- Data deletion: confirmed, functional, with timer shutdown and return to onboarding.
- No health analytics, tracking pixels, remote fonts or external calls needed for the demo.
- Clarify that ordinary application asset requests may occur when initially loading or updating; “local health processing” does not mean absolutely no network traffic ever occurs.

Onboarding includes location and notification choices with **Not now**. Do not label a saved preference as an OS/browser permission grant. Prefer simulated location and in-app notifications for the demo. If actual permission prompts are implemented, request them only from explicit user actions and handle denied/unsupported states without blocking onboarding.

## 9. Complete requirement coverage matrix

R numbers correspond to the numbered sections in the supplied requirements text. A row is complete only when its acceptance behavior exists; a screenshot alone is insufficient for interactive requirements.

| Source | Required delivery | Main phases |
|---|---|---|
| R1 | Health/environment inputs, personal baseline, local risk, emergency and hardware story | 2–7 |
| R2 | Contextual explanations rather than generic fitness tracking | 2–4 |
| R3 | Readable interface for older/vulnerable users | 1, 8 |
| R4 | All 11 main sections reachable; desktop sidebar replaces mobile bottom nav | 1, 3–6 |
| R5 | Four onboarding stages and required profile/permission choices | 6 |
| R6 | Greeting, overall state, seven metrics and small trend indicators | 1–3 |
| R7 | Correct 0–100 bands and Prototype AI Risk Score disclosure | 2–3 |
| R8 | Five analysis stages, input/context explanation, replaceable engine | 2–3 |
| R9 | HR/SpO₂/activity/sleep baseline and current comparison | 2–3 |
| R10 | Cardiovascular, respiratory, heat, fatigue and fall categories | 2–5 |
| R11 | Environmental Safety with four hazard summaries and advice | 4 |
| R12 | Pollution scenario visibly links AQI and personal SpO₂ change | 2–4 |
| R13 | Heat scenario changes values and produces explained high risk | 2–4 |
| R14 | Flood and cyclone modes with appropriate disaster information | 4 |
| R15 | Offline switch plus actual offline reload and local operation | 2, 7 |
| R16 | Privacy Center and functional sharing choices | 6–7 |
| R17 | SOS confirmation, required payload information, simulated preparation | 5–6 |
| R18 | Demo belt, sensor rows, Connect Device flow and adapter boundary | 2, 5 |
| R19 | Six metric charts with Today / 7 Days / 30 Days and truthful insights | 3 |
| R20 | Dynamic Alerts page; reason, action, timestamps and acknowledgement | 4 |
| R21 | Professional accessible design; light theme complete | 1, 8 |
| R22 | Named managers, modular domain and replaceable inference | 0, 2 |
| R23 | Profile, baseline, readings, alerts, risk history and settings persisted locally | 2, 6–7 |
| R24 | Changing realistic demo inputs, including motion then inactivity | 2, 5 |
| R25 | Six named demo actions plus required flood/cyclone additions | 2, 4–5, 7 |
| R26 | Non-diagnostic wording and appropriate disclaimer | 3, 5–6, 8 |
| R27 | Future Qualcomm deployment note; no current integration claim | 5, 9 |
| R28 | Functional screens, coherent scenarios, local analysis, no dead controls | 7–9 |
| PDF pp2–3 | Belt identity, MPU6050/ESP32, buzzer/GPS/battery and protection components | 1, 5 |
| PDF pp2–4 | Simulated fall-to-protection telemetry and caregiver preparation | 5 |
| User correction | Laptop-first layout verified at 1366×768 and 1920×1080 | 1, 8–9 |

## 10. Copy-ready phased prompts for Antigravity

Paste one prompt at a time. Each phase can consume the whole guide for context but may implement only its own scope and dependencies needed to finish that phase. You do not need to paste the full guide into every chat turn if it is available in the workspace.

### Prompt 0 — Establish the contract and runnable foundation

```text
Read SIH26181_Antigravity_Build_Guide.md and both source attachments in this workspace completely. The latest user instruction is binding: this is a DESKTOP-FIRST application demonstrated on a LAPTOP, not a mobile-first application. We have 15 hours for a polished frontend prototype and will build it in separate phases.

Implement Phase 0 only. Inspect the current project before changing it. If empty, initialize React + TypeScript + Vite with a compatible Node version and a lockfile. If there is already a suitable working application, preserve it and adapt it. Make the app run with a minimal shell.

Create docs/BUILD_STATUS.md, docs/REQUIREMENTS_TRACEABILITY.md and docs/DECISIONS.md. Capture the supplied requirement IDs, the PDF's belt/airbag features, desktop navigation, stack, module boundaries, actual-versus-simulated behavior, and the 15-hour phase sequence. Record exact dependency versions. Keep the source files intact.

Do not build all screens now. Do not add a backend, real hardware communication, real emergency sending, login, LLM APIs or model training. The final frontend must have coherent local behavior; its risk engine is an openly labeled demonstration.

Run the scaffold build. Report the exact run command, files created, the next phase, and any concrete blocker. Stop after Phase 0; do not continue into Phase 1.
```

**Gate:** the app opens; the traceability document includes the belt and desktop correction.

### Prompt 1 — Make the desktop interface worth presenting

```text
Implement Phase 1 of SIH26181_Antigravity_Build_Guide.md. Read BUILD_STATUS.md first. Build the desktop design foundation and a polished Overview using centralized typed fixture data.

Follow section 4: approximately 216 px sidebar, 64 px top bar, calm off-white/white surfaces, restrained teal, readable typography, proper semantic risk colors, and a clear belt identity. Build the complete navigation map and reusable MetricCard, StatusBadge, RiskSummary, ChartPanel, AlertRow, Drawer, Dialog and form primitives. Destination scaffolds may be unfinished in this phase, but must be honestly tracked.

Overview must already look like a finished product at 1366x768: health status, risk, HR/SpO2/body temperature/activity, grouped environment metrics, readable chart, belt summary, recent events and accessible Demo Controls. Do not create a phone frame, giant empty cards, a generic admin dashboard, an AI chat panel or decorative ECG animation. Use local icons/assets only.

Create the Demo Controls drawer layout with all required scenarios, pause/resume and reset controls ready to bind in Phase 2. Do not fake successful behavior for unfinished actions. Use design tokens and shared components so later screens match this one.

Open and visually inspect at 1366x768 and 1920x1080. Fix overflow, weak contrast, crowded labels and wasted space. Run the build, update BUILD_STATUS and traceability, and save a local checkpoint without touching unrelated changes. Give me the screenshot locations and a short review checklist. Stop after Phase 1.
```

**Gate:** open Overview at 100% zoom. Can you understand status, risk and belt connection in five seconds? If not, fix that now.

### Prompt 2 — Build the shared local engine

```text
Implement Phase 2 only. Preserve the approved UI. Read sections 5 and 6 of SIH26181_Antigravity_Build_Guide.md in detail.

Create the typed domain records, focused managers, one shared store, replaceable SensorAdapter/RiskEngine/EnvironmentProvider/LocalRepository boundaries, versioned bounded local persistence, deterministic 30-day seed history, and the single root-owned two-second simulator. Implement normal/heat/pollution/fatigue/fall/flood/cyclone fixture inputs and an independent offline flag. Bind the Overview and Demo Controls to real shared state.

Implement the explicit demonstration factor rules from section 6. The risk engine receives readings, baseline and environment, NEVER scenarioId. Its returned factors must produce the displayed score and explanation. Expected settled scores are Normal 18, Heat 78, Pollution 68 and Fatigue 58. Category bands and colors have one definition. Return null confidence with a truthful explanation; no fabricated medical confidence. Handle unavailable data as insufficient or partial assessment.

Implement baseline provenance, current comparison, buffers, pause/resume, scenario transitions and deterministic Reset Demo. Preserve profile/privacy choices on Demo Reset. Ensure hydration occurs before simulation and that navigation/remounts do not create duplicate intervals. Model fall/disaster urgency separately from physiological scores.

Write focused domain tests for the expected scenarios, category boundaries, baseline changes, missing/stale inputs and scenario independence. Verify scenario changes update all Overview values coherently and refresh restores the intended records. Run tests and build, update the status/traceability and checkpoint. Stop after Phase 2.
```

**Gate:** Heat Wave changes inputs and risk; changing the baseline changes comparison; pause works; refresh preserves profile/state without duplicate ticking.

### Prompt 3 — Complete Health and explain the analysis

```text
Implement Phase 3 only, using the existing store and approved components. Complete Health with Live, Personal Baseline and Trends tabs, and complete AI Analysis according to sections 4–6.

Health must show live readings and quality/freshness, meaningful per-metric charts, baseline HR/SpO2/activity/sleep, current deviations, source/window/sample count and an explicit baseline recalculation action. A manually entered resting HR must be labeled and must not be silently overwritten.

Implement all six trend series: heart rate, SpO2, body temperature, activity, sleep and prototype risk. Today/7 Days/30 Days must change the data window and aggregation; do not just change a selected tab color. Use correct units, axes, accessible summaries and the same deterministic history across views. Clearly mark seeded history as illustrative. Derive insights from the displayed series.

AI Analysis must show sensor receipt, baseline comparison, environmental context, pattern analysis and risk assessment, plus all five anomaly categories. Use real current inputs and matched factors from the engine. Show “Prototype AI Risk Score,” “Rule-based demonstration,” local processing status and “Confidence: not estimated by this demo engine.” Stages must reflect actual processing state, not a fake endless loading animation.

Wire Overview metric/risk links to the right detail. Verify the heat 72-to-108 baseline comparison and the pollution 98-to-94 percentage-point drop. Check paused/disconnected/insufficient-data states. Build, update status and traceability, checkpoint and stop.
```

**Gate:** every chart selector works; an alert explanation can be traced to the displayed inputs; baseline data stays normal during a heat event.

### Prompt 4 — Make environment, disasters and alerts functional

```text
Implement Phase 4 only. Complete Environmental Safety, disaster details and the Alerts workspace using the shared domain state.

Show heat, air quality, flood and cyclone context, source timestamps and freshness. Implement heat/pollution/flood/cyclone scenario effects and curated advice from the guide. Flood/cyclone warnings remain separate from the physiological risk score. Do not invent live authority feeds, maps, medical claims or safe evacuation routes.

Build the Alerts list and detail drawer with event type/severity filters, Active/Acknowledged/Resolved states, timestamp grouping, input snapshots, reasons and recommended actions. Implement section 6's persistence and deduplication rules, two-sample triggering, three-sample resolution, escalation and acknowledgement behavior. Keep one active episode per category and do not duplicate an alert on every tick.

Make alerts link to relevant analysis and Emergency. Empty filters have a proper empty state and clear-filter action. Scenario changes cancel transitions and resolve superseded demo episodes without pretending the user medically recovered. Prepare cached/expired environmental presentation for Phase 7.

Verify heat, pollution, flood and cyclone each change the correct content. Run relevant tests and build, update status and traceability, checkpoint and stop.
```

**Gate:** sustained heat produces one active alert, acknowledgement does not erase the risk, and flood leaves normal physiological readings normal.

### Prompt 5 — Deliver the belt, fall and SOS demonstration

```text
Implement Phase 5 only. Read section 7 carefully and use PDF pages 2–4 to preserve the integrated health belt identity.

Complete Devices with a clean local SVG belt illustration, “Integrated Health Belt — Demo Sensor,” component statuses for motion/MPU6050, HR, SpO2, temperature, ESP32, buzzer, GPS, battery, relay, solenoid, CO2 cartridge and airbag. The actual HR/SpO2/temperature sensor models are unspecified; do not invent hardware confirmation. Implement Connect demo belt, bounded pairing feedback, disconnect and reconnect. Keep hardware integration descriptions clearly future-facing.

Implement Possible Fall as two independent flows: a display-only simulated protection telemetry timeline, and the human “Are you okay?” check-in. Include I'm OK, Need Help and the 20-second labeled demo escalation countdown. I'm OK stops escalation but preserves the protection record. No response prepares one local SOS or shows the missing-contact state. Never wire any actual actuator or real message service. Heat/pollution must not trigger airbag deployment.

Complete Emergency with SOS confirmation, Cancel, Send SOS (demo), contact validation, location provenance, consent-filtered payload preview, prepared record and explicit nothing-sent status. Use incident IDs to prevent duplicate preparation. All navigation, cancellation, reset and resume paths must handle timers correctly. Add the future inference/hardware architecture note from the guide.

Verify fall->I'm OK, fall->Need Help->Cancel, fall->timeout, manual SOS, missing contact, location disabled, repeated confirmation and device disconnect. Run build, update status/traceability, checkpoint and stop.
```

**Gate:** the fall event visibly changes the belt timeline; cancellation works; SOS ends in “prepared” without any real sending.

### Prompt 6 — Finish onboarding, profile and privacy

```text
Implement Phase 6 only. Complete the four-step onboarding, Profile & Settings and Privacy Center described in the guide.

Onboarding must explain the companion, local processing and emergency awareness, then collect name/age/optional gender/resting HR/emergency contact with clear validation and location/notification choices. Support Not now and a clearly labeled Use demo profile action. Avoid collecting extra health data. Keep default location simulated and notifications in-app; do not fake OS permission grants.

Profile save/cancel must work and persist. Resting-HR edits must update baseline comparison coherently with user-provided provenance. Privacy must show local laptop processing, cloud upload disabled and not implemented, user-controlled location/emergency sharing, cache readiness placeholder bound for Phase 7 and a functional confirmed Clear local data flow. Enforce sharing choices in the actual SOS payload.

Finish all form disabled/error/success states, keyboard behavior and small disclaimer placement. Clear local data must stop timers and persistence, clear records and return to onboarding without silently reseeding. Demo Reset preserves the profile/consents; Reset Everything clears them after confirmation.

Verify reload persistence, invalid input, permission refusal, excluded SOS fields, returning-user onboarding bypass and complete reset. Build, update status/traceability, checkpoint and stop.
```

**Gate:** all settings persist and affect behavior; data deletion stays deleted until the user explicitly begins again.

### Prompt 7 — Prove offline operation and integrate every route

```text
Implement Phase 7 only. Follow section 8 of SIH26181_Antigravity_Build_Guide.md exactly. Finish the production PWA app-shell cache, local assets and manifest. Keep app updates user-controlled during the presentation; do not unexpectedly reload a running demo.

Separate demo-offline selection, browser connectivity hints, app-cache readiness and device connection. Keep the active scenario running when internet connectivity changes. Environmental snapshots retain timestamps and show cached/expired status truthfully. Offline scenario injection is marked locally simulated, never a newly received real bulletin. No cloud or actual emergency requests may be queued.

Build and run the production preview. Warm the cache, wait for service-worker control, use real browser network-offline mode, normal-reload and traverse all routes. Trigger heat, generate/acknowledge an alert, prepare demo SOS and reload again. Confirm data and behavior persist. The in-app offline toggle alone is not acceptable proof. Cache all app routes/chunks/icons/fonts and use no remote map or runtime font dependency.

Audit cross-screen coherence, route cleanup, timers, stale/disconnected inputs, first-load/empty/error states, navigation and every visible button. Add root error recovery and storage failure feedback if missing. Record actual observed verification results; do not invent passes if browser tools are unavailable.

Build, run targeted regression tests, update status/traceability, checkpoint and stop. From this point freeze features and dependency changes.
```

**Gate:** the built app reloads with the browser offline and still runs Heat Wave, Alerts and SOS locally.

### Prompt 8 — Finish the laptop experience

```text
Implement Phase 8 only. This is a visual/interaction finish, not a redesign or feature expansion. Preserve domain behavior and the approved design system.

Inspect every destination and the demo drawer at 1366x768 and 1920x1080. Fix clipped text, horizontal overflow, inaccessible buttons, excessive empty space, weak chart labels, inconsistent units, drawer/modal overflow, unstable number widths and unclear selected states. Check Overview first-viewport hierarchy, long alert text, a long profile name, denied permissions and disconnected belt states.

Use consistent semantic colors and text badges, readable 16px main copy, clear keyboard focus, large primary click targets and reduced-motion handling. Keep secondary implementation details inside AI/Devices details; the product's main flow should remain understandable immediately. No gratuitous animations, new libraries or theme rewrites.

Capture final screenshots of Overview Normal, Overview Heat, AI explanation, Devices/Fall, Emergency and Offline state. Fix issues visible in those captures. Run build and the core demo once, update status/traceability, checkpoint and stop.
```

**Gate:** no page requires zooming out to work on the laptop; risk and source labels are legible on a projector.

### Prompt 9 — Verify and package the demonstration

```text
Complete Phase 9 only. Audit every row of the guide's requirement coverage matrix against the application. Mark actual implemented, verified, future and blocked states separately. Fix required gaps before adding anything optional.

Run the focused tests and production build. Execute the acceptance checklist in section 12, especially actual offline reload, no duplicate alerts/timers, consent-filtered SOS, fall cancellation, missing/stale data and deterministic reset. Capture real pass/fail evidence; do not claim browser checks were performed if they were not.

Create README.md with exact installation/development/production-preview commands, recorded versions, offline warm-up steps and limitations. Create docs/DEMO_SCRIPT.md following section 13, docs/VERIFICATION.md with results and screenshot paths, and docs/FUTURE_INTEGRATION.md describing the sensor, environment, risk-engine, storage and emergency boundaries. Include current browser-demo vs future ESP32/Snapdragon responsibilities and the physical protection limitation.

Prepare a resettable Normal starting state. Rehearse the 5-minute demo twice from Reset Demo and once after a production reload. Keep a local production build ready and record a short backup walkthrough if the available tools allow it. Preserve the source and lockfile. Finish with a concise handoff: how to run, what is actually working, what is simulated, any verified limitations, and where the demo evidence lives. Do not claim production readiness, clinical validity or guaranteed SIH success.
```

**Gate:** the demonstration completes twice without repair and the traceability matrix has no silently missing required feature.

## 11. Prompts for corrections and continuity

### If the interface looks generic

```text
Preserve the current behavior. The interface is too generic. Re-read the desktop design specification and revise only the visual hierarchy, spacing, typography, chart presentation and belt identity. Keep one clear status headline, compact meaningful metrics, a readable explanation beside the chart and a purposeful device panel. Remove oversized filler cards, excessive decoration and repeated generic icon tiles. Show the revised Overview at 1366x768 before propagating it. Do not rewrite the app or change libraries.
```

### If a phase claims completion but something fails

```text
The current phase has not passed its acceptance gate. Reproduce this exact issue: [describe the clicks and observed result]. Identify the responsible state transition or component, fix the smallest relevant scope, and verify the same flow plus its immediate dependent behavior. Preserve working features and the approved visual design. Update BUILD_STATUS with the actual result. Do not start the next phase yet.
```

### If Antigravity loses context or you start a fresh chat

```text
Continue the existing SIH26181 desktop frontend; do not restart it. Read SIH26181_Antigravity_Build_Guide.md, docs/BUILD_STATUS.md, docs/DECISIONS.md and docs/REQUIREMENTS_TRACEABILITY.md. Inspect the current code and run the app. Determine the last completed acceptance gate and any unfinished work. Report that briefly, then implement only Phase [number]. The laptop-first instruction overrides the original mobile layout. Preserve the modular local simulator, existing functionality, source files and approved design.
```

### If time is running out

```text
We have [X] hours left. Preserve every required workflow and stop optional work immediately. Inspect the requirement matrix and current app, list only blocking gaps, then complete them in dependency order. Use existing components and simpler layouts; combine related details in tabs/drawers if needed. Do not remove the belt/fall story, local scenarios, actual offline test, SOS cancellation or clear simulation labels. Reserve the final 60 minutes for a production build and complete rehearsal. Record any genuinely unfinished requirement explicitly rather than disguising it.
```

## 12. Final acceptance checklist

### Product completeness

- [ ] Four-step onboarding, skip/decline paths and returning-user behavior work.
- [ ] All required destinations are reachable, with correct active sidebar state.
- [ ] Seven Overview metrics update from the same readings used by analysis.
- [ ] Five anomaly categories exist, with current inputs and explanations.
- [ ] All six trend metrics and three time windows work with units and truthful history labels.
- [ ] Baseline source and calculation are visible; scenario readings do not corrupt it.
- [ ] Heat, pollution, fatigue, fall, flood, cyclone, normal and offline interactions work.
- [ ] Devices includes the belt and every presentation component, with simulation labels.
- [ ] Privacy and profile actions persist and affect behavior.

### Behavioral verification

- [ ] Settled scores: Normal 18, Heat 78, Pollution 68, Fatigue 58.
- [ ] Bands handle boundaries 30/31, 60/61 and 80/81 correctly.
- [ ] Identical input records produce identical risk results regardless of how selected.
- [ ] Changing personal baseline changes factor results where applicable.
- [ ] Missing/stale readings produce insufficient/partial assessment, not reassurance.
- [ ] One sustained risk creates one active alert episode; acknowledgement leaves risk intact.
- [ ] Historical alert details keep their original input snapshot.
- [ ] Offline internet and disconnected sensor states are independent.
- [ ] Scenario switching mid-transition cancels old work cleanly.
- [ ] Multiple route changes do not accelerate simulation or duplicate timers.
- [ ] Fall: I'm OK, Need Help, Cancel and timeout behave as specified.
- [ ] No heat or pollution input deploys the simulated airbag.
- [ ] SOS never contacts anyone; disabled sharing fields are absent from its payload.
- [ ] Missing contact and repeated confirmation do not produce false success/duplicates.
- [ ] Reset Demo cancels pending events and gives a repeatable starting state.
- [ ] Clear local data stops writes and returns to onboarding without silent restoration.

### Offline and presentation verification

- [ ] Production build passes; no console errors in the main journey.
- [ ] Cached production app reloads and traverses every route under actual browser offline mode.
- [ ] Local analysis, alert acknowledgement and SOS preparation work offline after reload.
- [ ] Cached/expired environment and synthetic offline context are distinguished.
- [ ] No health payload leaves through fetch, analytics, remote fonts or emergency APIs.
- [ ] Overview and dialogs work at 1366×768 and 1920×1080 at 100% zoom.
- [ ] Keyboard focus, long text, chart labels and severity colors remain readable.
- [ ] The UI never claims a real model, actual belt connection, real deployment, sent SOS or clinical accuracy.
- [ ] Two full rehearsals pass from a reset state.

Record failures honestly. Automated coverage is useful for state transitions and offline journeys; avoid spending the deadline writing tests that merely assert decorative class names.

## 13. The judge demonstration: approximately five minutes

| Time | Action | What to say |
|---|---|---|
| 0:00–0:35 | Open Overview in Normal; point to belt and baseline | “This is the desktop companion prototype for our integrated health belt. Today the sensor feed is simulated, and the local demonstration engine reacts to those inputs.” |
| 0:35–1:30 | Trigger Heat Wave; open AI Analysis | “The warning combines the user's deviation from baseline with temperature, humidity and activity. These factors explain this prototype score.” |
| 1:30–2:05 | Trigger Pollution; inspect respiratory explanation | “The same interface interprets a different combination: environmental exposure and a change from personal SpO₂ baseline.” |
| 2:05–2:45 | Demonstrate offline mode, ideally already rehearsed actual browser offline reload | “The cached app and local analysis continue without internet. External environmental information is explicitly marked cached or outdated.” |
| 2:45–3:50 | Trigger Possible Fall; show belt timeline; choose Need Help and confirm demo SOS | “This timeline illustrates the proposed hardware protection event. The application separately asks for a response and prepares a consent-controlled caregiver message. No physical actuation or real sending occurs in this frontend.” |
| 3:50–4:25 | Open Privacy and show prepared SOS fields | “The prototype processes demo health data on this laptop. Location sharing is optional and changes the prepared payload.” |
| 4:25–5:00 | Briefly show Trends and future integration note | “These modules give us a working interaction model now. Hardware adapters and a validated inference engine can replace the demo implementations through defined interfaces.” |

Keep Flood, Cyclone, Fatigue, acknowledgement and sensor disconnect ready for judge questions. Do not force every feature into the main five-minute narrative.

### Before presenting

1. Use the final production preview on localhost or a tested HTTPS deployment; keep the local build available.
2. Open the app and confirm cache readiness. Verify the actual laptop/browser combination, not just another machine.
3. Set the fictional demo profile, valid demo contact and clear sharing choices. Reset to Normal.
4. Use 100% browser zoom and ensure the laptop's scaling leaves the app readable on the projector.
5. Keep Demo Controls one click away. Close unnecessary tabs and notifications on the presentation machine.
6. Keep a short recording and screenshots as backup. These support recovery; they do not replace the working demo.

### Questions you should answer plainly

| Question | Honest answer |
|---|---|
| “Is this real AI?” | “The current frontend uses transparent local demonstration rules. The inference boundary is ready for a trained model, but we are not claiming clinical model performance.” |
| “Is the belt connected?” | “This demonstration uses a simulated belt feed. The device interface and sensor adapter are prepared for integration.” |
| “Does it work offline?” | “The cached app, local simulation, analysis and in-app alerts work offline while active. Fresh external bulletins and real remote delivery would require appropriate connectivity.” |
| “Does the airbag actually protect someone?” | “The UI shows simulated protection telemetry. Physical triggering, latency and protection effectiveness require separate hardware validation.” |
| “Why personalization?” | “We compare current readings against this user's stored baseline and expose that comparison, alongside activity and environmental context.” |
| “What did you actually finish?” | “The complete interactive companion interface, coordinated local behavior, scenarios, explanations, history, privacy controls, emergency preparation and verified offline frontend workflow.” |

## 14. Future development without rebuilding the UI

| Boundary | Next implementation | UI contract to preserve |
|---|---|---|
| SensorAdapter | Supported BLE, USB/serial bridge or wearable SDK | Timestamped readings, units, quality, connection state |
| RiskEngine | Evaluated model on a supported device/runtime | Category results, provenance, missing-data handling and explanations |
| EnvironmentProvider | Verified weather/AQI/disaster feeds | Source, location scope, timestamp and expiry |
| LocalRepository | More robust local database and appropriate protection | Versioned records, deletion and migration |
| EmergencyManager | Consented delivery service with real receipts | Prepared / sending / sent / failed states, idempotency |
| Belt telemetry | Actual controller events and hardware status | Separate motion, protection and human-assistance timelines |

The PDF places processing on ESP32; the current implementation runs in the laptop browser. Future division of work between the belt controller, a companion device and a supported Snapdragon platform must be designed and measured. TensorFlow Lite, ONNX Runtime and Qualcomm-related runtimes are future candidates from the supplied requirements, not installed integrations or interchangeable guarantees.

Do not route a real belt's safety-critical deployment decision through this browser UI. Future firmware, actuation and pre-impact protection need a separate validated design. Browser demonstration timings provide no evidence of physical response performance.

The frontend is a strong deliverable when it presents the proposed product clearly, behaves consistently under judge interaction, and makes the implementation boundary obvious. It is not the completed hardware-category project by itself.
