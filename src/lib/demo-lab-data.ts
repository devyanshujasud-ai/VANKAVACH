export type CameraId = "CAM-01" | "CAM-02" | "CAM-03";
export type DetectionZone = "Core Zone" | "Village Boundary" | "Buffer Zone" | "Deep Forest" | "No-Vehicle Zone";
export type ClipType = "person" | "animal" | "vehicle";
export type AlertLevel = "CRITICAL" | "HIGH" | "WARNING" | "OBSERVATION";

export interface CameraSource {
  id: CameraId;
  name: string;
  location: string;
  defaultZone: DetectionZone;
  status: "ONLINE" | "STANDBY" | "OFFLINE";
  fps: number;
  resolution: string;
  battery: number;
  signalStrength: number;
  irEnabled: boolean;
}

export interface DetectionClipData {
  type: ClipType;
  label: string;
  detectedClass: string;
  confidence: number;
  box: { x: number; y: number; w: number; h: number };
  telemetry: string;
  timestamp: string;
  imageSrc: string;
}

export interface CameraRule {
  id: string;
  title: string;
  clipType: ClipType;
  zone: DetectionZone;
  alertLevel: AlertLevel;
  ruleCode: string;
  condition: string;
  action: string;
}

export interface CameraEventLog {
  id: string;
  cameraId: CameraId;
  timestamp: string;
  clipType: ClipType;
  detectedClass: string;
  confidence: number;
  zone: DetectionZone;
  alertLevel: AlertLevel;
  actionTaken: string;
}

export const CAMERAS: CameraSource[] = [
  {
    id: "CAM-01",
    name: "Camera 01 — Forest Perimeter",
    location: "Buffer Sector 04 · Western Ridge",
    defaultZone: "Buffer Zone",
    status: "ONLINE",
    fps: 30,
    resolution: "1080p 60fps",
    battery: 94,
    signalStrength: -68,
    irEnabled: true,
  },
  {
    id: "CAM-02",
    name: "Camera 02 — Village Boundary",
    location: "Moharli Gate Boundary Corridor",
    defaultZone: "Village Boundary",
    status: "ONLINE",
    fps: 25,
    resolution: "1080p 30fps",
    battery: 82,
    signalStrength: -74,
    irEnabled: false,
  },
  {
    id: "CAM-03",
    name: "Camera 03 — Core Zone",
    location: "Kolsa Deep Ridge · Strict Sanctuary",
    defaultZone: "Core Zone",
    status: "ONLINE",
    fps: 30,
    resolution: "4K UHD",
    battery: 98,
    signalStrength: -61,
    irEnabled: true,
  },
];

export const DETECTION_ZONES: DetectionZone[] = [
  "Core Zone",
  "Village Boundary",
  "Buffer Zone",
  "Deep Forest",
  "No-Vehicle Zone",
];

export const CLIPS: Record<ClipType, DetectionClipData> = {
  person: {
    type: "person",
    label: "Person Clip",
    detectedClass: "HUMAN / POACHER SUSPECT",
    confidence: 94.8,
    box: { x: 38, y: 15, w: 26, h: 73 },
    telemetry: "Thermal 37.1°C · Bipedal locomotion · Concealed utility bag",
    timestamp: "20:18:12",
    imageSrc: "/images/human_feed.jpg",
  },
  animal: {
    type: "animal",
    label: "Animal Clip",
    detectedClass: "TIGER (Panthera tigris)",
    confidence: 98.2,
    box: { x: 22, y: 22, w: 52, h: 64 },
    telemetry: "Stripe ID match: T-44 (Maya) · Adult female · Active hunting path",
    timestamp: "20:05:40",
    imageSrc: "/images/tiger_feed.jpg",
  },
  vehicle: {
    type: "vehicle",
    label: "Vehicle Clip",
    detectedClass: "UNAUTHORIZED 4x4 VEHICLE",
    confidence: 91.4,
    box: { x: 32, y: 26, w: 42, h: 54 },
    telemetry: "Modified 4WD chassis · Blackout lighting · Engine block thermal 91°C",
    timestamp: "19:54:19",
    imageSrc: "/images/vehicle_feed.jpg",
  },
};

