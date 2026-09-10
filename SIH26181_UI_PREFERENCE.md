# SIH26181 UI Preference — Binding Visual Direction

This file controls visual design for the SIH26181 Health Companion desktop prototype. It is binding wherever it is more specific than the build guide. The product is demonstrated on a laptop at 1366×768 and projected in an SIH setting.

## Visual idea

Design a calm, credible **health safety control center** for a wearable belt. It should feel closer to a carefully designed HealthTech desktop product than a developer dashboard, futuristic command center, fitness app, banking portal, or generic AI-generated SaaS page.

The page should be understandable at a glance:

1. Is the person stable, at risk, or in an emergency?
2. What changed from their personal normal?
3. Is the health belt connected and receiving data?
4. What should happen next?

The visual identity comes from precise health data, human safety and the integrated belt. It does not come from “AI” visual clichés.

## Non-negotiable rules

- Design for a full **desktop application**, never a phone mockup inside a browser.
- Use a light interface. A dark theme is not needed.
- Avoid neon, glowing borders, luminous gradients, cyberpunk colors, holograms, grid backgrounds, glassmorphism, floating particles and “AI brain” art.
- Do not use purple/blue gradient hero sections, sharp colorful left strips on every card, rainbow charts, emoji icons, or a chatbot panel.
- Do not use large empty rounded boxes with one icon and a number. Data cards must earn their space.
- Use one coherent outlined icon family only. Prefer Lucide icons at a restrained size.
- Use risk color only to communicate a meaningful state. Green, amber, orange and red must always have a text label; color is not the sole signal.
- Keep exact labels concise. Do not add marketing slogans, made-up model claims, fake partner logos, “AI-powered” badges everywhere, or dense explanation paragraphs.
- The belt needs its own visual identity: a small, clean vector belt schematic/product panel with component status, not a stock smartwatch image.

## Foundation

### Color

Use these as CSS variables. Small adjustments for contrast are allowed; introducing extra decorative colors is not.

```css
:root {
  --canvas: #F4F6F5;
  --surface: #FFFFFF;
  --surface-muted: #EEF3F1;
  --border: #D9E3DF;
  --text: #162B2B;
  --text-secondary: #58706E;
  --text-tertiary: #7C908E;
  --teal-700: #0E6B62;
  --teal-600: #137C71;
  --teal-100: #DCEFEA;
  --risk-low: #25845C;
  --risk-low-bg: #E2F3E9;
  --risk-moderate: #A96808;
  --risk-moderate-bg: #FFF1D6;
  --risk-high: #BF6417;
  --risk-high-bg: #FFF0E3;
  --risk-critical: #B53A3A;
  --risk-critical-bg: #FCE6E6;
  --shadow: 0 1px 2px rgba(20, 44, 43, .05), 0 6px 18px rgba(20, 44, 43, .045);
}
```

Never use a full-card red background. Critical states need a red status chip, alert edge or focused alert panel with normal readable text.

### Typography

- Use Inter if bundled locally; otherwise use `ui-sans-serif, system-ui, sans-serif`.
- Body text: 15–16 px. Supporting labels: 12–13 px. Never make normal app copy smaller than 12 px.
- Page title: 26–30 px, 650–700 weight. Section title: 16–18 px, 600–650 weight.
- Key metric: 30–36 px, 650 weight, tabular numerals. Unit: 13–14 px, secondary color.
- Sentence case only. Avoid ALL CAPS labels except very small severity chips where necessary.
- Use `font-variant-numeric: tabular-nums` for values, time and charts.

### Shape, borders and spacing

- App canvas is off-white; cards are white.
- Card radius: 12 px; dialog/drawer radius: 16 px; controls: 8 px.
- Border: 1 px `--border`; shadow used sparingly and softly.
- Default card padding: 18–20 px; large panels: 24 px.
- Use a strict 4 / 8 / 12 / 16 / 24 / 32 px rhythm.
- Avoid pill-shaped cards. Pills are reserved for compact status chips, filters and toggles.

## Desktop shell

The shell is a working application, not a marketing landing page.

- Left navigation: 216 px, white or very light neutral background, a right border, compact logo/wordmark at top, destination groups below.
- Main top bar: around 64 px, page title and context on the left; Demo Controls, connectivity status and profile menu on the right.
- Main content: 24 px page padding, about 20 px between primary panels.
- Use a responsive 12-column grid. At 1366 px, give charts and explanation panels enough width to be read without wrapping labels.
- The first Overview viewport must show the current status, Prototype AI Risk Score, key vitals, belt connection and Demo Controls without scrolling.
- Keep navigation visibly selected with a muted teal background plus text/icon color; do not make every nav item a separate rounded card.

## Overview composition

Follow this hierarchy exactly.

### Row 1 — safety context

Left: `Good evening, Ravi` and a small contextual line such as `Monitoring from Integrated Health Belt — Demo Sensor`.

Right: a compact local processing/offline status and last-reading timestamp. No giant “welcome” banner.

### Row 2 — primary decision area

Use a 7/5 column balance.

**Left, wide panel: Personal Risk Status**

- Large numeric score with the exact label `Prototype AI Risk Score`.
- A thin horizontal score track or restrained circular score; do not use a massive gauge.
- Severity chip, one-line interpretation, three strongest factors, `View analysis` action.
- Example Heat state: `78 / 100  High`, followed by `Heart rate is 44% above your resting baseline. High heat and humidity are contributing.`

**Right, narrower panel: Integrated Health Belt**

- Small clean SVG waist-belt schematic, not photorealistic art.
- Connected indicator, battery, latest motion status and three compact sensor-status rows.
- One clear `Open device status` action.
- During a fall, this panel changes to the actual simulated protection event state; it does not glow red everywhere.

