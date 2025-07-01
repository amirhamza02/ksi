import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Circular } from '../../types/api'
import { circularApi } from '../../services/circularApi'

interface CircularState {
  circulars: Circular[]
  selectedCircular: Circular | null
  loading: boolean
  error: string | null
}

const initialState: CircularState = {
  circulars: [],
  selectedCircular: null,
  loading: false,
  error: null,
}

// Async thunks
export const fetchCirculars = createAsyncThunk(
  'circular/fetchCirculars',
  async (_, { rejectWithValue }) => {
    try {
      const circulars = await circularApi.getCirculars()
      return circulars
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch circulars')
    }
  }
)

export const fetchCircular = createAsyncThunk(
  'circular/fetchCircular',
  async (id: string, { rejectWithValue }) => {
    try {
      const circular = await circularApi.getCircular(id)
      return circular
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch circular')
    }
  }
)

const circularSlice = createSlice({
  name: 'circular',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearSelectedCircular: (state) => {
      state.selectedCircular = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch circulars
      .addCase(fetchCirculars.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCirculars.fulfilled, (state, action: PayloadAction<Circular[]>) => {
        state.loading = false
        state.circulars = action.payload
      })
      .addCase(fetchCirculars.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Fetch single circular
      .addCase(fetchCircular.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCircular.fulfilled, (state, action: PayloadAction<Circular>) => {
        state.loading = false
        state.selectedCircular = action.payload
      })
      .addCase(fetchCircular.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, clearSelectedCircular } = circularSlice.actions
export default circularSlice.reducer