export const CAMERA_RULES: CameraRule[] = [
  {
    id: "RULE-CR-01",
    title: "High-Priority Core Sanctuary Alert",
    clipType: "person",
    zone: "Core Zone",
    alertLevel: "CRITICAL",
    ruleCode: "RULE-CR-01 [Person + Core Zone]",
    condition: "Unauthorized human presence detected inside strict Core Sanctuary area.",
    action: "Immediate Tactical Dispatch: Alert Moharli & Kolsa Rapid Response Team (RRT) + GPS Coordinates transmitted to patrol units.",
  },
  {
    id: "RULE-VH-04",
    title: "Unauthorized Vehicle Alert",
    clipType: "vehicle",
    zone: "No-Vehicle Zone",
    alertLevel: "HIGH",
    ruleCode: "RULE-VH-04 [Vehicle + No-Vehicle Zone]",
    condition: "Motorized vehicle detected in restricted ecological corridor.",
    action: "Interception Protocol: Activate Gate 2 automated road barrier warning & dispatch patrol vehicle P-03 for interception.",
  },
  {
    id: "RULE-HW-02",
    title: "Wildlife-Near-Village Conflict Alert",
    clipType: "animal",
    zone: "Village Boundary",
    alertLevel: "WARNING",
    ruleCode: "RULE-HW-02 [Animal + Village Boundary]",
    condition: "Apex predator detected within 300m of human settlement boundary.",
    action: "Conflict Mitigation Protocol: Trigger automated village warning siren & send advisory alert to Village Forest Committee (VFC) WhatsApp cell.",
  },
  {
    id: "RULE-ECO-09",
    title: "Ecological Census Observation",
    clipType: "animal",
    zone: "Deep Forest",
    alertLevel: "OBSERVATION",
    ruleCode: "RULE-ECO-09 [Animal + Deep Forest]",
    condition: "Natural wildlife movement inside designated deep sanctuary habitat.",
    action: "Ecological Census Logged: Movement recorded to Tadoba Biodiversity Registry (Telemetry Node ID: T-44).",
  },
];

export function evaluateCameraRule(clip: ClipType, zone: DetectionZone): {
  rule: CameraRule | null;
  alertLevel: AlertLevel;
  ruleCode: string;
  action: string;
  explanation: string;
} {
  // Check exact 4 rules first
  if (clip === "person" && zone === "Core Zone") {
    const r = CAMERA_RULES[0]!;
    return { rule: r, alertLevel: r.alertLevel, ruleCode: r.ruleCode, action: r.action, explanation: r.condition };
  }
  if (clip === "vehicle" && (zone === "No-Vehicle Zone" || zone === "Core Zone")) {
    const r = CAMERA_RULES[1]!;
    return { rule: r, alertLevel: r.alertLevel, ruleCode: r.ruleCode, action: r.action, explanation: r.condition };
  }
  if (clip === "animal" && zone === "Village Boundary") {
    const r = CAMERA_RULES[2]!;
    return { rule: r, alertLevel: r.alertLevel, ruleCode: r.ruleCode, action: r.action, explanation: r.condition };
  }
  if (clip === "animal" && (zone === "Deep Forest" || zone === "Buffer Zone")) {
    const r = CAMERA_RULES[3]!;
    return { rule: r, alertLevel: r.alertLevel, ruleCode: r.ruleCode, action: r.action, explanation: r.condition };
  }

  // Fallbacks for other combinations
  if (clip === "person") {
    return {
      rule: null,
      alertLevel: "HIGH",
      ruleCode: `RULE-PR-02 [Person + ${zone}]`,
      action: "Ranger patrol notified to check visitor permits and trail log.",
      explanation: `Human detected in ${zone}. Verification required.`,
    };
  }
  if (clip === "vehicle") {
    return {
      rule: null,
      alertLevel: "WARNING",
      ruleCode: `RULE-VH-02 [Vehicle + ${zone}]`,
      action: "Check automated gate RFID registry for authorized safari gypsies.",
      explanation: `Vehicle movement in ${zone}. Speed telemetry logged.`,
    };
  }
  return {
    rule: null,
    alertLevel: "OBSERVATION",
    ruleCode: `RULE-AN-01 [Animal + ${zone}]`,
    action: "Logged to wildlife observation database.",
    explanation: `Fauna activity recorded in ${zone}.`,
  };
}

export const INITIAL_CAMERA_LOGS: CameraEventLog[] = [
  {
    id: "CAM-EV-108",
    cameraId: "CAM-03",
    timestamp: "20:18:12",
    clipType: "person",
    detectedClass: "HUMAN / POACHER SUSPECT",
    confidence: 94.8,
    zone: "Core Zone",
    alertLevel: "CRITICAL",
    actionTaken: "RRT Moharli dispatched (Priority 1)",
  },
  {
    id: "CAM-EV-105",
    cameraId: "CAM-02",
    timestamp: "20:05:40",
    clipType: "animal",
    detectedClass: "TIGER (Panthera tigris)",
    confidence: 98.2,
    zone: "Village Boundary",
    alertLevel: "WARNING",
    actionTaken: "VFC automated advisory transmitted",
  },
  {
    id: "CAM-EV-102",
    cameraId: "CAM-01",
    timestamp: "19:54:19",
    clipType: "vehicle",
    detectedClass: "UNAUTHORIZED 4x4 VEHICLE",
    confidence: 91.4,
    zone: "No-Vehicle Zone",
    alertLevel: "HIGH",
    actionTaken: "Gate 2 barrier locked; P-03 responding",
  },
  {
    id: "CAM-EV-097",
    cameraId: "CAM-03",
    timestamp: "18:42:05",
    clipType: "animal",
    detectedClass: "TIGER (Panthera tigris)",
    confidence: 96.5,
    zone: "Deep Forest",
    alertLevel: "OBSERVATION",
    actionTaken: "Observation recorded to Census DB",
  },
];

