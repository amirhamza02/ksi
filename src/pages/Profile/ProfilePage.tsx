import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Header from '../../components/Header'
import { Save, User, GraduationCap, Plus, Trash2 } from 'lucide-react'

interface EducationEntry {
  id: string
  degreeName: string
  board: string
  institution: string
  academicYear: string
  result: string
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('basic')
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const [basicInfo, setBasicInfo] = useState({
    fullName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
    email: user?.email || '',
    isIubian: '',
    studentId: '',
    department: '',
    dateOfBirth: '',
    nationality: '',
    contactNumber: user?.phone || '',
    emergencyContact: '',
    fatherFirstName: '',
    fatherLastName: '',
    motherFirstName: '',
    motherLastName: '',
    presentAddress: '',
    permanentAddress: ''
  })

  const [educationEntries, setEducationEntries] = useState<EducationEntry[]>([
    { id: '1', degreeName: 'SSC', board: '', institution: '', academicYear: '', result: '' },
    { id: '2', degreeName: 'HSC', board: '', institution: '', academicYear: '', result: '' },
    { id: '3', degreeName: 'Honours', board: '', institution: '', academicYear: '', result: '' },
    { id: '4', degreeName: 'Masters', board: '', institution: '', academicYear: '', result: '' }
  ])

  const [occupationInfo, setOccupationInfo] = useState({
    profession: '',
    institute: '',
    department: ''
  })

  // Load saved data on component mount
  useEffect(() => {
    if (user?.id) {
      const savedProfile = localStorage.getItem(`ksi_profile_${user.id}`)
      if (savedProfile) {
        try {
          const profileData = JSON.parse(savedProfile)
          if (profileData.basic) setBasicInfo(profileData.basic)
          if (profileData.education) setEducationEntries(profileData.education)
          if (profileData.occupation) setOccupationInfo(profileData.occupation)
        } catch (error) {
          console.error('Error loading saved profile:', error)
        }
      }
    }
  }, [user?.id])

  const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setBasicInfo(prev => ({ ...prev, [name]: value }))
  }

  const handleEducationChange = (id: string, field: string, value: string) => {
    setEducationEntries(prev => 
      prev.map(entry => 
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    )
  }

  const handleOccupationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setOccupationInfo(prev => ({ ...prev, [name]: value }))
  }

  const addEducationEntry = () => {
    const newEntry: EducationEntry = {
      id: Date.now().toString(),
      degreeName: '',
      board: '',
      institution: '',
      academicYear: '',
      result: ''
    }
    setEducationEntries(prev => [...prev, newEntry])
  }

  const removeEducationEntry = (id: string) => {
    if (educationEntries.length > 1) {
      setEducationEntries(prev => prev.filter(entry => entry.id !== id))
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Save to localStorage
      const profileData = {
        basic: basicInfo,
        education: educationEntries,
        occupation: occupationInfo
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
    { id: 'basic', label: 'Basic Information', icon: User },
    { id: 'education', label: 'Education', icon: GraduationCap }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Complete Your Profile</h1>
          <p className="text-gray-600 mt-2">
            Please fill out all sections to complete your admission process. IUB students are eligible for special discounts!
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
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-[#00c0ef] text-[#00c0ef]'
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
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={basicInfo.fullName}
                      onChange={handleBasicChange}
                      className="input-field"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={basicInfo.email}
                      onChange={handleBasicChange}
                      className="input-field"
                      placeholder="Enter email"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="form-label">Are you an IUBian?</label>
                    <select
                      name="isIubian"
                      value={basicInfo.isIubian}
                      onChange={handleBasicChange}
                      className="input-field"
                    >
                      <option value="">Select option</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  {basicInfo.isIubian === 'yes' && (
                    <>
                      <div>
                        <label className="form-label">Student ID <span className="text-sm text-gray-500">(Applicable for only IUB student)</span></label>
                        <input
                          type="text"
                          name="studentId"
                          value={basicInfo.studentId}
                          onChange={handleBasicChange}
                          className="input-field"
                          placeholder="Enter student ID"
                        />
                      </div>

                      <div>
                        <label className="form-label">Department <span className="text-sm text-gray-500">(Applicable for only IUB student)</span></label>
                        <input
                          type="text"
                          name="department"
                          value={basicInfo.department}
                          onChange={handleBasicChange}
                          className="input-field"
                          placeholder="Enter department"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="form-label">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={basicInfo.dateOfBirth}
                      onChange={handleBasicChange}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="form-label">Nationality</label>
                    <input
                      type="text"
                      name="nationality"
                      value={basicInfo.nationality}
                      onChange={handleBasicChange}
                      className="input-field"
                      placeholder="Enter nationality"
                    />
                  </div>

                  <div>
                    <label className="form-label">Contact Number</label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={basicInfo.contactNumber}
                      onChange={handleBasicChange}
                      className="input-field"
                      placeholder="Enter contact number"
                    />
                  </div>

                  <div>
                    <label className="form-label">Emergency Contact</label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={basicInfo.emergencyContact}
                      onChange={handleBasicChange}
                      className="input-field"
                      placeholder="Enter emergency contact"
                    />
                  </div>

                </div>

                {/* Father's Name - Same Line */}
                <div>
                  <label className="form-label">Father's Name</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="fatherFirstName"
                      value={basicInfo.fatherFirstName}
                      onChange={handleBasicChange}
                      className="input-field"
                      placeholder="First name"
                    />
                    <input
                      type="text"
                      name="fatherLastName"
                      value={basicInfo.fatherLastName}
                      onChange={handleBasicChange}
                      className="input-field"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                {/* Mother's Name - Same Line */}
                <div>
                  <label className="form-label">Mother's Name</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="motherFirstName"
                      value={basicInfo.motherFirstName}
                      onChange={handleBasicChange}
                      className="input-field"
                      placeholder="First name"
                    />
                    <input
                      type="text"
                      name="motherLastName"
                      value={basicInfo.motherLastName}
                      onChange={handleBasicChange}
                      className="input-field"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="form-label">Present Address</label>
                    <textarea
                      name="presentAddress"
                      value={basicInfo.presentAddress}
                      onChange={handleBasicChange}
                      className="input-field"
                      rows={3}
                      placeholder="Enter present address"
                    />
                  </div>

                  <div>
                    <label className="form-label">Permanent Address</label>
                    <textarea
                      name="permanentAddress"
                      value={basicInfo.permanentAddress}
                      onChange={handleBasicChange}
                      className="input-field"
                      rows={3}
                      placeholder="Enter permanent address"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'education' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                  <p className="text-sm text-gray-600">Please begin with the latest academic qualification</p>
                </div>

                <div className="space-y-6">
                  {educationEntries.map((entry, index) => (
                    <div key={entry.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-800">Education Entry {index + 1}</h4>
                        {educationEntries.length > 1 && (
                          <button
                            onClick={() => removeEducationEntry(entry.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Remove entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="form-label">Name of Degree</label>
                          <select
                            value={entry.degreeName}
                            onChange={(e) => handleEducationChange(entry.id, 'degreeName', e.target.value)}
                            className="input-field"
                          >
                            <option value="">Select degree</option>
                            <option value="SSC">SSC</option>
                            <option value="HSC">HSC</option>
                            <option value="Honours">Honours</option>
                            <option value="Masters">Masters</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="form-label">Board</label>
                          <input
                            type="text"
                            value={entry.board}
                            onChange={(e) => handleEducationChange(entry.id, 'board', e.target.value)}
                            className="input-field"
                            placeholder="Enter board/university"
                          />
                        </div>

                        <div>
                          <label className="form-label">Institution</label>
                          <input
                            type="text"
                            value={entry.institution}
                            onChange={(e) => handleEducationChange(entry.id, 'institution', e.target.value)}
                            className="input-field"
                            placeholder="Enter institution name"
                          />
                        </div>

                        <div>
                          <label className="form-label">Academic Year</label>
                          <input
                            type="text"
                            value={entry.academicYear}
                            onChange={(e) => handleEducationChange(entry.id, 'academicYear', e.target.value)}
                            className="input-field"
                            placeholder="e.g., 2020-2024"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="form-label">Result</label>
                          <input
                            type="text"
                            value={entry.result}
                            onChange={(e) => handleEducationChange(entry.id, 'result', e.target.value)}
                            className="input-field"
                            placeholder="Enter CGPA/GPA/Grade"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={addEducationEntry}
                    className="flex items-center space-x-2 text-[#00c0ef] hover:text-cyan-600 font-medium transition-colors border border-[#00c0ef] hover:border-cyan-600 px-4 py-2 rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Another Education Entry</span>
                  </button>
                </div>

                {/* Occupation Section */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Occupation <span className="text-sm font-normal text-gray-500">(Optional)</span></h4>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="form-label">Profession</label>
                      <input
                        type="text"
                        name="profession"
                        value={occupationInfo.profession}
                        onChange={handleOccupationChange}
                        className="input-field"
                        placeholder="Enter profession"
                      />
                    </div>

                    <div>
                      <label className="form-label">Institute</label>
                      <input
                        type="text"
                        name="institute"
                        value={occupationInfo.institute}
                        onChange={handleOccupationChange}
                        className="input-field"
                        placeholder="Enter institute/company"
                      />
                    </div>

                    <div>
                      <label className="form-label">Department</label>
                      <input
                        type="text"
                        name="department"
                        value={occupationInfo.department}
                        onChange={handleOccupationChange}
                        className="input-field"
                        placeholder="Enter department"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
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