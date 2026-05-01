import AdminSidebar from './admin/AdminSidebar'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import { mathTheme } from './admin/theme';
import Courses from './admin/courses/components/CoursePage';
import UserManagement from './admin/users/components/UserManagement';
import HeadlineManagement from './admin/headlines/components/HeadlineManagement';
import StudentSidebar from './student/StudentSidebar';
import AllCoursesTab from './student/course/components/CourseTab';
import EnrolledCoursesTab from './student/enrollment/components/EnrollmentTab';
import ProfilePage from './student/profile/components/ProfilePage';
import theme from './landingPage/theme';
import { Box, CssBaseline } from '@mui/material';
import Header from './landingPage/components/Header';
import Hero from './landingPage/components/HeroSection';
import LandingCourses from './landingPage/components/LandingCourses';
import Testimonials from './landingPage/components/Testimonial';
import AboutUs from './landingPage/components/AboutUs';
import Footer from './landingPage/components/Footer';

import { AuthProvider } from './context/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './auth/components/LoginPage';
import SignupPage from './auth/components/SignupPage';
import CommingSoonPage from './ComingSoon/ComingSoonPage';

function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          {/* <Route path="/" element={
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Box>
                <Header />
                <Hero />
                <LandingCourses />
                <Testimonials />
                <AboutUs />
                <Footer />
              </Box>
            </ThemeProvider>
          } /> */}

          {/* <Route path="/login" element={
            <ThemeProvider theme={mathTheme}>
              <CssBaseline />
              <LoginPage />
            </ThemeProvider>
          } /> */}

          {/* <Route path="/signup" element={
            <ThemeProvider theme={mathTheme}>
              <CssBaseline />
              <SignupPage />
            </ThemeProvider>
          } /> */}

          {/* Admin Routes */}
          {/* <Route path="/admin/*" element={
            <ThemeProvider theme={mathTheme}>
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminSidebar>
                  <Routes>
                    <Route path="/" element={<Navigate to="/admin/headlines" replace />} />
                    <Route path="headlines" element={<HeadlineManagement />} />
                    <Route path="courses" element={<Courses />} />
                    <Route path="users" element={<UserManagement />} />
                  </Routes>
                </AdminSidebar>
              </ProtectedRoute>
            </ThemeProvider>
          } /> */}

          {/* Student Routes */}
          {/* <Route path="/student/*" element={
            <ThemeProvider theme={mathTheme}>
              <ProtectedRoute allowedRoles={['student']}>
                <StudentSidebar>
                  <Routes>
                    <Route path="/" element={<Navigate to="/student/courses" replace />} />
                    <Route path="enrolled-courses" element={<EnrolledCoursesTab />} />
                    <Route path="courses" element={<AllCoursesTab />} />
                    <Route path="profile" element={<ProfilePage />} />
                  </Routes>
                </StudentSidebar>
              </ProtectedRoute>
            </ThemeProvider>
          } /> */}

          {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
          
          <Route path="/" element={<CommingSoonPage />} />

        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
