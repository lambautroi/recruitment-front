import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/AuthPage.css";

export default function RegisterPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("user");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const register = async () => {
        if (password !== confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }

        if (
            !fullName.trim() ||
            !email.trim() ||
            !phone.trim() ||
            !password.trim()
        ) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        if (password.length < 6) {
            alert("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(
                "http://localhost:3001/api/auth/register",
                {
                    fullName,
                    email,
                    phone,
                    password,
                    confirmPassword,
                    role,
                }
            );

            alert("Đăng ký thành công!");

            if (res.data.redirect) {
                navigate("/login");
            } else {
                navigate("/login");
            }
        } catch (error) {
            console.error("Registration error:", error);

            const errorMessage =
                error.response?.data?.message || "Có lỗi xảy ra khi đăng ký!";
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>Đăng ký</h2>
            <div className="auth-form-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Tên người ứng tuyển / Tên doanh nghiệp"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={loading}
                />
            </div>
            <div className="auth-form-group">
                <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                />
            </div>
            <div className="auth-form-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Số điện thoại"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={loading}
                />
            </div>
            <div className="auth-form-group">
                <input
                    type="password"
                    className="form-control"
                    placeholder="Mật khẩu (tối thiểu 6 ký tự)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                />
            </div>
            <div className="auth-form-group">
                <input
                    type="password"
                    className="form-control"
                    placeholder="Xác nhận mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                />
            </div>
            <div className="auth-form-group">
                <select
                    className="form-control"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={loading}
                >
                    <option value="user">Người ứng tuyển</option>
                    <option value="employer">Doanh nghiệp</option>
                </select>
            </div>
            <button className="auth-btn" onClick={register} disabled={loading}>
                {loading ? "Đang đăng ký..." : "Đăng ký"}
            </button>
            <div className="auth-link-group">
                <span>Đã có tài khoản? </span>
                <button
                    className="auth-link-btn"
                    onClick={() => navigate("/login")}
                    disabled={loading}
                >
                    Đăng nhập
                </button>
            </div>
        </div>
    );
}
