import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Sidebar() {
    return (
        <div className="sidebar">
            <h2>Admin Dashboard</h2>
            <Nav defaultActiveKey="/stats" className="flex-column">
                <Nav.Link as={Link} to="/admin-dashboard/stats">
                    Trang thống kê
                </Nav.Link>
                <Nav.Link as={Link} to="/admin-dashboard/manage-home">
                    Quản lý trang chủ
                </Nav.Link>
                <Nav.Link as={Link} to="/admin-dashboard/manage-users">
                    Quản lý người dùng
                </Nav.Link>
            </Nav>
        </div>
    );
}
