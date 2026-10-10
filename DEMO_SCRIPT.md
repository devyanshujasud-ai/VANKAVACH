# VANKAVACH (वनकवच) — Tadoba Hackathon Demo Video Script

> **Project Name:** VANKAVACH (वनकवच)  
> **Subtitle:** AI-Powered Multi-Domain Forest Surveillance & Cyber-Wildlife Trade Intelligence System  
> **Target Audience:** Tadoba Hackathon Jury, Forest Department Officials, Wildlife Conservation Experts  
> **Recommended Video Length:** 2.5 to 3 minutes (or 90 seconds expedited)  
> **Screen Recording Tools:** OBS Studio, Loom, or Windows Game Bar (`Win + Alt + R`)

---

## 🎯 Executive Pitch (30-Second Elevator Hook)

> *"Poaching doesn't start in the forest and end at the fence. Today, poachers breach the core sanctuary at night, and within 36 hours, poached tiger claws (वाघ नख) and skins are solicited online across regional encrypted channels.  
> **VANKAVACH** is India's first unified forest intelligence control room that bridges real-time field surveillance with cyber-trade scanning. From Tadoba's acoustic mesh and optical camera traps to multilingual dark-social monitoring and automated spatiotemporal correlation—Vankavach closes the detection-to-enforcement loop in minutes, not months."*

---

## 🎬 3-Minute Video Walkthrough Script (Timestamped)

### Scene 1: The Tactical Overview & Real Tadoba GIS Map (0:00 – 0:35)
* **URL to show:** `http://localhost:8080/`
* **On-Screen Actions:**
  1. Start on the main **Forest Monitoring** dashboard.
  2. Show the real **Tadoba-Andhari Tiger Reserve (TATR)** map with satellite/terrain toggle.
  3. Point out the core zone boundary, buffer zone, safari gates (Moharli, Kolara), water bodies, and the 12 acoustic mesh nodes.
  4. Click on **Simulate Acoustic Anomaly** (or S-04 / S-07) to trigger the simulated event.
* **Presenter Voiceover:**
  > *"Welcome to **VANKAVACH**—the intelligent digital shield for Tadoba-Andhari Tiger Reserve.  
  > In forest conservation, seconds save species. Our command center operates on real geospatial telemetry mapped to Tadoba's exact sanctuary boundaries, buffer zones, water bodies, and peripheral villages.  
  > Here on the tactical GIS console, our 12 IoT acoustic mesh nodes continuously listen for disturbance frequencies. When a suspected chainsaw or firearm signature is detected near Kolsa ridge at node S-04, the system instantly triangulates the incident coordinates and alerts duty analysts without manual radio delays."*

---

### Scene 2: Demo Orchestrator Control Center (0:35 – 1:10)
* **URL to show:** `http://localhost:8080/demo-lab/orchestrator`
* **On-Screen Actions:**
  1. Click **Demo Orchestrator** in the sidebar `LAB` group.
  2. Show the circular **360° radar display**, the rotating sweep line, and plotted sensors.
  3. Click **"FAST DEMO (16s)"** or **"START FULL DEMO"**.
  4. Watch the 8 automated workflow steps advance in real-time, showing the live streaming event log update with timestamps and severity badges.
* **Presenter Voiceover:**
  > *"To demonstrate how our intelligence pipeline operates under live conditions, let's enter the **Demo Orchestrator Control Center**.  
  > This cinematic radar console models Tadoba's 360-degree sensor footprint. With one click on our automated orchestrator, the system executes an 8-stage tactical workflow:  
  > It calibrates the optical grid, locks onto an unauthorized intruder in Camera 03, evaluates sanctuary protection rules, triggers our regional cyber crawler, cross-matches the district and timestamp, synthesizes a linked criminal case, and enqueues it for senior forest officer review."*

---

