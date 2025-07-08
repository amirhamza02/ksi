import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { fetchExecutivePrograms } from '../../store/slices/executiveProgramSlice'
import { executiveProgramApi } from '../../services/circularApi'
import { paymentApi, BillingHistoryItem } from '../../services/paymentApi'
import Header from '../../components/Header'
import { formatRegistrationPeriod } from '../../utils/semesterUtils'
import { Clock, Users, Calendar, Star, BookOpen, UserPlus, CheckCircle, Receipt, CreditCard } from 'lucide-react'

const CoursePage: React.FC = () => {
  const dispatch = useAppDispatch()
  const [registrationLoading, setRegistrationLoading] = useState<number | null>(null)
  const [paymentLoading, setPaymentLoading] = useState<number | null>(null)
  const [registrationSuccess, setRegistrationSuccess] = useState<{[key: number]: string}>({})
  const [registrationError, setRegistrationError] = useState<string | null>(null)
  const [billingHistory, setBillingHistory] = useState<BillingHistoryItem[]>([])
  const [billingLoading, setBillingLoading] = useState(false)
  const { user } = useAuth()
  
  const { 
    programs, 
    loading: programLoading, 
    error: programError 
  } = useAppSelector((state) => state.executiveProgram)

  useEffect(() => {
    dispatch(fetchExecutivePrograms())
    fetchBillingHistory()
  }, [dispatch])

  const fetchBillingHistory = async () => {
    setBillingLoading(true)
    try {
      const history = await paymentApi.getBillingHistory()
      setBillingHistory(history)
    } catch (error) {
      console.error('Error fetching billing history:', error)
    } finally {
      setBillingLoading(false)
    }
  }

  const handleRegistration = async (program: any) => {
    setRegistrationLoading(program.id)
    setRegistrationError(null)
    
    try {
      const registrationData = {
        regYear: program.regYear,
        regSem: program.regSem,
        exProgramRegDetails: [
          {
            excutiveProgramId: program.id,
            credithours: 0,
            regBill: program.regCost,
            exeProgramName: program.programsName
          }
        ]
      }

      const response = await executiveProgramApi.registerForProgram(registrationData)
      
      if (response.success) {
        setRegistrationSuccess(prev => ({
          ...prev,
          [program.id]: `Successfully registered for ${program.programsName}!`
        }))
        // Refresh the programs list and billing history
        dispatch(fetchExecutivePrograms())
        fetchBillingHistory()
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setRegistrationSuccess(prev => {
            const newState = { ...prev }
            delete newState[program.id]
            return newState
          })
        }, 5000)
      } else {
        setRegistrationError(response.message || 'Registration failed')
      }
    } catch (error: any) {
      console.error('Registration failed:', error)
      setRegistrationError(error.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setRegistrationLoading(null)
    }
  }

  const handlePayment = async (billingItem: BillingHistoryItem) => {
    if (!user?.id) return;
    
    setPaymentLoading(billingItem.id)
    try {
      const response = await paymentApi.payRegistrationBill({
        Amount: billingItem.regPayable.toString(),
        RegId: billingItem.id.toString(),
        ValueB: "28",
        ValueD: billingItem.id.toString(),
      })
      
      // Check if response has paymentUrl and redirect to payment gateway
      if (response.paymentUrl) {
        // Open payment URL in new tab and focus on it
        const paymentWindow = window.open(response.paymentUrl, '_blank')
        if (paymentWindow) {
          paymentWindow.focus()
        }
        
        // Refresh billing history after payment
        fetchBillingHistory()
      } else {
        console.error('No payment URL received from API')
      }
    } catch (error) {
      console.error('Payment failed:', error)
    } finally {
      setPaymentLoading(null)
    }
  }

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
    return 'Course'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Korean Language Courses</h1>
          <p className="text-gray-600 mt-2">
            Manage your course registrations and explore new learning opportunities.
          </p>
        </div>

        {/* My Registered Courses Section */}
        {billingHistory.length > 0 && (
          <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Receipt className="w-5 h-5 mr-2 text-[#00c0ef]" />
                My Registered Courses
              </h2>
              {billingLoading && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#00c0ef]"></div>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {billingHistory.map((billingItem) => (
                billingItem.exProgramRegDetails.map((detail) => (
                  <div key={`${billingItem.id}-${detail.id}`} className="border border-gray-100 rounded-lg p-4 bg-gradient-to-r from-cyan-50 to-blue-50 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(detail.exeProgramName)}`}>
                        {getLevel(detail.exeProgramName)}
                      </span>
                      <div className="flex items-center space-x-1">
                        {billingItem.isBillPaid ? (
                          <div className="flex items-center space-x-1 text-green-600 text-xs">
                            <CheckCircle className="w-3 h-3" />
                            <span>Paid</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 text-amber-600 text-xs">
                            <CreditCard className="w-3 h-3" />
                            <span>Pending</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{detail.exeProgramName.trim()}</h4>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Payment Amount:</span>
                        <span className="font-bold text-[#00c0ef]">৳{billingItem.regPayable.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Registration Period:</span>
                        <span className="text-sm font-medium text-gray-800">{formatRegistrationPeriod(billingItem.regYear, billingItem.regSem)}</span>
                      </div>
                      
                      {billingItem.regDiscount > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Discount Applied:</span>
                          <span className="text-xs text-green-600">৳{billingItem.regDiscount.toLocaleString()}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Registration ID:</span>
                        <span className="text-xs text-gray-700">#{billingItem.id}</span>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-gray-200">
                      {billingItem.isBillPaid ? (
                        <div className="text-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Payment Complete
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="text-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                              <CreditCard className="w-3 h-3 mr-1" />
                              Payment Pending
                            </span>
                          </div>
                          <button
                            onClick={() => handlePayment(billingItem)}
                            disabled={paymentLoading === billingItem.id}
                            className="flex items-center space-x-1 text-[#00c0ef] hover:text-cyan-600 text-sm font-medium transition-colors disabled:opacity-50 border border-[#00c0ef] hover:border-cyan-600 px-2 py-1 rounded"
                          >
                            <CreditCard className="w-3 h-3" />
                            <span>
                              {paymentLoading === billingItem.id ? 'Processing...' : 'Pay Now'}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ))}
            </div>
          </div>
        )}

        {/* Success Messages */}
        {Object.entries(registrationSuccess).map(([programId, message]) => (
          <div key={programId} className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            {message}
          </div>
        ))}

        {registrationError && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {registrationError}
          </div>
        )}

        {programLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-600">Loading courses...</span>
          </div>
        )}

        {programError && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {programError}
          </div>
        )}

        {/* Available Courses Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-[#00c0ef]" />
              Available Courses for Registration
            </h2>
          </div>
          
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
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-lg font-bold text-gray-900">৳{program.regCost.toLocaleString()}</span>
                      <span className="text-gray-600 text-sm ml-1">BDT</span>
                      {program.discoutPC > 0 && (
                        <div className="text-xs text-green-600">
                          {program.discoutPC}% discount available
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      {program.isSuccessfullyEPRegistration ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Registered
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Available
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Registration Button */}
                  <div className="mt-4">
                    {program.isSuccessfullyEPRegistration || registrationSuccess[program.id] ? (
                      <div className="flex items-center justify-center space-x-2 text-green-600 text-sm font-medium py-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Successfully Registered</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleRegistration(program)}
                        disabled={registrationLoading === program.id}
                        className="w-full flex items-center justify-center space-x-2 bg-[#00c0ef] hover:bg-cyan-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>
                          {registrationLoading === program.id ? 'Registering...' : 'Register Now'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              !programLoading && (
                <div className="col-span-full text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Courses Available</h3>
                  <p className="text-gray-500">Please check back later for new course offerings.</p>
                </div>
              )
            )}
          </div>

          {programs?.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <h3 className="text-xl font-bold text-primary mb-3">Ready to Start Learning Korean?</h3>
              <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
                Join our comprehensive Korean language programs and embark on an exciting journey to master one of the world's most fascinating languages.
              </p>
              <p className="text-sm text-gray-500">
                After registration, you can proceed to payment from your dashboard.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CoursePage