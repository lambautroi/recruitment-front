import { useState, useEffect } from "react";
import "../../styles/FeaturedJobSlide.css";
import axios from "axios";

export default function FeaturedJobSlide() {
    const [featuredJobs, setFeaturedJobs] = useState([]);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        const fetchFeaturedJobs = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3001/api/featured-jobs"
                );
                setFeaturedJobs(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy tin tuyển dụng nổi bật", error);
            }
        };

        fetchFeaturedJobs();
    }, []);

    return (
        <div className="featured-job-slide">
            <h2 className="featured-job-slide-title">Tin Tuyển Dụng Nổi Bật</h2>
            <p className="featured-job-slide-subtitle">
                Tìm kiếm tin tuyển dụng nổi bật phù hợp với bạn!
            </p>

            <div className="category-tabs">
                {featuredJobs.map((category, index) => (
                    <div
                        key={index}
                        className={`category-tab ${
                            activeTab === index ? "active" : ""
                        }`}
                        onClick={() => setActiveTab(index)}
                    >
                        {category.categoryName}
                    </div>
                ))}
            </div>

            <div className="job-list">
                {featuredJobs[activeTab] &&
                    featuredJobs[activeTab].jobs.map((job, index) => (
                        <div key={index} className="job-card">
                            <div className="job-card-icon">
                                <img
                                    src="/logo-tin.jpg"
                                    alt="Logo"
                                    className="news-logo-img"
                                />
                            </div>
                            <h3>{job.title}</h3>
                            <p>
                                Toàn thời gian |{" "}
                                {job.posted_at
                                    ? `${new Date(
                                          job.posted_at
                                      ).toLocaleDateString()}`
                                    : ""}
                            </p>
                            <p>Cấp bậc: Nhân viên</p>
                            <p>Kinh nghiệm: Từ 2 - 3 năm</p>
                            <p>Trình độ: Đại học</p>
                            <p>Mức lương: {job.salary_range}</p>
                            <a href={`/job/${job._id}`} className="cta-btn">
                                Xem ngay
                            </a>
                        </div>
                    ))}
            </div>
        </div>
    );
}