### Scene 3: Camera Detection Dashboard with Optical AI (1:10 – 1:50)
* **URL to show:** `http://localhost:8080/demo-lab/camera`
* **On-Screen Actions:**
  1. Switch to **Camera Detection Dashboard**.
  2. Show **Camera 03 (Core Zone)** with the real night-vision camera trap feed of the human poacher intruder. Point to the glowing bounding box, 94.8% confidence, and the rule evaluation: `RULE-CR-01 [Person + Core Zone = CRITICAL ALERT]`.
  3. Click **"Animal Clip"** — show the real Bengal tiger in Tadoba camera trap. Show how the rule changes dynamically to `RULE-HW-02` or `RULE-ECO-09`.
  4. Click **"Vehicle Clip"** — show the real unauthorized 4x4 jeep and rule `RULE-VH-04`.
  5. Click **"LED STROBE"** or **"BIO-ACOUSTIC"** deterrent buttons to demonstrate non-lethal deterrent controls.
* **Presenter Voiceover:**
  > *"Next, let's inspect the field edge at the **Camera Detection Dashboard**.  
  > Using localized YOLO vision models adapted for nocturnal wildlife traps, Vankavach analyzes high-definition thermal and infrared feeds.  
  > Notice what happens: when a human trespasser with a utility pack is detected in the strict **Core Zone**, the engine immediately triggers **Rule CR-01**, escalating to a Priority-1 tactical dispatch.  
  > But if we switch to an animal clip, the system recognizes Bengal tiger T-44 'Maya' with 98.2% confidence. In the deep forest, it logs an ecological census entry. If that tiger approaches the Moharli village boundary, it switches to a human-wildlife conflict alert, alerting local village forest committees.  
  > Rangers can also remotely trigger directional strobe deterrents or ultrasonic bio-acoustic frequencies right from the console."*

---

### Scene 4: Cyber Wildlife-Trade Scanner (1:50 – 2:25)
* **URL to show:** `http://localhost:8080/demo-lab/cyber-scanner`
* **On-Screen Actions:**
  1. Navigate to **Cyber Wildlife-Trade Scanner**.
  2. Point out the top metric strip: 1,428 listings scanned, high-risk leads, pending review.
  3. Click on **LIST-901** (`दुर्लभ अस्सल वाघ नख (Tiger Claw) लॉकेट - चंद्रपूर थेट भेट`).
  4. Show the **92% Risk Assessment Score gauge**, matched Marathi keywords (`वाघ नख`, `चंद्रपूर`), suspected species (`Panthera tigris`), and geolocation metadata.
  5. Demonstrate the search filter (type "claw" or "नागपूर") and language filter (Marathi, Hindi, English).
  6. Click **"LINK TO FIELD INCIDENT (CREATE CASE)"**.
* **Presenter Voiceover:**
  > *"Physical forest protection is only half the battle. Illegal wildlife syndicates recruit and trade online.  
  > This is our **Cyber Wildlife-Trade Scanner**. Our crawler monitors regional marketplaces, encrypted Telegram channels, and classifieds across Vidarbha.  
  > It uses localized multilingual NLP trained on Marathi, Hindi, and English trade ciphers.  
  > Here, it flagged listing **LIST-901**, posted in Marathi offering 'अस्सल वाघ नख'—authentic tiger claws—with in-person handover right in Chandrapur.  
  > The AI assigns a 92% risk rating, extracts metadata, and allows the analyst to immediately link this online lead to our active field disturbance."*

---

### Scene 5: Linked Case Investigation Dashboard (2:25 – 2:55)
* **URL to show:** `http://localhost:8080/demo-lab/linked-cases`
* **On-Screen Actions:**
  1. Switch to **Linked Case Investigation Dashboard**.
  2. Show the **Interactive Relationship Graph**: Point to the glowing SVG cables connecting `CAMERA EVENT` ➔ `ACOUSTIC DISTURBANCE` ➔ `FIELD CLUSTER` ➔ `ONLINE CYBER LEAD` ➔ `LINKED CASE` ➔ `HUMAN REVIEW`.
  3. Show the **88.4% Correlation Score**, the Chandrapur district match badge, and the dual-track chronological timeline.
  4. Click **"VIEW EVIDENCE DOSSIER"** to open the side-by-side evidence comparison modal with digital chain of custody.
