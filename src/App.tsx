import { Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import { AuthProvider } from './contexts/AuthContext'
import HomePage from './pages/HomePage'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/Profile/ProfilePage'
import CoursePage from './pages/Course/CoursePage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/courses" element={
              <ProtectedRoute>
                <CoursePage />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </Provider>
  )
}

export default App