import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { problemsAPI } from '../../services/api'
import LocationPickerModal from '../../components/LocationPickerModal'
import { MapPin, FileUp, AlertTriangle, CheckCircle, ArrowLeft, Map } from 'lucide-react'

export default function SubmitProblem() {
  const { user } = useAuth()
  const { t, lang } = useLanguage()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [createdProblem, setCreatedProblem] = useState(null)
  const [error, setError] = useState('')
  const [isMapOpen, setIsMapOpen] = useState(false)
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    severity: 'medium',
    category: '',
  })
  const [evidenceFile, setEvidenceFile] = useState(null)

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await problemsAPI.create(form, user.id)
      const problem = res.data
      
      // Evidence file is optional
      if (evidenceFile) {
        try {
          await problemsAPI.uploadEvidence(problem.id, evidenceFile)
        } catch (e) {
          console.warn('Optional upload skipped:', e)
        }
      }
      
      setCreatedProblem(problem)
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit problem')
    } finally {
      setLoading(false)
    }
  }

  if (success && createdProblem) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {lang === 'hi' ? 'समस्या सफलतापूर्वक दर्ज हो गई है!' : 'Problem Submitted Successfully!'}
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            {lang === 'hi' ? 'समस्या पहचान संख्या (ID): ' : 'Assigned ID: '}
            <strong className="text-blue-700">{createdProblem.problem_id}</strong>
            {' · '}
            {lang === 'hi' ? 'एआई द्वारा पहचानी गई श्रेणी: ' : 'AI Category: '}
            <strong className="text-indigo-700">{createdProblem.ai_category}</strong>
          </p>
          
          {createdProblem.ai_summary && (
            <div className="bg-blue-50/70 border border-blue-100 rounded-lg p-4 mb-5 text-left">
              <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-1">
                {t('aiAnalysis')} - {lang === 'hi' ? 'संक्षिप्त सारांश' : 'Summary'}
              </p>
              <p className="text-sm text-blue-900 leading-relaxed">{createdProblem.ai_summary}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {createdProblem.ai_tags?.map(tag => (
                  <span key={tag} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => navigate(`/problem/${createdProblem.id}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-colors"
            >
              {lang === 'hi' ? 'समस्या का पूरा विवरण देखें' : 'View Problem Details'}
            </button>
            <button
              onClick={() => {
                setSuccess(false)
                setForm({ title: '', description: '', location: '', severity: 'medium', category: '' })
                setEvidenceFile(null)
                setStep(1)
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              {lang === 'hi' ? 'एक और समस्या दर्ज करें' : 'Submit Another'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 font-medium">
        <ArrowLeft className="w-4 h-4" /> {lang === 'hi' ? 'वापस' : 'Back'}
      </button>
      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-white">
          <h1 className="text-xl font-bold text-gray-900">{t('reportProblem')}</h1>
          <p className="text-xs text-gray-500 mt-1">
            {lang === 'hi' 
              ? 'नागरिक पोर्टल - अपने गांव, वार्ड, या शहर की समस्या दर्ज करें। यह सीधे विश्वविद्यालयों और संबंधित विभागों से जुड़ेगी।'
              : 'Citizen Portal - Describe the societal challenge your community is facing to connect with solvers.'}
          </p>
        </div>
        
        {/* Progress Bar */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between max-w-sm">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  s === step ? 'bg-blue-600 text-white ring-2 ring-blue-200' : s < step ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {s < step ? '✓' : s}
                </div>
                <span className={`text-xs ${s === step ? 'text-blue-700 font-semibold' : 'text-gray-500'}`}>
                  {s === 1 ? t('stepDetails') : s === 2 ? t('stepLocation') : t('stepSubmit')}
                </span>
                {s < 3 && <div className="w-8 h-px bg-gray-300"></div>}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3.5 py-2.5 rounded-lg">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          {/* STEP 1: Details */}
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {t('problemTitle')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder={lang === 'hi' ? 'उदा. हॉस्टल के मुख्य मार्ग पर भारी जलभराव' : 'e.g., Severe waterlogging near college road'}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  {lang === 'hi' ? 'समस्या का संक्षेप में नाम दें' : 'Briefly summarize the primary issue'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {t('description')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder={lang === 'hi' ? 'समस्या कब से है? कितने लोग प्रभावित हैं? क्या नुकसान हो रहा है? (विस्तार से लिखें)' : 'Describe who is affected, how long it has been occurring, and the impact...'}
                  rows={5}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none leading-relaxed"
                  required
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!form.title.trim() || !form.description.trim()) {
                    setError(lang === 'hi' ? 'कृपया शीर्षक और विवरण दोनों भरें' : 'Please provide both title and description')
                    return
                  }
                  setError('')
                  setStep(2)
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-colors"
              >
                {lang === 'hi' ? 'अगला: स्थान एवं गंभीरता' : 'Next: Location & Severity'}
              </button>
            </>
          )}

          {/* STEP 2: Location & Severity */}
          {step === 2 && (
            <>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-semibold text-gray-700">
                    <MapPin className="w-4 h-4 inline mr-1 text-blue-600" />
                    {t('location')}
                  </label>
                  {/* Interactive Map Picker Button */}
                  <button
                    type="button"
                    onClick={() => setIsMapOpen(true)}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-md transition-colors"
                  >
                    <Map className="w-3.5 h-3.5" />
                    {t('pickOnMap')}
                  </button>
                </div>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder={lang === 'hi' ? 'उदा. कांके रोड, रांची, झारखण्ड' : 'e.g., Kanke Road, Ranchi, Jharkhand'}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {lang === 'hi' ? 'आप मानचित्र पर क्लिक करके भी पता चुन सकते हैं' : 'You can type the address or click "Pick on Map"'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('severity')}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'low', label: t('low'), desc: lang === 'hi' ? 'सामान्य' : 'Minor issue' },
                    { id: 'medium', label: t('medium'), desc: lang === 'hi' ? 'ध्यान योग्य' : 'Needs attention' },
                    { id: 'high', label: t('high'), desc: lang === 'hi' ? 'आपातकालीन' : 'Urgent / Risky' }
                  ].map(lvl => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => handleChange('severity', lvl.id)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        form.severity === lvl.id
                          ? lvl.id === 'high'
                            ? 'border-red-500 bg-red-50/70 text-red-800'
                            : lvl.id === 'medium'
                            ? 'border-amber-500 bg-amber-50/70 text-amber-900'
                            : 'border-emerald-500 bg-emerald-50/70 text-emerald-800'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'
                      }`}
                    >
                      <p className="font-bold text-xs uppercase tracking-wider">{lvl.label}</p>
                      <p className="text-[11px] mt-0.5 text-gray-500">{lvl.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                >
                  {lang === 'hi' ? 'पीछे' : 'Back'}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-colors"
                >
                  {lang === 'hi' ? 'अगला: समीक्षा एवं जमा' : 'Next: Review & Submit'}
                </button>
              </div>
            </>
          )}

          {/* STEP 3: Review & Submit */}
          {step === 3 && (
            <>
              {/* Optional photo / evidence upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  <FileUp className="w-4 h-4 inline mr-1 text-gray-500" />
                  {lang === 'hi' ? 'फोटो / प्रमाण (वैकल्पिक)' : 'Photo / Evidence (Optional)'}
                </label>
                <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50/50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEvidenceFile(e.target.files[0])}
                    className="hidden"
                    id="evidence-upload"
                  />
                  <label htmlFor="evidence-upload" className="cursor-pointer block">
                    <p className="text-xs text-blue-600 font-medium hover:underline">
                      {lang === 'hi' ? '+ फोटो चुनें (यदि उपलब्ध हो)' : '+ Choose an image file if available'}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {lang === 'hi' ? 'प्रमाण वैकल्पिक है - आप बिना फोटो के भी जमा कर सकते हैं' : 'Optional: can be submitted without files'}
                    </p>
                  </label>
                  {evidenceFile && (
                    <p className="text-xs text-emerald-600 font-semibold mt-2">✓ {evidenceFile.name}</p>
                  )}
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 space-y-1.5 text-xs text-gray-700">
                <p className="font-semibold text-blue-900 mb-1">
                  {lang === 'hi' ? 'विवरण समीक्षा:' : 'Submission Preview:'}
                </p>
                <p><strong className="text-gray-900">{lang === 'hi' ? 'शीर्षक: ' : 'Title: '}</strong>{form.title}</p>
                <p><strong className="text-gray-900">{lang === 'hi' ? 'स्थान: ' : 'Location: '}</strong>{form.location || (lang === 'hi' ? 'निर्दिष्ट नहीं' : 'Not specified')}</p>
                <p><strong className="text-gray-900">{lang === 'hi' ? 'गंभीरता: ' : 'Severity: '}</strong><span className="capitalize">{form.severity}</span></p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                >
                  {lang === 'hi' ? 'पीछे' : 'Back'}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-colors disabled:opacity-50"
                >
                  {loading 
                    ? (lang === 'hi' ? 'जमा हो रहा है...' : 'Submitting...') 
                    : t('submitButton')}
                </button>
              </div>
            </>
          )}
        </form>
      </div>

      {/* Interactive Map Modal */}
      <LocationPickerModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        initialLocation={form.location}
        onSelectLocation={(loc) => handleChange('location', loc)}
      />
    </div>
  )
}
