# SIH26181 Evaluator Presentation & Demonstration Script

**Product:** Personal Health Companion for the Integrated AI Health Belt  
**Target Duration:** ~5 Minutes  
**Presentation Viewport:** 1366×768 (Base Laptop Display at 100% Zoom) or 1920×1080 (FHD)  
**Evaluator Stance:** Calm, honest, transparent, non-diagnostic.

---

## 1. Five-Minute Presentation Timeline

| Timebox | Screen / Destination | Presenter Action | Spoken Narrative & Focus Points |
|---|---|---|---|
| **0:00 – 0:35** | **Overview (Normal)** | Point to the belt status card, vitals strip, and risk score card (Score 18 / Low). | *"This is the desktop companion workstation for our integrated health belt. Today, the belt telemetry and environmental feeds are simulated locally, and our on-device demonstration engine evaluates them against a 30-day personalized baseline. As you can see, all parameters are nominal, giving a baseline score of 18."* |
| **0:35 – 1:30** | **Overview → AI Analysis** | Open **Demo Controls** → Click **Heat Wave** → Observe score transition → Click **View analysis** to open **AI Analysis**. | *"When the worker is exposed to an ambient 40°C heat wave, heart rate elevates by 50% and body temperature rises by 1.0°C. Notice our 5-stage explainable pipeline: we do not output black-box claims. The score settles transparently at 78 High, driven directly by heat stress factor rules."* |
| **1:30 – 2:05** | **AI Analysis → Environment** | Open **Demo Controls** → Select **Pollution Event** → Navigate to **Environment**. | *"Switching to a severe urban pollution event (AQI 185), the belt tracks an immediate 4 percentage point drop in blood oxygen saturation below the worker's 98% baseline. The system isolates respiratory risk (Score 68) while keeping core body temperature normal."* |
| **2:05 – 2:45** | **Top Bar / Offline Mode** | Switch in-app toggle to **Offline** (or DevTools Network Offline) → Hard reload with `Ctrl + R`. | *"Our workstation operates with complete offline autonomy. Built as a PWA with service worker precaching, the page reloads instantaneously without internet. External bulletins are truthfully labeled as cached, while physiological risk evaluation and alerting remain fully operational."* |
| **2:45 – 3:50** | **Devices / Fall Protection** | Open **Demo Controls** → Select **Possible Fall** → Observe airbag deployment timeline → Experience 20s check-in modal → Click **Need Help** → Confirm demo SOS. | *"When an abrupt deceleration vector is detected by the MPU6050, the belt initiates its dual-pod airbag deployment sequence (~200ms latency). Simultaneously, the laptop triggers a 20-second 'Are you okay?' escalation countdown. Selecting 'Need Help' prepares a consent-controlled emergency payload for the caregiver with zero external transmission."* |
| **3:50 – 4:25** | **Emergency → Privacy** | Navigate to **Emergency** → View Prepared JSON Payload → Navigate to **Privacy Center**. | *"Under the Emergency and Privacy Center workspaces, evaluators can audit the exact dispatch payload. Location and vitals sharing are granularly controlled by the user. What the user disables is strictly omitted from the payload."* |
| **4:25 – 5:00** | **Health (Trends) & Wrap-up** | Navigate to **Health** → Switch between **Today / 7D / 30D** → Point to Qualcomm NPU roadmap note. | *"Our longitudinal trends illustrate continuous personal baseline calibration. The architecture is modular: defined TypeScript interfaces allow the simulated sensor adapter to be swapped for physical ESP32 Bluetooth GATT, and the rule engine to be deployed to Qualcomm Snapdragon NPU edge runtimes."* |

---

## 2. Answers to Tough Evaluator & Judge Questions

### Q1: "Is this real AI or hardcoded rules?"
> **Honest Answer:** *"This prototype uses a transparent, deterministic multi-factor rule engine designed to demonstrate our 5-stage inference architecture without clinical overclaims. The domain interface `RiskEngine` is strictly decoupled, allowing a quantized machine learning model (e.g. trained on wearable IMU data) to execute via ONNX Runtime on the Qualcomm Snapdragon NPU without altering a single line of UI code."*

### Q2: "Is the belt actually connected right now?"
> **Honest Answer:** *"No, this demonstration uses our software-defined `DemoSensorAdapter` with a deterministic 2-second simulation loop. The hardware architecture and GATT telemetry channels are fully specified in the Devices schematic, but physical pairing is part of our Phase 9 hardware bench testing."*

### Q3: "Does this app work completely offline?"
> **Honest Answer:** *"Yes. The application shell and all 17 assets are precached by a production Service Worker (Workbox). You can disconnect Wi-Fi or set the browser to offline, refresh the page, and the entire workstation continues to evaluate vitals, generate alerts, and prepare emergency records locally."*

### Q4: "Does the airbag actually deploy in time?"
> **Honest Answer:** *"The hardware design uses lateral bilateral hip airbags inflated by 16g CO₂ cartridges via solenoid valves triggered by an ESP32 micro-controller within ~200ms. In production, deployment logic runs entirely on-belt at the edge — safety-critical inflation decisions are never routed through wireless browser links."*

### Q5: "Why is personal baseline comparison better than standard thresholds?"
> **Honest Answer:** *"Static thresholds fail for vulnerable demographics. A resting heart rate of 85 BPM may be normal for a sedentary user, but represents an acute +35% tachycardia spike for an athlete with a 60 BPM baseline. By computing medians over 30 days, we detect anomalies early while preventing alarm fatigue."*

---

## 3. Pre-Demo Checklist (5 Minutes Before Presentation)

1. Open Chrome at `http://localhost:4173/` (Vite production preview).
2. Confirm the top-bar indicates `Cache: Ready` and `Belt: Connected`.
3. Verify browser zoom is set to **100%** (press `Ctrl + 0`).
4. Click **Demo Controls** → Click **Reset Demo** to establish a clean Normal baseline.
5. Keep the **Demo Controls** drawer easily accessible for one-click scenario switching during the presentation.
