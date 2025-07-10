import { Route, Routes } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import StatsPage from "./StatsPage";
import ManageHomePage from "./ManageHomePage";
import ManageUsersPage from "./ManageUsersPage";
import "../../styles/AdminDashboard.css";

export default function AdminDashboard() {
    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="content">
                <Routes>
                    <Route path="/stats" element={<StatsPage />} />
                    <Route path="/manage-home" element={<ManageHomePage />} />
                    <Route path="/manage-users" element={<ManageUsersPage />} />
                </Routes>
            </div>
        </div>
    );
}
