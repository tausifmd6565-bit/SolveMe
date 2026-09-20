import { createContext, useContext, useState, useEffect } from 'react'
import { CATEGORIES, STATUS_LIST } from '../data/mockData'

const UI_TRANSLATIONS = {
  en: {
    brandName: 'SolveMe',
    tagline: 'From Problems to Solutions.',
    // Nav
    home: 'Home',
    explore: 'Explore Problems',
    reportProblem: 'Report a Problem',
    myProblems: 'My Submissions',
    projects: 'Projects',
    impact: 'Impact',
    solverWorkspace: 'Solver Workspace',
    adminOperations: 'Admin Triage',
    signOut: 'Sign Out',
    switchToHindi: 'हिन्दी में बदलें',
    switchToEnglish: 'Switch to English',

    // Home
    communityProblems: 'Community Problems',
    homeSubtitle: 'Report local challenges and create a structured pathway toward university, NGO, and technical solutions.',
    exploreProblems: 'Explore Problems',
    myReportsOverview: 'My Reports',
    confirmedOverview: 'Confirmed Endorsements',
    activeProjectsOverview: 'Active Solver Projects',
    problemsNearYou: 'Problems Near You',
    allSectors: 'All Sectors',
    sortBy: 'Sort By',
    sortRecent: 'Most Recent',
    sortPriority: 'Highest Priority',
    sortConfirmations: 'Most Endorsed',
    confirmationsCount: 'confirmations',
    priorityScoreLabel: 'Priority Score',

    // Reporting Wizard
    wizardTitle: 'Report a Community Problem',
    wizardSubtitle: 'Follow the 4-step structured civic intake process. Avoid vague complaints.',
    step1Problem: '1. Problem Details',
    step2Evidence: '2. Field Evidence',
    step3Location: '3. Location & GPS',
    step4Review: '4. Verification & Submit',
    problemTitleLabel: 'Problem Title',
    problemTitlePlaceholder: 'e.g., Severe waterlogging near university hostel road',
    descriptionLabel: 'Detailed Description',
    descriptionPlaceholder: 'Describe what is happening, who is affected, how long this has persisted, and immediate hazards...',
    severityLabel: 'Severity Assessment',
    severityLow: 'Low (Routine inconvenience)',
    severityMed: 'Medium (Functional disruption)',
    severityHigh: 'High (Hazard / safety risk)',
    urgencyLabel: 'Urgency Factor',
    urgencyLow: 'Can wait for scheduled cycle',
    urgencyMed: 'Needs attention within weeks',
    urgencyHigh: 'Immediate safety or health concern',
    evidenceLabel: 'Photographic or Video Documentation',
    evidenceHelp: 'Visual evidence increases priority score and aids technical solvers in preliminary feasibility review.',
    clickToUpload: 'Upload Photo or Video file',
    locationLabel: 'Specific Location / Landmark',
    locationPlaceholder: 'e.g., Hostel Gate Road, Kanke Block, Ranchi',
    useGps: 'Capture Current Geolocation',
    pickOnMap: 'Pick on Interactive Map',
    summaryBeforeSubmit: 'Summary Before Submission',
    submitButton: 'Submit Civic Challenge',
    nextButton: 'Continue',
    backButton: 'Previous Step',

    // AI Organization
    aiProcessingTitle: 'AI-Assisted Intake Organization',
    aiStep1: 'Problem payload received',
    aiStep2: 'Content semantically parsed',
    aiStep3: 'Category and domain suggested',
    aiStep4: 'Relevant engineering disciplines matched',
    aiStep5: 'Similar historical submissions cross-checked',
    aiDisclaimer: 'AI-assisted suggestions. Human and community validation required.',
    aiCategoryLabel: 'Suggested Category',
    aiSummaryLabel: 'Executive Summary',
    aiTagsLabel: 'Normalized Semantic Tags',
    aiDomainsLabel: 'Possible Technical Domains',

    // Problem Detail & Case Dossier
    alsoFaceIssue: 'I Also Face This Issue (Endorse)',
    alreadyEndorsed: 'You Endorsed This Issue',
    supportProblem: 'SUPPORT THIS PROBLEM',
    supported: 'SUPPORTED',
    peopleSupport: 'people support this problem',
    addSuggestion: 'ADD SUGGESTION',
    viewProblem: 'View Problem Case',
    theProblemTitle: 'THE PROBLEM',
    affectedAreaLabel: 'Affected Area',
    peopleAffectedLabel: 'People Affected',
    reportedLabel: 'Reported',
    categoryLabel: 'Category',
    severityLabel: 'Severity',
    communitySignalTitle: 'COMMUNITY VALIDATION & SIGNAL',
    suggestionsSection: 'CONSTRUCTIVE SUGGESTIONS',
    suggestionsHelp: 'Constructive contributions toward understanding, technical diagnosis, or addressing the problem.',
    noSuggestionsYet: 'No suggestions submitted yet. Share a constructive insight, technical data, or viable next step.',
    suggestionPlaceholder: 'State constructive information, diagnostic observations, or potential solution ideas...',
    contributorRoleLabel: 'Your Role / Perspective',
    submitSuggestionBtn: 'Submit Constructive Suggestion',
    citizenEvidenceLabel: 'Citizen-Provided Field Evidence',
    aiAssistedOrgTitle: 'AI-ASSISTED ORGANIZATION',
    aiAssistedDisclaimer: 'AI-assisted organization provides initial classification and domain suggestions. AI output is an analytical aid, not verified fact.',
    adminVerifiedLabel: 'Institutional Review Status',
    solverPathwayFlowTitle: 'POTENTIAL SOLVER PATHWAY',
    fieldUpdatesTitle: 'FIELD UPDATES & TIMELINE',
    nextActionTitle: 'CASE ACTION',
    mobileSupportBtn: '↑ SUPPORT',
    mobileSuggestBtn: '💡 SUGGESTION',
    endorseHelp: 'Community validation replaces superficial likes with verifiable civic signal.',
    evidenceSection: 'Field Evidence Dossier',
    descriptionSection: 'Problem Description',
    prioritySection: 'Rule-Based Priority Score',
    priorityExplainer: 'Calculated transparently based on community signal, evidence, severity, urgency, and validator vetting. Not an unverified black-box determination.',
    solverPathwayTitle: 'Potentially Relevant Technical Expertise',
    solverPathwaySubtitle: 'These engineering, agricultural, or medical domains may be relevant to solving this challenge.',
    potentialPathways: 'Potential Solution Pathways',
    pathwayDisclaimer: 'SolveMe connects challenges with partners. These pathways describe potential feasibility avenues, not unilateral promises of government execution.',
    projectStatusSection: 'Lifecycle Status & Project Timeline',

    // Solver Dashboard
    solverHeading: 'Problems Matching Your Expertise',
    solverSubheading: 'Academic institutions, startups, and NGOs can review open challenges and express adoption interest.',
    recommendedSection: 'Recommended for Your Department',
    underReviewSection: 'Under Review by Solvers',
    adoptedSection: 'Active Adopted Projects',
    expressInterestBtn: 'Express Interest to Solve',
    viewProblemBtn: 'View Full Assessment',

    // Express Interest Modal
    expressModalTitle: 'Submit Problem Adoption Proposal',
    orgLabel: 'Your Organization / Lab',
    approachLabel: 'Proposed Technical Approach',
    approachPlaceholder: 'Outline your methodology, student capstone involvement, or pilot prototype plan...',
    submitInterestBtn: 'Submit Formal Interest',

    // Project Workspace
    projectWorkspaceTitle: 'Project Workspace',
    projectLifecycle: 'Project Lifecycle',
    milestonesTitle: 'Milestones & Field Interventions',
    postMilestoneBtn: '+ Post Milestone Update',
    impactSection: 'Measured Civic Impact',

    // Impact
    impactHeading: 'Civic Impact & Measured Outcomes',
    impactSubheading: 'Tracing problems from community reporting to tangible field interventions.',
    peopleAffected: 'People Directly Benefited',
    areaCovered: 'Area Covered',
    interventionStatus: 'Intervention Status',
    measuredOutcome: 'Measured Outcome',

    // Admin
    adminHeading: 'Operational Triage & Review Console',
    adminSubheading: 'Audit incoming community reports, verify evidence, dispatch to departments, and monitor adoption.',
    tabNeedsReview: 'Needs Review',
    tabValidated: 'Validated Feed',
    tabAdopted: 'Adopted Pipeline',
    colProblem: 'Problem Statement',
    colSector: 'Sector',
    colPriority: 'Priority',
    colStatus: 'Status',
    colActions: 'Triage Actions',
    actionVerify: 'Verify Evidence',
    actionDispatch: 'Dispatch to Solver'
  },

  hi: {
    brandName: 'SolveMe',
    tagline: 'समस्याओं से समाधान तक।',
    // Nav
    home: 'होम',
    explore: 'समस्याएं खोजें',
    reportProblem: 'समस्या दर्ज करें',
    myProblems: 'मेरी शिकायतें',
    projects: 'परियोजनाएं',
    impact: 'प्रभाव एवं परिणाम',
    solverWorkspace: 'समाधानकर्ता कार्यक्षेत्र',
    adminOperations: 'प्रशासनिक समीक्षा',
    signOut: 'लॉग आउट',
    switchToHindi: 'हिन्दी में बदलें',
    switchToEnglish: 'Switch to English',

    // Home
    communityProblems: 'सामुदायिक समस्याएं',
    homeSubtitle: 'स्थानीय समस्याओं को दर्ज करें और विश्वविद्यालयों, गैर-सरकारी संगठनों तथा तकनीकी भागीदारों के माध्यम से ठोस समाधान पाएं।',
    exploreProblems: 'समस्याएं देखें',
    myReportsOverview: 'मेरी प्रस्तुतियां',
    confirmedOverview: 'सत्यापित समर्थन',
    activeProjectsOverview: 'सक्रिय समाधान परियोजनाएं',
    problemsNearYou: 'आपके निकटतम समस्याएं',
    allSectors: 'सभी क्षेत्र',
    sortBy: 'क्रमबद्ध करें',
    sortRecent: 'नवीनतम',
    sortPriority: 'उच्चतम प्राथमिकता',
    sortConfirmations: 'सर्वाधिक समर्थित',
    confirmationsCount: 'नागरिक समर्थन',
    priorityScoreLabel: 'प्राथमिकता अंक',

    // Reporting Wizard
    wizardTitle: 'नागरिक समस्या दर्ज करें',
    wizardSubtitle: '4-चरणीय व्यवस्थित प्रक्रिया का पालन करें। स्पष्ट और तथ्यात्मक जानकारी दें।',
    step1Problem: '1. समस्या का विवरण',
    step2Evidence: '2. प्रमाण एवं फोटो',
    step3Location: '3. स्थान एवं जीपीएस',
    step4Review: '4. समीक्षा एवं जमा करें',
    problemTitleLabel: 'समस्या का शीर्षक',
    problemTitlePlaceholder: 'उदा. विश्वविद्यालय छात्रावास मार्ग पर भारी जलभराव',
    descriptionLabel: 'विस्तृत विवरण',
    descriptionPlaceholder: 'समस्या कब से है? कितने लोग प्रभावित हैं? क्या तात्कालिक खतरे हैं? विस्तार से लिखें...',
    severityLabel: 'गंभीरता का स्तर',
    severityLow: 'कम (सामान्य असुविधा)',
    severityMed: 'मध्यम (कार्यात्मक व्यवधान)',
    severityHigh: 'अत्यधिक (सुरक्षा अथवा स्वास्थ्य जोखिम)',
    urgencyLabel: 'तात्कालिकता',
    urgencyLow: 'सामान्य चक्र में हल हो सकता है',
    urgencyMed: 'कुछ हफ्तों के भीतर ध्यान देने योग्य',
    urgencyHigh: 'अति आवश्यक तात्कालिक कदम',
    evidenceLabel: 'फोटो अथवा वीडियो प्रमाण',
    evidenceHelp: 'दृश्य प्रमाण प्राथमिकता अंक बढ़ाता है और तकनीकी टीमों को प्रारंभिक सर्वेक्षण में सहायता करता है।',
    clickToUpload: 'फोटो या वीडियो फाइल अपलोड करें',
    locationLabel: 'सटीक स्थान अथवा प्रमुख स्थल',
    locationPlaceholder: 'उदा. हॉस्टल गेट रोड, कांके ब्लॉक, रांची',
    useGps: 'वर्तमान जीपीएस स्थान लें',
    pickOnMap: 'मानचित्र पर चुनें',
    summaryBeforeSubmit: 'जमा करने से पूर्व समीक्षा',
    submitButton: 'समस्या दर्ज करें',
    nextButton: 'आगे बढ़ें',
    backButton: 'पिछला चरण',

    // AI Organization
    aiProcessingTitle: 'एआई-सहायित व्यवस्थापन प्रक्रिया',
    aiStep1: 'समस्या का विवरण प्राप्त हुआ',
    aiStep2: 'सामग्री का अर्थगत विश्लेषण पूर्ण',
    aiStep3: 'उचित श्रेणी एवं कार्यक्षेत्र निर्धारित',
    aiStep4: 'संबंधित इंजीनियरिंग विशेषज्ञता की पहचान',
    aiStep5: 'समान पूर्व शिकायतों की जांच पूर्ण',
    aiDisclaimer: 'एआई द्वारा सुझाए गए सुझाव। मानवीय एवं सामुदायिक सत्यापन अनिवार्य है।',
    aiCategoryLabel: 'सुझाई गई श्रेणी',
    aiSummaryLabel: 'संक्षिप्त सारांश',
    aiTagsLabel: 'पहचाने गए मुख्य शब्द',
    aiDomainsLabel: 'संभावित तकनीकी क्षेत्र',

    // Problem Detail & Case Dossier
    alsoFaceIssue: 'मुझे भी यह समस्या है (समर्थन दें)',
    alreadyEndorsed: 'आपने इसका समर्थन किया है',
    supportProblem: 'इस समस्या का समर्थन करें',
    supported: 'समर्थित',
    peopleSupport: 'नागरिक इस समस्या का समर्थन करते हैं',
    addSuggestion: 'सुझाव दें',
    viewProblem: 'समस्या केस देखें',
    theProblemTitle: 'समस्या का विवरण',
    affectedAreaLabel: 'प्रभावित क्षेत्र',
    peopleAffectedLabel: 'प्रभावित नागरिक',
    reportedLabel: 'दर्ज किया गया',
    categoryLabel: 'श्रेणी',
    severityLabel: 'गंभीरता',
    communitySignalTitle: 'सामुदायिक सत्यापन एवं संकेत',
    suggestionsSection: 'रचनात्मक नागरिक सुझाव',
    suggestionsHelp: 'समस्या को समझने, तकनीकी जांच अथवा समाधान दिशा में रचनात्मक इनपुट।',
    noSuggestionsYet: 'अभी कोई सुझाव दर्ज नहीं किया गया है। समस्या निदान या समाधान हेतु पहला सुझाव दें।',
    suggestionPlaceholder: 'रचनात्मक जानकारी, तकनीकी अवलोकन अथवा संभावित समाधान विचार लिखें...',
    contributorRoleLabel: 'आपकी भूमिका / दृष्टिकोण',
    submitSuggestionBtn: 'रचनात्मक सुझाव दर्ज करें',
    citizenEvidenceLabel: 'नागरिक द्वारा प्रस्तुत फील्ड प्रमाण',
    aiAssistedOrgTitle: 'एआई-सहायक व्यवस्थापन',
    aiAssistedDisclaimer: 'एआई-सहायक व्यवस्थापन प्रारंभिक वर्गीकरण एवं डोमेन मिलान प्रदान करता है। यह किसी मानवीय अथवा विभागीय सत्यापन का विकल्प नहीं है।',
    adminVerifiedLabel: 'संस्थागत समीक्षा स्थिति',
    solverPathwayFlowTitle: 'संभावित समाधान मार्ग',
    fieldUpdatesTitle: 'फील्ड अपडेट एवं केस प्रगति',
    nextActionTitle: 'केस कार्रवाई',
    mobileSupportBtn: '↑ समर्थन',
    mobileSuggestBtn: '💡 सुझाव',
    endorseHelp: 'सामुदायिक सत्यापन दिखावटी "लाइक" के स्थान पर वास्तविक नागरिक आवश्यकता को प्रमाणित करता है।',
    evidenceSection: 'फील्ड प्रमाण संचिका',
    descriptionSection: 'समस्या का विवरण',
    prioritySection: 'नियम-आधारित प्राथमिकता अंक',
    priorityExplainer: 'सामुदायिक संकेत, साक्ष्य, गंभीरता, तात्कालिकता और विशेषज्ञ समीक्षा के आधार पर पारदर्शी गणना। कोई अस्पष्ट या मनमाना निर्णय नहीं।',
    solverPathwayTitle: 'संभावित प्रासंगिक तकनीकी विशेषज्ञता',
    solverPathwaySubtitle: 'ये इंजीनियरिंग, कृषि अथवा चिकित्सा विषय इस समस्या के समाधान में सहायक हो सकते हैं।',
    potentialPathways: 'संभावित समाधान मार्ग',
    pathwayDisclaimer: 'SolveMe समस्याओं को भागीदारों से जोड़ता है। ये मार्ग तकनीकी संभावना को दर्शाते हैं, किसी एकतरफा वादे को नहीं।',
    projectStatusSection: 'परियोजना की स्थिति एवं समयरेखा',

    // Solver Dashboard
    solverHeading: 'आपकी विशेषज्ञता से मेल खाती समस्याएं',
    solverSubheading: 'विश्वविद्यालय, स्टार्टअप्स और एनजीओ खुली समस्याओं की समीक्षा कर समाधान हेतु रुचि दर्ज कर सकते हैं।',
    recommendedSection: 'आपके विभाग के लिए अनुशंसित',
    underReviewSection: 'समीक्षाधीन समस्याएं',
    adoptedSection: 'सक्रिय अंगीकृत परियोजनाएं',
    expressInterestBtn: 'समाधान हेतु रुचि दर्ज करें',
    viewProblemBtn: 'पूर्ण विवरण देखें',

    // Express Interest Modal
    expressModalTitle: 'समस्या समाधान हेतु प्रस्ताव जमा करें',
    orgLabel: 'आपकी संस्था / प्रयोगशाला',
    approachLabel: 'प्रस्तावित तकनीकी दृष्टिकोण',
    approachPlaceholder: 'पद्धति, छात्र भागीदारी, अथवा प्रोटोटाइप योजना की रूपरेखा लिखें...',
    submitInterestBtn: 'प्रस्ताव जमा करें',

    // Project Workspace
    projectWorkspaceTitle: 'परियोजना कार्यक्षेत्र',
    projectLifecycle: 'परियोजना जीवनचक्र',
    milestonesTitle: 'मील के पत्थर एवं क्षेत्र प्रगति',
    postMilestoneBtn: '+ प्रगति अपडेट दर्ज करें',
    impactSection: 'मापा गया नागरिक प्रभाव',

    // Impact
    impactHeading: 'नागरिक प्रभाव एवं ठोस परिणाम',
    impactSubheading: 'नागरिकों की रिपोर्ट से लेकर जमीनी समाधान तक की पूरी यात्रा।',
    peopleAffected: 'प्रत्यक्ष लाभान्वित लोग',
    areaCovered: 'कवर किया गया क्षेत्र',
    interventionStatus: 'हस्तक्षेप की स्थिति',
    measuredOutcome: 'मापा गया परिणाम',

    // Admin
    adminHeading: 'प्रशासनिक समीक्षा एवं नियंत्रण पटल',
    adminSubheading: 'नागरिक शिकायतों की जांच करें, प्रमाण सत्यापित करें, विभागों को सौंपें और समाधान की निगरानी करें।',
    tabNeedsReview: 'समीक्षा आवश्यक',
    tabValidated: 'सत्यापित समस्याएं',
    tabAdopted: 'स्वीकृत परियोजनाएं',
    colProblem: 'समस्या',
    colSector: 'क्षेत्र',
    colPriority: 'प्राथमिकता',
    colStatus: 'स्थिति',
    colActions: 'कार्यवाही',
    actionVerify: 'प्रमाण सत्यापित करें',
    actionDispatch: 'विभाग को भेजें'
  }
}

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('solveme_lang') || 'en')

  useEffect(() => {
    localStorage.setItem('solveme_lang', lang)
  }, [lang])

  const toggleLanguage = () => {
    setLang(prev => (prev === 'en' ? 'hi' : 'en'))
  }

  const t = (key) => {
    return UI_TRANSLATIONS[lang]?.[key] || UI_TRANSLATIONS['en']?.[key] || key
  }

  // Helper to translate problem dynamic data
  const getLocalized = (field) => {
    if (!field) return ''
    if (typeof field === 'object') {
      return field[lang] || field.en || Object.values(field)[0] || ''
    }
    return field
  }

  const getCategoryName = (catId) => {
    const c = CATEGORIES.find(item => item.id === catId)
    if (!c) return catId
    return lang === 'hi' ? c.hi : c.en
  }

  const getStatusName = (statusId) => {
    const s = STATUS_LIST.find(item => item.id === statusId || item.en.toLowerCase() === (statusId || '').toLowerCase())
    if (!s) return statusId
    return lang === 'hi' ? s.hi : s.en
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t, getLocalized, getCategoryName, getStatusName }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
