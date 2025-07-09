import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css"; // Import CSS riêng cho trang Login

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const login = async () => {
        try {
            // Gửi thông tin đăng nhập đến backend
            const res = await axios.post(
                "http://localhost:3001/api/auth/login",
                {
                    email,
                    password,
                }
            );

            const { token } = res.data;
            localStorage.setItem("token", token);

            // Giải mã token để lấy thông tin role
            const decodedToken = JSON.parse(atob(token.split(".")[1]));
            const userRole = decodedToken.role;

            // Điều hướng tới trang phù hợp với role
            if (userRole === "admin") {
                navigate("/admin-dashboard");
            } else if (userRole === "employer") {
                navigate("/company-dashboard");
            } else {
                navigate("/candidate-dashboard");
            }
        } catch (error) {
            alert("Sai thông tin đăng nhập!");
        }
    };

    return (
        <div className="login-container">
            <h2>Đăng nhập</h2>
            <div className="form-group">
                <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="form-group">
                <input
                    type="password"
                    className="form-control"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button className="btn btn-primary" onClick={login}>
                Đăng nhập
            </button>
            <div className="no-account">
                <span>Chưa có tài khoản? </span>
                <button
                    className="btn btn-link"
                    onClick={() => navigate("/register")}
                >
                    Đăng ký
                </button>
            </div>
        </div>
    );
}
