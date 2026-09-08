import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { Globe, ArrowRight } from 'lucide-react'

export default function Login() {
  const { login } = useAuth()
  const { lang, toggleLanguage } = useLanguage()
  const navigate = useNavigate()

  const [role, setRole] = useState('citizen')
  const [phone, setPhone] = useState('9876543210')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSendOtp = (e) => {
    e.preventDefault()
    if (phone.length < 10) {
      setError(lang === 'hi' ? 'कृपया 10 अंकों का मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit phone number')
      return
    }
    setError('')
    setOtpSent(true)
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(phone, otp || '246810', role)
      if (role === 'solver') navigate('/solver')
      else if (role === 'admin') navigate('/admin')
      else navigate('/')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Left: Branding and Product Statement */}
      <div className="md:w-1/2 bg-slate-900 text-white p-8 md:p-16 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-sm text-white">
              SM
            </div>
            <span className="text-lg font-bold tracking-tight">SolveMe</span>
          </div>

          <div className="max-w-md space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {lang === 'hi' ? 'समस्या दर्ज करें। समाधान की ओर कदम बढ़ाएं।' : 'Report a problem.\nHelp move it toward a solution.'}
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              {lang === 'hi'
                ? 'SolveMe नागरिकों द्वारा उठाई गई स्थानीय समस्याओं को विश्वविद्यालयों, तकनीकी स्टार्टअप्स, गैर-सरकारी संगठनों और विशेषज्ञों से जोड़ता है।'
                : 'SolveMe helps communities report local challenges and creates a structured pathway for those problems to reach relevant universities, NGOs, startups, and potential solution partners.'}
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>SolveMe Platform · Civic Technology</span>
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 text-slate-400 hover:text-white"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'हिन्दी में देखें' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* Right: Authentication Form */}
      <div className="md:w-1/2 flex items-center justify-center p-6 md:p-16">
        <div className="w-full max-w-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {lang === 'hi' ? 'पोर्टल में प्रवेश करें' : 'Sign in to SolveMe'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {lang === 'hi' ? 'मोबाइल नंबर और ओटीपी द्वारा सुरक्षित लॉगिन' : 'Secure mobile 2FA verification'}
            </p>
          </div>

          {error && (
            <div className="p-3 rounded border border-red-200 bg-red-50 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Role selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
              {lang === 'hi' ? 'अपनी भूमिका चुनें' : 'Select Access Role'}
            </label>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {[
                { id: 'citizen', label: lang === 'hi' ? 'नागरिक' : 'Citizen' },
                { id: 'solver', label: lang === 'hi' ? 'संस्थान/समाधान' : 'Solver/Univ' },
                { id: 'admin', label: lang === 'hi' ? 'प्रशासक' : 'Admin' }
              ].map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setRole(r.id)
                    if (r.id === 'solver') setPhone('9876543230')
                    else if (r.id === 'admin') setPhone('9876543220')
                    else setPhone('9876543210')
                  }}
                  className={`py-2 px-2 rounded border text-center font-medium transition-colors ${
                    role === r.id
                      ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={otpSent ? handleVerify : handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'hi' ? 'मोबाइल नंबर' : 'Phone Number'}
              </label>
              <div className="flex rounded border border-slate-300 overflow-hidden focus-within:border-slate-900">
                <span className="px-3 py-2 bg-slate-100 border-r border-slate-200 text-xs font-semibold text-slate-600 flex items-center">
                  +91
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10-digit mobile number"
                  className="w-full px-3 py-2 text-sm outline-none bg-white font-medium"
                  required
                />
              </div>
            </div>

            {otpSent && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    {lang === 'hi' ? 'ओटीपी दर्ज करें' : 'Enter 6-Digit OTP'}
                  </label>
                  <span className="text-[10px] text-slate-400">Demo OTP: 246810</span>
                </div>
                <input
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="246810"
                  className="w-full px-3 py-2 border border-slate-300 rounded text-center text-lg font-mono font-bold tracking-widest outline-none focus:border-slate-900"
                  maxLength={6}
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              {loading ? (
                'Processing...'
              ) : otpSent ? (
                <>
                  <span>{lang === 'hi' ? 'सत्यापित करें और आगे बढ़ें' : 'Verify & Continue'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : (
                <span>{lang === 'hi' ? 'ओटीपी प्राप्त करें' : 'Send Verification OTP'}</span>
              )}
            </button>

            {otpSent && (
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full text-xs text-slate-500 hover:text-slate-900 font-medium text-center"
              >
                ← {lang === 'hi' ? 'नंबर बदलें' : 'Change Phone Number'}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
