import { createContext, useContext, useState, useEffect } from 'react'
import { DEMO_USERS } from '../data/mockData'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('solveme_user')
      return saved ? JSON.parse(saved) : DEMO_USERS.citizen
    } catch {
      return DEMO_USERS.citizen
    }
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('solveme_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('solveme_user')
    }
  }, [user])

  const login = async (phone, otp, role = 'citizen') => {
    // Standard 6-digit mock OTP
    if (!otp || otp.length !== 6) {
      throw new Error('Please enter a 6-digit OTP.')
    }
    const targetUser = DEMO_USERS[role] || {
      id: Date.now(),
      name: role === 'solver' ? 'Prof. Faculty' : (role === 'admin' ? 'Monitoring Officer' : 'Citizen'),
      phone,
      role
    }
    setUser(targetUser)
    return targetUser
  }

  const switchRole = (newRole) => {
    if (DEMO_USERS[newRole]) {
      setUser(DEMO_USERS[newRole])
    }
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
