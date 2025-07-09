import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/RegisterPage.css";

export default function RegisterPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("user");
    const navigate = useNavigate();

    const register = async () => {
        if (password !== confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }
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
            navigate("/login");
        } catch (error) {
            alert("Có lỗi xảy ra khi đăng ký!");
        }
    };

    return (
        <div className="register-container">
            <h2>Đăng ký</h2>
            <div className="form-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Tên người ứng tuyển / Tên doanh nghiệp"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />
            </div>
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
                    type="text"
                    className="form-control"
                    placeholder="Số điện thoại"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
            <div className="form-group">
                <input
                    type="password"
                    className="form-control"
                    placeholder="Xác nhận mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>
            <div className="form-group">
                <select
                    className="form-control"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="user">Người ứng tuyển</option>
                    <option value="employer">Doanh nghiệp</option>
                </select>
            </div>
            <button className="btn btn-primary" onClick={register}>
                Đăng ký
            </button>
            <div className="already-account">
                <span>Đã có tài khoản? </span>
                <button
                    className="btn btn-link"
                    onClick={() => navigate("/login")}
                >
                    Đăng nhập
                </button>
            </div>
        </div>
    );
}
