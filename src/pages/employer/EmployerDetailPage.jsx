import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/homePage/Navbar";
import Footer from "../../components/Footer";
import "../../styles/EmployerDetailPage.css";
import axios from "axios";

const EmployerDetailPage = () => {
    const { id } = useParams();
    const [employerData, setEmployerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmployerDetail = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3001/api/companies/${id}`
                );
                setEmployerData(response.data);
            } catch (error) {
                console.error("Error fetching employer details:", error);
                setError("Không thể tải thông tin doanh nghiệp");
            } finally {
                setLoading(false);
            }
        };

        fetchEmployerDetail();
    }, [id]);

    if (loading) return <div className="loading">Đang tải...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!employerData)
        return <div className="error">Không tìm thấy doanh nghiệp</div>;

    const { employer, jobs } = employerData;

    // Format ngày thành lập
    const formatEstablishedDate = (dateString) => {
        if (!dateString) return "Chưa cập nhật";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN");
    };

    const getLogoUrl = (logoPath) => {
        if (!logoPath) return "/employer-logo.png";

        if (logoPath.startsWith("/uploads/")) {
            return `http://localhost:3001${logoPath}`;
        }

        if (logoPath.startsWith("http")) {
            return logoPath;
        }

        return "/employer-logo.png";
    };

    return (
        <div className = "employer-detail-page">
            <Navbar />
            <div className="employer-detail-banner">
                <div className="employer-detail-banner-content">
                    <div className="breadcrumb">
                        <Link to="/">Trang chủ</Link> &gt;
                        <Link to="/companies">Danh sách doanh nghiệp</Link> &gt;
                        Chi tiết doanh nghiệp
                    </div>
                </div>
            </div>

            <div className="employer-detail-container">
                {/* Header Section */}
                <div className="employer-header">
                    <div className="employer-logo">
                        <img
                            src={getLogoUrl(employer.logo)}
                            alt={employer.name}
                            onError={(e) => {
                                e.target.src = "/employer-logo.png";
                            }}
                        />
                    </div>
                    <div className="employer-basic-info">
                        <h1 className="employer-name">{employer.name}</h1>
                        <p className="employer-industry">
                            {employer.category_name}
                        </p>
                        <span className="employer-location">
                            📍 {employer.location_name}
                        </span>
                    </div>
                    <div className="employer-actions">
                        <button className="btn-contact">📞 Liên hệ ngay</button>
                    </div>
                </div>

                <div className="employer-detail-content">
                    {/* Left Column - Main Content */}
                    <div className="employer-main-content">
                        {/* Company Info Section */}
                        <section className="employer-section">
                            <div className="company-info-grid">
                                <div className="info-item">
                                    <span className="info-label">
                                        Tên Công Ty:
                                    </span>
                                    <span className="info-value">
                                        {employer.name}
                                    </span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">
                                        Lĩnh Vực Hoạt Động:
                                    </span>
                                    <span className="info-value">
                                        {employer.category_name}
                                    </span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Quy Mô:</span>
                                    <span className="info-value">
                                        {employer.company_size ||
                                            "Chưa cập nhật"}
                                    </span>
                                </div>
                            </div>
                        </section>

                        {/* Description Section */}
                        {employer.description && (
                            <section className="employer-section">
                                <h2 className="section-title">Giới Thiệu:</h2>
                                <div className="section-content">
                                    <p>{employer.description}</p>
                                </div>
                            </section>
                        )}

                        {/* Contact Section */}
                        <section className="employer-section">
                            <h2 className="section-title">Liên Hệ:</h2>
                            <div className="contact-list">
                                {employer.address && (
                                    <div className="contact-item">
                                        <span className="contact-label">
                                            Địa chỉ:
                                        </span>
                                        <span className="contact-value">
                                            {employer.address}
                                        </span>
                                    </div>
                                )}
                                {employer.phone && (
                                    <div className="contact-item">
                                        <span className="contact-label">
                                            Điện thoại:
                                        </span>
                                        <span className="contact-value">
                                            {employer.phone}
                                        </span>
                                    </div>
                                )}
                                {employer.email && (
                                    <div className="contact-item">
                                        <span className="contact-label">
                                            Email:
                                        </span>
                                        <span className="contact-value">
                                            {employer.email}
                                        </span>
                                    </div>
                                )}
                                {employer.website && (
                                    <div className="contact-item">
                                        <span className="contact-label">
                                            Website:
                                        </span>
                                        <span className="contact-value">
                                            <a
                                                href={employer.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {employer.website}
                                            </a>
                                        </span>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Jobs Section */}
                        <section className="employer-section">
                            <h2 className="section-title">
                                Danh sách tuyển dụng ({jobs.length} việc làm)
                            </h2>
                            <div className="jobs-list">
                                {jobs.length > 0 ? (
                                    jobs.map((job) => (
                                        <div key={job._id} className="job-item">
                                            <div className="job-item-header">
                                                <div className="job-logo">
                                                    <img
                                                        src={getLogoUrl(
                                                            employer.logo
                                                        )}
                                                        alt="Company Logo"
                                                        onError={(e) => {
                                                            e.target.src =
                                                                "/employer-logo.png";
                                                        }}
                                                    />
                                                </div>
                                                <div className="job-info">
                                                    <h3 className="job-title">
                                                        <Link
                                                            to={`/jobs/${job._id}`}
                                                        >
                                                            {job.title}
                                                        </Link>
                                                    </h3>
                                                    <p className="job-location-type">
                                                        {job.form_name} • 📍{" "}
                                                        {job.location_name}
                                                    </p>
                                                </div>
                                                <div className="job-category-badge">
                                                    {job.category_name}
                                                </div>
                                            </div>

                                            <div className="job-details">
                                                <div className="job-detail-item">
                                                    <span className="detail-label">
                                                        Cấp bậc tuyển dụng:
                                                    </span>
                                                    <span className="detail-value">
                                                        {job.position_name}
                                                    </span>
                                                </div>
                                                <div className="job-detail-item">
                                                    <span className="detail-label">
                                                        Kinh nghiệm:
                                                    </span>
                                                    <span className="detail-value">
                                                        {job.experience_name}
                                                    </span>
                                                </div>
                                                <div className="job-detail-item">
                                                    <span className="detail-label">
                                                        Trình độ học vấn:
                                                    </span>
                                                    <span className="detail-value">
                                                        {job.education_name}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="job-salary">
                                                <span className="salary-icon">
                                                    💰
                                                </span>
                                                <span className="salary-text">
                                                    {job.salary_range ||
                                                        "Thỏa thuận"}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-jobs">
                                        <p>
                                            Hiện tại công ty chưa có tin tuyển
                                            dụng nào.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right Column - Company Info Card */}
                    <div className="employer-sidebar">
                        <div className="employer-info-card">
                            <h3 className="info-card-title">{employer.name}</h3>
                            <p className="company-category">
                                📍 {employer.location_name}
                            </p>
                            <p className="company-industry">
                                {employer.category_name}
                            </p>

                            <div className="company-details">
                                {employer.established_date && (
                                    <div className="detail-row">
                                        <span className="detail-icon">📅</span>
                                        <div className="detail-content">
                                            <div className="detail-label">
                                                Ngày thành lập
                                            </div>
                                            <div className="detail-value">
                                                {formatEstablishedDate(
                                                    employer.established_date
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {employer.tax_code && (
                                    <div className="detail-row">
                                        <span className="detail-icon">🏢</span>
                                        <div className="detail-content">
                                            <div className="detail-label">
                                                Mã số thuế
                                            </div>
                                            <div className="detail-value">
                                                {employer.tax_code}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="detail-row">
                                    <span className="detail-icon">📊</span>
                                    <div className="detail-content">
                                        <div className="detail-label">
                                            Lĩnh vực hoạt động
                                        </div>
                                        <div className="detail-value">
                                            {employer.category_name}
                                        </div>
                                    </div>
                                </div>

                                <div className="detail-row">
                                    <span className="detail-icon">📍</span>
                                    <div className="detail-content">
                                        <div className="detail-label">
                                            Địa chỉ
                                        </div>
                                        <div className="detail-sub">
                                            Tỉnh/Thành phố:
                                        </div>
                                        <div className="detail-value">
                                            {employer.location_name}
                                        </div>
                                        {employer.address && (
                                            <>
                                                <div className="detail-sub">
                                                    Địa chỉ chi tiết:
                                                </div>
                                                <div className="detail-value">
                                                    {employer.address}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="contact-actions">
                                <button className="btn-send-email">
                                    📧 Gửi email liên hệ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default EmployerDetailPage;
