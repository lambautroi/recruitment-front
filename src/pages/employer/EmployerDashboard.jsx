import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/homePage/Navbar";
import Footer from "../../components/Footer";
import EmployerInfo from "./EmployerInfo";
import JobManagement from "./JobManagement";
import "../../styles/EmployerDashboard.css";

const EmployerDashboard = () => {
    const [activeTab, setActiveTab] = useState("info");
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        // Decode token để lấy thông tin user
        try {
            const decodedToken = JSON.parse(atob(token.split(".")[1]));
            if (decodedToken.role !== "employer") {
                navigate("/");
                return;
            }
            setUserInfo(decodedToken);
        } catch (error) {
            console.error("Error decoding token:", error);
            navigate("/login");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const renderContent = () => {
        switch (activeTab) {
            case "info":
                return <EmployerInfo userInfo={userInfo} />;
            case "jobs":
                return <JobManagement userInfo={userInfo} />;
            default:
                return <EmployerInfo userInfo={userInfo} />;
        }
    };

    if (!userInfo) {
        return <div className="loading">Đang tải...</div>;
    }

    return (
        <div className="employer-dashboard-page">
            <Navbar />
            <div className="employer-dashboard">
                <div className="dashboard-container">
                    {/* Sidebar */}
                    <div className="dashboard-sidebar">
                        <div className="sidebar-header">
                            <h3>Quản lý doanh nghiệp</h3>
                        </div>
                        <nav className="sidebar-nav">
                            <button
                                className={`nav-item ${activeTab === "info" ? "active" : ""}`}
                                onClick={() => setActiveTab("info")}
                            >
                                <span className="nav-icon">🏢</span>
                                Thông tin doanh nghiệp
                            </button>
                            <button
                                className={`nav-item ${activeTab === "jobs" ? "active" : ""}`}
                                onClick={() => setActiveTab("jobs")}
                            >
                                <span className="nav-icon">📋</span>
                                Quản lý tin tuyển dụng
                            </button>
                            <button
                                className="nav-item logout"
                                onClick={handleLogout}
                            >
                                <span className="nav-icon">🚪</span>
                                Đăng xuất
                            </button>
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="dashboard-content">
                        {renderContent()}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default EmployerDashboard;