// ==========================================
// 2. CYBER WILDLIFE-TRADE SCANNER DATA
// ==========================================

export type ListingDistrict = "Chandrapur" | "Nagpur" | "Wardha" | "Bhandara" | "Gadchiroli";
export type ListingLanguage = "English" | "Hindi" | "Marathi";
export type ListingClassification =
  | "Parts & Derivatives"
  | "Live Animal"
  | "Trapping Equipment"
  | "Legitimate Conservation"
  | "Academic";
export type ListingReviewStatus = "UNVERIFIED" | "PENDING_REVIEW" | "REVIEWED" | "DISMISSED";

export interface CyberListing {
  id: string;
  title: string;
  district: ListingDistrict;
  language: ListingLanguage;
  date: string;
  time: string;
  riskScore: number;
  classification: ListingClassification;
  reviewStatus: ListingReviewStatus;
  platform: string;
  matchedKeywords: string[];
  explanation: string;
  species: string;
  sourceMetadata: {
    author: string;
    ipLocation: string;
    contactHandle: string;
    discoveredAt: string;
  };
}

export const MOCK_CYBER_LISTINGS: CyberListing[] = [
  {
    id: "LIST-901",
    title: "दुर्लभ अस्सल वाघ नख (Tiger Claw) लॉकेट - चंद्रपूर थेट भेट",
    district: "Chandrapur",
    language: "Marathi",
    date: "2026-10-09",
    time: "21:30",
    riskScore: 92,
    classification: "Parts & Derivatives",
    reviewStatus: "PENDING_REVIEW",
    platform: "Encrypted Telegram Channel [Vidarbha_Exotics]",
    matchedKeywords: ["वाघ नख", "claw", "चंद्रपूर", "थेट भेट", "अस्सल"],
    explanation: "Explicit solicitation of protected big cat claws with specific Chandrapur local handover location offered.",
    species: "Panthera tigris (Tiger)",
    sourceMetadata: {
      author: "@wild_curio_99",
      ipLocation: "Ballarpur Sub-node (Chandrapur)",
      contactHandle: "t.me/vidarbha_deals_priv",
      discoveredAt: "2026-10-09 21:30:15 UTC+5:30",
    },
  },
  {
    id: "LIST-902",
    title: "Original tiger canine teeth and dried pelt specimen for puja curio",
    district: "Chandrapur",
    language: "English",
    date: "2026-10-08",
    time: "14:15",
    riskScore: 88,
    classification: "Parts & Derivatives",
    reviewStatus: "UNVERIFIED",
    platform: "Dark Web Forum [SilkForest Mirror]",
    matchedKeywords: ["canine teeth", "tiger pelt", "curio", "chandrapur"],
    explanation: "Direct offering of tiger canine dental specimens and skin fragments; matching Tadoba geographic radius.",
    species: "Panthera tigris (Tiger)",
    sourceMetadata: {
      author: "ForestShadow_IN",
      ipLocation: "Tor Exit Relay (Chandrapur Area)",
      contactHandle: "forestshadow@onionmail.org",
      discoveredAt: "2026-10-08 14:15:02 UTC+5:30",
    },
  },
  {
    id: "LIST-903",
    title: "जंगली साळींदर काटे आणि अस्वल नखे उपलब्ध नागपूर/वर्धा",
    district: "Wardha",
    language: "Hindi",
    date: "2026-10-08",
    time: "18:40",
    riskScore: 81,
    classification: "Parts & Derivatives",
    reviewStatus: "UNVERIFIED",
    platform: "Regional Classifieds Forum",
    matchedKeywords: ["अस्वल नखे", "bear claw", "quills", "वर्धा"],
    explanation: "Sale of Sloth Bear claws and porcupine quills; Schedule I wildlife contravention.",
    species: "Melursus ursinus (Sloth Bear)",
    sourceMetadata: {
      author: "DesiTrader_22",
      ipLocation: "Wardha Central",
      contactHandle: "+91-98231-XXXXX (Signal)",
      discoveredAt: "2026-10-08 18:40:44 UTC+5:30",
    },
  },
  {
    id: "LIST-904",
    title: "Heavy duty steel wire snare traps (तार सापळे) bulk box 20 pcs",
    district: "Chandrapur",
    language: "English",
    date: "2026-10-07",
    time: "11:20",
    riskScore: 79,
    classification: "Trapping Equipment",
    reviewStatus: "PENDING_REVIEW",
    platform: "Private WhatsApp Group [AgriTools Exchange]",
    matchedKeywords: ["wire snare", "तार सापळे", "steel wire", "bulk trap"],
    explanation: "High-gauge tensile cable snares configured specifically for big cat poaching and heavy game immobilization.",
    species: "Schedule I Carnivores / Herbivores",
    sourceMetadata: {
      author: "HardwareSupply_CP",
      ipLocation: "Bhadrawati (Chandrapur)",
      contactHandle: "WA Business +91-7172-XXXXX",
      discoveredAt: "2026-10-07 11:20:10 UTC+5:30",
    },
  },
  {
    id: "LIST-905",
    title: "दुर्लभ जडीबुटी आणि वन्य वनस्पती तेल - ताडोबा जंगल स्पेशल",
    district: "Chandrapur",
    language: "Marathi",
    date: "2026-10-06",
    time: "09:50",
    riskScore: 54,
    classification: "Parts & Derivatives",
    reviewStatus: "UNVERIFIED",
    platform: "Local Facebook Community Group",
    matchedKeywords: ["ताडोबा जंगल", "वनस्पती तेल", "जडीबुटी"],
    explanation: "Ambiguous minor forest produce listing; claimed to originate inside Tadoba core zone.",
    species: "Wild Flora & Minor Forest Produce",
    sourceMetadata: {
      author: "Prakruti Herbs",
      ipLocation: "Chandrapur City",
      contactHandle: "fb.me/prakrutiherbs",
      discoveredAt: "2026-10-06 09:50:00 UTC+5:30",
    },
  },
  {
    id: "LIST-906",
    title: "Handmade bone carving dagger handle antique curio item",
    district: "Nagpur",
    language: "English",
    date: "2026-10-06",
    time: "16:15",
    riskScore: 62,
    classification: "Parts & Derivatives",
    reviewStatus: "UNVERIFIED",
    platform: "Antique Auction Forum",
    matchedKeywords: ["bone carving", "dagger", "curio", "antique"],
    explanation: "Claimed antique animal bone handle; requires biological review to determine whether wild ungulate or boar.",
    species: "Sus scrofa / Wild Boar",
    sourceMetadata: {
      author: "HeritageCollectibles",
      ipLocation: "Nagpur Sitabuldi",
      contactHandle: "heritage_ngp@crafts.in",
      discoveredAt: "2026-10-06 16:15:30 UTC+5:30",
    },
  },
  {
    id: "LIST-907",
    title: "देशी शिकार जाळी आणि नायलॉन दोरी ट्रॅप्स",
    district: "Bhandara",
    language: "Marathi",
    date: "2026-10-05",
    time: "20:05",
    riskScore: 68,
    classification: "Trapping Equipment",
    reviewStatus: "UNVERIFIED",
    platform: "Telegram Channel [Shikar_Mitra]",
    matchedKeywords: ["शिकार जाळी", "नायलॉन ट्रॅप्स", "दोरी"],
    explanation: "Specialized bird netting and ground trip-wire equipment marketed with hunting keywords.",
    species: "Wetland Avifauna / Small Game",
    sourceMetadata: {
      author: "@nets_bhandara",
      ipLocation: "Bhandara East",
      contactHandle: "t.me/bhandara_crafts",
      discoveredAt: "2026-10-05 20:05:12 UTC+5:30",
    },
  },
  {
    id: "LIST-908",
    title: "Live Indian Star Tortoise pair for home aquarium vastu",
    district: "Nagpur",
    language: "English",
    date: "2026-10-05",
    time: "12:30",
    riskScore: 74,
    classification: "Live Animal",
    reviewStatus: "UNVERIFIED",
    platform: "Classifieds App",
    matchedKeywords: ["star tortoise", "vastu", "aquarium", "live pair"],
    explanation: "Live specimen sale of protected Indian Star Tortoise (Geochelone elegans); Schedule IV wildlife.",
    species: "Geochelone elegans (Star Tortoise)",
    sourceMetadata: {
      author: "VastuAquatics",
      ipLocation: "Nagpur Dharampeth",
      contactHandle: "+91-94221-XXXXX",
      discoveredAt: "2026-10-05 12:30:19 UTC+5:30",
    },
  },
  {
    id: "LIST-909",
    title: "ताडोबा सफारी बुकिंग आणि जिप्सी चालक संपर्क",
    district: "Chandrapur",
    language: "Marathi",
    date: "2026-10-04",
    time: "15:45",
    riskScore: 32,
    classification: "Legitimate Conservation",
    reviewStatus: "REVIEWED",
    platform: "Safari Booking Directory",
    matchedKeywords: ["ताडोबा सफारी", "जिप्सी चालक", "मोहर्ली गेट"],
    explanation: "Harmless tourism and safari driver coordination services for registered Moharli gate visitors.",
    species: "None (Tourism Service)",
    sourceMetadata: {
      author: "Moharli Safari Association",
      ipLocation: "Moharli Tourist Hub",
      contactHandle: "info@tadobasafari.org",
      discoveredAt: "2026-10-04 15:45:00 UTC+5:30",
    },
  },
  {
    id: "LIST-910",
    title: "Field camera trap night vision accessories 940nm black flash",
    district: "Nagpur",
    language: "English",
    date: "2026-10-04",
    time: "10:10",
    riskScore: 46,
    classification: "Trapping Equipment",
    reviewStatus: "UNVERIFIED",
    platform: "Outdoor Optics Forum",
    matchedKeywords: ["camera trap", "night vision", "black flash", "field"],
    explanation: "Wildlife photography gear; flagged due to dual-use nocturnal surveillance capability.",
    species: "Dual-use Camera Technology",
    sourceMetadata: {
      author: "WildTrailOptics",
      ipLocation: "Nagpur Civil Lines",
      contactHandle: "sales@wildtrail.in",
      discoveredAt: "2026-10-04 10:10:44 UTC+5:30",
    },
  },
  {
    id: "LIST-911",
    title: "ताडोबा अंधारी व्याघ्र प्रकल्प - निसर्ग संवर्धन व जनजागृती कार्यशाळा",
    district: "Chandrapur",
    language: "Marathi",
    date: "2026-10-03",
    time: "09:00",
    riskScore: 8,
    classification: "Legitimate Conservation",
    reviewStatus: "REVIEWED",
    platform: "Maharashtra Forest Dept Blog",
    matchedKeywords: ["ताडोबा अंधारी", "व्याघ्र प्रकल्प", "संवर्धन", "जनजागृती"],
    explanation: "Official public awareness workshop announcement promoting tiger corridor conservation.",
    species: "Panthera tigris (Education)",
    sourceMetadata: {
      author: "TATR Public Outreach Cell",
      ipLocation: "Forest Colony Chandrapur",
      contactHandle: "outreach@tatr.gov.in",
      discoveredAt: "2026-10-03 09:00:00 UTC+5:30",
    },
  },
  {
    id: "LIST-912",
    title: "University research paper: Prey base dynamics of herbivores in Central India",
    district: "Nagpur",
    language: "English",
    date: "2026-10-03",
    time: "17:25",
    riskScore: 5,
    classification: "Academic",
    reviewStatus: "REVIEWED",
    platform: "ResearchGate Academic Mirror",
    matchedKeywords: ["prey base", "herbivores", "central india", "ecology"],
    explanation: "Peer-reviewed scientific publication analyzing chital and sambar carrying capacity in Tadoba-Andhari.",
    species: "Cervus axis / Rusa unicolor",
    sourceMetadata: {
      author: "Dr. A. K. Joshi (Nagpur University)",
      ipLocation: "Nagpur University Campus",
      contactHandle: "joshi.ecology@uni.ac.in",
      discoveredAt: "2026-10-03 17:25:10 UTC+5:30",
    },
  },
  {
    id: "LIST-913",
    title: "वने व वन्यजीव संरक्षण कायदा १९७२ कार्यशाळा व मार्गदर्शन",
    district: "Wardha",
    language: "Marathi",
    date: "2026-10-02",
    time: "11:00",
    riskScore: 6,
    classification: "Legitimate Conservation",
    reviewStatus: "REVIEWED",
    platform: "Legal Education Portal",
    matchedKeywords: ["वन्यजीव संरक्षण कायदा", "१९७२", "कार्यशाळा", "मार्गदर्शन"],
    explanation: "Free legal literacy camp educating forest-dwelling communities on Wildlife Protection Act provisions.",
    species: "Legal Compliance",
    sourceMetadata: {
      author: "Vidarbha Legal Aid Society",
      ipLocation: "Wardha Courts Complex",
      contactHandle: "legalaid@wardhawild.org",
      discoveredAt: "2026-10-02 11:00:00 UTC+5:30",
    },
  },
  {
    id: "LIST-914",
    title: "Wildlife photography workshop in Tadoba Moharli Gate March batch",
    district: "Chandrapur",
    language: "English",
    date: "2026-10-02",
    time: "14:50",
    riskScore: 11,
    classification: "Legitimate Conservation",
    reviewStatus: "REVIEWED",
    platform: "EcoTour India Portal",
    matchedKeywords: ["photography", "moharli gate", "tadoba", "safari batch"],
    explanation: "Commercial ecotourism tour package with licensed naturalists and registered forest permits.",
    species: "Ecotourism Expedition",
    sourceMetadata: {
      author: "LensAndWild Expeditions",
      ipLocation: "Chandrapur / Mumbai",
      contactHandle: "tours@lenswild.com",
      discoveredAt: "2026-10-02 14:50:22 UTC+5:30",
    },
  },
  {
    id: "LIST-915",
    title: "बांबू हस्तकला आणि वन उत्पादने प्रदर्शन - चंद्रपूर",
    district: "Chandrapur",
    language: "Marathi",
    date: "2026-10-01",
    time: "10:15",
    riskScore: 14,
    classification: "Legitimate Conservation",
    reviewStatus: "REVIEWED",
    platform: "District Handloom & Handicrafts",
    matchedKeywords: ["बांबू हस्तकला", "वन उत्पादने", "चंद्रपूर", "प्रदर्शन"],
    explanation: "Tribal cooperative exhibition of sustainable bamboo handicrafts and Mahua non-timber forest products.",
    species: "Dendrocalamus strictus (Bamboo)",
    sourceMetadata: {
      author: "Gondwana Bamboo Karigar Sanstha",
      ipLocation: "Chandrapur MIDC",
      contactHandle: "bamboo@gondwana-crafts.org",
      discoveredAt: "2026-10-01 10:15:00 UTC+5:30",
    },
  },
  {
    id: "LIST-916",
    title: "Research survey on tiger corridor connectivity across Gadchiroli forests",
    district: "Gadchiroli",
    language: "English",
    date: "2026-09-30",
    time: "16:40",
    riskScore: 7,
    classification: "Academic",
    reviewStatus: "REVIEWED",
    platform: "Wildlife Institute GIS Repository",
    matchedKeywords: ["tiger corridor", "connectivity", "gadchiroli", "survey"],
    explanation: "Government-authorized landscape ecology mapping between Tadoba and Indravati forest corridors.",
    species: "Panthera tigris (Corridor GIS)",
    sourceMetadata: {
      author: "Landscape Ecology Lab",
      ipLocation: "Gadchiroli Forest Hq",
      contactHandle: "corridor@wii-central.gov.in",
      discoveredAt: "2026-09-30 16:40:55 UTC+5:30",
    },
  },
  {
    id: "LIST-917",
    title: "वनरक्षक भरती मार्गदर्शन वर्ग २०२६ - शारीरिक चाचणी तयारी",
    district: "Nagpur",
    language: "Marathi",
    date: "2026-09-29",
    time: "08:30",
    riskScore: 4,
    classification: "Legitimate Conservation",
    reviewStatus: "REVIEWED",
    platform: "Career Academy Forum",
    matchedKeywords: ["वनरक्षक भरती", "शारीरिक चाचणी", "मार्गदर्शन वर्ग"],
    explanation: "Coaching classes for local youth aspiring to pass forest guard recruitment examinations.",
    species: "None (Career Academy)",
    sourceMetadata: {
      author: "Sahyadri Career Academy",
      ipLocation: "Nagpur Reshimbagh",
      contactHandle: "admin@sahyadriacademy.in",
      discoveredAt: "2026-09-29 08:30:10 UTC+5:30",
    },
  },
  {
    id: "LIST-918",
    title: "Volunteer call for wildlife water hole census in Tadoba buffer",
    district: "Chandrapur",
    language: "English",
    date: "2026-09-28",
    time: "18:00",
    riskScore: 9,
    classification: "Legitimate Conservation",
    reviewStatus: "REVIEWED",
    platform: "Volunteer Conservation NGO",
    matchedKeywords: ["volunteer", "water hole", "census", "tadoba buffer"],
    explanation: "Annual public participatory census program organized under forest department supervision on Buddha Purnima.",
    species: "Mammalian Wildlife Census",
    sourceMetadata: {
      author: "Tiger Conservation Trust",
      ipLocation: "Chandrapur Camp",
      contactHandle: "census@tigertrust.org",
      discoveredAt: "2026-09-28 18:00:00 UTC+5:30",
    },
  },
  {
    id: "LIST-919",
    title: "ग्राम वन संरक्षण समिती मोहर्ली - मासिक अहवाल व माहिती",
    district: "Chandrapur",
    language: "Marathi",
    date: "2026-09-27",
    time: "11:20",
    riskScore: 8,
    classification: "Legitimate Conservation",
    reviewStatus: "REVIEWED",
    platform: "Gram Panchayat Bulletin",
    matchedKeywords: ["ग्राम वन", "संरक्षण समिती", "मोहर्ली", "मासिक अहवाल"],
    explanation: "Joint Forest Management Committee meeting minutes documenting zero conflict incidents in Moharli village.",
    species: "Community Stewardship",
    sourceMetadata: {
      author: "VFC Moharli Secretary",
      ipLocation: "Moharli Gram Panchayat",
      contactHandle: "vfc.moharli@panchayat.gov.in",
      discoveredAt: "2026-09-27 11:20:45 UTC+5:30",
    },
  },
  {
    id: "LIST-920",
    title: "GIS satellite imagery mapping of forest canopy cover in Vidarbha",
    district: "Nagpur",
    language: "English",
    date: "2026-09-26",
    time: "13:45",
    riskScore: 5,
    classification: "Academic",
    reviewStatus: "REVIEWED",
    platform: "Open Remote Sensing Data",
    matchedKeywords: ["GIS", "satellite imagery", "forest canopy", "vidarbha"],
    explanation: "Open-source Sentinel-2 multispectral NDVI vegetation index analysis for Tadoba forest buffer.",
    species: "Forest Ecosystem Remote Sensing",
    sourceMetadata: {
      author: "GeoSpatial Vidarbha Group",
      ipLocation: "VNIT Nagpur",
      contactHandle: "remote_sensing@vnit.ac.in",
      discoveredAt: "2026-09-26 13:45:00 UTC+5:30",
    },
  },
];

