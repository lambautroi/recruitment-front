import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/AuthPage.css";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const login = async () => {
        try {
            const res = await axios.post(
                "http://localhost:3001/api/auth/login",
                {
                    email,
                    password,
                }
            );

            const { token } = res.data;
            localStorage.setItem("token", token);

            const decodedToken = JSON.parse(atob(token.split(".")[1]));
            const userRole = decodedToken.role;

            navigate("/");

        } catch (error) {
            alert("Sai thông tin đăng nhập!");
        }
    };

    return (
        <div className="auth-container">
            <h2>Đăng nhập</h2>
            <div className="auth-form-group">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="auth-form-group">
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button className="auth-btn" onClick={login}>
                Đăng nhập
            </button>
            <div className="auth-link-group">
                <span>Chưa có tài khoản? </span>
                <button
                    className="auth-link-btn"
                    onClick={() => navigate("/register")}
                >
                    Đăng ký
                </button>
            </div>
        </div>
    );
}
