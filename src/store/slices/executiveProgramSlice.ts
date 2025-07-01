import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { ExecutiveProgram, ProgramType } from '../../types/api'
import { executiveProgramApi } from '../../services/circularApi'

interface ExecutiveProgramState {
  programs: ExecutiveProgram[]
  programTypes: ProgramType[]
  loading: boolean
  error: string | null
}

const initialState: ExecutiveProgramState = {
  programs: [],
  programTypes: [],
  loading: false,
  error: null,
}

// Async thunks
export const fetchExecutivePrograms = createAsyncThunk(
  'executiveProgram/fetchPrograms',
  async (_, { rejectWithValue }) => {
    try {
      const programs = await executiveProgramApi.getExecutivePrograms()
      return programs
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch executive programs')
    }
  }
)

export const fetchProgramTypes = createAsyncThunk(
  'executiveProgram/fetchProgramTypes',
  async (_, { rejectWithValue }) => {
    try {
      const programTypes = await executiveProgramApi.getProgramTypes()
      return programTypes
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch program types')
    }
  }
)

const executiveProgramSlice = createSlice({
  name: 'executiveProgram',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch executive programs
      .addCase(fetchExecutivePrograms.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchExecutivePrograms.fulfilled, (state, action: PayloadAction<ExecutiveProgram[]>) => {
        state.loading = false
        state.programs = action.payload
      })
      .addCase(fetchExecutivePrograms.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Fetch program types
      .addCase(fetchProgramTypes.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProgramTypes.fulfilled, (state, action: PayloadAction<ProgramType[]>) => {
        state.loading = false
        state.programTypes = action.payload
      })
      .addCase(fetchProgramTypes.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = executiveProgramSlice.actions
export default executiveProgramSlice.reducer