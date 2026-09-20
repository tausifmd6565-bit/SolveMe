import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { api } from '../services/api'
import ProblemStatus from '../components/common/ProblemStatus'
import PriorityBreakdown from '../components/common/PriorityBreakdown'
import EvidenceViewer from '../components/common/EvidenceViewer'
import AIInsight from '../components/common/AIInsight'
import SolverPathway from '../components/common/SolverPathway'
import ProjectTimeline from '../components/common/ProjectTimeline'
import SuggestionsSection from '../components/common/SuggestionsSection'
import ExpressInterestModal from './ExpressInterestModal'
import { 
  ArrowLeft, Users, MapPin, Calendar, Check, 
  ArrowUp, Lightbulb, Briefcase, AlertCircle, 
  ShieldCheck, Bot, FileText, CheckCircle2, ChevronRight
} from 'lucide-react'

export default function ProblemDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const { lang, t, getLocalized, getCategoryName } = useLanguage()

  const [problem, setProblem] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [supportFeedback, setSupportFeedback] = useState('')

  useEffect(() => {
    loadProblem()
  }, [id])

  const loadProblem = async () => {
    setLoading(true)
    try {
      const data = await api.getProblemById(id)
      setProblem(data)
      const sugs = api.getSuggestions(id)
      setSuggestions(sugs)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleSupport = async () => {
    if (problem.userConfirmed) return
    setConfirming(true)
    try {
      const updated = await api.confirmProblem(problem.id, user)
      setProblem(updated)
      setSupportFeedback(
        lang === 'hi' 
          ? 'आपका समर्थन दर्ज कर लिया गया है। आभार।' 
          : 'Your community endorsement has been recorded.'
      )
      setTimeout(() => setSupportFeedback(''), 4000)
    } catch (e) {
      console.error(e)
    } finally {
      setConfirming(false)
    }
  }

  const handleAddSuggestion = (text, role) => {
    const updated = api.addSuggestion(problem.id, text, user, role)
    setSuggestions(updated)
  }

  const scrollToSuggestions = () => {
    const el = document.getElementById('suggestions-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-slate-500 font-mono">
        {lang === 'hi' ? 'समस्या केस फाइल लोड हो रही है...' : 'Retrieving problem case dossier...'}
      </div>
    )
  }

  if (!problem) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-6 text-center space-y-3">
        <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
        <h3 className="text-base font-bold text-slate-900">
          {lang === 'hi' ? 'समस्या केस नहीं मिला' : 'Problem Case Dossier Not Found'}
        </h3>
        <p className="text-xs text-slate-500">
          {lang === 'hi' ? 'यह केस फ़ाइल हटाई जा चुकी है अथवा उपलब्ध नहीं है।' : 'The requested problem dossier does not exist or has been archived.'}
        </p>
        <Link to="/" className="inline-block text-xs text-blue-600 font-semibold hover:underline pt-2">
          ← {lang === 'hi' ? 'सामुदायिक समस्याओं पर वापस जाएं' : 'Return to Problem Directory'}
        </Link>
      </div>
    )
  }

  const title = getLocalized(problem.title)
  const description = getLocalized(problem.description)
  const categoryName = getCategoryName(problem.category)
  const reportedDate = problem.timeline?.[0]?.date || '18 days ago'
  const supportCount = problem.confirmations || 0

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-24 text-slate-900">
      {/* Top Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link
          to="/"
          className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'समस्याएं' : 'Problems'}</span>
        </Link>
        <span className="text-slate-300">/</span>
        <span className="font-mono text-slate-400">{problem.id}</span>
        <span className="text-slate-300">/</span>
        <span className="truncate max-w-xs text-slate-700 font-medium">{categoryName}</span>
      </nav>

      {/* ========================================================= */}
      {/* 1. PROBLEM CASE HEADER (Editorial Style)                  */}
      {/* ========================================================= */}
      <header className="space-y-4 pb-8 border-b border-slate-200">
        {/* Category & Status Line */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-mono text-xs font-bold text-slate-500 tracking-wider">
            CASE #{problem.id}
          </span>
          <span className="text-slate-300">•</span>
          <span className="px-2.5 py-0.5 rounded border border-slate-200 bg-slate-100 text-slate-800 text-xs font-semibold tracking-wide">
            {categoryName}
          </span>
          <ProblemStatus status={problem.status} />
        </div>

        {/* Editorial Headline */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
          {title}
        </h1>

        {/* Location & Metadata */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5 text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{problem.location}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{lang === 'hi' ? `दर्ज: ${reportedDate}` : `Reported ${reportedDate}`}</span>
          </span>
          <span className="flex items-center gap-1.5 font-mono text-slate-600">
            <span>Lat: {problem.lat?.toFixed(4) || '23.3441'}, Lng: {problem.lng?.toFixed(4) || '85.3096'}</span>
          </span>
        </div>

        {/* PRIMARY ACTIONS BLOCK */}
        <div className="pt-3 flex flex-wrap items-center gap-4">
          {/* Main Support Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSupport}
              disabled={confirming || problem.userConfirmed}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-xs ${
                problem.userConfirmed
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 cursor-default'
                  : 'bg-slate-950 hover:bg-slate-800 text-white active:scale-98'
              }`}
            >
              {problem.userConfirmed ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <ArrowUp className="w-4 h-4 text-amber-400" />
              )}
              <span>
                {problem.userConfirmed 
                  ? t('supported') 
                  : t('supportProblem')}
              </span>
            </button>

            <span className="text-xs text-slate-600 font-medium">
              <strong className="text-slate-950 font-bold">{supportCount}</strong> {t('peopleSupport')}
            </span>
          </div>

          <span className="text-slate-300 hidden sm:inline">|</span>

          {/* Add Suggestion Action */}
          <button
            onClick={scrollToSuggestions}
            className="px-4 py-2.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>+ {t('addSuggestion')}</span>
          </button>
        </div>

        {supportFeedback && (
          <p className="text-xs text-emerald-700 font-semibold pt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{supportFeedback}</span>
          </p>
        )}
      </header>

      {/* ========================================================= */}
      {/* 2. HERO EVIDENCE (Editorial Presentation)                */}
      {/* ========================================================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            {t('evidenceSection')}
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">PRIMARY FIELD RECORD</span>
        </div>
        <EvidenceViewer evidence={problem.evidence} location={problem.location} />
      </section>

      {/* ========================================================= */}
      {/* 3. THE PROBLEM (Full Editorial Summary & Metrics)        */}
      {/* ========================================================= */}
      <section className="space-y-6 pt-4 border-t border-slate-200">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
            {t('theProblemTitle')}
          </h3>
          <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal whitespace-pre-line">
            {description}
          </p>
        </div>

        {/* Structured Field Metrics (Minimalist layout, not cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 px-4 bg-slate-50/80 rounded-lg border border-slate-200 text-xs">
          <div className="space-y-0.5">
            <span className="text-slate-400 uppercase text-[10px] font-semibold tracking-wider block">
              {t('affectedAreaLabel')}
            </span>
            <p className="font-semibold text-slate-900 truncate">{problem.location}</p>
          </div>

          <div className="space-y-0.5">
            <span className="text-slate-400 uppercase text-[10px] font-semibold tracking-wider block">
              {t('peopleAffectedLabel')}
            </span>
            <p className="font-semibold text-slate-900">
              {problem.impact?.people_affected || `${supportCount * 30 + 150} citizens`}
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-slate-400 uppercase text-[10px] font-semibold tracking-wider block">
              {t('reportedLabel')}
            </span>
            <p className="font-semibold text-slate-900">{reportedDate}</p>
          </div>

          <div className="space-y-0.5">
            <span className="text-slate-400 uppercase text-[10px] font-semibold tracking-wider block">
              {t('severityLabel')}
            </span>
            <p className="font-semibold text-slate-900 capitalize">
              {problem.severity === 'high' ? (lang === 'hi' ? 'अत्यधिक (गंभीर)' : 'High (Urgent Hazard)') : problem.severity}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. COMMUNITY SUPPORT & VALIDATION SIGNAL                 */}
      {/* ========================================================= */}
      <section className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {t('communitySignalTitle')}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'hi' 
                ? 'नागरिक सत्यापन वास्तविक जमीनी आवश्यकता को प्रमाणित करता है।' 
                : 'Community validation proves genuine civic need, replacing superficial social likes.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-extrabold font-mono text-slate-950">
              {supportCount}
            </span>
            <span className="text-xs text-slate-500">
              {t('peopleSupport')}
            </span>
            <button
              onClick={handleSupport}
              disabled={confirming || problem.userConfirmed}
              className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${
                problem.userConfirmed
                  ? 'bg-slate-100 text-slate-500 border border-slate-200 cursor-default'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {problem.userConfirmed ? t('supported') : t('supportProblem')}
            </button>
          </div>
        </div>

        {/* Triage Threshold Indicator */}
        <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">
              {lang === 'hi' ? 'संस्थागत समीक्षा दहलीज (25 समर्थन)' : 'Institutional Triage Threshold (25 Endorsements)'}
            </span>
            <span className="font-mono font-bold text-slate-900">
              {Math.min(100, Math.round((supportCount / 25) * 100))}%
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                supportCount >= 25 ? 'bg-emerald-600' : 'bg-slate-800'
              }`}
              style={{ width: `${Math.min(100, (supportCount / 25) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">
            {supportCount >= 25
              ? (lang === 'hi' ? '✓ दहलीज पूर्ण: यह समस्या प्राथमिकता के आधार पर अकादमिक एवं विभागीय समीक्षा हेतु अग्रेषित है।' : '✓ Threshold met: Case qualified for priority review by university and municipal solver cells.')
              : (lang === 'hi' ? `प्राथमिक समीक्षा हेतु अभी ${25 - supportCount} और नागरिकों के सत्यापन की आवश्यकता है।` : `${25 - supportCount} more citizen endorsements needed to trigger institutional escalation.`)}
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. CONSTRUCTIVE SUGGESTIONS                              */}
      {/* ========================================================= */}
      <section className="pt-4 border-t border-slate-200">
        <SuggestionsSection
          problemId={problem.id}
          suggestions={suggestions}
          onAddSuggestion={handleAddSuggestion}
        />
      </section>

      {/* ========================================================= */}
      {/* 6. EVIDENCE & VERIFICATION LAYERS                         */}
      {/* ========================================================= */}
      <section className="space-y-3 pt-4 border-t border-slate-200">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
          {lang === 'hi' ? 'साक्ष्य एवं सत्यापन स्तर' : 'Evidence & Verification Layers'}
        </h3>
        <p className="text-xs text-slate-500">
          {lang === 'hi'
            ? 'SolveMe साक्ष्य स्रोतों को अलग-अलग स्तरों में स्पष्ट रूप से प्रदर्शित करता है।'
            : 'Clear transparency separating raw citizen submissions, AI organizational aids, and institutional audits.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Layer 1: Citizen Evidence */}
          <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <FileText className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{t('citizenEvidenceLabel')}</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {lang === 'hi'
                ? 'स्थानीय नागरिकों द्वारा मौके पर ली गई फोटो एवं जीपीएस स्थान।'
                : 'Geotagged image captured on-site with verified coordinates.'}
            </p>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
              ✓ Attached & EXIF Verified
            </span>
          </div>

          {/* Layer 2: AI Organization */}
          <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Bot className="w-4 h-4 text-violet-600 shrink-0" />
              <span>{t('aiAssistedOrgTitle')}</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {lang === 'hi'
                ? 'प्रारंभिक सिमेंटिक वर्गीकरण एवं इंजीनियरिंग डोमेन मैपिंग।'
                : 'Automated semantic categorization and discipline matching aid.'}
            </p>
            <span className="text-[10px] font-mono text-violet-700 bg-violet-50 px-2 py-0.5 rounded border border-violet-200 inline-block">
              Analytical Aid (Non-Binding)
            </span>
          </div>

          {/* Layer 3: Administrative Status */}
          <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t('adminVerifiedLabel')}</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {lang === 'hi'
                ? 'विभागीय नोडल अधिकारी अथवा अकादमिक सेल द्वारा स्थिति की पुष्टि।'
                : 'Status review by district monitoring cell or academic partner.'}
            </p>
            <span className="text-[10px] font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 inline-block">
              {problem.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. AI-ASSISTED ORGANIZATION                               */}
      {/* ========================================================= */}
      <section className="pt-4 border-t border-slate-200">
        <AIInsight ai={problem.ai} category={problem.category} />
      </section>

      {/* ========================================================= */}
      {/* 8. PRIORITY & COMMUNITY SIGNAL BREAKDOWN                  */}
      {/* ========================================================= */}
      <section className="pt-4 border-t border-slate-200">
        <PriorityBreakdown priority={problem.priority} />
      </section>

      {/* ========================================================= */}
      {/* 9. POTENTIAL SOLVER PATHWAY                               */}
      {/* ========================================================= */}
      <section className="pt-4 border-t border-slate-200">
        <SolverPathway solver={problem.solver} currentStatus={problem.status} />
      </section>

      {/* ========================================================= */}
      {/* 10. PROJECT STATUS & LIFECYCLE TIMELINE                   */}
      {/* ========================================================= */}
      <section className="pt-4 border-t border-slate-200">
        <ProjectTimeline currentStatus={problem.status} timeline={problem.timeline} />
      </section>

      {/* ========================================================= */}
      {/* 11. NEXT ACTION (Role-Contextual Bottom Bar)              */}
      {/* ========================================================= */}
      <section className="p-5 rounded-xl border border-slate-200 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            {t('nextActionTitle')}
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            {user?.role === 'solver'
              ? (lang === 'hi' ? 'आपकी संस्था इस समस्या के समाधान हेतु प्रस्ताव प्रस्तुत कर सकती है।' : 'Your academic lab or startup can adopt this problem for a technical capstone or pilot.')
              : user?.role === 'admin'
              ? (lang === 'hi' ? 'प्रशासनिक रूप से स्थिति अद्यतन करें अथवा संबंधित विभाग को अग्रेषित करें।' : 'Review case dossier and update municipal routing or validation status.')
              : (lang === 'hi' ? 'इस समस्या का समर्थन करें अथवा रचनात्मक समाधान विचार साझा करें।' : 'Support this civic issue or contribute constructive technical suggestions.')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Solver Role Action */}
          {(user?.role === 'solver' || user?.role === 'admin') && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-1.5 shadow-sm transition-colors"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>{t('expressInterestBtn')}</span>
            </button>
          )}

          {/* Citizen Actions */}
          <button
            onClick={handleSupport}
            disabled={confirming || problem.userConfirmed}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
              problem.userConfirmed
                ? 'bg-slate-800 text-slate-400 cursor-default'
                : 'bg-white hover:bg-slate-100 text-slate-900'
            }`}
          >
            <ArrowUp className="w-3.5 h-3.5 text-amber-500" />
            <span>{problem.userConfirmed ? t('supported') : t('supportProblem')}</span>
          </button>

          <button
            onClick={scrollToSuggestions}
            className="flex-1 sm:flex-none px-3.5 py-2.5 rounded text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('addSuggestion')}</span>
          </button>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 12. MOBILE STICKY ACTION BAR                              */}
      {/* ========================================================= */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 flex items-center gap-2 shadow-lg">
        <button
          onClick={handleSupport}
          disabled={confirming || problem.userConfirmed}
          className={`flex-1 py-2.5 px-3 rounded text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors ${
            problem.userConfirmed
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
              : 'bg-slate-950 text-white active:bg-slate-800'
          }`}
        >
          {problem.userConfirmed ? <Check className="w-3.5 h-3.5" /> : <ArrowUp className="w-3.5 h-3.5 text-amber-400" />}
          <span>{problem.userConfirmed ? t('supported') : t('mobileSupportBtn')} ({supportCount})</span>
        </button>

        <button
          onClick={scrollToSuggestions}
          className="flex-1 py-2.5 px-3 rounded text-xs font-semibold bg-white border border-slate-300 text-slate-800 flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>{t('mobileSuggestBtn')}</span>
        </button>
      </div>

      {/* Express Interest Modal */}
      <ExpressInterestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        problem={problem}
        onSuccess={() => loadProblem()}
      />
    </div>
  )
}
