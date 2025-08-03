import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/homePage/Navbar";
import Footer from "../../components/Footer";
import "../../styles/CandidateDetailPage.css";
import axios from "axios";

const CandidateDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isEmployerView = location.pathname.startsWith("/employer/");

    useEffect(() => {
        const fetchCandidateDetail = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3001/api/candidates/${id}`
                );
                setCandidate(response.data);
            } catch (error) {
                console.error("Error fetching candidate details:", error);
                setError("Không thể tải thông tin ứng viên");
            } finally {
                setLoading(false);
            }
        };

        fetchCandidateDetail();
    }, [id]);

    const handleGoBack = () => {
        if (isEmployerView) {
            navigate(-1);
        } else {
            navigate("/candidates");
        }
    };

    if (loading) return <div className="loading">Đang tải...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!candidate) return <div className="error">Không tìm thấy ứng viên</div>;

    const formatBirthDate = (dateString) => {
        if (!dateString) return "Chưa cập nhật";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN");
    };

    return (
        <div className="candidate-detail-page">
            {!isEmployerView && <Navbar />}
            <div className="candidate-detail-banner">
                <div className="candidate-detail-banner-content">
                    <div className="breadcrumb">
                        {isEmployerView ? (
                            <>
                                <button
                                    onClick={handleGoBack}
                                    className="btn-back-link"
                                >
                                    ← Quay lại danh sách ứng viên
                                </button>
                                <span> &gt; Chi tiết ứng viên</span>
                            </>
                        ) : (
                            <>
                                <Link to="/">Trang chủ</Link> &gt;
                                <Link to="/candidates">
                                    Danh sách ứng viên
                                </Link>{" "}
                                &gt; Chi tiết ứng viên
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="candidate-detail-container">
                <div className="candidate-header">
                    <div className="candidate-avatar">
                        <img
                            src={candidate.profile_picture || "/logo.png"}
                            alt={candidate.name}
                            onError={(e) => {
                                e.target.src = "/logo.png";
                            }}
                        />
                    </div>
                    <div className="candidate-basic-info">
                        <div className="candidate-name-section">
                            <h1 className="candidate-name">{candidate.name}</h1>
                            <span className="candidate-location">
                                📍 {candidate.location_name}
                            </span>
                            <p className="candidate-position">
                                {candidate.position_name}
                            </p>
                        </div>
                        <div className="candidate-status">
                            {candidate.status === "active" && (
                                <span className="status-badge active">
                                    ✓ Đã sẵn sàng ứng tuyển
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="candidate-actions">
                        {candidate.resume_file ? (
                            <a
                                href={`http://localhost:3001${candidate.resume_file}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-contact"
                            >
                                📄 Xem CV Ứng Viên
                            </a>
                        ) : (
                            <button className="btn-contact disabled" disabled>
                                Chưa có CV
                            </button>
                        )}
                    </div>
                </div>

                <div className="candidate-detail-content">
                    <div className="candidate-main-content">
                        {candidate.career_objective && (
                            <section className="candidate-section">
                                <h2 className="section-title">
                                    Kinh nghiệm thực tế
                                </h2>
                                <div className="section-content">
                                    <p>{candidate.career_objective}</p>
                                </div>
                            </section>
                        )}

                        {candidate.work_preference &&
                            candidate.work_preference.length > 0 && (
                                <section className="candidate-section">
                                    <h2 className="section-title">
                                        Nơi làm việc mong muốn:
                                    </h2>
                                    <div className="section-content">
                                        <p>
                                            {candidate.work_preference.join(
                                                ", "
                                            )}
                                        </p>
                                    </div>
                                </section>
                            )}

                        {candidate.professional_skills &&
                            candidate.professional_skills.length > 0 && (
                                <section className="candidate-section">
                                    <h2 className="section-title">
                                        Kỹ năng chuyên môn
                                    </h2>
                                    <div className="skills-list">
                                        {candidate.professional_skills.map(
                                            (skill, index) => (
                                                <div
                                                    key={index}
                                                    className="skill-item"
                                                >
                                                    <span className="skill-icon">
                                                        ▶
                                                    </span>
                                                    <span className="skill-text">
                                                        {skill}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </section>
                            )}

                        {candidate.soft_skills &&
                            candidate.soft_skills.length > 0 && (
                                <section className="candidate-section">
                                    <h2 className="section-title">
                                        Kỹ năng mềm
                                    </h2>
                                    <div className="skills-list">
                                        {candidate.soft_skills.map(
                                            (skill, index) => (
                                                <div
                                                    key={index}
                                                    className="skill-item"
                                                >
                                                    <span className="skill-icon">
                                                        ▶
                                                    </span>
                                                    <span className="skill-text">
                                                        {skill}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </section>
                            )}
                        {candidate.skills && candidate.skills.length > 0 && (
                            <section className="candidate-section">
                                <h2 className="section-title">Kỹ năng khác</h2>
                                <div className="skills-list">
                                    {candidate.skills.map((skill, index) => (
                                        <div key={index} className="skill-item">
                                            <span className="skill-icon">
                                                ▶
                                            </span>
                                            <span className="skill-text">
                                                {skill}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="candidate-sidebar">
                        <div className="candidate-info-card">
                            <h3 className="info-card-title">
                                Thông tin cá nhân
                            </h3>

                            <div className="info-item">
                                <div className="info-icon">📅</div>
                                <div className="info-content">
                                    <div className="info-label">Ngày sinh</div>
                                    <div className="info-value">
                                        {formatBirthDate(candidate.birth_date)}
                                    </div>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon">👤</div>
                                <div className="info-content">
                                    <div className="info-label">Giới tính</div>
                                    <div className="info-value">
                                        {candidate.gender || "Chưa cập nhật"}
                                    </div>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon">💍</div>
                                <div className="info-content">
                                    <div className="info-label">
                                        Tình trạng hôn nhân
                                    </div>
                                    <div className="info-value">
                                        {candidate.marital_status ||
                                            "Chưa cập nhật"}
                                    </div>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon">📍</div>
                                <div className="info-content">
                                    <div className="info-label">Địa chỉ</div>
                                    <div className="info-details">
                                        <div className="info-sub">
                                            Tỉnh/Thành phố:
                                        </div>
                                        <div className="info-value">
                                            {candidate.location_name}
                                        </div>
                                        <div className="info-sub">
                                            Quận/Huyện:
                                        </div>
                                        <div className="info-value">
                                            {candidate.address ||
                                                "Chưa cập nhật"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="candidate-work-info">
                            <h3 className="section-title">
                                Thông tin công việc
                            </h3>

                            <div className="work-info-item">
                                <span className="work-label">
                                    Lĩnh vực nghề nghiệp:
                                </span>
                                <span className="work-value">
                                    {candidate.category_name}
                                </span>
                            </div>

                            <div className="work-info-item">
                                <span className="work-label">
                                    Kinh nghiệm làm việc:
                                </span>
                                <span className="work-value">
                                    {candidate.experience_level}
                                </span>
                            </div>

                            <div className="work-info-item">
                                <span className="work-label">
                                    Cấp bậc làm việc mong muốn:
                                </span>
                                <span className="work-value">
                                    {candidate.position_name}
                                </span>
                            </div>

                            <div className="work-info-item">
                                <span className="work-label">
                                    Mức lương mong muốn:
                                </span>
                                <span className="work-value">
                                    {candidate.salary_expectation
                                        ? `${candidate.salary_expectation.toLocaleString()} VNĐ`
                                        : "Thỏa thuận"}
                                </span>
                            </div>
                        </div>
                        {isEmployerView && (
                            <div className="contact-section">
                                <a
                                    href={`mailto:${candidate.email}`}
                                    className="btn-contact-email"
                                >
                                    📧 Gửi Email liên hệ
                                </a>
                                {candidate.phone && (
                                    <a
                                        href={`tel:${candidate.phone}`}
                                        className="btn-contact-phone"
                                    >
                                        📞 Gọi điện thoại
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {!isEmployerView && <Footer />}
        </div>
    );
};

export default CandidateDetailPage;
