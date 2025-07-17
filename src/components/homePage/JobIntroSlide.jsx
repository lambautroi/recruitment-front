import "../../styles/JobIntroSlide.css";
import React from "react";

export default function JobIntroSlide() {
    const title = "Tìm Công Việc Phù Hợp Với Bạn Ngay Hôm Nay!";
    const subtitle = "Rất nhiều việc làm hấp dẫn đang đợi bạn.";
    const description =
        "Đây là hệ thống tuyển dụng hàng đầu, cung cấp các công việc đa dạng và hấp dẫn, phù hợp với mọi đối tượng người tìm việc.";
    const ctaText = "Tìm Việc Ngay";
    const ctaLink = "/jobs";

    return (
        <div className="job-intro-slide">
            <div className="left">
                <h2 className="subtitle">{subtitle}</h2>
                <h1 className="title">{title}</h1>
                <p className="description">{description}</p>
                <a href={ctaLink}>
                    <button className="cta-btn">{ctaText}</button>
                </a>
            </div>
            <div className="right">
                <img
                    src="anh-web-tim-viec.jpg"
                    alt="Teamwork Illustration"
                    className="illustration"
                />
            </div>
        </div>
    );
}
