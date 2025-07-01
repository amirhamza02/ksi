import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LogOut, User, BookOpen, CreditCard } from 'lucide-react'

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100 p-1">
                  <img 
                    src="/iphone_3x_retina_ksj.jpg" 
                    alt="KSI Logo" 
                    className="w-full h-full object-contain rounded"
                  />
                </div>
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100 p-1">
                  <img 
                    src="/iub-logo_2024_color-c303e48f-7406-4c63-8e53-51fb791b2167.png" 
                    alt="IUB Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-primary">King Sejong Institute</h1>
                <p className="text-xs text-gray-500">Independent University, Bangladesh</p>
              </div>
            </Link>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.firstName}</span>
              <nav className="hidden md:flex space-x-4">
                <Link to="/dashboard" className="text-gray-500 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Dashboard
                </Link>
                <Link to="/profile" className="text-gray-500 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  Profile
                </Link>
                <Link to="/courses" className="text-gray-500 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                  <BookOpen className="w-4 h-4 mr-1" />
                  Courses
                </Link>
                <Link to="/payment" className="text-gray-500 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                  <CreditCard className="w-4 h-4 mr-1" />
                  Payment
                </Link>
              </nav>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-500 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-500 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Login
              </Link>
              <Link to="/register" className="btn-primary btn-sm">
                Apply Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header