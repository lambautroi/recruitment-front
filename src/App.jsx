import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/authPage/LoginPage";
import RegisterPage from "./pages/authPage/RegisterPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import CandidateDashboard from "./pages/CandidateDashboard";
import JobListPage from "./pages/JobListPage";
import JobDetailPage from "./pages/JobDetailPage";
import EmployerListPage from "./pages/EmployerListPage";
import CandidateListPage from "./pages/CandidateListPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
                <Route
                    path="/company-dashboard"
                    element={<CompanyDashboard />}
                />
                <Route
                    path="/candidate-dashboard"
                    element={<CandidateDashboard />}
                />
                <Route path="/jobs" element={<JobListPage />} />
                <Route path="/jobs/:id" element={<JobDetailPage />} />
                <Route path="/employers" element={<EmployerListPage />} />
                <Route path="/candidates" element={<CandidateListPage />} />
            </Routes>
        </Router>
    );
}

export default App;
