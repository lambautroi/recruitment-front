import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/homePage/Navbar";
import Footer from "../../components/Footer";
import ApplyJobModal from "../../components/ApplyJobModal";
import "../../styles/JobDetailPage.css";

export default function JobDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [candidateInfo, setCandidateInfo] = useState(null);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [isJobSaved, setIsJobSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [applicationStatus, setApplicationStatus] = useState(null);
    const [isApplicationLoading, setIsApplicationLoading] = useState(false);

    useEffect(() => {
        const fetchJobDetail = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `http://localhost:3001/api/jobs/${id}`
                );
                setJob(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy chi tiết công việc", error);
                setError("Không thể tải thông tin công việc");
            } finally {
                setLoading(false);
            }
        };

        const checkAuthAndCandidateInfo = async () => {
            const token = localStorage.getItem("token");
            const role = localStorage.getItem("role");

            if (token && role === "user") {
                setIsLoggedIn(true);
                setUserRole(role);

                try {
                    const candidateResponse = await axios.get(
                        "http://localhost:3001/api/candidate/profile",
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    setCandidateInfo(candidateResponse.data);

                    const applicationResponse = await axios.get(
                        `http://localhost:3001/api/candidate/application-status/${id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    setApplicationStatus(applicationResponse.data.status);

                    const savedJobsResponse = await axios.get(
                        "http://localhost:3001/api/candidate/saved-jobs",
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    const isSaved = savedJobsResponse.data.some(
                        (saved) => saved.job._id === id
                    );
                    setIsJobSaved(isSaved);
                } catch (error) {
                    if (error.response?.status === 401) {
                        localStorage.removeItem("token");
                        localStorage.removeItem("role");
                        setIsLoggedIn(false);
                        setUserRole(null);
                    }
                }
            } else {
                console.log("Not logged in or not user role");
            }
        };

        if (id) {
            fetchJobDetail();
            checkAuthAndCandidateInfo();
        }
    }, [id]);

    // Handle apply job
    const handleApplyJob = async (applicationData) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "http://localhost:3001/api/candidate/apply-job",
                applicationData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setApplicationStatus("pending");
            alert("Ứng tuyển thành công!");
        } catch (error) {
            console.error("Error applying for job:", error);
            const message =
                error.response?.data?.message || "Có lỗi xảy ra khi ứng tuyển";
            alert(message);
            throw error;
        }
    };

    // Handle save/unsave job
    const handleSaveJob = async () => {
        if (!isLoggedIn || userRole !== "user") {
            alert(
                "Bạn cần đăng nhập với tài khoản ứng viên để lưu tin tuyển dụng"
            );
            navigate("/login");
            return;
        }

        setIsSaving(true);

        try {
            const token = localStorage.getItem("token");

            if (isJobSaved) {
                const savedJobsResponse = await axios.get(
                    "http://localhost:3001/api/candidate/saved-jobs",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const savedJob = savedJobsResponse.data.find(
                    (saved) => saved.job._id === id
                );

                if (savedJob) {
                    await axios.delete(
                        `http://localhost:3001/api/candidate/saved-jobs/${savedJob._id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    setIsJobSaved(false);
                    alert("Đã bỏ lưu tin tuyển dụng");
                }
            } else {
                await axios.post(
                    "http://localhost:3001/api/candidate/save-job",
                    { job_id: id },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setIsJobSaved(true);
                alert("Đã lưu tin tuyển dụng");
            }
        } catch (error) {
            console.error("Error saving job:", error);
            const message = error.response?.data?.message || "Có lỗi xảy ra";
            alert(message);
        } finally {
            setIsSaving(false);
        }
    };

    // Handle apply button click
    const handleApplyButtonClick = () => {
        if (!isLoggedIn || userRole !== "user") {
            alert("Bạn cần đăng nhập với tài khoản ứng viên để ứng tuyển");
            return;
        }

        if (applicationStatus) {
            alert("Bạn đã ứng tuyển công việc này rồi!");
            return;
        }

        if (!candidateInfo?.resume_file) {
            alert(
                "Bạn cần tải lên CV trước khi ứng tuyển. Vui lòng cập nhật thông tin cá nhân."
            );
            navigate("/candidate/profile");
            return;
        }

        setIsApplyModalOpen(true);
    };

    // Function để render button text dựa trên trạng thái
    const getApplyButtonText = () => {
        if (!isLoggedIn || userRole !== "user") {
            return "Ứng tuyển ngay";
        }

        if (applicationStatus === "pending") {
            return "Đã ứng tuyển";
        } else if (applicationStatus === "accepted") {
            return "Đã được chấp nhận";
        } else if (applicationStatus === "rejected") {
            return "Đã từ chối";
        }

        return "📝 Ứng tuyển ngay";
    };

    // Function để render button class
    const getApplyButtonClass = () => {
        if (applicationStatus === "pending") {
            return "apply-button applied-pending";
        } else if (applicationStatus === "accepted") {
            return "apply-button applied-accepted";
        } else if (applicationStatus === "rejected") {
            return "apply-button applied-rejected";
        }

        return "apply-button";
    };

    const formatSalaryRange = (salaryRange) => {
        if (salaryRange && salaryRange.includes("-")) {
            const [minSalary, maxSalary] = salaryRange.split("-");
            return `${new Intl.NumberFormat("vi-VN").format(
                parseInt(minSalary)
            )} - ${new Intl.NumberFormat("vi-VN").format(
                parseInt(maxSalary)
            )} VND`;
        }
        return salaryRange || "Thỏa thuận";
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("vi-VN");
    };

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="job-detail-loading">
                    <p>Đang tải thông tin công việc...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !job) {
        return (
            <div>
                <Navbar />
                <div className="job-detail-error">
                    <p>{error || "Không tìm thấy thông tin công việc"}</p>
                    <Link to="/jobs" className="back-link">
                        Quay lại danh sách việc làm
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const jobDesc = job.job_description || {};

    return (
        <div>
            <Navbar />
            <div className="job-detail-banner">
                <div className="job-detail-banner-content">
                    <div className="breadcrumb">
                        <Link to="/">Trang chủ</Link> &gt;
                        <Link to="/jobs">Danh sách tuyển dụng</Link> &gt; Chi
                        tiết công việc
                    </div>
                </div>
            </div>

            <div className="job-detail-container">
                <div className="job-header">
                    <div className="company-info">
                        <div className="company-logo">
                            <img
                                src={job.employer?.logo || "/employer-logo.png"}
                                alt="Company Logo"
                                onError={(e) => {
                                    e.target.src =
                                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMTIiIGZpbGw9IiMzMzczZGMiLz4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjI0IiBmb250LWZhbWlseT0iQXJpYWwiPkM8L3RleHQ+Cjwvc3ZnPgo=";
                                }}
                            />
                        </div>
                        <div className="company-details">
                            <h1 className="job-title">{job.title}</h1>
                            <h2 className="company-name">
                                {job.employer?.name}
                            </h2>
                            <div className="job-meta">
                                <span className="job-location">
                                    📍 {job.location_name}
                                </span>
                                <span className="job-type">
                                    • {job.form_name}
                                </span>
                                <span className="job-category">
                                    • {job.category_name}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="job-actions">
                        <button
                            className={getApplyButtonClass()}
                            onClick={handleApplyButtonClick}
                            disabled={applicationStatus !== null}
                        >
                            {getApplyButtonText()}
                        </button>

                        <button
                            className={`save-button ${
                                isJobSaved ? "saved" : ""
                            }`}
                            onClick={handleSaveJob}
                            disabled={isSaving}
                        >
                            {isSaving
                                ? "⏳ Đang xử lý..."
                                : isJobSaved
                                ? "❤️ Đã lưu tin"
                                : "💾 Lưu tin"}
                        </button>
                    </div>
                </div>

                <div className="job-content">
                    <div className="job-main-content">
                        <div className="job-section">
                            <h3>Thông tin cơ bản</h3>
                            <div className="basic-info-grid">
                                <div className="info-item">
                                    <span className="label">
                                        Số lượng tuyển:
                                    </span>
                                    <span className="value">
                                        {job.quantity ||
                                            jobDesc.basic_info?.quantity ||
                                            1}{" "}
                                        người
                                    </span>
                                </div>
                                <div className="info-item">
                                    <span className="label">
                                        Hình thức làm việc:
                                    </span>
                                    <span className="value">
                                        {job.form_name}
                                    </span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Cấp bậc:</span>
                                    <span className="value">
                                        {job.position_name}
                                    </span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Kinh nghiệm:</span>
                                    <span className="value">
                                        {job.experience_level}
                                    </span>
                                </div>
                                <div className="info-item">
                                    <span className="label">
                                        Trình độ học vấn:
                                    </span>
                                    <span className="value">
                                        {job.education_level}
                                    </span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Mức lương:</span>
                                    <span className="value salary">
                                        {formatSalaryRange(job.salary_range)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {jobDesc.job_details && (
                            <div className="job-section">
                                <h3>Mô tả công việc</h3>
                                <div className="job-description">
                                    {jobDesc.job_details.position && (
                                        <div className="job-position">
                                            <strong>Vị trí: </strong>
                                            {jobDesc.job_details.position}
                                        </div>
                                    )}
                                    {jobDesc.job_details.workplace && (
                                        <div className="workplace">
                                            <strong>Nơi làm việc: </strong>
                                            {jobDesc.job_details.workplace}
                                        </div>
                                    )}
                                    {jobDesc.job_details.description &&
                                        Array.isArray(
                                            jobDesc.job_details.description
                                        ) && (
                                            <div className="job-tasks">
                                                <strong>
                                                    Công việc cần làm:
                                                </strong>
                                                <ul>
                                                    {jobDesc.job_details.description.map(
                                                        (task, index) => (
                                                            <li key={index}>
                                                                {task}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </div>
                                        )}
                                </div>
                            </div>
                        )}

                        {jobDesc.requirements && (
                            <div className="job-section">
                                <h3>Yêu cầu công việc</h3>
                                <div className="requirements">
                                    {jobDesc.requirements.work_experience && (
                                        <div className="requirement-group">
                                            <h4>Kinh nghiệm làm việc:</h4>
                                            <ul>
                                                {jobDesc.requirements.work_experience.map(
                                                    (exp, index) => (
                                                        <li key={index}>
                                                            {exp}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    )}

                                    {jobDesc.requirements
                                        .professional_skills && (
                                        <div className="requirement-group">
                                            <h4>Kỹ năng chuyên môn:</h4>
                                            <div className="skills-list">
                                                {jobDesc.requirements.professional_skills.map(
                                                    (skill, index) => (
                                                        <span
                                                            key={index}
                                                            className="skill-tag"
                                                        >
                                                            {skill}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {jobDesc.requirements.soft_skills && (
                                        <div className="requirement-group">
                                            <h4>Kỹ năng mềm:</h4>
                                            <ul>
                                                {jobDesc.requirements.soft_skills.map(
                                                    (skill, index) => (
                                                        <li key={index}>
                                                            {skill}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    )}

                                    {jobDesc.requirements.language && (
                                        <div className="requirement-group">
                                            <h4>Yêu cầu ngoại ngữ:</h4>
                                            <ul>
                                                {jobDesc.requirements.language.map(
                                                    (lang, index) => (
                                                        <li key={index}>
                                                            {lang}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {jobDesc.benefits && (
                            <div className="job-section">
                                <h3>Quyền lợi được hưởng</h3>
                                <div className="benefits">
                                    {jobDesc.benefits.insurance && (
                                        <ul>
                                            {jobDesc.benefits.insurance.map(
                                                (benefit, index) => (
                                                    <li key={index}>
                                                        {benefit}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        )}

                        {jobDesc.documents && (
                            <div className="job-section">
                                <h3>Hồ sơ cần nộp</h3>
                                <div className="documents">
                                    <ul>
                                        {jobDesc.documents.map((doc, index) => (
                                            <li key={index}>{doc}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="job-sidebar">
                        <div className="sidebar-section company-section">
                            <h3>Thông tin công ty</h3>
                            <div className="company-info-card">
                                <div className="company-logo-small">
                                    <img
                                        src={
                                            job.employer?.logo ||
                                            "/employer-logo.png"
                                        }
                                        alt="Company Logo"
                                        onError={(e) => {
                                            e.target.src =
                                                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzMzNzNkYyIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJBcmlhbCI+QzwvdGV4dD4KPHN2Zz4K";
                                        }}
                                    />
                                </div>
                                <div className="company-details-small">
                                    <h4>{job.employer?.name}</h4>
                                    <p>
                                        Lĩnh vực: {job.employer?.category_name}
                                    </p>
                                    <p>
                                        Địa điểm: {job.employer?.location_name}
                                    </p>
                                </div>
                            </div>
                            {job.employer?.description && (
                                <div className="company-description">
                                    <p>{job.employer.description}</p>
                                </div>
                            )}
                        </div>

                        {jobDesc.contact_info && (
                            <div className="sidebar-section contact-section">
                                <h3>Thông tin liên hệ</h3>
                                <div className="contact-info">
                                    {jobDesc.contact_info.address && (
                                        <div className="contact-item">
                                            <span className="contact-label">
                                                📍 Địa chỉ:
                                            </span>
                                            <span className="contact-value">
                                                {jobDesc.contact_info.address}
                                            </span>
                                        </div>
                                    )}
                                    {jobDesc.contact_info.phone && (
                                        <div className="contact-item">
                                            <span className="contact-label">
                                                📞 Điện thoại:
                                            </span>
                                            <span className="contact-value">
                                                {jobDesc.contact_info.phone}
                                            </span>
                                        </div>
                                    )}
                                    {jobDesc.contact_info.email && (
                                        <div className="contact-item">
                                            <span className="contact-label">
                                                📧 Email:
                                            </span>
                                            <span className="contact-value">
                                                {jobDesc.contact_info.email}
                                            </span>
                                        </div>
                                    )}
                                    {jobDesc.contact_info.website && (
                                        <div className="contact-item">
                                            <span className="contact-label">
                                                🌐 Website:
                                            </span>
                                            <a
                                                href={
                                                    jobDesc.contact_info.website
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="contact-value"
                                            >
                                                {jobDesc.contact_info.website}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="sidebar-section job-info-section">
                            <h3>Thông tin tin tuyển dụng</h3>
                            <div className="job-meta-info">
                                <div className="meta-item">
                                    <span className="meta-label">
                                        Ngày đăng:
                                    </span>
                                    <span className="meta-value">
                                        {formatDate(job.posted_at)}
                                    </span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">
                                        Hạn nộp hồ sơ:
                                    </span>
                                    <span className="meta-value">
                                        {formatDate(job.expiration_date)}
                                    </span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">
                                        Trạng thái:
                                    </span>
                                    <span
                                        className={`meta-value status ${job.status}`}
                                    >
                                        {job.status === "active"
                                            ? "Đang tuyển"
                                            : "Đã đóng"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ApplyJobModal
                isOpen={isApplyModalOpen}
                onClose={() => setIsApplyModalOpen(false)}
                job={job}
                candidateInfo={candidateInfo}
                onApply={handleApplyJob}
            />

            <Footer />
        </div>
    );
}
