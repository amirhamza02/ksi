import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import { fetchExecutivePrograms } from '../store/slices/executiveProgramSlice'
import { paymentApi } from '../services/paymentApi'
import Header from '../components/Header'
import { User, BookOpen, Clock, Users, Calendar, Star, CreditCard, CheckCircle } from 'lucide-react'

const DashboardPage: React.FC = () => {
  const { user } = useAuth()
  const dispatch = useAppDispatch()
  const [paymentLoading, setPaymentLoading] = useState<number | null>(null)
  const [paymentSuccess, setPaymentSuccess] = useState<number[]>([])
  
  const { 
    programs, 
    loading: programLoading, 
    error: programError 
  } = useAppSelector((state) => state.executiveProgram)

  useEffect(() => {
    dispatch(fetchExecutivePrograms())
  }, [dispatch])

  const handlePayment = async (programId: number) => {
    if (!user?.id) return;
    
    setPaymentLoading(programId)
    try {
      const response = await paymentApi.payRegistrationBill({
        programId: programId,
        userId: user.id
      })
      
      if (response.success) {
        setPaymentSuccess(prev => [...prev, programId])
        // Optionally refresh programs to get updated registration status
        dispatch(fetchExecutivePrograms())
      }
    } catch (error) {
      console.error('Payment failed:', error)
      // Handle error - could show a toast notification
    } finally {
      setPaymentLoading(null)
    }
  }

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
      value: 'Available',
      icon: BookOpen,
      color: 'text-[#00c0ef]',
      bgColor: 'bg-cyan-50',
      action: 'View Courses',
      link: '/courses'
    }
  ]

  const getLevelColor = (programName: string) => {
    if (programName.includes('Level 1')) {
      return 'bg-green-100 text-green-800'
    } else if (programName.includes('Level 2')) {
      return 'bg-yellow-100 text-yellow-800'
    } else if (programName.includes('Level 3')) {
      return 'bg-red-100 text-red-800'
    }
    return 'bg-gray-100 text-gray-800'
  }

  const getLevel = (programName: string) => {
    if (programName.includes('Level 1')) return 'Beginner'
    if (programName.includes('Level 2')) return 'Intermediate'
    if (programName.includes('Level 3')) return 'Advanced'
    return 'Unknown'
  }

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
        <div className="grid md:grid-cols-2 gap-6 mb-8">
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
                      <h3 className="font-medium text-gray-800">Browse Courses</h3>
                      <p className="text-sm text-gray-600">View available Korean courses</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Admission Progress</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>50%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#00c0ef] h-2 rounded-full transition-all duration-300" style={{ width: '50%' }}></div>
                  </div>
                </div>
              </div>
              <div className="space-y-3 mt-6">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Account Created</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Complete Profile</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Browse Courses</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Registered Courses Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-[#00c0ef]" />
              Registered Courses
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
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {programs && programs?.length > 0 ? (
              programs.filter(program => program.isRunning).map((program) => (
                <div key={program.id} className="border border-gray-100 rounded-lg p-4 hover:border-[#00c0ef] hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(program.programsName)}`}>
                      {getLevel(program.programsName)}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">4.8</span>
                    </div>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mb-2">{program.programsName}</h4>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <Clock className="w-3 h-3" />
                      <span>{program.totalHours} hours total</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <Users className="w-3 h-3" />
                      <span>{program.classCount} classes</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span>Starts: {program.startDateDescription}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-gray-900">৳{program.regCost.toLocaleString()}</span>
                      <span className="text-gray-600 text-sm ml-1">BDT</span>
                      {program.discoutPC > 0 && (
                        <div className="text-xs text-green-600">
                          {program.discoutPC}% discount available
                        </div>
                      )}
                    </div>
                    
                    {program.isSuccessfullyEPRegistration ? (
                      <div className="flex items-center space-x-1 text-green-600 text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        <span>Paid</span>
                      </div>
                    ) : paymentSuccess.includes(program.id) ? (
                      <div className="flex items-center space-x-1 text-green-600 text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        <span>Paid</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handlePayment(program.id)}
                        disabled={paymentLoading === program.id}
                        className="flex items-center space-x-1 text-[#00c0ef] hover:text-cyan-600 text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        <CreditCard className="w-3 h-3" />
                        <span>{paymentLoading === program.id ? 'Processing...' : 'Pay Now'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              !programLoading && (
                <div className="col-span-full text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No courses available at the moment</p>
                </div>
              )
            )}
          </div>
          
          {programs?.length > 0 && (
            <div className="mt-6 text-center">
              <Link
                to="/courses"
                className="inline-flex items-center text-[#00c0ef] hover:text-cyan-600 font-medium transition-colors"
              >
                View All Available Courses →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage