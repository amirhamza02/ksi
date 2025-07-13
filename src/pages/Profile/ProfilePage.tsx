import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { fetchProfile, updatePersonalInfo, updateEducationInfo, clearError } from '../../store/slices/profileSlice';

interface EducationEntry {
  id: string;
  nameOfDegree: string;
  boardOfEducation: string;
  institution: string;
  academicYear: string;
  result: string;
}

interface FormErrors {
  [key: string]: string;
}

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { profile, loading, error } = useAppSelector((state) => state.profile);

  const [activeTab, setActiveTab] = useState<'basic' | 'education'>('basic');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  // Basic Information State
  const [basicInfo, setBasicInfo] = useState({
    fullName: '',
    studentId: '',
    isIubian: '',
    departmentName: '',
    dateOfBirth: '',
    fatherFirstName: '',
    fatherLastName: '',
    motherFirstName: '',
    motherLastName: '',
    nationality: '',
    presentAddress: '',
    permanentAddress: '',
    email: '',
    phoneNumber: '',
    contactNumber: '',
    emergencyContactNumber: ''
  });

  // Education State
  const [educationEntries, setEducationEntries] = useState<EducationEntry[]>([
    { id: "1", nameOfDegree: "SSC", boardOfEducation: "", institution: "", academicYear: "", result: "" },
    { id: "2", nameOfDegree: "HSC", boardOfEducation: "", institution: "", academicYear: "", result: "" },
    { id: "3", nameOfDegree: "Honours", boardOfEducation: "", institution: "", academicYear: "", result: "" },
    { id: "4", nameOfDegree: "Masters", boardOfEducation: "", institution: "", academicYear: "", result: "" },
  ]);

  // Helper function to format date for input
  const formatDateForInput = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  // Load profile data on component mount
  useEffect(() => {
    if (!profile) {
      dispatch(fetchProfile());
    }
  }, [dispatch, profile]);

  // Populate form fields when profile data is loaded
  useEffect(() => {
    if (profile) {
      setBasicInfo({
        fullName: profile.fullName || '',
        studentId: profile.studentId || '',
        isIubian: profile.isIubian ? 'yes' : 'no',
        departmentName: profile.departmentName || '',
        dateOfBirth: formatDateForInput(profile.dateOfBirth),
        fatherFirstName: profile.fatherFirstName || '',
        fatherLastName: profile.fatherLastName || '',
        motherFirstName: profile.motherFirstName || '',
        motherLastName: profile.motherLastName || '',
        nationality: profile.nationality || '',
        presentAddress: profile.presentAddress || '',
        permanentAddress: profile.permanentAddress || '',
        email: profile.email || '',
        phoneNumber: profile.phoneNumber || '',
        contactNumber: profile.contactNumber || '',
        emergencyContactNumber: profile.emergencyContactNumber || ''
      });

      // Handle education data
      if (profile.academicInformations && profile.academicInformations.length > 0) {
        const transformedEducation = profile.academicInformations.map((item) => ({
          id: item.id?.toString() || Date.now().toString(),
          nameOfDegree: item.nameOfDegree || "",
          boardOfEducation: item.boardOfEducation || "",
          institution: item.institution || "",
          academicYear: item.academicYear?.toString() || "",
          result: item.result || "",
        }));
        
        const defaultEntries = [
          { id: "1", nameOfDegree: "SSC", boardOfEducation: "", institution: "", academicYear: "", result: "" },
          { id: "2", nameOfDegree: "HSC", boardOfEducation: "", institution: "", academicYear: "", result: "" },
          { id: "3", nameOfDegree: "Honours", boardOfEducation: "", institution: "", academicYear: "", result: "" },
          { id: "4", nameOfDegree: "Masters", boardOfEducation: "", institution: "", academicYear: "", result: "" },
        ];
        
        const mergedEntries = defaultEntries.map(defaultEntry => {
          const apiEntry = transformedEducation.find(item => 
            item.nameOfDegree.toLowerCase() === defaultEntry.nameOfDegree.toLowerCase()
          );
          return apiEntry || defaultEntry;
        });
        
        const additionalEntries = transformedEducation.filter(item => 
          !defaultEntries.some(defaultEntry => 
            defaultEntry.nameOfDegree.toLowerCase() === item.nameOfDegree.toLowerCase()
          )
        );
        
        setEducationEntries([...mergedEntries, ...additionalEntries]);
      }
    }
  }, [profile]);

  // Clear error when component unmounts or when switching tabs
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, activeTab]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleBasicInfoChange = (field: string, value: string) => {
    setBasicInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleEducationChange = (id: string, field: string, value: string) => {
    setEducationEntries(prev =>
      prev.map(entry =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
    
    const errorKey = `${id}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const addEducationEntry = () => {
    const newEntry: EducationEntry = {
      id: Date.now().toString(),
      nameOfDegree: '',
      boardOfEducation: '',
      institution: '',
      academicYear: '',
      result: ''
    };
    setEducationEntries(prev => [...prev, newEntry]);
  };

  const removeEducationEntry = (id: string) => {
    if (educationEntries.length > 1) {
      setEducationEntries(prev => prev.filter(entry => entry.id !== id));
    }
  };

  const validateBasicInfo = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!basicInfo.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!basicInfo.studentId.trim()) newErrors.studentId = 'Student ID is required';
    if (!basicInfo.isIubian) newErrors.isIubian = 'Please select if you are an IUBian';
    if (!basicInfo.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!basicInfo.fatherFirstName.trim()) newErrors.fatherFirstName = 'Father\'s first name is required';
    if (!basicInfo.fatherLastName.trim()) newErrors.fatherLastName = 'Father\'s last name is required';
    if (!basicInfo.motherFirstName.trim()) newErrors.motherFirstName = 'Mother\'s first name is required';
    if (!basicInfo.motherLastName.trim()) newErrors.motherLastName = 'Mother\'s last name is required';
    if (!basicInfo.nationality.trim()) newErrors.nationality = 'Nationality is required';
    if (!basicInfo.presentAddress.trim()) newErrors.presentAddress = 'Present address is required';
    if (!basicInfo.permanentAddress.trim()) newErrors.permanentAddress = 'Permanent address is required';
    if (!basicInfo.email.trim()) newErrors.email = 'Email is required';
    if (!basicInfo.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
    if (!basicInfo.emergencyContactNumber.trim()) newErrors.emergencyContactNumber = 'Emergency contact number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEducation = (): boolean => {
    const newErrors: FormErrors = {};
    
    educationEntries.forEach(entry => {
      if (!entry.nameOfDegree.trim()) {
        newErrors[`${entry.id}_nameOfDegree`] = 'Degree name is required';
      }
      if (!entry.boardOfEducation.trim()) {
        newErrors[`${entry.id}_boardOfEducation`] = 'Board/University is required';
      }
      if (!entry.institution.trim()) {
        newErrors[`${entry.id}_institution`] = 'Institution is required';
      }
      if (!entry.academicYear.trim()) {
        newErrors[`${entry.id}_academicYear`] = 'Academic year is required';
      }
      if (!entry.result.trim()) {
        newErrors[`${entry.id}_result`] = 'Result is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    setMessage(null);
    setErrors({});

    try {
      if (activeTab === 'basic') {
        if (!validateBasicInfo()) {
          setMessage({ type: 'error', text: 'Please fill in all required fields in Basic Information.' });
          return;
        }

        const personalInfoData = {
          ...basicInfo,
          isIubian: basicInfo.isIubian === 'yes'
        };

        await dispatch(updatePersonalInfo(personalInfoData)).unwrap();
        setMessage({ type: 'success', text: 'Basic Information updated successfully!' });
      } else if (activeTab === 'education') {
        if (!validateEducation()) {
          setMessage({ type: 'error', text: 'Please fill in all required fields in Education.' });
          return;
        }

        const educationData = educationEntries.map(entry => ({
          ...entry,
          academicYear: parseInt(entry.academicYear)
        }));

        await dispatch(updateEducationInfo(educationData)).unwrap();
        setMessage({ type: 'success', text: 'Education updated successfully!' });
      }
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'An error occurred while saving. Please try again.' 
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Profile Information</h1>
            <p className="text-blue-100 mt-1">Manage your personal and academic information</p>
          </div>

          {/* Messages */}
          {(message || error) && (
            <div className="px-6 py-4 border-b border-gray-200">
              {message && (
                <div className={`p-4 rounded-md ${
                  message.type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  {message.text}
                </div>
              )}
              {error && !message && (
                <div className="p-4 rounded-md bg-red-50 border border-red-200 text-red-800">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('basic')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'basic'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Basic Information
              </button>
              <button
                onClick={() => setActiveTab('education')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'education'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Education
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={basicInfo.fullName}
                      onChange={(e) => handleBasicInfoChange('fullName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.fullName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student ID *
                    </label>
                    <input
                      type="text"
                      value={basicInfo.studentId}
                      onChange={(e) => handleBasicInfoChange('studentId', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.studentId ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your student ID"
                    />
                    {errors.studentId && <p className="mt-1 text-sm text-red-600">{errors.studentId}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Are you an IUBian? *
                    </label>
                    <select
                      value={basicInfo.isIubian}
                      onChange={(e) => handleBasicInfoChange('isIubian', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.isIubian ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select an option</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                    {errors.isIubian && <p className="mt-1 text-sm text-red-600">{errors.isIubian}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department Name
                    </label>
                    <input
                      type="text"
                      value={basicInfo.departmentName}
                      onChange={(e) => handleBasicInfoChange('departmentName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your department"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      value={basicInfo.dateOfBirth}
                      onChange={(e) => handleBasicInfoChange('dateOfBirth', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Father's First Name *
                    </label>
                    <input
                      type="text"
                      value={basicInfo.fatherFirstName}
                      onChange={(e) => handleBasicInfoChange('fatherFirstName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.fatherFirstName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter father's first name"
                    />
                    {errors.fatherFirstName && <p className="mt-1 text-sm text-red-600">{errors.fatherFirstName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Father's Last Name *
                    </label>
                    <input
                      type="text"
                      value={basicInfo.fatherLastName}
                      onChange={(e) => handleBasicInfoChange('fatherLastName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.fatherLastName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter father's last name"
                    />
                    {errors.fatherLastName && <p className="mt-1 text-sm text-red-600">{errors.fatherLastName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mother's First Name *
                    </label>
                    <input
                      type="text"
                      value={basicInfo.motherFirstName}
                      onChange={(e) => handleBasicInfoChange('motherFirstName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.motherFirstName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter mother's first name"
                    />
                    {errors.motherFirstName && <p className="mt-1 text-sm text-red-600">{errors.motherFirstName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mother's Last Name *
                    </label>
                    <input
                      type="text"
                      value={basicInfo.motherLastName}
                      onChange={(e) => handleBasicInfoChange('motherLastName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.motherLastName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter mother's last name"
                    />
                    {errors.motherLastName && <p className="mt-1 text-sm text-red-600">{errors.motherLastName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nationality *
                    </label>
                    <input
                      type="text"
                      value={basicInfo.nationality}
                      onChange={(e) => handleBasicInfoChange('nationality', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.nationality ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your nationality"
                    />
                    {errors.nationality && <p className="mt-1 text-sm text-red-600">{errors.nationality}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Present Address *
                    </label>
                    <textarea
                      value={basicInfo.presentAddress}
                      onChange={(e) => handleBasicInfoChange('presentAddress', e.target.value)}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.presentAddress ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your present address"
                    />
                    {errors.presentAddress && <p className="mt-1 text-sm text-red-600">{errors.presentAddress}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Permanent Address *
                    </label>
                    <textarea
                      value={basicInfo.permanentAddress}
                      onChange={(e) => handleBasicInfoChange('permanentAddress', e.target.value)}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.permanentAddress ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your permanent address"
                    />
                    {errors.permanentAddress && <p className="mt-1 text-sm text-red-600">{errors.permanentAddress}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={basicInfo.email}
                      onChange={(e) => handleBasicInfoChange('email', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={basicInfo.phoneNumber}
                      onChange={(e) => handleBasicInfoChange('phoneNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      value={basicInfo.contactNumber}
                      onChange={(e) => handleBasicInfoChange('contactNumber', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.contactNumber ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your contact number"
                    />
                    {errors.contactNumber && <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emergency Contact Number *
                    </label>
                    <input
                      type="tel"
                      value={basicInfo.emergencyContactNumber}
                      onChange={(e) => handleBasicInfoChange('emergencyContactNumber', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.emergencyContactNumber ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter emergency contact number"
                    />
                    {errors.emergencyContactNumber && <p className="mt-1 text-sm text-red-600">{errors.emergencyContactNumber}</p>}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'education' && (
              <div className="space-y-6">
                {educationEntries.map((entry, index) => (
                  <div key={entry.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Education Entry {index + 1}
                      </h3>
                      {educationEntries.length > 1 && (
                        <button
                          onClick={() => removeEducationEntry(entry.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name of Degree *
                        </label>
                        <input
                          type="text"
                          value={entry.nameOfDegree}
                          onChange={(e) => handleEducationChange(entry.id, 'nameOfDegree', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors[`${entry.id}_nameOfDegree`] ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="e.g., SSC, HSC, Bachelor's"
                        />
                        {errors[`${entry.id}_nameOfDegree`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`${entry.id}_nameOfDegree`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Board/University *
                        </label>
                        <input
                          type="text"
                          value={entry.boardOfEducation}
                          onChange={(e) => handleEducationChange(entry.id, 'boardOfEducation', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors[`${entry.id}_boardOfEducation`] ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="e.g., Dhaka Board, University of Dhaka"
                        />
                        {errors[`${entry.id}_boardOfEducation`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`${entry.id}_boardOfEducation`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Institution *
                        </label>
                        <input
                          type="text"
                          value={entry.institution}
                          onChange={(e) => handleEducationChange(entry.id, 'institution', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors[`${entry.id}_institution`] ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="e.g., ABC High School, XYZ College"
                        />
                        {errors[`${entry.id}_institution`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`${entry.id}_institution`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Academic Year *
                        </label>
                        <input
                          type="text"
                          value={entry.academicYear}
                          onChange={(e) => handleEducationChange(entry.id, 'academicYear', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors[`${entry.id}_academicYear`] ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="e.g., 2020, 2018-2022"
                        />
                        {errors[`${entry.id}_academicYear`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`${entry.id}_academicYear`]}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Result *
                        </label>
                        <input
                          type="text"
                          value={entry.result}
                          onChange={(e) => handleEducationChange(entry.id, 'result', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors[`${entry.id}_result`] ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="e.g., A+, 3.75/4.00, First Class"
                        />
                        {errors[`${entry.id}_result`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`${entry.id}_result`]}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addEducationEntry}
                  className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors duration-200"
                >
                  + Add Another Education Entry
                </button>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;