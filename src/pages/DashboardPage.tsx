import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import { fetchCirculars } from '../store/slices/circularSlice'
import { fetchExecutivePrograms, fetchProgramTypes } from '../store/slices/executiveProgramSlice'
import Header from '../components/Header'
import { User, BookOpen, CreditCard, CheckCircle, Clock, AlertCircle, FileText, GraduationCap } from 'lucide-react'

const DashboardPage: React.FC = () => {
  const { user } = useAuth()
  const dispatch = useAppDispatch()
  
  const { 
    circulars, 
    loading: circularLoading, 
    error: circularError 
  } = useAppSelector((state) => state.circular)
  
  const { 
    loading: programLoading, 
    error: programError 
  } = useAppSelector((state) => state.executiveProgram)

  useEffect(() => {
    dispatch(fetchExecutivePrograms())
  }, [dispatch])

  const dashboardStats = [
    {
      title: 'Profile Status',
      value: 'Incomplete',
      icon: User,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      action: 'Complete Profile',
      link: '/profile'
    },
    {
      title: 'Course Registration',
      value: 'Not Selected',
      icon: BookOpen,
      color: 'text-[#00c0ef]',
      bgColor: 'bg-cyan-50',
      action: 'Select Course',
      link: '/courses'
    },
    {
      title: 'Payment Status',
      value: 'Pending',
      icon: CreditCard,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      action: 'Make Payment',
      link: '/payment'
    }
  ]

  const recentActivities = [
    {
      title: 'Account Created',
      description: 'Welcome to KSI! Your account has been successfully created.',
      time: 'Just now',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Profile Incomplete',
      description: 'Please complete your profile to proceed with course registration.',
      time: '2 minutes ago',
      icon: AlertCircle,
      color: 'text-amber-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#00c0ef]">
            Welcome, {user?.firstName} {user?.lastName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Complete your admission process to start your Korean language journey.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className={`text-sm font-medium ${stat.color}`}>{stat.value}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{stat.title}</h3>
              <Link
                to={stat.link}
                className="inline-flex items-center text-[#00c0ef] hover:text-cyan-600 font-medium text-sm transition-colors"
              >
                {stat.action} →
              </Link>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link
                  to="/profile"
                  className="p-4 border border-gray-100 rounded-lg hover:border-[#00c0ef] hover:bg-cyan-50 transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <User className="w-8 h-8 text-gray-400 group-hover:text-[#00c0ef] transition-colors" />
                    <div>
                      <h3 className="font-medium text-gray-800">Complete Profile</h3>
                      <p className="text-sm text-gray-600">Add personal & academic info</p>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/courses"
                  className="p-4 border border-gray-100 rounded-lg hover:border-[#00c0ef] hover:bg-cyan-50 transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-8 h-8 text-gray-400 group-hover:text-[#00c0ef] transition-colors" />
                    <div>
                      <h3 className="font-medium text-gray-800">Select Course</h3>
                      <p className="text-sm text-gray-600">Choose your Korean course</p>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/payment"
                  className="p-4 border border-gray-100 rounded-lg hover:border-[#00c0ef] hover:bg-cyan-50 transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-8 h-8 text-gray-400 group-hover:text-[#00c0ef] transition-colors" />
                    <div>
                      <h3 className="font-medium text-gray-800">Make Payment</h3>
                      <p className="text-sm text-gray-600">Pay course fees securely</p>
                    </div>
                  </div>
                </Link>

                <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-8 h-8 text-gray-400" />
                    <div>
                      <h3 className="font-medium text-gray-500">Get Confirmation</h3>
                      <p className="text-sm text-gray-500">Receive email confirmation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <activity.icon className={`w-5 h-5 mt-1 ${activity.color}`} />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{activity.title}</h4>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* API Data Sections */}
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* Circulars Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-[#00c0ef]" />
                Latest Circulars
              </h2>
              {circularLoading && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#00c0ef]"></div>
              )}
            </div>
            
            {circularError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                {circularError}
              </div>
            )}
            
            <div className="space-y-4">
              {circulars.length > 0 ? (
                circulars.slice(0, 3).map((circular) => (
                  <div key={circular.id} className="border border-gray-100 rounded-lg p-4 hover:border-[#00c0ef] transition-colors">
                    <h4 className="font-medium text-gray-800 mb-1">{circular.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{circular.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(circular.publishDate).toLocaleDateString()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        circular.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {circular.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                !circularLoading && (
                  <p className="text-gray-500 text-center py-4">No circulars available</p>
                )
              )}
            </div>
          </div>

          {/* Executive Programs Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-[#00c0ef]" />
                Executive Programs
              </h2>
              {programLoading && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#00c0ef]"></div>
              )}
            </div>
            
            {programError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                {programError}
              </div>
            )}
          </div>
        </div>

        {/* Progress Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Admission Progress</h2>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>25%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[#00c0ef] h-2 rounded-full transition-all duration-300" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Complete your profile and select a course to continue with the admission process.
          </p>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage