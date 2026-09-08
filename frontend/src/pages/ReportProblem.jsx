import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { api } from '../services/api'
import LocationPicker from '../components/common/LocationPicker'
import { 
  Camera, Video, MapPin, Navigation, CheckCircle2, 
  ArrowRight, ArrowLeft, AlertCircle, FileText, Check 
} from 'lucide-react'

export default function ReportProblem() {
  const { user } = useAuth()
  const { lang, t } = useLanguage()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [isMapOpen, setIsMapOpen] = useState(false)
  const [phase, setPhase] = useState('form') // form | processing | done
  const [submittedProblem, setSubmittedProblem] = useState(null)
  const [aiSteps, setAiSteps] = useState([])

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium',
    urgency: 'medium',
    location: '',
    lat: 23.3441,
    lng: 85.3096,
    evidenceFile: null,
    evidencePreview: null
  })

  const [error, setError] = useState('')

  const handleInputChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setFormData(prev => ({
        ...prev,
        evidenceFile: file,
        evidencePreview: {
          name: file.name,
          type: file.type.startsWith('video') ? 'video' : 'photo',
          previewUrl
        }
      }))
    }
  }

  const handleGpsLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData(prev => ({
            ...prev,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            location: 'Kanke Road, Ranchi, Jharkhand (GPS coordinates captured)'
          }))
        },
        () => {
          setFormData(prev => ({
            ...prev,
            lat: 23.3441,
            lng: 85.3096,
            location: 'Ranchi Municipal Ward 8 (Approximate)'
          }))
        }
      )
    }
  }

  const handleSubmit = async () => {
    setPhase('processing')
    setAiSteps([])

    // Simulate structured AI intake workflow steps
    const stepsSequence = [
      t('aiStep1'),
      t('aiStep2'),
      t('aiStep3'),
      t('aiStep4'),
      t('aiStep5')
    ]

    for (let i = 0; i < stepsSequence.length; i++) {
      await new Promise(r => setTimeout(r, 380))
      setAiSteps(prev => [...prev, stepsSequence[i]])
    }

    try {
      const problem = await api.createProblem({
        title: formData.title,
        description: formData.description,
        severity: formData.severity,
        urgency: formData.urgency,
        location: formData.location || 'Ranchi, Jharkhand',
        lat: formData.lat,
        lng: formData.lng,
        evidence: formData.evidencePreview
      }, user)

      setSubmittedProblem(problem)
      setPhase('done')
    } catch (err) {
      setError(err.message || 'Submission failed')
      setPhase('form')
    }
  }

  // View: AI Processing Workflow (Strictly non-chatbot)
  if (phase === 'processing') {
    return (
      <div className="max-w-xl mx-auto panel-card p-8 text-center space-y-5 bg-white">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin mx-auto"></div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            {t('aiProcessingTitle')}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'hi'
              ? 'सिस्टम समस्या का विश्लेषण कर रहा है और उपयुक्त तकनीकी डोमेन मैप कर रहा है...'
              : 'Structuring problem metadata for university and institutional review...'}
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-left space-y-2 max-w-sm mx-auto">
          {aiSteps.map((stepText, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{stepText}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // View: Problem Organization Confirmation
  if (phase === 'done' && submittedProblem) {
    return (
      <div className="max-w-2xl mx-auto panel-card p-6 sm:p-8 space-y-6 bg-white">
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">
                {lang === 'hi' ? 'समस्या सफलतापूर्वक दर्ज हुई' : 'Your Problem Has Been Submitted.'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {lang === 'hi' ? 'समस्या पहचान संख्या:' : 'Problem ID:'}{' '}
              <strong className="font-mono text-slate-900">{submittedProblem.id}</strong> · Status: <span className="font-semibold text-slate-700">Submitted</span>
            </p>
          </div>
        </div>

        {/* Structured Problem Organization Section */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              {lang === 'hi' ? 'समस्या व्यवस्थापन' : 'Problem Organization'}
            </span>
            <span className="text-[10px] text-slate-500">
              {lang === 'hi' ? 'एआई-सहायित संरचना' : 'AI-Assisted Classification'}
            </span>
          </div>

          <div>
            <span className="text-slate-500 block text-[11px]">{t('aiCategoryLabel')}:</span>
            <span className="font-bold text-slate-900 text-sm">{submittedProblem.category}</span>
          </div>

          <div>
            <span className="text-slate-500 block text-[11px]">{t('aiSummaryLabel')}:</span>
            <p className="text-slate-700 font-medium leading-relaxed">{submittedProblem.ai?.summary?.en || submittedProblem.description?.en}</p>
          </div>

          <div>
            <span className="text-slate-500 block text-[11px] mb-1">{t('aiTagsLabel')}:</span>
            <div className="flex flex-wrap gap-1">
              {(submittedProblem.ai?.tags || ['civic-issue', 'community']).map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded border border-slate-200 bg-white text-slate-600 text-[11px] font-mono">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-slate-500 block text-[11px] mb-1">{t('aiDomainsLabel')}:</span>
            <div className="flex flex-wrap gap-1.5">
              {(submittedProblem.ai?.possible_domains || ['Civil Engineering']).map(dom => (
                <span key={dom} className="px-2 py-0.5 rounded border border-slate-300 bg-white text-slate-800 text-xs font-medium">
                  {dom}
                </span>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 border-t border-slate-200 pt-2 italic">
            {t('aiDisclaimer')}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={() => navigate(`/problem/${submittedProblem.id}`)}
            className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded text-center"
          >
            {lang === 'hi' ? 'समस्या का विस्तृत पृष्ठ देखें' : 'View Problem Record & Pathways'}
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-2.5 px-4 border border-slate-200 text-slate-700 text-xs font-semibold rounded hover:bg-slate-50 text-center"
          >
            {lang === 'hi' ? 'होम स्क्रीन पर जाएं' : 'Return to Community Feed'}
          </button>
        </div>
      </div>
    )
  }

  // View: 4-Section Structured Civic Reporting Workflow
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          {t('wizardTitle')}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {t('wizardSubtitle')}
        </p>
      </div>

      {/* 4 Section Step Header */}
      <div className="grid grid-cols-4 gap-1 border-b border-slate-200 pb-3 text-center">
        {[
          { id: 1, label: t('step1Problem') },
          { id: 2, label: t('step2Evidence') },
          { id: 3, label: t('step3Location') },
          { id: 4, label: t('step4Review') }
        ].map(s => (
          <button
            key={s.id}
            type="button"
            onClick={() => s.id < step && setStep(s.id)}
            disabled={s.id > step}
            className={`py-1 text-xs font-medium truncate ${
              s.id === step
                ? 'text-slate-900 font-bold border-b-2 border-slate-900 pb-2 -mb-3.5'
                : s.id < step
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-300'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-3 rounded border border-red-200 bg-red-50 text-red-700 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* SECTION 1: Problem Details */}
      {step === 1 && (
        <div className="panel-card p-6 space-y-4 bg-white">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            {t('step1Problem')}
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('problemTitleLabel')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={e => handleInputChange('title', e.target.value)}
              placeholder={t('problemTitlePlaceholder')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-xs outline-none focus:border-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('descriptionLabel')} <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={e => handleInputChange('description', e.target.value)}
              rows={5}
              placeholder={t('descriptionPlaceholder')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-xs outline-none focus:border-slate-900 leading-relaxed font-normal"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('severityLabel')}
              </label>
              <select
                value={formData.severity}
                onChange={e => handleInputChange('severity', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs outline-none focus:border-slate-900 bg-white"
              >
                <option value="low">{t('severityLow')}</option>
                <option value="medium">{t('severityMed')}</option>
                <option value="high">{t('severityHigh')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('urgencyLabel')}
              </label>
              <select
                value={formData.urgency}
                onChange={e => handleInputChange('urgency', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs outline-none focus:border-slate-900 bg-white"
              >
                <option value="low">{t('urgencyLow')}</option>
                <option value="medium">{t('urgencyMed')}</option>
                <option value="high">{t('urgencyHigh')}</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => {
                if (!formData.title.trim() || !formData.description.trim()) {
                  setError(lang === 'hi' ? 'कृपया शीर्षक और विवरण दर्ज करें' : 'Please provide both title and description')
                  return
                }
                setError('')
                setStep(2)
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center gap-1"
            >
              <span>{t('nextButton')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* SECTION 2: Evidence */}
      {step === 2 && (
        <div className="panel-card p-6 space-y-4 bg-white">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {t('step2Evidence')}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('evidenceHelp')}
            </p>
          </div>

          {/* Actual Preview State */}
          {formData.evidencePreview ? (
            <div className="space-y-3">
              <div className="rounded-lg border border-slate-200 overflow-hidden max-h-60 bg-slate-900 flex items-center justify-center">
                <img
                  src={formData.evidencePreview.previewUrl}
                  alt="Evidence Preview"
                  className="w-full h-full object-cover max-h-60"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="font-mono text-[11px] truncate">{formData.evidencePreview.name}</span>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, evidenceFile: null, evidencePreview: null }))}
                  className="text-red-600 font-semibold text-xs hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50 hover:bg-slate-100/50 transition-colors">
              <input
                type="file"
                id="evidence-input"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="evidence-input" className="cursor-pointer block">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-2 text-slate-600">
                  <Camera className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-800 block">
                  {t('clickToUpload')}
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Supports JPG, PNG, MP4 up to 25MB
                </span>
              </label>
            </div>
          )}

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 border border-slate-200 rounded text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('backButton')}</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center gap-1"
            >
              <span>{t('nextButton')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* SECTION 3: Location */}
      {step === 3 && (
        <div className="panel-card p-6 space-y-4 bg-white">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {t('step3Location')}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pinpoint the geographic location of the civic hazard for mapping and dispatch.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('locationLabel')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={e => handleInputChange('location', e.target.value)}
              placeholder={t('locationPlaceholder')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-xs outline-none focus:border-slate-900 font-medium"
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={handleGpsLocation}
              className="px-3 py-1.5 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5 text-blue-600" />
              <span>{t('useGps')}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsMapOpen(true)}
              className="px-3 py-1.5 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-slate-700" />
              <span>{t('pickOnMap')}</span>
            </button>
          </div>

          {formData.lat && (
            <p className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded">
              ✓ Coordinates indexed: {formData.lat.toFixed(4)} N, {formData.lng.toFixed(4)} E
            </p>
          )}

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2 border border-slate-200 rounded text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('backButton')}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (!formData.location.trim()) {
                  setError(lang === 'hi' ? 'कृपया स्थान दर्ज करें' : 'Please specify a location or landmark')
                  return
                }
                setError('')
                setStep(4)
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center gap-1"
            >
              <span>{t('nextButton')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* SECTION 4: Review Summary Before Submission */}
      {step === 4 && (
        <div className="panel-card p-6 space-y-4 bg-white">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {t('step4Review')}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verify your information before submitting into the community intake pipeline.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded p-4 text-xs space-y-2">
            <div>
              <span className="text-slate-500 block text-[11px]">Title:</span>
              <span className="font-bold text-slate-900">{formData.title}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Description:</span>
              <p className="text-slate-700 leading-relaxed">{formData.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200 text-[11px]">
              <div>
                <span className="text-slate-500">Location:</span>{' '}
                <span className="font-semibold text-slate-800">{formData.location}</span>
              </div>
              <div>
                <span className="text-slate-500">Severity / Urgency:</span>{' '}
                <span className="font-semibold text-slate-800 capitalize">{formData.severity} / {formData.urgency}</span>
              </div>
            </div>
            {formData.evidencePreview && (
              <div className="pt-1 text-[11px]">
                <span className="text-slate-500">Field Evidence:</span>{' '}
                <span className="font-semibold text-emerald-700">✓ 1 Document Attached ({formData.evidencePreview.name})</span>
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-4 py-2 border border-slate-200 rounded text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('backButton')}</span>
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-bold shadow-sm"
            >
              {t('submitButton')}
            </button>
          </div>
        </div>
      )}

      {/* Location Picker Modal */}
      <LocationPicker
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        initialLocation={formData.location}
        onSelect={(addr, lat, lng) => {
          setFormData(prev => ({ ...prev, location: addr, lat, lng }))
        }}
      />
    </div>
  )
}
