// Standardized Master Data for SIH Innovation Hub (SolveGrid)

const CATEGORIES = [
  { id: 'water', name: 'Water & Drainage Infrastructure', code: 'WTR', icon: '💧' },
  { id: 'health', name: 'Healthcare & Public Health', code: 'HLT', icon: '🏥' },
  { id: 'road', name: 'Roads & Transport Infrastructure', code: 'RDS', icon: '🛣️' },
  { id: 'agriculture', name: 'Agriculture & Rural Irrigation', code: 'AGR', icon: '🌾' },
  { id: 'education', name: 'Education & School Infrastructure', code: 'EDU', icon: '📚' },
  { id: 'energy', name: 'Power, Grid & Renewable Energy', code: 'NRG', icon: '⚡' },
  { id: 'waste', name: 'Sanitation & Solid Waste Management', code: 'WST', icon: '♻️' },
  { id: 'safety', name: 'Public Safety & Civic Lighting', code: 'SFT', icon: '🛡️' },
  { id: 'connectivity', name: 'Digital Infrastructure & Telecom', code: 'NET', icon: '📡' },
  { id: 'livelihood', name: 'Employment & Rural Livelihoods', code: 'LVH', icon: '💼' }
];

const STATUSES = [
  'Submitted',
  'Published',
  'Community Validated',
  'Under Review',
  'Adopted',
  'In Progress',
  'Prototype / Pilot',
  'Completed',
  'Archived'
];

// Professional, restrained status colors: neutral backgrounds with subtle dot colors
const STATUS_CONFIG = {
  'Submitted': { dot: 'bg-slate-400', text: 'text-slate-700', border: 'border-slate-200' },
  'Published': { dot: 'bg-blue-600', text: 'text-slate-800', border: 'border-slate-200' },
  'Community Validated': { dot: 'bg-emerald-600', text: 'text-slate-800', border: 'border-slate-200' },
  'Under Review': { dot: 'bg-amber-600', text: 'text-slate-800', border: 'border-slate-200' },
  'Adopted': { dot: 'bg-indigo-600', text: 'text-slate-800', border: 'border-slate-200' },
  'In Progress': { dot: 'bg-teal-600', text: 'text-slate-800', border: 'border-slate-200' },
  'Prototype / Pilot': { dot: 'bg-violet-600', text: 'text-slate-800', border: 'border-slate-200' },
  'Completed': { dot: 'bg-emerald-700', text: 'text-slate-800', border: 'border-slate-200' },
  'Archived': { dot: 'bg-slate-300', text: 'text-slate-500', border: 'border-slate-200' }
};

