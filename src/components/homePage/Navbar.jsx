import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Navbar.css";

export default function Navbar() {
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    // Lấy role người dùng từ localStorage (sau khi đăng nhập)
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedToken = JSON.parse(atob(token.split(".")[1]));
            setUserRole(decodedToken.role);
        }
    }, []);

    const handleLoginClick = () => {
        navigate("/login");
    };

    const handleProfileClick = () => {
        if (userRole === "user") {
            navigate("/candidate/dashboard");
        } else if (userRole === "employer") {
            navigate("/employer/dashboard");
        }
    };

    return (
        <nav className="navbar">
            <div className="logo">
                <img
                    src="/logo.png"
                    alt="Job Seeker Logo"
                    style={{ height: "62px", marginRight: "8px" }}
                />
            </div>
            <div className="nav-links">
                <Link to="/">Trang chủ</Link>
                <Link to="/jobs">Tìm việc</Link>
                <Link to="/employers">Doanh nghiệp</Link>
                <Link to="/candidates">Ứng viên</Link>
            </div>
            <div className="auth-buttons">
                {!userRole ? (
                    <button onClick={handleLoginClick} className="login-btn">
                        Đăng nhập
                    </button>
                ) : (
                    <button
                        onClick={handleProfileClick}
                        className="profile-btn"
                    >
                        {userRole === "employer"
                            ? "Thông tin doanh nghiệp"
                            : "Thông tin ứng viên"}
                    </button>
                )}
            </div>
        </nav>
    );
}
