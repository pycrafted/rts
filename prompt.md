Prompt for Cursor:

🚀 Project context:
I am building a professional telecom web application called RTS (Radio Telecom Simulation). It uses React + TypeScript, Vite, Tailwind CSS, and React Three Fiber for 3D visualizations. The application already supports GSM, UMTS, Optical, and Microwave planning modules. I now want to create a new simulation page to help students perform practical labs (TPs) for UMTS (3G) dimensioning and coverage.

✅ Your task:
Please generate a new React component called SimulationUMTS.tsx under src/components/simulation/umts/.
This page should simulate UMTS network behavior using React Three Fiber and include interactive 3D visuals plus a user control panel.

🎯 Goals of the simulation:

Help students understand how Load Factor affects UMTS capacity.

Let them test different configurations (user count, data rate, service type).

Display results in real-time: load factor, QoS, needed Node Bs.

Visually show the impact of distance, interference, and handovers.

🧩 Expected components:

SimulationUMTS.tsx: Main wrapper component.

NodeB3D.tsx: Renders the 3D base station.

MobileUser3D.tsx: Renders mobile users as spheres in the scene.

LoadFactorPanel.tsx: Side panel with sliders and live stats.

useUMTSSimulationStore.ts: Zustand store to manage state.

calculateLoadFactor.ts: Utility function to compute load factor.

Optional: ScenarioDropdown.tsx for loading predefined student scenarios.

🖼️ 3D Scene features (React Three Fiber):

A Node B object centered in the scene.

A coverage zone (green/yellow/red sphere or ring) that changes color based on signal quality.

Multiple user spheres scattered randomly, with color changes (green = good QoS, red = overloaded).

Orbit controls enabled for camera movement.

Optionally, simulate interference areas between Node Bs.

🎛️ User Panel Controls (right sidebar or bottom drawer):
Use React Hook Form or Leva to control parameters like:

Number of users (slider: 1–200)

Data rate per user (kbps: 64–1024)

Activity factor (slider: 0.1 to 1)

Type of service (voice, data, video)

Node B transmit power (dBm)

Interference toggle (on/off)

Show handovers toggle (on/off)

📊 Displayed results (live updates):

Computed Load Factor (with warning colors: green/orange/red)

Estimated QoS level

Number of Node Bs required

Optional chart: users vs load factor (Recharts or Chart.js)

⚙️ Tech stack to use:

@react-three/fiber + @react-three/drei for 3D

react-hook-form or leva for controls

zustand for global simulation state

mathjs for dB and signal computations

recharts for visual results

tailwind for layout and styling

📁 File structure to follow:

cpp
Copier le code
src/
└── components/
    └── simulation/
        └── umts/
            ├── SimulationUMTS.tsx
            ├── NodeB3D.tsx
            ├── MobileUser3D.tsx
            ├── LoadFactorPanel.tsx
            ├── useUMTSSimulationStore.ts
            ├── calculateLoadFactor.ts
            └── ScenarioDropdown.tsx (optional)
💡 Notes:

Keep the logic modular and reusable.

Include explanatory comments to help students understand the logic.

Simplicity is key: it's for educational purposes.

If needed, mock basic 3D assets (Node B, mobile user) with simple geometry.