import api from '../lib/api';
import { AcademicInfo, PersonalInfoRequest } from '../types/profile';
import { ProfileState } from '../types/profile';

// Example API call functions

export const profileApi = {
    fetchProfile: async () => {
        const response = await api.get('/Profiles/profile');
        return response.data;
    },
    submitPersonalInfo: async (personalInfoData: PersonalInfoRequest) => {
        const response = await api.post('/Profiles/personal-info', personalInfoData);
        return response.data;
    },
    submitEducationInfo: async ( academicInformation: AcademicInfo[]) => {

        var profileData: ProfileState = {
            personalInfo: null,
            educationInfo: academicInformation,
            professionalInfo: null,
            loading: false,
            error: null,
            isLoaded: false,
        }
      
        const response = await api.post('/Profiles/education-info', profileData);
        return response.data;
    }
};