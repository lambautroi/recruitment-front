import { useNavigate } from "react-router-dom";

export default function CandidateDashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div>
            <h2>Trang Ứng viên</h2>
            <p>Đây là trang ứng viên.</p>
            <button onClick={handleLogout}>Đăng xuất</button>
        </div>
    );
}