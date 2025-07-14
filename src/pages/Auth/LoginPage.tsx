import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Eye, EyeOff } from 'lucide-react'

const LoginPage: React.FC = () => {
  const location = useLocation()
  const registrationMessage = location.state?.message
  const prefilledEmail = location.state?.email || ''
  
  const [formData, setFormData] = useState({
    userName: prefilledEmail,
    password: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.userName.trim()) {
      newErrors.userName = 'User Id must not be empty.'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const success = await login(formData.userName, formData.password)
      if (success) {
        navigate('/dashboard')
      } else {
        setErrors({ general: 'Invalid email or password' })
      }
    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl card-shadow p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100 p-2">
                <img 
                   src="./king-sejong.jpg" 
                  alt="KSI Logo" 
                  className="w-full h-full object-contain rounded"
                />
              </div>
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100 p-2">
                <img 
                  src="./iub-logo.png" 
                  alt="IUB Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-primary">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {registrationMessage && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
                {registrationMessage}
              </div>
            )}

            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {errors.general}
              </div>
            )}

            <div>
              <label className="form-label">User Id</label>
              <input
                type="email"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className={`input-field ${errors.userName ? 'border-red-500' : ''}`}
                placeholder="Enter your email"
              />
              {errors.userName && <p className="error-text">{errors.userName}</p>}
            </div>

            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input-field pr-12 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="error-text">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:text-purple-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage