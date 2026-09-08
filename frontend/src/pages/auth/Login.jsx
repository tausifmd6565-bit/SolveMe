import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Phone, KeyRound, AlertCircle } from 'lucide-react'

export default function Login() {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSendOtp = (e) => {
    e.preventDefault()
    if (phone.length < 10) {
      setError('Please enter a valid 10-digit phone number')
      return
    }
    setOtpSent(true)
    setError('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(phone, otp)
      if (user.role === 'validator' || user.role === 'admin') {
        navigate('/validator')
      } else if (user.role === 'solver') {
        navigate('/solver')
      } else {
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* Header Bar */}
      <div className="bg-blue-800 text-white py-2 text-center text-xs">
        Government of India · Smart India Hackathon 2026
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl mb-4">
              <span className="text-white font-bold text-2xl">SI</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">SIH Innovation Hub</h1>
            <p className="text-sm text-gray-500 mt-1">Crowdsourcing Societal Solutions for India</p>
          </div>
          
          {/* Login Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Welcome Back</h2>
            <p className="text-sm text-gray-500 mb-6">Login with your phone number</p>
            
            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg mb-4">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}
            
            <form onSubmit={otpSent ? handleLogin : handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter 10-digit phone number"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    disabled={otpSent}
                  />
                </div>
              </div>
              
              {otpSent && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter 6-digit OTP"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      maxLength={6}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">For prototype: enter any 6-digit code</p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 text-sm"
              >
                {loading ? 'Logging in...' : otpSent ? 'Verify & Login' : 'Send OTP'}
              </button>
            </form>
            
            {otpSent && (
              <button
                onClick={() => { setOtpSent(false); setOtp('') }}
                className="w-full text-sm text-gray-500 hover:text-blue-600 mt-3"
              >
                Change phone number
              </button>
            )}
          </div>
          
          <p className="text-center text-sm text-gray-500 mt-4">
            New user?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Register here
            </Link>
          </p>
          
          {/* Demo accounts info */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <p className="text-xs font-medium text-blue-700 mb-2">Demo Accounts (any 6-digit OTP):</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-blue-600">
              <div>
                <p className="font-medium">Citizen</p>
                <p className="text-blue-500">9876543210</p>
              </div>
              <div>
                <p className="font-medium">Validator</p>
                <p className="text-blue-500">9876543220</p>
              </div>
              <div>
                <p className="font-medium">Solver</p>
                <p className="text-blue-500">9876543230</p>
              </div>
              <div>
                <p className="font-medium">Admin</p>
                <p className="text-blue-500">9876543200</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
