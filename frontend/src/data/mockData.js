// SolveMe Master Dataset with Bilingual Hindi/English Content

export const CATEGORIES = [
  { id: 'water', en: 'Water Management / Infrastructure', hi: 'जल प्रबंधन एवं अवसंरचना', code: 'WTR' },
  { id: 'health', en: 'Healthcare / Public Health', hi: 'स्वास्थ्य एवं जन स्वास्थ्य', code: 'HLT' },
  { id: 'road', en: 'Road / Transport Infrastructure', hi: 'सड़क एवं परिवहन अवसंरचना', code: 'RDS' },
  { id: 'agriculture', en: 'Agriculture / Rural Development', hi: 'कृषि एवं ग्रामीण विकास', code: 'AGR' },
  { id: 'education', en: 'Education / School Infrastructure', hi: 'शिक्षा एवं विद्यालय अवसंरचना', code: 'EDU' },
  { id: 'energy', en: 'Electricity / Energy Access', hi: 'विद्युत एवं ऊर्जा आपूर्ति', code: 'NRG' },
  { id: 'waste', en: 'Waste Management / Environment', hi: 'अपशिष्ट प्रबंधन एवं पर्यावरण', code: 'WST' },
  { id: 'safety', en: 'Public Safety / Civic Lighting', hi: 'नागरिक सुरक्षा एवं स्ट्रीट लाइट', code: 'SFT' }
];

export const STATUS_LIST = [
  { id: 'submitted', en: 'Submitted', hi: 'दर्ज किया गया', dot: 'bg-slate-400' },
  { id: 'published', en: 'Published', hi: 'प्रकाशित', dot: 'bg-blue-500' },
  { id: 'community_validated', en: 'Community Validated', hi: 'समुदाय द्वारा सत्यापित', dot: 'bg-emerald-600' },
  { id: 'under_review', en: 'Under Review', hi: 'समीक्षाधीन', dot: 'bg-amber-500' },
  { id: 'adopted', en: 'Adopted', hi: 'संस्थान द्वारा अंगीकृत', dot: 'bg-indigo-600' },
  { id: 'in_progress', en: 'In Progress', hi: 'प्रगति पर', dot: 'bg-cyan-600' },
  { id: 'prototype_pilot', en: 'Prototype / Pilot', hi: 'पायलट परीक्षण', dot: 'bg-violet-600' },
  { id: 'completed', en: 'Completed', hi: 'समाधान पूर्ण', dot: 'bg-emerald-700' }
];