// ==========================================
// 3. LINKED CASE INVESTIGATION DATA
// ==========================================

export interface FieldAlert {
  id: string;
  sourceType: "CAMERA" | "ACOUSTIC" | "SEISMIC" | "SENSOR";
  sourceName: string;
  location: string;
  district: ListingDistrict;
  timestamp: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  detectedClass: string;
  details: string;
}

export interface LinkedCase {
  id: string;
  title: string;
  fieldEventId: string;
  fieldEvent: FieldAlert;
  onlineListingId: string;
  onlineListing: CyberListing;
  districtMatch: boolean;
  dateDifferenceDays: number;
  correlationReasons: string[];
  correlationScore: number;
  reviewStatus: "PENDING_REVIEW" | "REVIEWED" | "ESCALATED";
  auditNotes: string;
}

export const INITIAL_FIELD_ALERTS: FieldAlert[] = [
  {
    id: "CAM-EV-108",
    sourceType: "CAMERA",
    sourceName: "Camera 03 — Core Zone",
    location: "Kolsa Deep Ridge · Sector 4B",
    district: "Chandrapur",
    timestamp: "2026-10-10 20:18:12",
    severity: "CRITICAL",
    detectedClass: "HUMAN / POACHER SUSPECT",
    details: "Adult male with concealed equipment bag trespassing in non-public sanctuary trail at dusk.",
  },
  {
    id: "EV-2042",
    sourceType: "ACOUSTIC",
    sourceName: "Acoustic Sensor Node S-04 / S-07",
    location: "Kolsa-Moharli Border Ridge",
    district: "Chandrapur",
    timestamp: "2026-10-10 20:14:36",
    severity: "CRITICAL",
    detectedClass: "ACOUSTIC DISRUPTION (Gunshot/Axe)",
    details: "High-frequency impulse signature correlated across dual audio telemetry sensors.",
  },
  {
    id: "CAM-EV-102",
    sourceType: "CAMERA",
    sourceName: "Camera 01 — Forest Perimeter",
    location: "Buffer Sector 04",
    district: "Chandrapur",
    timestamp: "2026-10-09 19:54:19",
    severity: "HIGH",
    detectedClass: "UNAUTHORIZED 4x4 VEHICLE",
    details: "Utility vehicle without headlights traversing non-motorized trail corridor.",
  },
  {
    id: "S-09-VIB",
    sourceType: "SEISMIC",
    sourceName: "Seismic Fence Line Sensor S-09",
    location: "Southern Buffer Boundary",
    district: "Chandrapur",
    timestamp: "2026-10-08 02:15:00",
    severity: "MEDIUM",
    detectedClass: "PERIMETER WIRE TAMPER",
    details: "Mechanical strain fluctuation on perimeter warning fence wire.",
  },
];

