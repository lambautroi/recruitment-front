import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/AppliedJobs.css";

const AppliedJobs = ({ userInfo }) => {
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    useEffect(() => {
        fetchAppliedJobs();
    }, []);

    const fetchAppliedJobs = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3001/api/candidate/applied-jobs",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            setAppliedJobs(response.data);
        } catch (error) {
            console.error("Error fetching applied jobs:", error);
        } finally {
            setLoading(false);
        }
    };

    const getFileUrl = (filePath) => {
        if (!filePath) return "";
        if (filePath.startsWith("/uploads/")) {
            return `http://localhost:3001${filePath}`;
        }
        return filePath;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    const getTimeAgo = (days) => {
        if (days === 0) return "Hôm nay";
        if (days === 1) return "Hôm qua";
        if (days < 7) return `${days} ngày trước`;
        if (days < 30) return `${Math.floor(days / 7)} tuần trước`;
        return `${Math.floor(days / 30)} tháng trước`;
    };

    // Filter và sort logic
    const filteredJobs = appliedJobs.filter((app) => {
        if (filter === "all") return true;
        return app.status === filter;
    });

    const sortedJobs = [...filteredJobs].sort((a, b) => {
        switch (sortBy) {
            case "newest":
                return new Date(b.applied_date) - new Date(a.applied_date);
            case "oldest":
                return new Date(a.applied_date) - new Date(b.applied_date);
            case "company":
                return a.job.employer_name.localeCompare(b.job.employer_name);
            default:
                return 0;
        }
    });

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Đang tải danh sách công việc đã ứng tuyển...</p>
            </div>
        );
    }

    return (
        <div className="applied-jobs">
            <div className="applied-jobs-header">
                <div className="header-content">
                    <h2>Công việc đã ứng tuyển</h2>
                    <div className="stats">
                        <span className="total-count">
                            Tổng cộng: <strong>{appliedJobs.length}</strong> ứng
                            tuyển
                        </span>
                    </div>
                </div>

                <div className="filter-controls">
                    <div className="filter-group">
                        <label>Lọc theo trạng thái:</label>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">Tất cả</option>
                            <option value="applied">Đã ứng tuyển</option>
                            <option value="accepted">Được chấp nhận</option>
                            <option value="rejected">Bị từ chối</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Sắp xếp:</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="filter-select"
                        >
                            <option value="newest">Mới nhất</option>
                            <option value="oldest">Cũ nhất</option>
                            <option value="company">Theo công ty</option>
                        </select>
                    </div>
                </div>
            </div>

            {sortedJobs.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📄</div>
                    <h3>
                        {filter === "all"
                            ? "Bạn chưa ứng tuyển công việc nào"
                            : `Không có ứng tuyển nào với trạng thái "${filter}"`}
                    </h3>
                    <p>
                        Hãy tìm kiếm và ứng tuyển các công việc phù hợp với bạn!
                    </p>
                    <button className="btn-primary">Tìm việc làm</button>
                </div>
            ) : (
                <div className="applications-list">
                    {sortedJobs.map((application) => (
                        <div key={application._id} className="application-card">
                            <div className="card-header">
                                <div className="job-info">
                                    <h3 className="job-title">
                                        {application.job.title}
                                    </h3>
                                    <div className="company-info">
                                        <span className="company-name">
                                            🏢 {application.job.employer_name}
                                        </span>
                                        <span className="location">
                                            📍 {application.job.location_name}
                                        </span>
                                    </div>
                                </div>

                                <div className="status-info">
                                    <span
                                        className={`status-badge status-${application.status_color}`}
                                    >
                                        {application.status_text}
                                    </span>
                                    <div className="time-info">
                                        <small>
                                            {getTimeAgo(
                                                application.days_since_applied
                                            )}
                                        </small>
                                    </div>
                                </div>
                            </div>

                            <div className="card-body">
                                <div className="job-details">
                                    <div className="detail-item">
                                        <span className="label">
                                            Ngành nghề:
                                        </span>
                                        <span className="value">
                                            {application.job.category_name}
                                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">
                                            Mức lương:
                                        </span>
                                        <span className="value">
                                            {application.job.salary_range}
                                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">
                                            Loại hình:
                                        </span>
                                        <span className="value">
                                            {application.job.job_type}
                                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">
                                            Ngày ứng tuyển:
                                        </span>
                                        <span className="value">
                                            {formatDate(
                                                application.applied_date
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {application.cover_letter && (
                                    <div className="cover-letter">
                                        <h4>Thư xin việc:</h4>
                                        <p>{application.cover_letter}</p>
                                    </div>
                                )}
                            </div>

                            <div className="card-footer">
                                <div className="actions">
                                    {application.resume_file && (
                                        <a
                                            href={getFileUrl(
                                                application.resume_file
                                            )}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-view-cv"
                                        >
                                            📄 Xem CV đã nộp
                                        </a>
                                    )}

                                    <button
                                        className="btn-view-job"
                                        onClick={() => {
                                            // Navigate to job detail
                                            window.open(
                                                `/jobs/${application.job._id}`,
                                                "_blank"
                                            );
                                        }}
                                    >
                                        👁️ Xem chi tiết job
                                    </button>

                                    {application.job.deadline && (
                                        <div className="deadline-info">
                                            <small>
                                                Hạn nộp:{" "}
                                                {formatDate(
                                                    application.job.deadline
                                                )}
                                            </small>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AppliedJobs;
