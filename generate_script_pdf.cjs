const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const publicDir = path.join(__dirname, 'public');

function getBase64Image(filePath) {
  try {
    const ext = path.extname(filePath).slice(1);
    const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
    const data = fs.readFileSync(filePath);
    return `data:${mime};base64,${data.toString('base64')}`;
  } catch (err) {
    return '';
  }
}

const logoBase64 = getBase64Image(path.join(publicDir, 'favicon.png'));

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>VANKAVACH (वनकवच) — Tadoba Hackathon Official Demo Video Script</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

    @page {
      size: A4;
      margin: 12mm 12mm 12mm 12mm;
      @bottom-right {
        content: "Page " counter(page);
        font-family: 'JetBrains Mono', monospace;
        font-size: 8pt;
        color: #64748B;
      }
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #0F172A;
      background-color: #FFFFFF;
      line-height: 1.5;
      font-size: 9.5pt;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page-break {
      page-break-before: always;
      break-before: page;
    }

    /* Header */
    .header {
      background: linear-gradient(135deg, #07110E 0%, #0D2219 100%);
      color: #FFFFFF;
      padding: 20px 24px;
      border-radius: 10px;
      border: 1px solid #263A30;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .brand-wrap {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .brand-logo {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      border: 1.5px solid #55D6A3;
    }

    .brand-title {
      font-size: 20pt;
      font-weight: 800;
      letter-spacing: -0.5px;
    }

    .brand-title span {
      color: #55D6A3;
      font-weight: 600;
      font-size: 15pt;
    }

    .brand-desc {
      font-size: 8.5pt;
      color: #A3B8AD;
      font-weight: 500;
    }

    .badge-top {
      background: rgba(85, 214, 163, 0.15);
      border: 1px solid #55D6A3;
      color: #55D6A3;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 7.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      text-align: right;
    }

    /* Pitch Card */
    .pitch-card {
      background: #F0FDF4;
      border-left: 4px solid #10B981;
      padding: 12px 16px;
      border-radius: 0 8px 8px 0;
      margin-bottom: 16px;
    }

    .pitch-card h3 {
      font-size: 10pt;
      font-weight: 800;
      color: #047857;
      text-transform: uppercase;
      margin-bottom: 4px;
      letter-spacing: 0.5px;
    }

    .pitch-card p {
      font-size: 9pt;
      color: #065F46;
      font-style: italic;
      line-height: 1.45;
    }

    /* Scene Blocks */
    .scene {
      border: 1px solid #CBD5E1;
      border-radius: 8px;
      margin-bottom: 12px;
      overflow: hidden;
      background: #FFFFFF;
      page-break-inside: avoid;
    }

    .scene-header {
      background: #0B1E16;
      color: #FFFFFF;
      padding: 7px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .scene-title {
      font-size: 9pt;
      font-weight: 700;
      color: #FFFFFF;
    }

    .scene-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 7.5pt;
      background: #55D6A3;
      color: #07110E;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 12px;
    }

    .scene-body {
      padding: 10px 14px;
    }

    .cue-box {
      font-size: 8pt;
      color: #334155;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      padding: 6px 10px;
      border-radius: 6px;
      margin-bottom: 8px;
      display: flex;
      gap: 12px;
    }

    .cue-item {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .cue-item strong {
      color: #0F172A;
      font-weight: 700;
    }

    .cue-item code {
      font-family: 'JetBrains Mono', monospace;
      background: #E2E8F0;
      padding: 1px 4px;
      border-radius: 3px;
      font-size: 7.5pt;
      color: #0F172A;
    }

    .voiceover-box {
      background: #EFF6FF;
      border-left: 3.5px solid #3B82F6;
      padding: 9px 12px;
      border-radius: 0 6px 6px 0;
      font-size: 8.5pt;
      line-height: 1.45;
      color: #1E3A8A;
    }

    .voiceover-box strong {
      color: #1D4ED8;
      text-transform: uppercase;
      font-size: 7.5pt;
      letter-spacing: 0.5px;
      display: block;
      margin-bottom: 3px;
    }

    /* Fast Pitch Table */
    table.fast-table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
      font-size: 8.5pt;
    }

    table.fast-table th {
      background: #0B1E16;
      color: #FFFFFF;
      padding: 7px 10px;
      text-align: left;
      font-size: 8pt;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    table.fast-table td {
      border: 1px solid #E2E8F0;
      padding: 8px 10px;
      vertical-align: top;
    }

    table.fast-table tr:nth-child(even) td {
      background: #F8FAFC;
    }

    .tip-card {
      background: #FFFBEB;
      border: 1px solid #FDE68A;
      border-left: 4px solid #F59E0B;
      padding: 10px 14px;
      border-radius: 0 8px 8px 0;
      margin-top: 10px;
    }

    .tip-card h4 {
      font-size: 9pt;
      font-weight: 800;
      color: #92400E;
      margin-bottom: 6px;
      text-transform: uppercase;
    }

    .tip-card ol {
      margin-left: 18px;
      font-size: 8pt;
      color: #78350F;
      line-height: 1.45;
    }

    .footer {
      margin-top: 14px;
      padding-top: 8px;
      border-top: 1px solid #E2E8F0;
      display: flex;
      justify-content: space-between;
      font-size: 7.5pt;
      color: #64748B;
      font-family: 'JetBrains Mono', monospace;
    }
  </style>
</head>
<body>

  <!-- PAGE 1 -->
  <div class="header">
    <div class="brand-wrap">
      ${logoBase64 ? `<img src="${logoBase64}" class="brand-logo" alt="Logo" />` : ''}
      <div>
        <div class="brand-title">VANKAVACH <span class="hindi">वनकवच</span></div>
        <div class="brand-desc">Tadoba Hackathon 2026 — Official Demo Video & Presentation Script</div>
      </div>
    </div>
    <div class="badge-top">
      PROTOTYPE DEMO GUIDE<br/>
      <span style="font-size:6.5pt; font-weight:normal; opacity:0.85;">2.5 TO 3 MIN / 90 SEC</span>
    </div>
  </div>

  <div class="pitch-card">
    <h3>🎯 30-Second Elevator Hook (Opening Voiceover)</h3>
    <p>
      "Poaching doesn't start in the forest and end at the fence. Today, poachers breach the sanctuary at night, and within 36 hours, poached tiger claws (वाघ नख) and skins are solicited online across regional encrypted channels. <strong>VANKAVACH</strong> is India's first unified forest intelligence control room that bridges real-time field surveillance with cyber-trade scanning. From Tadoba's acoustic mesh and optical camera traps to multilingual dark-social monitoring and automated spatiotemporal correlation—Vankavach closes the detection-to-enforcement loop in minutes, not months."
    </p>
  </div>

  <!-- SCENE 1 -->
  <div class="scene">
    <div class="scene-header">
      <div class="scene-title">Scene 1: Tactical GIS Command Map & Acoustic Triangulation</div>
      <div class="scene-badge">0:00 – 0:35 (35s)</div>
    </div>
    <div class="scene-body">
      <div class="cue-box">
        <div class="cue-item"><strong>URL:</strong> <code>http://localhost:8080/</code></div>
        <div class="cue-item"><strong>Action:</strong> Show Tadoba map, Moharli/Kolara gates, click <em>Simulate Acoustic Anomaly</em> on Node S-04.</div>
      </div>
      <div class="voiceover-box">
        <strong>Spoken Voiceover:</strong>
        "Welcome to VANKAVACH—the intelligent digital shield for Tadoba-Andhari Tiger Reserve. In wildlife protection, seconds save species. Our command center operates on real geospatial telemetry mapped to Tadoba's exact sanctuary boundaries, buffer zones, and water bodies. Here on the tactical GIS console, our 12 IoT acoustic mesh nodes continuously listen for disturbance frequencies. When a suspected chainsaw or firearm signature is detected near Kolsa ridge at node S-04, the system instantly triangulates the incident coordinates and alerts duty analysts without manual radio delays."
      </div>
    </div>
  </div>

  <!-- SCENE 2 -->
  <div class="scene">
    <div class="scene-header">
      <div class="scene-title">Scene 2: Demo Orchestrator Control Center & 360° Radar</div>
      <div class="scene-badge">0:35 – 1:10 (35s)</div>
    </div>
    <div class="scene-body">
      <div class="cue-box">
        <div class="cue-item"><strong>URL:</strong> <code>http://localhost:8080/demo-lab/orchestrator</code></div>
        <div class="cue-item"><strong>Action:</strong> Point to rotating 360° radar sweep. Click <strong>FAST DEMO (16s)</strong> to advance the 8 automated pipeline steps.</div>
      </div>
      <div class="voiceover-box">
        <strong>Spoken Voiceover:</strong>
        "To demonstrate how our intelligence pipeline operates under live conditions, let's enter the Demo Orchestrator Control Center. This cinematic radar console models Tadoba's 360-degree sensor footprint. With one click on our automated orchestrator, the system executes an 8-stage tactical workflow: It calibrates the optical grid, locks onto an unauthorized intruder in Camera 03, evaluates sanctuary protection rules, triggers our regional cyber crawler, cross-matches the district and timestamp, synthesizes a linked criminal case, and enqueues it for senior forest officer review."
      </div>
    </div>
  </div>

  <!-- SCENE 3 -->
  <div class="scene">
    <div class="scene-header">
      <div class="scene-title">Scene 3: Camera Detection Dashboard with Nocturnal Vision AI</div>
      <div class="scene-badge">1:10 – 1:50 (40s)</div>
    </div>
    <div class="scene-body">
      <div class="cue-box">
        <div class="cue-item"><strong>URL:</strong> <code>http://localhost:8080/demo-lab/camera</code></div>
        <div class="cue-item"><strong>Action:</strong> Show Camera 03 intruder (Rule CR-01). Switch to Tiger (Rule ECO-09). Show Jeep. Click LED Strobe / Bio-Acoustic deterrents.</div>
      </div>
      <div class="voiceover-box">
        <strong>Spoken Voiceover:</strong>
        "Next, let's inspect the field edge at the Camera Detection Dashboard. Using localized YOLO vision models adapted for nocturnal wildlife traps, Vankavach analyzes high-definition thermal and infrared feeds. Notice what happens: when a human trespasser with a utility pack is detected in the strict Core Zone, the engine triggers Rule CR-01, escalating to a Priority-1 tactical dispatch. But if we switch to an animal clip, the system recognizes Bengal tiger T-44 'Maya' with 98.2% confidence and logs an ecological census entry. Rangers can also remotely trigger directional strobe deterrents or ultrasonic bio-acoustic frequencies right from the console."
      </div>
    </div>
  </div>

  <div class="footer">
    <span>VANKAVACH — TADOBA HACKATHON DEMO VIDEO SCRIPT</span>
    <span>CONFIDENTIAL & PROPRIETARY — TADOBHA HACKATHON 2026</span>
  </div>

  <!-- PAGE 2 -->
  <div class="page-break"></div>

  <!-- SCENE 4 -->
  <div class="scene">
    <div class="scene-header">
      <div class="scene-title">Scene 4: Cyber Wildlife-Trade Scanner & Multilingual Marathi NLP</div>
      <div class="scene-badge">1:50 – 2:25 (35s)</div>
    </div>
    <div class="scene-body">
      <div class="cue-box">
        <div class="cue-item"><strong>URL:</strong> <code>http://localhost:8080/demo-lab/cyber-scanner</code></div>
        <div class="cue-item"><strong>Action:</strong> Click LIST-901 in Marathi. Show 92% Risk Score gauge, extracted keywords ('वाघ नख', Chandrapur). Click <em>Link to Field Incident</em>.</div>
      </div>
      <div class="voiceover-box">
        <strong>Spoken Voiceover:</strong>
        "Physical forest protection is only half the battle. Illegal wildlife syndicates recruit and trade online. This is our Cyber Wildlife-Trade Scanner. Our crawler monitors regional marketplaces, encrypted Telegram channels, and classifieds across Vidarbha. It uses localized multilingual NLP trained on Marathi, Hindi, and English trade ciphers. Here, it flagged listing LIST-901, posted in Marathi offering 'अस्सल वाघ नख'—authentic tiger claws—with in-person handover right in Chandrapur. The AI assigns a 92% risk rating, extracts metadata, and allows the analyst to immediately link this online lead to our active field disturbance."
      </div>
    </div>
  </div>

  <!-- SCENE 5 -->
  <div class="scene">
    <div class="scene-header">
      <div class="scene-title">Scene 5: Linked Case Investigation & Evidence Dossier</div>
      <div class="scene-badge">2:25 – 2:55 (30s)</div>
    </div>
    <div class="scene-body">
      <div class="cue-box">
        <div class="cue-item"><strong>URL:</strong> <code>http://localhost:8080/demo-lab/linked-cases</code></div>
        <div class="cue-item"><strong>Action:</strong> Trace glowing relationship graph cables. Show 88.4% Match Score. Click <strong>VIEW EVIDENCE DOSSIER</strong> modal.</div>
      </div>
      <div class="voiceover-box">
        <strong>Spoken Voiceover:</strong>
        "This brings us to the centerpiece of Vankavach: the Linked Case Investigation Dashboard. Instead of siloed reports, our deterministic spatiotemporal correlation engine connects the dots. On this interactive graph, you see the complete criminal relationship: the acoustic disruption at Node S-04 connected to the Camera 03 intruder, correlated with the Chandrapur tiger claw listing posted just 26 hours later. The engine verifies matching jurisdictions, temporal proximity, and species concordance, delivering an 88.4% match score. Analysts can open the Evidence Dossier, inspect the forensic timeline, and submit the case directly for judicial prosecution."
      </div>
    </div>
  </div>

  <!-- SCENE 6 -->
  <div class="scene">
    <div class="scene-header">
      <div class="scene-title">Scene 6: Conclusion & Operational Impact</div>
      <div class="scene-badge">2:55 – 3:15 (20s)</div>
    </div>
    <div class="scene-body">
      <div class="cue-box">
        <div class="cue-item"><strong>URL:</strong> <code>http://localhost:8080/</code></div>
        <div class="cue-item"><strong>Action:</strong> Return to main overview map with all status indicators showing green.</div>
      </div>
      <div class="voiceover-box">
        <strong>Spoken Voiceover:</strong>
        "By unifying edge AI camera traps, acoustic sensor meshes, and multilingual cyber intelligence into a single intuitive command system, VANKAVACH transforms Tadoba's defense from reactive reporting into proactive, coordinated interception. Built with modern web technologies, zero external paid dependencies, and production-ready responsiveness, Vankavach is ready to protect Tadoba's tigers today. Thank you!"
      </div>
    </div>
  </div>

  <h3 style="font-size:10pt; font-weight:800; color:#0B1E16; margin: 12px 0 6px 0; text-transform:uppercase;">
    ⚡ 90-Second Fast Pitch Option (For Short Video Submissions)
  </h3>

  <table class="fast-table">
    <thead>
      <tr>
        <th style="width: 14%;">Time</th>
        <th style="width: 26%;">Screen / Route</th>
        <th style="width: 60%;">Spoken Words</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>0:00 - 0:15</strong></td>
        <td><code>/</code> (Main Map)</td>
        <td>"Every year, tiger reserves face poachers in the forest and illegal trade online—with no bridge between them. Introducing <strong>VANKAVACH</strong>: India's unified forest surveillance and cyber-wildlife intelligence platform for Tadoba."</td>
      </tr>
      <tr>
        <td><strong>0:15 - 0:35</strong></td>
        <td><code>/demo-lab/orchestrator</code></td>
        <td>"Watch our automated Demo Orchestrator: in seconds, our 360° radar mesh detects an intrusion, analyzes threat rules, scans regional cyber listings, and correlates field and digital evidence into an actionable case."</td>
      </tr>
      <tr>
        <td><strong>0:35 - 0:55</strong></td>
        <td><code>/demo-lab/camera</code></td>
        <td>"At the edge, our optical AI analyzes real camera-trap footage—classifying Bengal tigers with 98% accuracy and flagging human poachers in the core sanctuary for immediate tactical dispatch, complete with remote deterrent controls."</td>
      </tr>
      <tr>
        <td><strong>0:55 - 1:15</strong></td>
        <td><code>/demo-lab/cyber-scanner</code></td>
        <td>"Simultaneously, our multilingual cyber crawler scans regional channels in Marathi and Hindi, intercepting listings for poached tiger claws and snares in Chandrapur with a 92% risk rating."</td>
      </tr>
      <tr>
        <td><strong>1:15 - 1:30</strong></td>
        <td><code>/demo-lab/linked-cases</code></td>
        <td>"Our correlation engine connects the physical intrusion to the digital sale on an interactive evidence graph. Vankavach stops wildlife trade at both ends of the supply chain. Thank you!"</td>
      </tr>
    </tbody>
  </table>

  <div class="tip-card">
    <h4>💡 Top 5 Tips for a Flawless Demo Recording</h4>
    <ol>
      <li><strong>Fullscreen Browser (<code>F11</code>)</strong>: The dark forest control room aesthetic (<code>#07110E</code>, <code>#55D6A3</code>) looks cinematic when full screen.</li>
      <li><strong>Fast Demo Button</strong>: In <code>/demo-lab/orchestrator</code>, click <strong>"FAST DEMO (16s)"</strong> so all 8 workflow stages execute automatically while you speak.</li>
      <li><strong>Mention Tadoba Landmarks</strong>: Reference <strong>Moharli Gate</strong>, <strong>Kolsa Ridge</strong>, and <strong>Chandrapur</strong>. Local relevance wins hackathons!</li>
      <li><strong>Show Deterrents & Evidence Dossier</strong>: Clicking "LED Strobe" in Camera Lab and "View Evidence Dossier" in Linked Cases demonstrates complete depth.</li>
      <li><strong>Screen Recording Shortcut</strong>: Press <strong><code>Win + Alt + R</code></strong> in Windows 10/11 to start instant HD recording with microphone.</li>
    </ol>
  </div>

  <div class="footer">
    <span>VANKAVACH — TADOBA HACKATHON DEMO VIDEO SCRIPT</span>
    <span>CONFIDENTIAL & PROPRIETARY — TADOBA HACKATHON 2026</span>
  </div>

</body>
</html>
`;

const htmlPath = path.join(__dirname, 'script_dossier.html');
fs.writeFileSync(htmlPath, htmlContent, 'utf8');

console.log('Generated script_dossier.html');
