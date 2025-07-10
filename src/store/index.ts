import { configureStore } from '@reduxjs/toolkit'
import circularReducer from './slices/circularSlice'
import executiveProgramReducer from './slices/executiveProgramSlice'
import profileReducer from './slices/profileSlice'

export const store = configureStore({
  reducer: {
    circular: circularReducer,
    executiveProgram: executiveProgramReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch