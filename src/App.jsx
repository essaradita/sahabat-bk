import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import { ToastProvider } from './components/ui/Toast'
import ProtectedRoute from './components/ProtectedRoute'

// Layouts
import StudentLayout from './layouts/StudentLayout'
import TeacherLayout from './layouts/TeacherLayout'

// Auth pages
import LandingPage from './pages/auth/LandingPage'
import LoginStudent from './pages/auth/LoginStudent'
import LoginTeacher from './pages/auth/LoginTeacher'
import RegisterStudent from './pages/auth/RegisterStudent'
import RegisterTeacher from './pages/auth/RegisterTeacher'

// Student pages
import StudentDashboard from './pages/student/StudentDashboard'
import AdventureMap from './pages/student/AdventureMap'
import MissionDetail from './pages/student/MissionDetail'
import MissionPlay from './pages/student/MissionPlay'
import MissionComplete from './pages/student/MissionComplete'
import StudentJournal from './pages/student/StudentJournal'
import StudentProfile from './pages/student/StudentProfile'
import GroupMode from './pages/student/GroupMode'
import CaseStudyIntro from './pages/student/CaseStudyIntro'
import GroupMap from './pages/student/GroupMap'
import CaseStudyPlay from './pages/student/CaseStudyPlay'
import CaseStudyComplete from './pages/student/CaseStudyComplete'

// Teacher pages
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import ManageClasses from './pages/teacher/ManageClasses'
import StudentData from './pages/teacher/StudentData'
import QuestionBank from './pages/teacher/QuestionBank'
import MissionEditor from './pages/teacher/MissionEditor'
import AttendancePage from './pages/teacher/AttendancePage'
import ReportsPage from './pages/teacher/ReportsPage'
import CounselingPage from './pages/teacher/CounselingPage'
import TeacherSettings from './pages/teacher/TeacherSettings'
import CaseStudies from './pages/teacher/CaseStudies'
import CaseStudyEditor from './pages/teacher/CaseStudyEditor'
import PreviewGame from './pages/teacher/PreviewGame'

// Misc
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login/student" element={<LoginStudent />} />
          <Route path="/login/teacher" element={<LoginTeacher />} />
          <Route path="/register/student" element={<RegisterStudent />} />
          <Route path="/register/teacher" element={<RegisterTeacher />} />

          {/* Student routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute role="student">
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="map" element={<AdventureMap />} />
            <Route path="group-mode" element={<GroupMode />} />
            <Route path="case-study-intro/:caseId" element={<CaseStudyIntro />} />
            <Route path="group-map/:caseId" element={<GroupMap />} />
            <Route path="case-study/:caseId/mission/:missionId" element={<CaseStudyPlay />} />
            <Route path="case-study-complete" element={<CaseStudyComplete />} />
            <Route path="mission/:missionId" element={<MissionDetail />} />
            <Route path="mission/:missionId/play" element={<MissionPlay />} />
            <Route path="mission/:missionId/complete" element={<MissionComplete />} />
            <Route path="journal" element={<StudentJournal />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>

          {/* Teacher routes */}
          <Route
            path="/teacher"
            element={
              <ProtectedRoute role="teacher">
                <TeacherLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="classes" element={<ManageClasses />} />
            <Route path="students" element={<StudentData />} />
            <Route path="question-bank" element={<QuestionBank />} />
            <Route path="question-bank/mission/:missionId" element={<MissionEditor />} />
            <Route path="case-studies" element={<CaseStudies />} />
            <Route path="case-studies/create" element={<CaseStudyEditor />} />
            <Route path="case-studies/edit/:caseId" element={<CaseStudyEditor />} />
            <Route path="preview-game" element={<PreviewGame />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="counseling" element={<CounselingPage />} />
            <Route path="settings" element={<TeacherSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  )
}
