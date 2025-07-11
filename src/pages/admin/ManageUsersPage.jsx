import { useState, useEffect } from "react";

export default function ManageUsersPage() {
    const [userList, setUserList] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [editedFullName, setEditedFullName] = useState("");
    const [editedEmail, setEditedEmail] = useState("");
    const [editedPhone, setEditedPhone] = useState("");
    const [editedRole, setEditedRole] = useState("");

    // Fetch users automatically when component is mounted
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(
                "http://localhost:3001/api/auth/users"
            );
            const data = await response.json();
            setUserList(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setEditedFullName(user.fullName);
        setEditedEmail(user.email);
        setEditedPhone(user.phone);
        setEditedRole(user.role);
    };

    const handleSaveEdit = async () => {
        if (!editedFullName || !editedEmail || !editedPhone || !editedRole) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:3001/api/auth/users/${editingUser._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        fullName: editedFullName,
                        email: editedEmail,
                        phone: editedPhone,
                        role: editedRole,
                    }),
                }
            );

            if (response.ok) {
                alert("Cập nhật người dùng thành công!");
                setEditingUser(null);
                fetchUsers(); // Cập nhật lại danh sách người dùng
            } else {
                alert("Cập nhật người dùng thất bại!");
            }
        } catch (error) {
            alert("Có lỗi khi cập nhật người dùng");
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            const response = await fetch(
                `http://localhost:3001/api/auth/users/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                alert("Người dùng đã được xóa!");
                setUserList(userList.filter((user) => user._id !== id)); // Cập nhật lại danh sách người dùng
            } else {
                alert("Xóa người dùng thất bại!");
            }
        } catch (error) {
            alert("Có lỗi khi xóa người dùng");
        }
    };

    return (
        <div>
            <h2>Quản lý Người Dùng</h2>

            {editingUser ? (
                <div>
                    <h3>Chỉnh sửa người dùng</h3>
                    <div>
                        <input
                            type="text"
                            placeholder="Tên người dùng"
                            value={editedFullName}
                            onChange={(e) => setEditedFullName(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={editedEmail}
                            onChange={(e) => setEditedEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Số điện thoại"
                            value={editedPhone}
                            onChange={(e) => setEditedPhone(e.target.value)}
                        />
                    </div>
                    <div>
                        <select
                            value={editedRole}
                            onChange={(e) => setEditedRole(e.target.value)}
                        >
                            <option value="user">Người dùng</option>
                            <option value="employer">Doanh nghiệp</option>
                        </select>
                    </div>
                    <button onClick={handleSaveEdit}>Lưu thay đổi</button>
                    <button onClick={() => setEditingUser(null)}>Hủy</button>
                </div>
            ) : (
                <div>
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên</th>
                                <th>Email</th>
                                <th>Số điện thoại</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userList.map((user, index) => (
                                <tr key={user._id}>
                                    <td>{index + 1}</td>
                                    <td>{user.fullName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        <span
                                            role="button"
                                            onClick={() => handleEditUser(user)}
                                            style={{
                                                fontSize: "20px",
                                                cursor: "pointer",
                                                marginRight: "10px",
                                            }}
                                        >
                                            ✏️
                                        </span>
                                        <span
                                            role="button"
                                            onClick={() =>
                                                handleDeleteUser(user._id)
                                            }
                                            style={{
                                                fontSize: "20px",
                                                cursor: "pointer",
                                                color: "brown",
                                            }}
                                        >
                                            ❌
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
