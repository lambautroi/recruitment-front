import { useState } from "react";

export default function ManageHomePage() {
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [buttonText, setButtonText] = useState("");
    const [buttonLink, setButtonLink] = useState("");

    const saveHomePageSettings = () => {
        // Xử lý lưu cài đặt trang chủ
        alert("Cài đặt trang chủ đã được lưu.");
    };

    return (
        <div>
            <h2>Quản lý Trang Chủ</h2>
            <div>
                <input
                    type="text"
                    placeholder="Tiêu đề chính"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Tiêu đề phụ"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Tên nút bấm"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Đường dẫn tới nút nhấn"
                    value={buttonLink}
                    onChange={(e) => setButtonLink(e.target.value)}
                />
                <button onClick={saveHomePageSettings}>Lưu cài đặt</button>
            </div>
        </div>
    );
}
