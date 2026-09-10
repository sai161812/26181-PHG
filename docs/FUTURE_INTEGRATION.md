# SIH26181 Future Hardware & Edge AI Integration Architecture

**Product:** Personal Health Companion for the Integrated AI Health Belt  
**Scope:** Architectural boundaries, interface contracts, and hardware migration roadmap.

---

## 1. System Architecture Boundaries

The companion application is engineered around strict hexagonal separation of concerns:

```
+-------------------------------------------------------------------------------+
|                       PRESENTATION & WORKSPACE LAYER                          |
|         (Overview, Health, AI Analysis, Environment, Alerts, Devices)         |
+---------------------------------------+---------------------------------------+
                                        | (Zustand Store Actions & Selectors)
+---------------------------------------v---------------------------------------+
|                           DOMAIN MANAGER BOUNDARY                             |
|  - BaselineManager   - AlertManager    - DeviceManager    - EmergencyManager  |
+-------------------+-------------------+-------------------+-------------------+
                    |                   |                   |
        +-----------v----+      +-------v---------+  +------v----------+
        | ISensorAdapter |      | IEnvironment    |  | IRiskEngine     |
        +----------------+      | Provider        |  +-----------------+
                |               +-----------------+           |
        +-------v--------+              |             +-------v---------+
        |  Demo Adapter  |      +-------v---------+   | Rule Engine     |
        |  (ESP32 Sim)   |      | Fixture Provider|   | (Transparent)   |
        +----------------+      +-----------------+   +-----------------+
                |                       |                     |
     [ FUTURE PHYSICAL BOUNDARY: HARDWARE BENCH & ONNX NPU RUNTIME ]
                |                       |                     |
        +-------v--------+      +-------v---------+   +-------v---------+
        | BLE 5.2 GATT   |      | Live OpenMeteo/ |   | Qualcomm        |
        | Web Bluetooth  |      | CPCB AQI Client |   | Snapdragon NPU  |
        | Bridge         |      +-----------------+   | AI Hub ONNX     |
        +----------------+                            +-----------------+
```

---

## 2. Core Integration Contracts

### 1. `SensorAdapter` Boundary
- **Current State:** `DemoSensorAdapter` generates synthetic physiological streams at a 2.0-second interval with configurable scenario setpoints.
- **Production Contract:**
  ```typescript
  export interface SensorAdapter {
    subscribe(onReading: (reading: SensorReading) => void): () => void;
    isConnected(): boolean;
    connect(): Promise<boolean>;
    disconnect(): Promise<void>;
  }
  ```
- **Migration Path:**
  - Implement `WebBluetoothSensorAdapter` utilizing the Web Bluetooth API (`navigator.bluetooth`).
  - Subscribe to standard GATT characteristics:
    - Heart Rate Measurement (`0x2A37`)
    - Pulse Oximeter Continuous (`0x2A5F`)
    - Health Thermometer Temperature (`0x2A1C`)
    - Custom ESP32 Belt Telemetry Characteristic (`UUID: 26181001-...`) for MPU6050 acceleration vectors, solenoid pressure, and battery percentage.

### 2. `RiskEngine` & Qualcomm Snapdragon NPU Contract
- **Current State:** `RuleRiskEngine` evaluates five deterministic factor rules and returns composite score and explanatory factors.
- **Production Contract:**
  ```typescript
  export interface RiskEngine {
    evaluateRisk(
      reading: SensorReading,
      baseline: PersonalBaseline,
      environment: EnvironmentSnapshot
    ): RiskAssessment;
  }
  ```
- **Qualcomm Snapdragon AI Hub Integration:**
  - Quantize deep wearable fall/motion classification models to **INT8** precision via Qualcomm AI Hub.
  - Deploy models directly to the **Snapdragon Neural Processing Unit (NPU)** utilizing ONNX Runtime Web with WebNN / DirectML backends.
  - Execute inference on-device in under **10ms** per classification window with zero cloud transmission.

### 3. `EnvironmentProvider` Boundary
- **Current State:** `FixtureEnvironmentProvider` serves timestamped environmental data with simulated offline freezing and synthetic injection.
- **Production Contract:**
  - Swap fixture provider for `LiveEnvironmentProvider` connecting to Central Pollution Control Board (CPCB) India API and India Meteorological Department (IMD) disaster bulletins.
  - Retain local caching and freshness validation (`validUntil`) so network interruptions degrade gracefully to cached bulletins.

---

## 3. Physical Protection Decoupling & Safety Mandate

> [!CAUTION]
> **SAFETY CRITICAL ARCHITECTURAL CONSTRAINT:**  
> The physical airbag deployment decision must **NEVER** depend on wireless communication with the laptop or browser companion.

1. **Edge Deployment Loop:**
   - The MPU6050 acceleration thresholding, free-fall pre-impact detection algorithm, and 12V solenoid valve triggering must execute exclusively on the **ESP32 microcontroller** inside a deterministic FreeRTOS real-time task (`< 50ms` latency).
2. **Companion Role:**
   - The desktop workstation serves solely as a **post-impact monitoring and escalation companion**:
     - Logging the chronological telemetry sequence for post-incident review.
     - Initiating the human "Are you okay?" 20-second escalation countdown.
     - Preparing local emergency dispatch payloads for configured caregivers.
