import api from '../lib/api';
import { AcademicInfo, PersonalInfoRequest } from '../types/profile';

// Example API call functions

export const profileApi = {
    submitPersonalInfo: async (personalInfoData: PersonalInfoRequest) => {
        const response = await api.post('/Profiles/personal-info', personalInfoData);
        return response.data;
    },
    submitEducationInfo: async (educationData: AcademicInfo[]) => {
        const response = await api.post('/Profiles/education', { education: educationData });
        return response.data;
    }
};