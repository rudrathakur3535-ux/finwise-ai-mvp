import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StudentDashboard from './pages/StudentDashboard';
import QuizEngine from './pages/QuizEngine';
import TeacherDashboard from './pages/TeacherDashboard';
import QuizReview from './pages/QuizReview';
import Leaderboard from './pages/Leaderboard';
import Flashcards from './pages/Flashcards';

export default function App() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <BrowserRouter>
      <div className="min-h-screen font-sans bg-slate-900 text-slate-100">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/student" 
            element={token && role === 'STUDENT' ? <StudentDashboard /> : <Navigate to="/" />} 
          />
          <Route 
            path="/teacher" 
            element={token && role === 'TEACHER' ? <TeacherDashboard /> : <Navigate to="/" />} 
          />
          <Route 
            path="/quiz/:topicId" 
            element={token && role === 'STUDENT' ? <QuizEngine /> : <Navigate to="/" />} 
          />
          <Route 
            path="/flashcards/:topicId" 
            element={token && role === 'STUDENT' ? <Flashcards /> : <Navigate to="/" />} 
          />
          <Route 
            path="/quiz/review/:quizAttemptId" 
            element={token && role === 'STUDENT' ? <QuizReview /> : <Navigate to="/" />} 
          />
          <Route 
            path="/leaderboard" 
            element={token && role === 'STUDENT' ? <Leaderboard /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
