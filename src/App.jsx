import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/authPage/LoginPage";
import RegisterPage from "./pages/authPage/RegisterPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import CandidateDashboard from "./pages/CandidateDashboard";

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
            </Routes>
        </Router>
    );
}

export default App;
