import { useState, useEffect } from "react";
import "../../styles/StatsAndEmployerSlide.css";
import axios from "axios";

export default function StatsAndEmployerSlide() {
    const [stats, setStats] = useState({
        jobCount: 0,
        employerCount: 0,
        userCount: 0,
        categoryCount: 0,
    });

    const [employers, setEmployers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Lấy thống kê tổng quan
        const fetchStats = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3001/api/stats/stats"
                );
                setStats(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy thống kê", error);
            }
        };

        // Lấy danh sách công ty/doanh nghiệp nổi bật
        const fetchEmployers = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3001/api/stats/employers"
                );
                setEmployers(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách công ty", error);
            }
        };

        fetchStats();
        fetchEmployers();
    }, []);

    const nextSlide = () => {
        if (currentIndex < employers.length / 4 - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    // Hàm để chuyển tới nhóm công ty trước đó
    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    // Lấy 4 công ty trong nhóm hiện tại
    const currentEmployers = employers.slice(
        currentIndex * 4,
        (currentIndex + 1) * 4
    );

    return (
        <div className="stats-and-employer-slide">
            <div className="stats-panel">
                <div className="stat-item">
                    <h3>{stats.jobCount}</h3>
                    <p>Số lượng tin tuyển dụng</p>
                </div>
                <div className="stat-item">
                    <h3>{stats.employerCount}</h3>
                    <p>Số lượng công ty/doanh nghiệp</p>
                </div>
                <div className="stat-item">
                    <h3>{stats.userCount}</h3>
                    <p>Số lượng ứng viên</p>
                </div>
                <div className="stat-item">
                    <h3>{stats.categoryCount}</h3>
                    <p>Số lượng lĩnh vực nghề nghiệp</p>
                </div>
            </div>

            <div className="employer-slide">
                <h2>Công Ty/Doanh Nghiệp Tuyển Dụng Nổi Bật</h2>
                <p>
                    Danh sách các công ty/doanh nghiệp thường xuyên có nhu cầu
                    tuyển dụng.
                </p>

                <div className="employer-cards">
                    {currentEmployers.map((employer, index) => (
                        <div key={index} className="employer-card">
                            <div className="employer-logo">
                                <img
                                    src="/employer-logo.png"
                                    alt="Employer Logo"
                                />
                            </div>
                            <h3>{employer.employerName}</h3>
                            <p>Địa điểm: {employer.employerLocation}</p>
                            <p>Số lượng tin tuyển dụng: {employer.jobCount}</p>
                        </div>
                    ))}
                </div>

                <div className="navigation">
                    <button onClick={prevSlide} disabled={currentIndex === 0}>
                        ←
                    </button>
                    <button
                        onClick={nextSlide}
                        disabled={
                            currentIndex >= Math.ceil(employers.length / 4) - 1
                        }
                    >
                        →
                    </button>
                </div>
            </div>
        </div>
    );
}