### Row 3 — current measurements

Use compact, unequal information cards across the available width:

- Heart rate: value, BPM, up/down indicator, baseline label.
- SpO₂: value, %, difference in percentage points from baseline.
- Body temperature: value, °C, trend.
- Activity: plain-language state and active minutes.
- Environment cluster: ambient °C, humidity and AQI in one wider card.

Each card has a small inline sparkline or a short historical visual only when it carries information. Do not repeat the same oversized icon treatment in every card.

### Row 4 — interpretation and history

Left: a clean live chart with one selected metric and baseline reference line.  
Right: recent alerts, maximum three items, each with severity, event, time and a one-line reason.

The full Alert list is reachable from a text action. Do not squeeze a table of ten alerts into the Overview.

## Other screens

### Health

Use tabs: `Live monitoring`, `Personal baseline`, `Trends`.

- Give charts a white plotting surface, quiet grid lines and a legible axis.
- Baseline view should look like a comparison, not four random cards: baseline values left, current values right, small delta between them.
- Trend time controls are a compact segmented control: `Today`, `7 days`, `30 days`.

### AI Analysis

Use one focused analysis result first, then supporting detail.

- Current assessment and active factors at the top.
- Five process steps below in a vertical list or simple horizontal sequence: sensor data → personal baseline → environment → pattern analysis → risk assessment.
- Each step is quiet and factual. Avoid animated “thinking” dots, neural-network graphics or fake confidence meters.
- Category detail uses clear factor rows: factor label, observed value, baseline/reference and contribution.

### Environment

Use four hazard tiles in a 2×2 grid: Heat, Air quality, Flood, Cyclone.

- Each tile shows the severity, data freshness and a short practical recommendation.
- Only the active/problem hazard gets visual emphasis.
- Make synthetic scenarios visibly `Simulated locally`; cached values visibly `Cached` with time.

### Alerts

Use an editorial list, not a cluttered admin table.

- Date grouping, compact severity marker, title, explanation and state.
- The selected alert opens in a right-side drawer with the snapshot, contributing factors, recommended action and acknowledgement history.
- Acknowledged alerts look subdued but remain readable.

### Devices

Use a two-column page: belt schematic/status on the left and component telemetry/timeline on the right.

- Sensor labels: Motion / MPU6050, HR, SpO₂, Body temperature, ESP32 controller, Buzzer, GPS, Battery, Relay, Solenoid, CO₂ cartridge, Airbag.
- Show simulation explicitly in the device title and each non-real telemetry state where needed.
- The protection-event timeline should be chronological, with small markers and timestamps. It should look like a safety incident record.

### Emergency

The central SOS action should be immediate and unmistakable, but restrained.

- Use a large outlined emergency action on a calm page; reserve solid red for the confirmation action only.
- Beside it, show emergency contact, location-sharing state and the current risk/event snapshot.
- The confirmation dialog must say `Send SOS (demo)` and finish with `SOS notification prepared — demonstration only; nothing sent.`

### Privacy and Profile

- Use grouped settings rows with title, one-line explanation and control/state aligned to the right.
- Privacy needs a short “local processing on this laptop” panel, no lock-shield illustration wall.
- Profile should be a well-spaced form with clear labels, useful helper text and explicit Save/Cancel actions.

## Component rules

| Component | Required appearance |
|---|---|
| Primary button | Deep teal fill, white text, 8 px radius, single clear action per panel |
| Secondary button | White/soft teal surface, teal text, visible border |
| Destructive/emergency button | Red only inside focused emergency action/confirmation |
| Status chip | Small rounded pill, icon + text, semantic background and dark readable text |
| Card | White surface, subtle border, 12 px radius; no glowing outline or decorative top stripe |
| Chart | One or two data colors maximum, clear tooltip, baseline as dashed neutral/teal line |
| Drawer | White surface, 16 px rounded left edge, strong title/close row, comfortable detail spacing |
| Empty state | Brief explanatory message and one useful action; no giant illustrative graphic |
| Loading state | Skeleton matching final content shape; no endless spinner |

## Content tone

- Human, calm and factual.
- Use `Possible heat-stress risk`, `Early warning`, `Check-in needed`, `Risk detected`, `Recommendation` and `Demo sensor`.
- Use `Prototype AI Risk Score`, `Rule-based demonstration` and `Confidence: not estimated by this demo engine` exactly where relevant.
- Never say `diagnosis`, `clinically proven`, `guaranteed protection`, `real-time AI prediction`, `medical emergency detected`, or `message sent`.
- Keep medical disclaimer compact and near analysis/emergency content, not as a full-screen warning.

## Visual acceptance gate

Before continuing after Phase 1, inspect Overview at 1366×768 and answer these questions:

- Does it look like a professional health product rather than a neon AI dashboard?
- Can a judge identify status, risk, current vitals and connected belt within five seconds?
- Are the main cards unequal in size because their information importance differs?
- Is every red/orange/green visual tied to a stated risk meaning?
- Is the belt visible as a meaningful product component rather than a generic icon?
- Could this be projected without small text becoming unreadable?
- Is there any gradient, glow, colored card strip, emoji or generic “AI” visual left? Remove it.

If the answer to any question is no, refine the Overview before building more pages.

## Instruction for the implementation agent

Read this file before implementing Phase 1 and keep it available for every later phase. Treat it as a visual contract. Do not replace the architecture, behavior, requirement coverage or local simulation defined in `SIH26181_Antigravity_Build_Guide.md`; this file only decides how those features are presented.

At the end of each phase, compare the changed screens against this brief at 1366×768 and 1920×1080. Fix visible violations before progressing. If a requested feature needs a design decision not covered here, choose the quietest, clearest option that supports health safety and laptop readability.
