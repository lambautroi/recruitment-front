import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
    const location = useLocation();

    return (
        <div className="sidebar">
            <h2>Admin Dashboard</h2>
            <Nav className="sidebar-nav">
                <Nav.Link
                    as={Link}
                    to="/admin-dashboard/stats"
                    className={
                        location.pathname === "/admin-dashboard/stats"
                            ? "active-link"
                            : ""
                    }
                >
                    Trang thống kê
                </Nav.Link>
                <Nav.Link
                    as={Link}
                    to="/admin-dashboard/manage-home"
                    className={
                        location.pathname === "/admin-dashboard/manage-home"
                            ? "active-link"
                            : ""
                    }
                >
                    Quản lý trang chủ
                </Nav.Link>
                <Nav.Link
                    as={Link}
                    to="/admin-dashboard/manage-users"
                    className={
                        location.pathname === "/admin-dashboard/manage-users"
                            ? "active-link"
                            : ""
                    }
                >
                    Quản lý người dùng
                </Nav.Link>
            </Nav>
        </div>
    );
}
