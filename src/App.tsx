import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Admin from "./pages/Admin";
import Customers from "./pages/Customers";
import Dashboard from "./pages/Dashboard";
import Exam from "./pages/Exam";
import Lesson from "./pages/Lesson";
import Orders from "./pages/Orders";
import Question from "./pages/Question";
import Settings from "./pages/Settings";
import StudentExam from "./pages/StudentExam";
import UserPage from "./pages/User";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";

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
            <Route path="orders" element={<Orders />} />
            <Route path="lesson" element={<Lesson />} />
            <Route path="question" element={<Question />} />
            <Route path="exam" element={<Exam />} />
            <Route path="student-exam" element={<StudentExam />} />
            <Route path="admin" element={<Admin />} />
            <Route path="user" element={<UserPage />} />
            <Route path="customers" element={<Customers />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
