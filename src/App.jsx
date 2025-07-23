import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/authPage/LoginPage";
import RegisterPage from "./pages/authPage/RegisterPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import JobListPage from "./pages/JobListPage";
import JobDetailPage from "./pages/JobDetailPage";
import EmployerListPage from "./pages/EmployerListPage";
import CandidateListPage from "./pages/CandidateListPage";
import CandidateDetailPage from "./pages/CandidateDetailPage";
import EmployerDetailPage from "./pages/EmployerDetailPage";
import EmployerDashboard from "./pages/employer/EmployerDashboard";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
                <Route path="/jobs" element={<JobListPage />} />
                <Route path="/jobs/:id" element={<JobDetailPage />} />
                <Route path="/employers" element={<EmployerListPage />} />
                <Route path="/candidates" element={<CandidateListPage />} />
                <Route
                    path="/candidates/:id"
                    element={<CandidateDetailPage />}
                />
                <Route path="/companies/:id" element={<EmployerDetailPage />} />
                <Route
                    path="/employer/dashboard"
                    element={<EmployerDashboard />}
                />
            </Routes>
        </Router>
    );
}

export default App;