export const INITIAL_LINKED_CASES: LinkedCase[] = [
  {
    id: "CASE-2026-TAD-084",
    title: "Correlated Core Intrusion & Cyber Tiger Part Listing",
    fieldEventId: "CAM-EV-108",
    fieldEvent: INITIAL_FIELD_ALERTS[0]!,
    onlineListingId: "LIST-901",
    onlineListing: MOCK_CYBER_LISTINGS[0]!,
    districtMatch: true,
    dateDifferenceDays: 1.1,
    correlationReasons: [
      "Spatiotemporal Proximity: Field detection in Tadoba Kolsa correlates with Chandrapur direct handover listing.",
      "Species Correlation: Suspect intrusion in tiger core corridor coincides with fresh tiger claw (वाघ नख) solicitation.",
      "Modus Operandi: Rapid posting within 24-48 hour window typical of opportunistic local trade networks.",
    ],
    correlationScore: 88.4,
    reviewStatus: "PENDING_REVIEW",
    auditNotes: "Generated by local correlation engine. Requires field ranger verification and cyber intelligence tracking.",
  },
  {
    id: "CASE-2026-TAD-082",
    title: "Night Vehicle Breach & Wire Snare Supplier Inquiry",
    fieldEventId: "CAM-EV-102",
    fieldEvent: INITIAL_FIELD_ALERTS[2]!,
    onlineListingId: "LIST-904",
    onlineListing: MOCK_CYBER_LISTINGS[3]!,
    districtMatch: true,
    dateDifferenceDays: 2.3,
    correlationReasons: [
      "Equipment Concordance: Wire snare listing in Bhadrawati matches unauthorized vehicle access route.",
      "Geographic Cluster: Chandrapur buffer zone vehicle corridor links to seller's warehouse area.",
    ],
    correlationScore: 76.5,
    reviewStatus: "REVIEWED",
    auditNotes: "Reviewed by Analyst R. Mehta. Vehicle registration cross-checked with Bhadrawati checkpoint.",
  },
];

