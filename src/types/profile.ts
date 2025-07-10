import { User } from "./auth";

export interface Profile {
    firstName: string;
    lastName: string;
    email: string;
    isIubian: boolean;
    studentId: string;
    departmentName: string;
    dateOfBirth: string;
    nationality: string;
    contactNumber: string;
    emergencyContactNumber: string;
    fatherFirstName: string;
    fatherLastName: string;
    motherFirstName: string;
    motherLastName: string;
    presentAddress: string;
    permanentAddress: string;
}

export interface AcademicInfo {
    id: string;
    nameOfDegree: string;
    boardOfEducation: string;
    institution: string;
    academicYear: string;
    result: string;
}

export interface ProfessionalInfo {
    userId: number;
    profession?: string;
    institution?: string;
    department?: string;
    fromDate?: string; // ISO date string
    toDate?: string;   // ISO date string
    isContinue: boolean;
}

export interface PersonalInfoRequest extends Profile {}

export interface EducationRequest {
    education: AcademicInfo[];
}

export interface ProfileState {
    personalInfo: Profile | null;
    educationInfo: AcademicInfo[];
    professionalInfo: ProfessionalInfo | null;
    loading: boolean;
    error: string | null;
    isLoaded: boolean;
}
