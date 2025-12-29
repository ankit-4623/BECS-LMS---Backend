import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import Home from './pages/home'
import Login from './pages/login'
import Signup from './pages/signup'
import ForgotPassword from './pages/forgetpassword'
import Verify from './pages/verify'
import Dashboard from './pages/dashboard'
import Profile from './pages/profile'
import AllCourses from './pages/all-courses'
import AllSchoolCourses from './pages/all-school-courses'
import AllNotes from './pages/all-notes'
import CourseDetail from './pages/course-detail'
import NoteDetail from './pages/note-detail'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify" element={<Verify />} />
        
        {/* Semi-Public Routes (accessible without auth but show different content if logged in) */}
        <Route path="/courses" element={<AllCourses />} />
        <Route path="/school-courses" element={<AllSchoolCourses />} />
        <Route path="/notes" element={<AllNotes />} />
        <Route path="/course/:courseId" element={<CourseDetail />} />
        <Route path="/notes/:noteId" element={<NoteDetail />} />
        
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
