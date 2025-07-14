import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Profile, AcademicInfo, Occupation, ProfileState } from '../../types/profile'
import { profileApi } from '../../services/profileApi'

const initialState: ProfileState = {
  personalInfo: null,
  academicInformations: [],
  occupation: null,
  loading: false,
  error: null,
  isLoaded: false,
}

// Async thunks
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const profileData = await profileApi.fetchProfile()
      return profileData
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile')
    }
  }
)

export const updatePersonalInfo = createAsyncThunk(
  'profile/updatePersonalInfo',
  async (personalInfoData: any, { rejectWithValue }) => {
    try {
      const response = await profileApi.submitPersonalInfo(personalInfoData)
      return { personalInfo: personalInfoData, response }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update personal information')
    }
  }
)

export const updateEducationInfo = createAsyncThunk(
  'profile/updateEducationInfo',
  async (educationData:ProfileState, { rejectWithValue }) => {
    try {
      const response = await profileApi.submitEducationInfo(educationData)
      return { educationInfo: educationData, response }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update education information')
    }
  }
)

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    updatePersonalInfoLocal: (state, action: PayloadAction<Partial<Profile>>) => {
      if (state.personalInfo) {
        state.personalInfo = { ...state.personalInfo, ...action.payload }
      }
    },
    updateEducationInfoLocal: (state, action: PayloadAction<AcademicInfo[]>) => {
      state.academicInformations = action.payload
    },
    resetProfile: (state) => {
      state.personalInfo = null
      state.academicInformations = []
      state.occupation = null
      state.isLoaded = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false
        state.isLoaded = true
        const data = action.payload.data || action.payload
        
        // Handle personal info
        if (data.personalInfo || data) {
          state.personalInfo = data.personalInfo || data
        }
        
        // Handle education info
        if (data.academicInformations || data.academicInformations) {
          state.academicInformations = data.academicInformations || []
        }

        
        // Handle professional info
        if (data.occupations || data.occupations.length > 0) {
          state.occupation = data.occupations[0] || null
        }
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Update personal info
      .addCase(updatePersonalInfo.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updatePersonalInfo.fulfilled, (state, action) => {
        state.loading = false
        state.personalInfo = action.payload.personalInfo
      })
      .addCase(updatePersonalInfo.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Update education info
      .addCase(updateEducationInfo.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateEducationInfo.fulfilled, (state, action) => {
        state.loading = false
        state.academicInformations = action.payload.educationInfo.academicInformations
      })
      .addCase(updateEducationInfo.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { 
  clearError, 
  updatePersonalInfoLocal, 
  updateEducationInfoLocal, 
  resetProfile 
} = profileSlice.actions

export default profileSlice.reducer