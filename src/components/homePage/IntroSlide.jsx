import { useState, useEffect } from "react";
import "../../styles/IntroSlide.css";
import axios from "axios";

export default function IntroSlide() {
    const [title, setTitle] = useState(
        "Tìm Việc Làm Theo Mong Muốn Của Bạn Ngay Hôm Nay!"
    );
    const [subtitle, setSubtitle] = useState(
        "Tìm Việc Làm Mơ Ước Của Bạn Ngay Hôm Nay!"
    );
    const [buttonText, setButtonText] = useState("Tìm việc ngay");
    const [buttonLink, setButtonLink] = useState("/jobs");

    useEffect(() => {
        const fetchHomePageSettings = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3001/api/homepage-settings"
                );
                const data = response.data;

                if (data) {
                    setTitle(data.title || title);
                    setSubtitle(data.subtitle || subtitle);
                    setButtonText(data.buttonText || buttonText);
                    setButtonLink(data.buttonLink || buttonLink);
                }
            } catch (error) {
                console.error("Lỗi khi lấy cài đặt trang chủ", error);
            }
        };

        fetchHomePageSettings();
    }, []);

    return (
        <div className="intro-slide">
            <div className="left">
                <img src="/slide1.png" alt="Work Environment" />{" "}
            </div>
            <div className="right">
                <h1>{title}</h1>
                <p>{subtitle}</p>
                <a href={buttonLink}>
                    <button className="cta-btn">{buttonText}</button>
                </a>
            </div>
        </div>
    );
}
