import { useState } from 'react'
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
import theme from './landingPage/theme';
import { Box, CssBaseline } from '@mui/material';
import Header from './landingPage/components/Header';
import Hero from './landingPage/components/HeroSection';
import LandingCourses from './landingPage/components/LandingCourses';
import Testimonials from './landingPage/components/Testimonial';
import AboutUs from './landingPage/components/AboutUs';
import Footer from './landingPage/components/Footer';

function App() {

  return (
    <>

    {/* admin dashboard */}
      {/* <ThemeProvider theme={mathTheme}>
        <Router>
          <AdminSidebar>
            <Routes>
              <Route path="/" element={<Navigate to="/admin/headlines" />} />
               <Route path="/admin/headlines" element={<HeadlineManagement />} /> 
               <Route path="/admin/courses" element={<Courses />} /> 
               <Route path="/admin/users" element={<UserManagement />} /> 
           
            </Routes>
          </AdminSidebar>
        </Router>
      </ThemeProvider> */}

      {/* student dashbaord */}
      <ThemeProvider theme={mathTheme}>
        <Router>
          <StudentSidebar>
            <Routes>
              <Route path="/" element={<Navigate to="/student/courses" />} />
              <Route path="/admin/headlines" element={<HeadlineManagement />} />
              <Route path="/student/enrolled-courses" element={<EnrolledCoursesTab />} />
              <Route path="/student/courses" element={<AllCoursesTab />} />
              <Route path="/student/users" element={<UserManagement />} />

            </Routes>
          </StudentSidebar>
        </Router>
      </ThemeProvider>

      {/* landing page */}
      {/* <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box>
          <Header />
          <Hero />
          <LandingCourses />
          <Testimonials />
          <AboutUs />
          <Footer />
        </Box>
      </ThemeProvider> */}
    </>
  )
}

export default App
