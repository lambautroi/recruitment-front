import { useNavigate } from "react-router-dom";

export default function CompanyDashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div>
            <h2>Trang Doanh nghiệp</h2>
            <p>Đây là trang doanh nghiệp.</p>
            <button onClick={handleLogout}>Đăng xuất</button>
        </div>
    );
}