import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/authPage/LoginPage";
import RegisterPage from "./pages/authPage/RegisterPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import JobListPage from "./pages/JobListPage";
import JobDetailPage from "./pages/JobDetailPage";
import EmployerListPage from "./pages/employer/EmployerListPage";
import CandidateListPage from "./pages/candidate/CandidateListPage";
import CandidateDetailPage from "./pages/candidate/CandidateDetailPage";
import EmployerDetailPage from "./pages/employer/EmployerDetailPage";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import JobEdit from "./pages/employer/JobEdit";

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
                <Route path="/employer/jobs/edit/:id" element={<JobEdit />} />
            </Routes>
        </Router>
    );
}

export default App;
