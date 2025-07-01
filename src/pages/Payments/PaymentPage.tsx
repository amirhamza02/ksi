import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Header from '../../components/Header'
import { CreditCard, Shield, CheckCircle, AlertCircle } from 'lucide-react'

const PaymentPage: React.FC = () => {
  const { user } = useAuth()
  const [selectedCourse, setSelectedCourse] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    bkashNumber: '',
    nagadNumber: ''
  })

  const courses = [
    {
      id: 'beginner-1',
      title: 'Korean Language Beginner Level 1',
      fee: 15000
    },
    {
      id: 'beginner-2',
      title: 'Korean Language Beginner Level 2',
      fee: 16000
    },
    {
      id: 'intermediate-1',
      title: 'Korean Language Intermediate Level 1',
      fee: 20000
    },
    {
      id: 'advanced-1',
      title: 'Korean Language Advanced Level 1',
      fee: 25000
    }
  ]

  useEffect(() => {
    const courseId = localStorage.getItem('selected_course')
    if (courseId) {
      const course = courses.find(c => c.id === courseId)
      setSelectedCourse(course)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPaymentData(prev => ({ ...prev, [name]: value }))
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Save payment record
      const paymentRecord = {
        courseId: selectedCourse?.id,
        courseName: selectedCourse?.title,
        amount: selectedCourse?.fee,
        paymentMethod,
        userId: user?.id,
        userEmail: user?.email,
        paymentDate: new Date().toISOString(),
        transactionId: `TXN${Date.now()}`,
        status: 'completed'
      }
      
      localStorage.setItem(`payment_${user?.id}`, JSON.stringify(paymentRecord))
      setPaymentSuccess(true)
      
    } catch (error) {
      console.error('Payment failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-lg card-shadow p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-primary mb-4">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">
              Your payment has been processed successfully. A confirmation email has been sent to {user?.email}.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Payment Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Course:</span>
                  <span className="font-medium">{selectedCourse?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-medium">৳{selectedCourse?.fee.toLocaleString()} BDT</span>
                </div>
                <div className="flex justify-between">
                  <span>Transaction ID:</span>
                  <span className="font-medium">TXN{Date.now()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                You will receive course details and schedule information via email within 24 hours.
              </p>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="btn-primary"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!selectedCourse) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-lg card-shadow p-8 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No Course Selected</h1>
            <p className="text-gray-600 mb-6">
              Please select a course first before proceeding to payment.
            </p>
            <button
              onClick={() => window.location.href = '/courses'}
              className="btn-primary"
            >
              Select Course
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Course Payment</h1>
          <p className="text-gray-600 mt-2">
            Complete your payment to secure your spot in the course.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg card-shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Information</h2>
              
              {/* Payment Method Selection */}
              <div className="mb-6">
                <label className="form-label">Payment Method</label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 border rounded-lg text-center transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-primary bg-primary-light text-primary'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <CreditCard className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">Credit Card</span>
                  </button>
                  
                  <button
                    onClick={() => setPaymentMethod('bkash')}
                    className={`p-4 border rounded-lg text-center transition-colors ${
                      paymentMethod === 'bkash'
                        ? 'border-primary bg-primary-light text-primary'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="w-6 h-6 bg-pink-500 rounded mx-auto mb-2"></div>
                    <span className="text-sm font-medium">bKash</span>
                  </button>
                  
                  <button
                    onClick={() => setPaymentMethod('nagad')}
                    className={`p-4 border rounded-lg text-center transition-colors ${
                      paymentMethod === 'nagad'
                        ? 'border-primary bg-primary-light text-primary'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="w-6 h-6 bg-orange-500 rounded mx-auto mb-2"></div>
                    <span className="text-sm font-medium">Nagad</span>
                  </button>
                </div>
              </div>

              {/* Payment Form Fields */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Cardholder Name</label>
                    <input
                      type="text"
                      name="cardName"
                      value={paymentData.cardName}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter cardholder name"
                    />
                  </div>
                  
                  <div>
                    <label className="form-label">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={paymentData.cardNumber}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Expiry Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={paymentData.expiryDate}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={paymentData.cvv}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="123"
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'bkash' && (
                <div>
                  <label className="form-label">bKash Number</label>
                  <input
                    type="text"
                    name="bkashNumber"
                    value={paymentData.bkashNumber}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter your bKash number"
                  />
                </div>
              )}

              {paymentMethod === 'nagad' && (
                <div>
                  <label className="form-label">Nagad Number</label>
                  <input
                    type="text"
                    name="nagadNumber"
                    value={paymentData.nagadNumber}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter your Nagad number"
                  />
                </div>
              )}

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Secure Payment</span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  Your payment information is encrypted and secure. We do not store your payment details.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg card-shadow p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">{selectedCourse.title}</h4>
                  <p className="text-sm text-gray-600">Korean Language Course</p>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <span>Course Fee</span>
                    <span>৳{selectedCourse.fee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Processing Fee</span>
                    <span>৳0</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>৳{selectedCourse.fee.toLocaleString()} BDT</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full mt-6 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing Payment...' : `Pay ৳${selectedCourse.fee.toLocaleString()}`}
              </button>
              
              <p className="text-xs text-gray-500 mt-4 text-center">
                By clicking "Pay", you agree to our terms and conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage