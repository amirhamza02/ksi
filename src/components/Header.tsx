import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LogOut, User, BookOpen } from 'lucide-react'

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActivePath = (path: string) => {
    return location.pathname === path
  }

  const getNavLinkClass = (path: string) => {
    const baseClass = "px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
    const activeClass = "text-[#00c0ef] bg-cyan-50 border border-cyan-200"
    const inactiveClass = "text-gray-500 hover:text-[#00c0ef] hover:bg-cyan-50"
    
    return `${baseClass} ${isActivePath(path) ? activeClass : inactiveClass}`
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
                    src="./king-sejong.jpg" 
                    alt="KSI Logo" 
                    className="w-full h-full object-contain rounded"
                  />
                </div>
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100 p-1">
                  <img 
                    src="./iub-logo.png" 
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
              <nav className="hidden md:flex space-x-2">
                <Link to="/dashboard" className={getNavLinkClass('/dashboard')}>
                  Dashboard
                </Link>
                <Link to="/profile" className={getNavLinkClass('/profile')}>
                  <User className="w-4 h-4 mr-1" />
                  Profile
                </Link>
                <Link to="/courses" className={getNavLinkClass('/courses')}>
                  <BookOpen className="w-4 h-4 mr-1" />
                  Courses
                </Link>
              </nav>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-500 hover:text-[#00c0ef] px-3 py-2 rounded-md text-sm font-medium transition-colors"
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