import { useNavigate } from "react-router-dom";
export default function AdminDashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div>
            <h2>Dashboard Quản trị viên</h2>
            <p>Chào mừng bạn đến với trang quản trị viên.</p>
        </div>
    );
}