export const INITIAL_PROBLEMS = [
  {
    id: 'P101',
    title: {
      en: 'Severe waterlogging near university hostel road',
      hi: 'विश्वविद्यालय छात्रावास मार्ग पर भारी जलभराव'
    },
    description: {
      en: 'During every monsoon rain, stagnant stormwater accumulates over 300 meters near the hostel entrance. Student foot movement is blocked, and breeding of dengue mosquitoes has caused 14 hospitalizations this season.',
      hi: 'हर मानसून में छात्रावास के मुख्य द्वार के पास 300 मीटर तक गंदा बरसाती पानी भर जाता है। छात्रों का आवागमन बाधित होता है और डेंगू के मच्छरों के कारण इस सत्र में 14 छात्रों को अस्पताल में भर्ती कराना पड़ा है।'
    },
    category: 'water',
    location: 'Hostel Gate Road, Kanke Block, Ranchi',
    lat: 23.4124,
    lng: 85.3245,
    severity: 'high',
    urgency: 'high',
    status: 'community_validated',
    confirmations: 38,
    userConfirmed: false,
    evidence: {
      type: 'photo',
      url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
      caption: {
        en: 'Standing water of 1.5 ft depth blocking pedestrian culvert',
        hi: 'पैदल मार्ग को अवरुद्ध करता 1.5 फीट गहरा जमा हुआ पानी'
      }
    },
    ai: {
      category_id: 'water',
      summary: {
        en: 'Recurring stormwater inundation near student hostels obstructing transit and creating vector-borne health risks.',
        hi: 'छात्र छात्रावास के पास बार-बार होने वाला जलभराव जो आवागमन बाधित करता है और वेक्टर जनित बीमारियों का खतरा पैदा करता है।'
      },
      tags: ['waterlogging', 'stormwater', 'student-safety', 'drainage-slope'],
      possible_domains: ['Civil Engineering', 'Hydrology & Environmental Engineering'],
      possible_duplicate_ids: []
    },
    priority: {
      community: 4.0,
      evidence: 2.0,
      severity: 5.0,
      urgency: 3.0,
      validation: 3.0,
      total: 17.0
    },
    solver: {
      relevant_expertise: ['Stormwater Runoff Modeling', 'Permeable Drainage Paving', 'Sediment Trap Design'],
      potential_pathways: [
        'University Civil Engineering Student Capstone Project',
        'Municipal Drainage Engineering Division',
        'Urban CleanTech Water Management Startup'
      ],
      adopted_by: 'BIT Mesra — Civil & Environmental Engineering Dept',
      project_status: 'in_progress',
      proposal: 'Construct a 180m sub-surface perforated gravel French drain with soak pit recharge.'
    },
    timeline: [
      { status: 'Submitted', date: '2026-08-12', note: 'Report filed by resident student with geotagged photo.' },
      { status: 'Published', date: '2026-08-12', note: 'AI classified under Water Infrastructure; published to community feed.' },
      { status: 'Community Validated', date: '2026-08-16', note: 'Crossed 25 verified citizen endorsements.' },
      { status: 'Adopted', date: '2026-08-25', note: 'Adopted by BIT Mesra Civil Dept for undergraduate capstone pilot.' },
      { status: 'In Progress', date: '2026-09-02', note: 'Slope survey and soil permeability tests completed.' }
    ],
    impact: {
      people_affected: '1,200 students & staff',
      area_covered: '350 meters transit corridor',
      intervention_status: 'French Drain Design Finalized',
      measured_outcome: 'Estimated 85% runoff diversion to groundwater recharge table'
    }
  },
  {
    id: 'P102',
    title: {
      en: 'Damaged culvert bridge isolating three agricultural hamlets',
      hi: 'क्षतिग्रस्त पुलिया पुल के कारण तीन कृषि बस्तियों का संपर्क टूटा'
    },
    description: {
      en: 'The single-lane concrete slab over the seasonal stream cracked during flash floods. Small tractors and crop transport vehicles cannot cross, forcing a 14km detour to reach the mandi.',
      hi: 'मौसमी नाले पर बना एकल-लेन कंक्रीट स्लैब अचानक आई बाढ़ में टूट गया। छोटे ट्रैक्टर और फसल परिवहन वाहन पार नहीं कर सकते, जिससे मंडी पहुंचने के लिए 14 किमी का चक्कर लगाना पड़ता है।'
    },
    category: 'road',
    location: 'Angara Block, Rural Ranchi District',
    lat: 23.4218,
    lng: 85.5312,
    severity: 'high',
    urgency: 'medium',
    status: 'under_review',
    confirmations: 24,
    userConfirmed: false,
    evidence: {
      type: 'photo',
      url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
      caption: {
        en: 'Structural collapse of western abutment slab',
        hi: 'पश्चिमी किनारे के स्लैब का ढांचागत नुकसान'
      }
    },
    ai: {
      category_id: 'road',
      summary: {
        en: 'Collapsed rural culvert hindering agricultural produce transit and emergency connectivity for 3 villages.',
        hi: 'क्षतिग्रस्त ग्रामीण पुलिया जिससे 3 गांवों के कृषि उत्पादों का परिवहन और आपातकालीन संपर्क प्रभावित हुआ है।'
      },
      tags: ['culvert', 'rural-road', 'crop-transport', 'structural-failure'],
      possible_domains: ['Structural Engineering', 'Rural Infrastructure Management'],
      possible_duplicate_ids: []
    },
    priority: {
      community: 3.0,
      evidence: 2.0,
      severity: 5.0,
      urgency: 2.0,
      validation: 3.0,
      total: 15.0
    },
    solver: {
      relevant_expertise: ['Prefabricated Modular Steel Bridges', 'Geotechnical Abutment Stabilization'],
      potential_pathways: [
        'State Rural Development & PWD Cell',
        'Engineering College Structural Lab',
        'Rural Connectivity NGO Alliance'
      ],
      adopted_by: null,
      project_status: null,
      proposal: null
    },
    timeline: [
      { status: 'Submitted', date: '2026-08-20', note: 'Reported by local Farmer Producer Group.' },
      { status: 'Published', date: '2026-08-20', note: 'Classified under Road Infrastructure.' },
      { status: 'Under Review', date: '2026-08-29', note: 'Assigned to PWD Sub-Divisional Officer for site inspection.' }
    ],
    impact: {
      people_affected: '2,800 villagers across 3 hamlets',
      area_covered: '14 km connecting bypass',
      intervention_status: 'Engineering feasibility review underway',
      measured_outcome: 'Pending pilot execution'
    }
  },
  {
    id: 'P103',
    title: {
      en: 'Lack of cold storage for perishable tomato harvest',
      hi: 'टमाटर की जल्द खराब होने वाली फसल के लिए कोल्ड स्टोरेज का अभाव'
    },
    description: {
      en: 'Over 40 smallholder farmers face 35% post-harvest distress spoilage during peak November-January season due to lack of localized solar micro-cold rooms.',
      hi: 'शीतकालीन कटाई के दौरान स्थानीय सौर शीतगृह की कमी के कारण 40 से अधिक छोटे किसान 35% फसल खराब होने का नुकसान उठाते हैं।'
    },
    category: 'agriculture',
    location: 'Ormanjhi Block, Ranchi',
    lat: 23.4841,
    lng: 85.4762,
    severity: 'medium',
    urgency: 'medium',
    status: 'adopted',
    confirmations: 42,
    userConfirmed: true,
    evidence: {
      type: 'photo',
      url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
      caption: {
        en: 'Field harvest storage without climate control',
        hi: 'तापमान नियंत्रण के बिना खेत में रखी फसल'
      }
    },
    ai: {
      category_id: 'agriculture',
      summary: {
        en: 'Severe post-harvest economic loss for tomato cultivators due to absence of village-level cold chain facilities.',
        hi: 'गांव स्तर पर कोल्ड चेन सुविधाओं की कमी के कारण टमाटर उत्पादकों को भारी फसल कटाई पश्चात नुकसान।'
      },
      tags: ['cold-storage', 'post-harvest', 'solar-energy', 'farmer-income'],
      possible_domains: ['Agricultural Engineering', 'Renewable Thermal Systems'],
      possible_duplicate_ids: []
    },
    priority: {
      community: 4.0,
      evidence: 2.0,
      severity: 3.0,
      urgency: 2.0,
      validation: 4.0,
      total: 15.0
    },
    solver: {
      relevant_expertise: ['Phase Change Material (PCM) Cooling', 'Solar PV-Thermal Micro-Cold Units'],
      potential_pathways: [
        'AgriTech Hardware Startup',
        'Indian Institute of Agricultural Biotechnology (IIAB)',
        'Jharkhand Renewable Energy Development Agency (JREDA)'
      ],
      adopted_by: 'IIT (ISM) Dhanbad Clean Energy Incubation Cell',
      project_status: 'prototype_pilot',
      proposal: 'Deploying a 5-metric-ton solar-powered thermal battery cold unit at Ormanjhi farmer cluster.'
    },
    timeline: [
      { status: 'Submitted', date: '2026-07-10', note: 'Submitted with collective farmer signature sheet.' },
      { status: 'Community Validated', date: '2026-07-18', note: 'Verified by 42 cultivators.' },
      { status: 'Adopted', date: '2026-08-05', note: 'Adopted by IIT ISM Dhanbad Clean Energy Incubation Cell.' },
      { status: 'Prototype / Pilot', date: '2026-08-30', note: 'Solar container unit fabricated and shipped to site.' }
    ],
    impact: {
      people_affected: '48 farming households',
      area_covered: '120 acres cultivation cluster',
      intervention_status: 'Field pilot testing phase',
      measured_outcome: 'Reduced distress spoilage from 35% to less than 6% in trial week'
    }
  },
  {
    id: 'P104',
    title: {
      en: 'Unsafe dark pedestrian corridor on hospital approach road',
      hi: 'अस्पताल पहुंच मार्ग पर असुरक्षित अंधेरा पैदल गलियारा'
    },
    description: {
      en: 'A 600m stretch connecting the bus stop to the Community Health Centre has zero functioning streetlights. Three chain-snatching and pedestrian stumbling accidents occurred last month.',
      hi: 'बस स्टॉप से सामुदायिक स्वास्थ्य केंद्र को जोड़ने वाले 600 मीटर के मार्ग पर कोई स्ट्रीट लाइट चालू नहीं है। पिछले महीने तीन दुर्घटनाएं और छीना-झपटी की घटनाएं हुईं।'
    },
    category: 'safety',
    location: 'Bariatu Road, Ward 12, Ranchi',
    lat: 23.3852,
    lng: 85.3481,
    severity: 'medium',
    urgency: 'high',
    status: 'published',
    confirmations: 19,
    userConfirmed: false,
    evidence: {
      type: 'photo',
      url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
      caption: {
        en: 'Night visibility less than 5 meters on main patient walking path',
        hi: 'रोगी पैदल पथ पर रात में 5 मीटर से भी कम दृश्यता'
      }
    },
    ai: {
      category_id: 'safety',
      summary: {
        en: 'Dark corridor compromising safe pedestrian access to local healthcare facility during evening hours.',
        hi: 'शाम के समय स्थानीय स्वास्थ्य केंद्र तक सुरक्षित पैदल पहुंच को बाधित करता अंधेरा मार्ग।'
      },
      tags: ['street-lighting', 'pedestrian-safety', 'hospital-access', 'dark-spots'],
      possible_domains: ['Electrical Systems', 'Urban Safety Planning'],
      possible_duplicate_ids: []
    },
    priority: {
      community: 3.0,
      evidence: 2.0,
      severity: 3.0,
      urgency: 3.0,
      validation: 1.0,
      total: 12.0
    },
    solver: {
      relevant_expertise: ['Smart Solar LED Streetlighting', 'Civic Dark-Spot Mapping'],
      potential_pathways: [
        'Municipal Electrical Works Division',
        'Student Robotics/IoT Society',
        'Citizen Safety Collective'
      ],
      adopted_by: null,
      project_status: null,
      proposal: null
    },
    timeline: [
      { status: 'Submitted', date: '2026-08-30', note: 'Reported by evening nursing staff.' },
      { status: 'Published', date: '2026-08-30', note: 'Validated and open for community endorsement.' }
    ],
    impact: {
      people_affected: '850 daily hospital visitors & transit commuters',
      area_covered: '600 meters access road',
      intervention_status: 'Awaiting solver interest',
      measured_outcome: 'Pending adoption'
    }
  }
];

export const DEMO_USERS = {
  citizen: {
    id: 1,
    name: 'Rahul Kumar',
    phone: '9876543210',
    role: 'citizen',
    location: 'Ranchi, Jharkhand',
    myReportsCount: 2,
    confirmedCount: 5
  },
  solver: {
    id: 9,
    name: 'Prof. Sunil Mehta',
    phone: '9876543230',
    role: 'solver',
    organization: 'BIT Mesra — Civil & Environmental Engineering Dept',
    expertise: ['Civil Engineering', 'Hydrology & Environmental Engineering', 'Stormwater Runoff Modeling'],
    adoptedCount: 2
  },
  admin: {
    id: 12,
    name: 'Dr. Rajesh Verma',
    phone: '9876543220',
    role: 'admin',
    department: 'District Monitoring Cell, Jharkhand',
    triageQueueCount: 6
  }
};
