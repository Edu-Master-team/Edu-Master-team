import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import Exam from "./pages/Exam";
import Lesson from "./pages/Lesson";

import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import Question from "./pages/Question";
import StudentExam from "./pages/StudentExam";
import UserPage from "./pages/User";

function App() {
  return (
    <Router>
      <Routes>
        {/* صفحة تسجيل الدخول متاحة للجميع */}
        <Route path="/login" element={<LoginPage />} />

        {/* باقي الصفحات محمية */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />

            <Route path="lesson" element={<Lesson />} />
            <Route path="question" element={<Question />} />
            <Route path="exam" element={<Exam />} />
          
            <Route path="admin" element={<Admin />} />
            <Route path="user" element={<UserPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
