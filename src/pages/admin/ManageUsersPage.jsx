import { useState } from "react";

export default function ManageUsersPage() {
    const [userList, setUserList] = useState([]);

    const fetchUsers = async () => {
        // Fetch danh sách người dùng từ API
        const response = await fetch("http://localhost:3001/api/users");
        const data = await response.json();
        setUserList(data);
    };

    const handleAddUser = () => {
        // Thêm người dùng mới
        alert("Thêm người dùng thành công");
    };

    const handleEditUser = (id) => {
        // Sửa thông tin người dùng
        alert(`Chỉnh sửa người dùng ${id}`);
    };

    const handleDeleteUser = (id) => {
        // Xóa người dùng
        alert(`Xóa người dùng ${id}`);
    };

    return (
        <div>
            <h2>Quản lý Người Dùng</h2>
            <button onClick={fetchUsers}>Tải người dùng</button>
            <div>
                <button onClick={handleAddUser}>Thêm người dùng</button>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userList.map((user) => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button
                                        onClick={() => handleEditUser(user._id)}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDeleteUser(user._id)
                                        }
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