* **Presenter Voiceover:**
  > *"This brings us to the centerpiece of Vankavach: the **Linked Case Investigation Dashboard**.  
  > Instead of siloed reports, our deterministic spatiotemporal correlation engine connects the dots.  
  > On this interactive graph, you see the complete criminal relationship: the acoustic disruption at Node S-04 connected to the Camera 03 intruder, correlated with the Chandrapur tiger claw listing posted just 26 hours later.  
  > The engine verifies matching jurisdictions, temporal proximity, and species concordance, delivering an 88.4% match score.  
  > Analysts can open the **Evidence Dossier**, inspect the forensic timeline, and submit the case directly for judicial prosecution or field taskforce escalation."*

---

### Scene 6: Conclusion & Impact (2:55 – 3:15)
* **URL to show:** Return to `/` or `/overview` with all indicators green.
* **Presenter Voiceover:**
  > *"By unifying edge AI camera traps, acoustic sensor meshes, and multilingual cyber intelligence into a single intuitive command system, **VANKAVACH** transforms Tadoba's defense from reactive reporting into proactive, coordinated interception.  
  > Built with modern web technologies, zero external paid dependencies, and production-ready responsiveness, Vankavach is ready to protect Tadoba's tigers today.  
  > Thank you!"*

---

## ⚡ 90-Second Fast Pitch Option (For Short Hackathon Video Submissions)

| Time | Screen / Route | Spoken Words |
| :--- | :--- | :--- |
| **0:00 - 0:15** | `/` (Main Map) | *"Every year, tiger reserves face poachers in the forest and illegal trade online—with no bridge between them. Introducing **VANKAVACH**: India's unified forest surveillance and cyber-wildlife intelligence platform for Tadoba."* |
| **0:15 - 0:35** | `/demo-lab/orchestrator` | *"Watch our automated Demo Orchestrator: in seconds, our 360° radar mesh detects an intrusion, analyzes threat rules, scans regional cyber listings, and correlates field and digital evidence into an actionable case."* |
| **0:35 - 0:55** | `/demo-lab/camera` | *"At the edge, our optical AI analyzes real camera-trap footage—classifying Bengal tigers with 98% accuracy and flagging human poachers in the core sanctuary for immediate tactical dispatch, complete with remote deterrent controls."* |
| **0:55 - 1:15** | `/demo-lab/cyber-scanner` | *"Simultaneously, our multilingual cyber crawler scans regional channels in Marathi and Hindi, intercepting listings for poached tiger claws and snares in Chandrapur with a 92% risk rating."* |
| **1:15 - 1:30** | `/demo-lab/linked-cases` | *"Our correlation engine connects the physical intrusion to the digital sale on an interactive evidence graph. Vankavach stops wildlife trade at both ends of the supply chain. Thank you!"* |

---

## 💡 Top 5 Tips for a Winning Hackathon Demo

1. **Keep Browser at 100% Zoom or Fullscreen (`F11`)**: The dark forest control room aesthetic (`#07110E`, `#55D6A3`) looks cinematic when fullscreen.
2. **Use the Fast Demo Button**: In `/demo-lab/orchestrator`, clicking **"FAST DEMO (16s)"** lets you show automated progression while you talk without awkward waiting.
3. **Emphasize Local Relevance to Tadoba**: Mention specific Tadoba landmarks: **Moharli Gate**, **Kolsa Ridge**, **Chandrapur District**, and local languages (**Marathi / Hindi**). Judges love localized solutions!
4. **Highlight the "Two-Domain" Innovation**: The key differentiator of your project is bridging **Field IoT sensors (camera traps + acoustic nodes)** with **Cyber intelligence (trade scanner)**.
5. **Show the Evidence Dossier Modal**: In `/demo-lab/linked-cases`, clicking **"VIEW EVIDENCE DOSSIER"** proves your prototype has complete forensic depth, not just superficial UI.
