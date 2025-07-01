import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Header from '../../components/Header'
import { Save, User, GraduationCap, MapPin } from 'lucide-react'

const ProfilePage: React.FC = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('personal')
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const [personalInfo, setPersonalInfo] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    fatherName: '',
    motherName: '',
    emergencyContact: '',
    emergencyPhone: ''
  })

  const [addressInfo, setAddressInfo] = useState({
    presentAddress: '',
    permanentAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Bangladesh'
  })

  const [educationInfo, setEducationInfo] = useState({
    highestDegree: '',
    institution: '',
    graduationYear: '',
    cgpa: '',
    previousKoreanStudy: '',
    koreanLevel: '',
    studyPurpose: ''
  })

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setPersonalInfo(prev => ({ ...prev, [name]: value }))
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setAddressInfo(prev => ({ ...prev, [name]: value }))
  }

  const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEducationInfo(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Save to localStorage
      const profileData = {
        personal: personalInfo,
        address: addressInfo,
        education: educationInfo
      }
      localStorage.setItem(`ksi_profile_${user?.id}`, JSON.stringify(profileData))
      
      setSuccessMessage('Profile updated successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'address', label: 'Address Info', icon: MapPin },
    { id: 'education', label: 'Education Info', icon: GraduationCap }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Complete Your Profile</h1>
          <p className="text-gray-600 mt-2">
            Please fill out all sections to complete your admission process.
          </p>
        </div>

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        <div className="bg-white rounded-lg card-shadow">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'personal' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={personalInfo.firstName}
                      onChange={handlePersonalChange}
                      className="input-field"
                      placeholder="Enter first name"
                    />
                  </div>

                  <div>
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={personalInfo.lastName}
                      onChange={handlePersonalChange}
                      className="input-field"
                      placeholder="Enter last name"
                    />
                  </div>

                  <div>
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={personalInfo.email}
                      onChange={handlePersonalChange}
                      className="input-field"
                      placeholder="Enter email"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={personalInfo.phone}
                      onChange={handlePersonalChange}
                      className="input-field"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="form-label">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={personalInfo.dateOfBirth}
                      onChange={handlePersonalChange}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="form-label">Gender</label>
                    <select
                      name="gender"
                      value={personalInfo.gender}
                      onChange={handlePersonalChange}
                      className="input-field"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Nationality</label>
                    <input
                      type="text"
                      name="nationality"
                      value={personalInfo.nationality}
                      onChange={handlePersonalChange}
                      className="input-field"
                      placeholder="Enter nationality"
                    />
                  </div>

                  <div>
                    <label className="form-label">Father's Name</label>
                    <input
                      type="text"
                      name="fatherName"
                      value={personalInfo.fatherName}
                      onChange={handlePersonalChange}
                      className="input-field"
                      placeholder="Enter father's name"
                    />
                  </div>

                  <div>
                    <label className="form-label">Mother's Name</label>
                    <input
                      type="text"
                      name="motherName"
                      value={personalInfo.motherName}
                      onChange={handlePersonalChange}
                      className="input-field"
                      placeholder="Enter mother's name"
                    />
                  </div>

                  <div>
                    <label className="form-label">Emergency Contact Name</label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={personalInfo.emergencyContact}
                      onChange={handlePersonalChange}
                      className="input-field"
                      placeholder="Enter emergency contact name"
                    />
                  </div>

                  <div>
                    <label className="form-label">Emergency Contact Phone</label>
                    <input
                      type="tel"
                      name="emergencyPhone"
                      value={personalInfo.emergencyPhone}
                      onChange={handlePersonalChange}
                      className="input-field"
                      placeholder="Enter emergency contact phone"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'address' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Address Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Present Address</label>
                    <input
                      type="text"
                      name="presentAddress"
                      value={addressInfo.presentAddress}
                      onChange={handleAddressChange}
                      className="input-field"
                      placeholder="Enter present address"
                    />
                  </div>

                  <div>
                    <label className="form-label">Permanent Address</label>
                    <input
                      type="text"
                      name="permanentAddress"
                      value={addressInfo.permanentAddress}
                      onChange={handleAddressChange}
                      className="input-field"
                      placeholder="Enter permanent address"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        name="city"
                        value={addressInfo.city}
                        onChange={handleAddressChange}
                        className="input-field"
                        placeholder="Enter city"
                      />
                    </div>

                    <div>
                      <label className="form-label">State/Division</label>
                      <input
                        type="text"
                        name="state"
                        value={addressInfo.state}
                        onChange={handleAddressChange}
                        className="input-field"
                        placeholder="Enter state/division"
                      />
                    </div>

                    <div>
                      <label className="form-label">Postal Code</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={addressInfo.postalCode}
                        onChange={handleAddressChange}
                        className="input-field"
                        placeholder="Enter postal code"
                      />
                    </div>

                    <div>
                      <label className="form-label">Country</label>
                      <select
                        name="country"
                        value={addressInfo.country}
                        onChange={handleAddressChange}
                        className="input-field"
                      >
                        <option value="Bangladesh">Bangladesh</option>
                        <option value="India">India</option>
                        <option value="Pakistan">Pakistan</option>
                        <option value="Nepal">Nepal</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'education' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Educational Information</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Highest Degree</label>
                    <select
                      name="highestDegree"
                      value={educationInfo.highestDegree}
                      onChange={handleEducationChange}
                      className="input-field"
                    >
                      <option value="">Select degree</option>
                      <option value="high-school">High School</option>
                      <option value="bachelor">Bachelor's Degree</option>
                      <option value="master">Master's Degree</option>
                      <option value="phd">PhD</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Institution</label>
                    <input
                      type="text"
                      name="institution"
                      value={educationInfo.institution}
                      onChange={handleEducationChange}
                      className="input-field"
                      placeholder="Enter institution name"
                    />
                  </div>

                  <div>
                    <label className="form-label">Graduation Year</label>
                    <input
                      type="number"
                      name="graduationYear"
                      value={educationInfo.graduationYear}
                      onChange={handleEducationChange}
                      className="input-field"
                      placeholder="Enter graduation year"
                      min="1990"
                      max="2030"
                    />
                  </div>

                  <div>
                    <label className="form-label">CGPA/GPA</label>
                    <input
                      type="text"
                      name="cgpa"
                      value={educationInfo.cgpa}
                      onChange={handleEducationChange}
                      className="input-field"
                      placeholder="Enter CGPA/GPA"
                    />
                  </div>

                  <div>
                    <label className="form-label">Previous Korean Study</label>
                    <select
                      name="previousKoreanStudy"
                      value={educationInfo.previousKoreanStudy}
                      onChange={handleEducationChange}
                      className="input-field"
                    >
                      <option value="">Select option</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Korean Level (if applicable)</label>
                    <select
                      name="koreanLevel"
                      value={educationInfo.koreanLevel}
                      onChange={handleEducationChange}
                      className="input-field"
                    >
                      <option value="">Select level</option>
                      <option value="beginner">Beginner</option>
                      <option value="elementary">Elementary</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label">Purpose of Study</label>
                  <textarea
                    name="studyPurpose"
                    value={educationInfo.studyPurpose}
                    onChange={handleEducationChange}
                    className="input-field"
                    rows={4}
                    placeholder="Explain why you want to learn Korean and your goals..."
                  />
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage