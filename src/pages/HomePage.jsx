import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <div>
            <h1>Đây là Trang Chủ</h1>
            <div>
                <Link to="/login">
                    <button>Đăng nhập</button>
                </Link>
                <Link to="/register">
                    <button>Đăng ký</button>
                </Link>
            </div>
        </div>
    );
}
