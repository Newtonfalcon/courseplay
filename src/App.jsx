import { useState } from 'react'
import SignUpPage from './pages/auth/Register'
import LoginPage from './pages/auth/Login'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ROUTES } from './libs/constants'
import { Link } from 'react-router'
import OnboardingPage from './pages/Onboarding'

import CreateCourse from './pages/dashboard/create/CreateCourse'
import CreateLesson from './pages/dashboard/create/CreateLesson'
import ProtectedRoute from './components/Protected'
import Courses from './pages/dashboard/course/Allcourse'
import CourseDetail from './pages/dashboard/course/Coursedetails'
import LessonPage from './pages/dashboard/lessons/Lesson'
import CodeEditor from './pages/dashboard/code /Code'
import Profile from './pages/dashboard/user/Profile'
import Learn from './pages/dashboard/lessons/Learn'
import CourseCompleted from './pages/dashboard/Completed'



function App() {


 
  

  return (
    <Router> 
      <Routes>
        <Route path={ROUTES.home} element={<OnboardingPage />} />
        <Route path={ROUTES.code} element={<CodeEditor />} />   
       
        <Route path={ROUTES.signup} element={<SignUpPage />} />
        <Route path={ROUTES.signin} element={<LoginPage />} />

    
           <Route path={ROUTES.createCourse} element={<ProtectedRoute><CreateCourse /></ProtectedRoute>} />
           <Route path={ROUTES.profile} element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path={ROUTES.createLesson} element={<ProtectedRoute><CreateLesson /></ProtectedRoute>} />
          <Route path={ROUTES.dashboard} element={<ProtectedRoute><Courses /> </ProtectedRoute>} />
          <Route path="/dashboard/:courseId" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
          <Route path="/dashboard/:courseId/lesson/:lessonId" element={<ProtectedRoute><LessonPage /></ProtectedRoute>} />
          <Route path="/dashboard/:courseId/lesson/:lessonId/code" element={<ProtectedRoute><CodeEditor /></ProtectedRoute>} />
          <Route path={ROUTES.learn} element={<ProtectedRoute ><Learn /> </ProtectedRoute> } />
          <Route path={ROUTES.completed} element={<ProtectedRoute><CourseCompleted /></ProtectedRoute>} />  
        
      </Routes>
    </Router>
    
  )
}

export default App