const STAKEHOLDER_MAP = {
  'water': {
    govt_body: 'Local Municipal Corporation / Jal Board / PHED',
    university_expertise: ['Civil Engineering', 'Environmental Engineering', 'Hydrology'],
    startup_type: 'WaterTech / Smart Metering',
    ngo_type: 'Watershed & Conservation Society',
    solution_pathway: 'Drainage Flow Mapping → Sedimentation Basin Pilot → PWD Municipal Handover'
  },
  'health': {
    govt_body: 'District Health Society / Dept of Health & Family Welfare',
    university_expertise: ['Community Medicine', 'Biotechnology', 'Telemedicine Systems'],
    startup_type: 'HealthTech / Mobile Diagnostic Unit',
    ngo_type: 'Rural Health & Maternal Care Network',
    solution_pathway: 'Mobile Tele-Consultation Van → Sub-Centre Doctor Allocation'
  },
  'road': {
    govt_body: 'Road Construction Department / PWD / NHAI',
    university_expertise: ['Transportation Engineering', 'Geotechnical Engineering'],
    startup_type: 'InfraTech / Pothole AI Mapping',
    ngo_type: 'Rural Road Safety Council',
    solution_pathway: 'Soil Stabilization Survey → Cold-Mix Asphalt Patching Pilot'
  },
  'agriculture': {
    govt_body: 'Directorate of Agriculture / Krishi Vigyan Kendra (KVK)',
    university_expertise: ['Agronomy', 'Soil & Water Conservation', 'Agri-Instrumentation'],
    startup_type: 'AgriTech / Solar Micro-Irrigation',
    ngo_type: 'Farmer Producer Organization (FPO) Support',
    solution_pathway: 'Solar Lift Irrigation Prototype → Community Water Sharing Model'
  },
  'education': {
    govt_body: 'School Education & Literacy Dept / Samagra Shiksha',
    university_expertise: ['Education Technology', 'Civil & Structural Safety'],
    startup_type: 'EdTech / Solar Smart Classrooms',
    ngo_type: 'Literacy & Child Rights Foundation',
    solution_pathway: 'Classroom Structural Audit → Solar Power Backup & Learning Kit'
  },
  'energy': {
    govt_body: 'Jharkhand Bijli Vitran Nigam (JBVNL) / JREDA',
    university_expertise: ['Electrical Engineering', 'Power Systems', 'Renewable Energy'],
    startup_type: 'CleanTech / DC Micro-Grid',
    ngo_type: 'Clean Energy Access Initiative',
    solution_pathway: 'Solar Off-Grid Microgrid Installation → Local Battery Operator Model'
  },
  'waste': {
    govt_body: 'Municipal Sanitation Wing / State Pollution Control Board',
    university_expertise: ['Environmental Engineering', 'Chemical Waste Processing'],
    startup_type: 'WasteTech / Organic Composting Units',
    ngo_type: 'Swachh Bharat Community Alliances',
    solution_pathway: 'Decentralized Composting Shed → Wet Waste Segregation Incentive'
  },
  'safety': {
    govt_body: 'District Police Administration / Municipal Corporation',
    university_expertise: ['Computer Science (Computer Vision)', 'Urban Security Design'],
    startup_type: 'SafetyTech / Smart Solar Streetlighting',
    ngo_type: 'Women & Child Safety Watch',
    solution_pathway: 'Dark Spot Illumination Survey → Solar Streetlight Deployment'
  },
  'connectivity': {
    govt_body: 'Dept of Information Technology / BharatNet / BSNL',
    university_expertise: ['Electronics & Telecommunications', 'Wireless Networking'],
    startup_type: 'Community Wi-Fi / Low-Cost Mesh Tech',
    ngo_type: 'Digital Inclusion Society',
    solution_pathway: 'Tower Line-of-Sight Survey → GPON Fibre Extension Point'
  },
  'livelihood': {
    govt_body: 'Jharkhand State Livelihood Promotion Society (JSLPS)',
    university_expertise: ['Rural Management', 'Development Economics', 'Vocational Training'],
    startup_type: 'SkillTech / Local Artisan Marketplaces',
    ngo_type: 'Tribal Craft & Self-Help Group Federations',
    solution_pathway: 'Vocational Skill Center Setup → Local Market Aggregation'
  }
};

const ORGANIZATIONS = [
  { id: 1, name: 'BIT Mesra — Civil & Environmental Dept', type: 'university', expertise: ['Civil Engineering', 'Environmental Engineering', 'Hydrology'] },
  { id: 2, name: 'IIT (ISM) Dhanbad — Mining & Clean Energy', type: 'university', expertise: ['Power Systems', 'Renewable Energy', 'Geotechnical Engineering'] },
  { id: 3, name: 'Ranchi University — Rural Development Wing', type: 'university', expertise: ['Rural Management', 'Development Economics', 'Education Technology'] },
  { id: 4, name: 'XLRI Jamshedpur — Social Impact Lab', type: 'university', expertise: ['Community Medicine', 'Vocational Training'] },
  { id: 5, name: 'Jharkhand CivicTech Solutions', type: 'startup', expertise: ['WaterTech / Smart Metering', 'WasteTech / Organic Composting Units'] },
  { id: 6, name: 'Gram Swaraj Foundation', type: 'ngo', expertise: ['Watershed & Conservation Society', 'Farmer Producer Organization (FPO) Support'] }
];
