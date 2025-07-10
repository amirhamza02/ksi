import api from '../lib/api';
import { AcademicInfo, PersonalInfoRequest } from '../types/profile';

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
    submitEducationInfo: async (educationData: AcademicInfo[]) => {
        const response = await api.post('/Profiles/education', { education: educationData });
        return response.data;
    },

    fetchProfile : async (): Promise<void> => {
        try {
          const response = await api.get('/Profiles/profile');
            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error(`Error fetching profile: ${response.statusText}`);
            }
        } catch (error) {
          throw error;
        }
      }
};