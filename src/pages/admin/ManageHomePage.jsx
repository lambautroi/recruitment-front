import { useState, useEffect } from "react";
import "../../styles/HomePageSetting.css";
import axios from "axios";

export default function ManageHomePage() {
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [buttonText, setButtonText] = useState("");
    const [buttonLink, setButtonLink] = useState("");

    useEffect(() => {
        const fetchHomePageSettings = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3001/api/homepage-settings"
                );
                const data = response.data;

                if (data) {
                    setTitle(data.title || "");
                    setSubtitle(data.subtitle || "");
                    setButtonText(data.buttonText || "");
                    setButtonLink(data.buttonLink || "");
                }
            } catch (error) {
                console.error("Lỗi khi lấy cài đặt trang chủ", error);
            }
        };

        fetchHomePageSettings();
    }, []);

    // Lưu cài đặt trang chủ
    const saveHomePageSettings = async () => {
        try {
            const response = await axios.post(
                "http://localhost:3001/api/save-homepage-settings",
                {
                    title,
                    subtitle,
                    buttonText,
                    buttonLink,
                }
            );

            alert(response.data.message);
        } catch (error) {
            alert("Có lỗi khi lưu cài đặt trang chủ");
            console.error("Error saving homepage settings", error);
        }
    };

    return (
        <div className="homepage-setting-container">
            <h2>Quản lý Trang Chủ</h2>
            <form
                className="homepage-setting-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    saveHomePageSettings();
                }}
            >
                <label>Tiêu đề chính</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <label>Tiêu đề phụ</label>
                <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                />
                <label>Tên nút bấm</label>
                <input
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                />
                <label>Đường dẫn tới nút nhấn</label>
                <input
                    type="text"
                    value={buttonLink}
                    onChange={(e) => setButtonLink(e.target.value)}
                />
                <button type="submit">Lưu cài đặt</button>
            </form>
        </div>
    );
}