// ==========================================
// 4. DEMO ORCHESTRATOR STAGES
// ==========================================

export interface OrchestratorStage {
  id: number;
  key: string;
  title: string;
  shortDesc: string;
  durationSec: number;
  radarFocus: string;
  eventToEmit?: {
    type: string;
    source: string;
    severity: "INFO" | "WARNING" | "CRITICAL" | "SUCCESS";
    message: string;
  };
}

export const ORCHESTRATOR_STAGES: OrchestratorStage[] = [
  {
    id: 1,
    key: "init",
    title: "1. Initialize Demo",
    shortDesc: "Synchronize telemetry networks, calibrate optical sensors, and check system readiness.",
    durationSec: 8,
    radarFocus: "ALL_NODES",
    eventToEmit: {
      type: "SYSTEM_INIT",
      source: "TELEMETRY_ENGINE",
      severity: "INFO",
      message: "Vankavach sensor mesh synchronized. 3 optical feeds, 12 acoustic nodes online.",
    },
  },
  {
    id: 2,
    key: "camera_detection",
    title: "2. Camera Detection",
    shortDesc: "Camera 03 triggers high-confidence optical lock on unauthorized bipedal subject in Core Sanctuary.",
    durationSec: 12,
    radarFocus: "CAM-03",
    eventToEmit: {
      type: "OPTICAL_DETECT",
      source: "CAM-03 (Kolsa)",
      severity: "CRITICAL",
      message: "Human intruder detected at 20:18:12. Confidence 94.8%. Bounding box locked.",
    },
  },
  {
    id: 3,
    key: "apply_rule",
    title: "3. Apply Detection Rule",
    shortDesc: "Evaluating RULE-CR-01: Person + Core Zone. Escalating to high-priority critical incident.",
    durationSec: 10,
    radarFocus: "RULES_ENGINE",
    eventToEmit: {
      type: "RULE_TRIGGER",
      source: "RULES_ENGINE",
      severity: "CRITICAL",
      message: "RULE-CR-01 matched: Unauthorized presence inside core sanctuary. Alert dispatched to RRT Moharli.",
    },
  },
  {
    id: 4,
    key: "cyber_scan",
    title: "4. Scan Wildlife-Trade Listings",
    shortDesc: "Execute automated cyber-crawler across regional classifieds, dark social, and messaging channels.",
    durationSec: 14,
    radarFocus: "CYBER_CRAWLER",
    eventToEmit: {
      type: "CYBER_CRAWL",
      source: "CYBER_SCANNER",
      severity: "WARNING",
      message: "Discovered listing LIST-901 in Marathi: 'दुर्लभ अस्सल वाघ नख (Tiger Claw)' in Chandrapur. Risk 92%.",
    },
  },
  {
    id: 5,
    key: "correlate",
    title: "5. Correlate Field & Online Events",
    shortDesc: "Cross-correlating spatial district (Chandrapur) and temporal proximity (1.1 days difference).",
    durationSec: 12,
    radarFocus: "CORRELATION_CORE",
    eventToEmit: {
      type: "CORRELATION_MATCH",
      source: "CORRELATION_ENGINE",
      severity: "WARNING",
      message: "Spatiotemporal correlation verified: CAM-EV-108 ↔ LIST-901. Match confidence: 88.4%.",
    },
  },
  {
    id: 6,
    key: "create_case",
    title: "6. Create Linked Case",
    shortDesc: "Synthesizing linked case CASE-2026-TAD-084 with evidence graph and digital chain-of-custody.",
    durationSec: 12,
    radarFocus: "CASE_REGISTRY",
    eventToEmit: {
      type: "CASE_CREATED",
      source: "CASE_MANAGEMENT",
      severity: "CRITICAL",
      message: "Created CASE-2026-TAD-084: Correlated Core Intrusion & Cyber Tiger Part Listing.",
    },
  },
  {
    id: 7,
    key: "human_review",
    title: "7. Submit for Human Review",
    shortDesc: "Enqueue case to duty analyst R. Mehta. Transmit high-priority notification to review queue.",
    durationSec: 12,
    radarFocus: "REVIEW_DESK",
    eventToEmit: {
      type: "REVIEW_ENQUEUED",
      source: "DUTY_DESK",
      severity: "SUCCESS",
      message: "Case CASE-2026-TAD-084 submitted to human review queue. Duty analyst notified.",
    },
  },
  {
    id: 8,
    key: "complete",
    title: "8. Demo Complete",
    shortDesc: "Demonstration sequence successfully completed. System operational and ready for inspection.",
    durationSec: 10,
    radarFocus: "ALL_NODES",
    eventToEmit: {
      type: "DEMO_COMPLETED",
      source: "ORCHESTRATOR",
      severity: "SUCCESS",
      message: "Full demonstration finished. All 4 dashboards populated with live synchronized mock evidence.",
    },
  },
];
