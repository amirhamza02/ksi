import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import { Save, User, GraduationCap, Plus, Trash2 } from "lucide-react";
import { AcademicInfo, ProfileState } from "../../types/profile";
import { useAuth } from "../../contexts/AuthContext";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { 
  fetchProfile, 
  updatePersonalInfo, 
  updateEducationInfo, 
  clearError 
} from "../../store/slices/profileSlice";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { 
    personalInfo, 
    occupation,
    academicInformations, 
    loading: profileLoading, 
    error: profileError,
    isLoaded 
  } = useAppSelector((state) => state.profile);
  
  const [activeTab, setActiveTab] = useState("basic");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [basicInfo, setBasicInfo] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    isIubian: "",
    studentId: "",
    departmentName: "",
    dateOfBirth: "",
    nationality: "",
    contactNumber: user?.phone || "",
    emergencyContactNumber: "",
    fatherFirstName: "",
    fatherLastName: "",
    motherFirstName: "",
    motherLastName: "",
    presentAddress: "",
    permanentAddress: "",
  });

  const [educationEntries, setEducationEntries] = useState<AcademicInfo[]>([
    {
      id: "1",
      nameOfDegree: "SSC",
      boardOfEducation: "",
      institution: "",
      academicYear: '',
      result: "",
    },
    {
      id: "2",
      nameOfDegree: "HSC",
      boardOfEducation: "",
      institution: "",
      academicYear: '',
      result: "",
    },
    {
      id: "3",
      nameOfDegree: "Honours",
      boardOfEducation: "",
      institution: "",
      academicYear: '',
      result: "",
    },
    {
      id: "4",
      nameOfDegree: "Masters",
      boardOfEducation: "",
      institution: "",
      academicYear: '',
      result: "",
    },
  ]);

  const [occupationInfo, setOccupationInfo] = useState({
    profession: "",
    institute: "",
    department: "",
  });

  // Load profile data on component mount
  useEffect(() => {
    if (user?.id && !isLoaded) {
      dispatch(fetchProfile());
    }
  }, [user?.id, isLoaded, dispatch]);

  // Update form fields when profile data is loaded from store
  useEffect(() => {
    if (personalInfo) {
      // Helper function to format date from API response
      const formatDateForInput = (dateString: string | null | undefined): string => {
        if (!dateString) return '';
        try {
          // Extract just the date part from ISO string (YYYY-MM-DDTHH:mm:ss -> YYYY-MM-DD)
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        } catch (error) {
          console.error('Error formatting date:', error);
          return '';
        }
      };

      setBasicInfo({
        firstName: personalInfo.firstName || user?.firstName || "",
        lastName: personalInfo.lastName || user?.lastName || "",
        email: personalInfo.email || user?.email || "",
        isIubian: personalInfo.isIubian ? "yes" : "no",
        studentId: personalInfo.studentId || "",
        departmentName: personalInfo.departmentName || "",
        dateOfBirth: formatDateForInput(personalInfo.dateOfBirth),
        nationality: personalInfo.nationality || "",
        contactNumber:  personalInfo?.contactNumber || "",
        emergencyContactNumber: personalInfo.emergencyContactNumber || "",
        fatherFirstName: personalInfo.fatherFirstName || "",
        fatherLastName: personalInfo.fatherLastName || "",
        motherFirstName: personalInfo.motherFirstName || "",
        motherLastName: personalInfo.motherLastName || "",
        presentAddress: personalInfo.presentAddress || "",
        permanentAddress: personalInfo.permanentAddress || "",
      });
    }
  }, [personalInfo, user]);

  // Update education entries when education data is loaded from store
  useEffect(() => {
    if (academicInformations && academicInformations.length > 0) {
      setEducationEntries(academicInformations);
    }
  }, [academicInformations]);

  // Update occupation info when occupation data is loaded from store
  useEffect(() => {
    if (occupation) {
      setOccupationInfo({
        profession: occupation.profession || "",
        institute: occupation.institute || "",
        department: occupation.department || "",
      });
    }
  }, [occupation]);

  // Clear profile errors when component unmounts or user changes
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleBasicChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setBasicInfo((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleEducationChange = (id: string, field: string, value: string) => {
    setEducationEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const handleOccupationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOccupationInfo((prev) => ({ ...prev, [name]: value }));
  };

  const addEducationEntry = () => {
    const newEntry: AcademicInfo = {
      id: Date.now().toString(),
      nameOfDegree: "",
      boardOfEducation: "",
      institution: "",
      academicYear: '',
      result: "",
    };
    setEducationEntries((prev) => [...prev, newEntry]);
  };

  const removeEducationEntry = (id: string) => {
    if (educationEntries.length > 1) {
      setEducationEntries((prev) => prev.filter((entry) => entry.id !== id));
    }
  };

  const validateBasicInfo = () => {
    const newErrors: Record<string, string> = {};

    if (!basicInfo.firstName?.trim()) {
      newErrors.firstName = "First Name is required";
    }
    if (!basicInfo.lastName?.trim()) {
      newErrors.lastName = "Last Name is required";
    }
    if (!basicInfo.dateOfBirth?.trim()) {
      newErrors.dateOfBirth = "Date of Birth is required";
    }
    if (!basicInfo.fatherFirstName?.trim()) {
      newErrors.fatherFirstName = "Father's first name is required";
    }
    if (!basicInfo.fatherLastName?.trim()) {
      newErrors.fatherLastName = "Father's last name is required";
    }
    if (!basicInfo.motherFirstName?.trim()) {
      newErrors.motherFirstName = "Mother's first name is required";
    }
    if (!basicInfo.motherLastName?.trim()) {
      newErrors.motherLastName = "Mother's last name is required";
    }
    if (!basicInfo.nationality?.trim()) {
      newErrors.nationality = "Nationality is required";
    }
    if (!basicInfo.contactNumber?.trim()) {
      newErrors.contactNumber = "Contact Number is required";
    }
    if (!basicInfo.emergencyContactNumber?.trim()) {
      newErrors.emergencyContact = "Emergency Contact is required";
    }

    // IUB student validation
    if (basicInfo.isIubian === "yes") {
      if (!basicInfo.studentId?.trim()) {
        newErrors.studentId = "Student ID is required for IUB students";
      }
      if (!basicInfo.departmentName?.trim()) {
        newErrors.departmentName = "Department is required for IUB students";
      }
    }

    // Always set errors, even if empty
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const validateAcademicInfo = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // At least one education entry must be filled (any field)
    const hasAnyEducation = educationEntries.some(
      (entry) =>
        entry.boardOfEducation.trim() ||
        entry.institution.trim() ||
        entry.academicYear.trim() ||
        entry.result.trim()
    );

    if (!hasAnyEducation) {
      newErrors.general = "Please provide at least one education entry.";
      isValid = false;
    }

    educationEntries.forEach((entry, index) => {
      // If any of the fields are filled, all must be filled
      const anyFieldFilled =
        entry.boardOfEducation.trim() ||
        entry.institution.trim() ||
        entry.academicYear.trim() ||
        entry.result.trim();

      if (anyFieldFilled) {
        if (!entry.nameOfDegree) {
          newErrors[`degreeName_${index}`] = "Degree Name is required";
          isValid = false;
        }
        if (!entry.boardOfEducation.trim()) {
          newErrors[`board_${index}`] = "Board/University is required";
          isValid = false;
        }
        if (!entry.institution.trim()) {
          newErrors[`institution_${index}`] = "Institution is required";
          isValid = false;
        }
        if (!entry.result.trim()) {
          newErrors[`result_${index}`] = "Result is required";
          isValid = false;
        }
      }
    });

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const handleSave = async () => {
    // Clear previous errors first
    setErrors({});
    dispatch(clearError());

    setIsLoading(true);

    try {
      if (activeTab === "basic") {
        // Validate and save basic information
        if (!validateBasicInfo()) {
          setErrors((prev) => ({
            ...prev,
            general:
              "Please fill in all required fields in the Basic Information section before saving.",
          }));
          return;
        }
        
        const personalInfoData = {
          firstName: basicInfo.firstName,
          lastName: basicInfo.lastName,
          email: basicInfo.email,
          isIubian: basicInfo.isIubian === "yes",
          studentId: basicInfo.studentId,
          departmentName: basicInfo.departmentName,
          dateOfBirth: basicInfo.dateOfBirth,
          nationality: basicInfo.nationality,
          contactNumber: basicInfo.contactNumber,
          emergencyContactNumber: basicInfo.emergencyContactNumber,
          fatherFirstName: basicInfo.fatherFirstName,
          fatherLastName: basicInfo.fatherLastName,
          motherFirstName: basicInfo.motherFirstName,
          motherLastName: basicInfo.motherLastName,
          presentAddress: basicInfo.presentAddress,
          permanentAddress: basicInfo.permanentAddress,
        };
        
        await dispatch(updatePersonalInfo(personalInfoData)).unwrap();
      } else if (activeTab === "education") {
        // Validate and save education information
        if (!validateAcademicInfo()) {
          setErrors((prev) => ({
            ...prev,
            general:
              "Please fill in at least one Education section before saving.",
          }));
          return;
        }
        
        const educationData = educationEntries
          .filter(entry => entry.institution && entry.academicYear && entry.result)
          .map((entry) => ({
            id: entry.id,
            userId: typeof user?.id === "number" ? user.id : 0,
            nameOfDegree: entry.nameOfDegree,
            boardOfEducation: entry.boardOfEducation,
            institution: entry.institution,
            academicYear: entry.academicYear,
            result: entry.result,
          }));

          const occupationData = {
            profession: occupationInfo.profession,
            institute: occupationInfo.institute,
            department: occupationInfo.department,
            userId: typeof user?.id === "number" ? user.id : 0,
            isContinue: false, // or set based on your logic
          }


      const profileData : ProfileState = {
        academicInformations: educationData,
        personalInfo: null,
        occupation: occupationData,
        loading: false,
        error: null,
        isLoaded: false
      };

        
        await dispatch(updateEducationInfo(profileData)).unwrap();
      }

      // Save to localStorage
      const profileData = {
        basic: basicInfo,
        education: educationEntries,
        occupation: occupation,
      };
      localStorage.setItem(
        `ksi_profile_${user?.id}`,
        JSON.stringify(profileData)
      );

      setSuccessMessage(`${activeTab === "basic" ? "Basic Information" : "Education"} updated successfully!`);
      setTimeout(() => setSuccessMessage(""), 3000);

    } catch (error) {
      console.error("Error saving profile:", error);
      setErrors({
        general:
          error instanceof Error ? error.message : "Failed to save profile",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Information", icon: User },
    { id: "education", label: "Education", icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">
            Complete Your Profile
          </h1>
          <p className="text-gray-600 mt-2">
            Please fill out all sections to complete your admission process. IUB
            students are eligible for special discounts!
          </p>
        </div>

        {/* Common message area */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        {(errors.general || profileError) && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {errors.general || profileError}
          </div>
        )}
        
        {/* Loading indicator for profile data */}
        {profileLoading && !isLoaded && (
          <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Loading profile data...
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
                      ? "border-[#00c0ef] text-[#00c0ef]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
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
            {activeTab === "basic" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Basic Information
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={basicInfo.firstName}
                      onChange={handleBasicChange}
                      className={`input-field ${
                        errors.firstName ? "border-red-500" : ""
                      }`}
                      placeholder="Enter first name"
                    />
                    {errors.firstName && (
                      <p className="error-text">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={basicInfo.lastName}
                      onChange={handleBasicChange}
                      className={`input-field ${
                        errors.lastName ? "border-red-500" : ""
                      }`}
                      placeholder="Enter last name"
                    />
                    {errors.lastName && (
                      <p className="error-text">{errors.lastName}</p>
                    )}
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

                  {basicInfo.isIubian === "yes" && (
                    <>
                      <div>
                        <label className="form-label">
                          Student ID <span className="text-red-500">*</span>{" "}
                          <span className="text-sm text-gray-500">
                            (Applicable for only IUB student)
                          </span>
                        </label>
                        <input
                          type="text"
                          name="studentId"
                          value={basicInfo.studentId}
                          onChange={handleBasicChange}
                          className={`input-field ${
                            errors.studentId ? "border-red-500" : ""
                          }`}
                          placeholder="Enter student ID"
                        />
                        {errors.studentId && (
                          <p className="error-text">{errors.studentId}</p>
                        )}
                      </div>

                      <div>
                        <label className="form-label">
                          Department <span className="text-red-500">*</span>{" "}
                          <span className="text-sm text-gray-500">
                            (Applicable for only IUB student)
                          </span>
                        </label>
                        <input
                          type="text"
                          name="departmentName"
                          value={basicInfo.departmentName}
                          onChange={handleBasicChange}
                          className={`input-field ${
                            errors.department ? "border-red-500" : ""
                          }`}
                          placeholder="Enter department"
                        />
                        {errors.department && (
                          <p className="error-text">{errors.departmentName}</p>
                        )}
                      </div>
                    </>
                  )}

                  <div>
                    <label className="form-label">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      placeholder="DD-MM-YYYY"
                      value={basicInfo.dateOfBirth}
                      onChange={handleBasicChange}
                      className={`input-field ${
                        errors.dateOfBirth ? "border-red-500" : ""
                      }`}
                    />
                    {errors.dateOfBirth && (
                      <p className="error-text">{errors.dateOfBirth}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">
                      Nationality <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nationality"
                      value={basicInfo.nationality}
                      onChange={handleBasicChange}
                      className={`input-field ${
                        errors.nationality ? "border-red-500" : ""
                      }`}
                      placeholder="Enter nationality"
                    />
                    {errors.nationality && (
                      <p className="error-text">{errors.nationality}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">
                      Contact Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={basicInfo.contactNumber}
                      onChange={handleBasicChange}
                      className={`input-field ${
                        errors.contactNumber ? "border-red-500" : ""
                      }`}
                      placeholder="Enter contact number"
                    />
                    {errors.contactNumber && (
                      <p className="error-text">{errors.contactNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">
                      Emergency Contact <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="emergencyContactNumber"
                      value={basicInfo.emergencyContactNumber}
                      onChange={handleBasicChange}
                      className={`input-field ${
                        errors.emergencyContactNumber ? "border-red-500" : ""
                      }`}
                      placeholder="Enter emergency contact"
                    />
                    {errors.emergencyContactNumber && (
                      <p className="error-text">{errors.emergencyContactNumber}</p>
                    )}
                  </div>
                </div>

                {/* Father's Name - Same Line */}
                <div>
                  <label className="form-label">
                    Father's Name <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="fatherFirstName"
                        value={basicInfo.fatherFirstName}
                        onChange={handleBasicChange}
                        className={`input-field ${
                          errors.fatherFirstName ? "border-red-500" : ""
                        }`}
                        placeholder="First name"
                      />
                      {errors.fatherFirstName && (
                        <p className="error-text">{errors.fatherFirstName}</p>
                      )}
                    </div>
                    <div>
                      <input
                        type="text"
                        name="fatherLastName"
                        value={basicInfo.fatherLastName}
                        onChange={handleBasicChange}
                        className={`input-field ${
                          errors.fatherLastName ? "border-red-500" : ""
                        }`}
                        placeholder="Last name"
                      />
                      {errors.fatherLastName && (
                        <p className="error-text">{errors.fatherLastName}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mother's Name - Same Line */}
                <div>
                  <label className="form-label">
                    Mother's Name <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="motherFirstName"
                        value={basicInfo.motherFirstName}
                        onChange={handleBasicChange}
                        className={`input-field ${
                          errors.motherFirstName ? "border-red-500" : ""
                        }`}
                        placeholder="First name"
                      />
                      {errors.motherFirstName && (
                        <p className="error-text">{errors.motherFirstName}</p>
                      )}
                    </div>
                    <div>
                      <input
                        type="text"
                        name="motherLastName"
                        value={basicInfo.motherLastName}
                        onChange={handleBasicChange}
                        className={`input-field ${
                          errors.motherLastName ? "border-red-500" : ""
                        }`}
                        placeholder="Last name"
                      />
                      {errors.motherLastName && (
                        <p className="error-text">{errors.motherLastName}</p>
                      )}
                    </div>
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

            {activeTab === "education" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Education
                  </h3>
                </div>

                <div className="space-y-6">
                  {educationEntries.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-800">
                          Education Entry {index + 1}
                        </h4>
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
                            value={entry.nameOfDegree}
                            onChange={(e) =>
                              handleEducationChange(
                                entry.id,
                                "nameOfDegree",
                                e.target.value
                              )
                            }
                            className={`input-field ${
                              errors[`degreeName_${index}`] ? "border-red-500" : ""
                            }`}
                          >
                            <option value="">Select degree</option>
                            <option value="SSC">SSC</option>
                            <option value="HSC">HSC</option>
                            <option value="Honours">Honours</option>
                            <option value="Masters">Masters</option>
                            <option value="Other">Other</option>
                          </select>
                          {errors[`degreeName_${index}`] && (
                            <p className="error-text">{errors[`degreeName_${index}`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="form-label">Board</label>
                          <input
                            type="text"
                            value={entry.boardOfEducation}
                            onChange={(e) =>
                              handleEducationChange(
                                entry.id,
                                "boardOfEducation",
                                e.target.value
                              )
                            }
                            className={`input-field ${
                              errors[`board_${index}`] ? "border-red-500" : ""
                            }`}
                            placeholder="Enter board/university"
                          />
                          {errors[`board_${index}`] && (
                            <p className="error-text">{errors[`board_${index}`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="form-label">Institution</label>
                          <input
                            type="text"
                            value={entry.institution}
                            onChange={(e) =>
                              handleEducationChange(
                                entry.id,
                                "institution",
                                e.target.value
                              )
                            }
                            className={`input-field ${
                              errors[`institution_${index}`] ? "border-red-500" : ""
                            }`}
                            placeholder="Enter institution name"
                          />
                          {errors[`institution_${index}`] && (
                            <p className="error-text">{errors[`institution_${index}`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="form-label">Academic Year</label>
                          <input
                            type="text"
                            value={entry.academicYear}
                            onChange={(e) =>
                              handleEducationChange(
                                entry.id,
                                "academicYear",
                                e.target.value
                              )
                            }
                            className="input-field"
                            placeholder="e.g., 2020-2024"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="form-label">Result</label>
                          <input
                            type="text"
                            value={entry.result}
                            onChange={(e) =>
                              handleEducationChange(
                                entry.id,
                                "result",
                                e.target.value
                              )
                            }
                            className={`input-field ${
                              errors[`result_${index}`] ? "border-red-500" : ""
                            }`}
                            placeholder="Enter CGPA/GPA/Grade"
                          />
                          {errors[`result_${index}`] && (
                            <p className="error-text">{errors[`result_${index}`]}</p>
                          )}
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
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Occupation{" "}
                    <span className="text-sm font-normal text-gray-500">
                      (Optional)
                    </span>
                  </h4>

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

            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={isLoading || profileLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading || profileLoading ? "Saving..." : "Save Profile"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;