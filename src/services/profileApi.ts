import api from '../lib/api';
import { AcademicInfo, PersonalInfoRequest } from '../types/profile';

// Example API call functions

export const profileApi = {
    fetchProfile: async () => {
        const response = await api.get('/Profiles/profile');
        console.log("Profile data fetched:", response.data);
        return response.data;
    },
    submitPersonalInfo: async (personalInfoData: PersonalInfoRequest) => {
        const response = await api.post('/Profiles/personal-info', personalInfoData);
        return response.data;
    },
    submitEducationInfo: async (educationData: AcademicInfo[]) => {
        const response = await api.post('/Profiles/education', { education: educationData });
        return response.data;
    }
};