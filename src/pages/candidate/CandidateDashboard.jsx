import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/homePage/Navbar";
import Footer from "../../components/Footer";
import CandidateInfo from "./CandidateInfo";
import AppliedJobs from "./AppliedJobs";
import SavedJobs from "./SavedJobs";
import "../../styles/CandidateDashboard.css";

const CandidateDashboard = () => {
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
            if (decodedToken.role !== "user") {
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
                return <CandidateInfo userInfo={userInfo} />;
            case "applied":
                return <AppliedJobs userInfo={userInfo} />;
            case "saved":
                return <SavedJobs userInfo={userInfo} />;
            default:
                return <CandidateInfo userInfo={userInfo} />;
        }
    };

    if (!userInfo) {
        return <div className="loading">Đang tải...</div>;
    }

    return (
        <div className="candidate-dashboard-container">
            <Navbar />
            <div className="candidate-dashboard">
                <div className="dashboard-container">
                    <div className="dashboard-sidebar">
                        <div className="sidebar-header">
                            <h3>Thông tin người ứng tuyển</h3>
                        </div>
                        <nav className="sidebar-nav">
                            <button
                                className={`nav-item ${activeTab === "info" ? "active" : ""}`}
                                onClick={() => setActiveTab("info")}
                            >
                                <span className="nav-icon">👤</span>
                                Thông tin tài khoản
                            </button>
                            <button
                                className={`nav-item ${activeTab === "applied" ? "active" : ""}`}
                                onClick={() => setActiveTab("applied")}
                            >
                                <span className="nav-icon">📝</span>
                                Công việc đã ứng tuyển
                            </button>
                            <button
                                className={`nav-item ${activeTab === "saved" ? "active" : ""}`}
                                onClick={() => setActiveTab("saved")}
                            >
                                <span className="nav-icon">❤️</span>
                                Công việc đã lưu
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

                    <div className="dashboard-content">
                        {renderContent()}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CandidateDashboard;