import React, { useState, useEffect } from "react";
import axios from "axios";
import ApplyJobModal from "../../components/ApplyJobModal";
import "../../styles/SavedJobs.css";

const SavedJobs = ({ userInfo }) => {
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [candidateInfo, setCandidateInfo] = useState(null);
    const [applicationStatuses, setApplicationStatuses] = useState({});

    useEffect(() => {
        fetchSavedJobs();
    }, []);

    const fetchCandidateInfo = async () => {
        try {
            const token = localStorage.getItem("token");
            const candidateResponse = await axios.get(
                "http://localhost:3001/api/candidate/profile",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setCandidateInfo(candidateResponse.data);
        } catch (error) {
            console.error("Error fetching candidate info:", error);
        }
    };

    const fetchSavedJobs = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(
                "http://localhost:3001/api/candidate/saved-jobs",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            setSavedJobs(response.data);
            const jobIds = response.data.map((saved) => saved.job._id);
            await fetchApplicationStatuses(jobIds);
        } catch (error) {
            console.error("Error fetching saved jobs:", error);
            setError(
                error.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu"
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchApplicationStatuses = async (jobIds) => {
        try {
            const token = localStorage.getItem("token");
            const statusPromises = jobIds.map(async (jobId) => {
                try {
                    const response = await axios.get(
                        `http://localhost:3001/api/candidate/application-status/${jobId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    return { jobId, status: response.data.status };
                } catch (error) {
                    return { jobId, status: null };
                }
            });

            const statuses = await Promise.all(statusPromises);
            const statusMap = {};
            statuses.forEach(({ jobId, status }) => {
                statusMap[jobId] = status;
            });
            setApplicationStatuses(statusMap);
        } catch (error) {
            console.error("Error fetching application statuses:", error);
        }
    };

    const handleUnsaveJob = async (savedJobId) => {
        try {
            await axios.delete(
                `http://localhost:3001/api/candidate/saved-jobs/${savedJobId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            setSavedJobs((prev) =>
                prev.filter((saved) => saved._id !== savedJobId)
            );

            showNotification("Đã bỏ lưu công việc thành công!", "success");
        } catch (error) {
            console.error("Error unsaving job:", error);
            showNotification("Có lỗi xảy ra khi bỏ lưu công việc", "error");
        }
    };

    const handleApplyJob = async (job) => {
        if (applicationStatuses[job._id]) {
            alert("Bạn đã ứng tuyển công việc này rồi!");
            return;
        }

        if (!candidateInfo?.resume_file) {
            alert(
                "Bạn cần tải lên CV trước khi ứng tuyển. Vui lòng cập nhật thông tin cá nhân."
            );
            return;
        }

        setSelectedJob(job);
        setIsApplyModalOpen(true);
    };

    const handleSubmitApplication = async (applicationData) => {
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

            setApplicationStatuses((prev) => ({
                ...prev,
                [applicationData.job_id]: "pending",
            }));

            showNotification("Ứng tuyển thành công!", "success");
        } catch (error) {
            console.error("Error applying for job:", error);
            const message =
                error.response?.data?.message || "Có lỗi xảy ra khi ứng tuyển";
            showNotification(message, "error");
            throw error;
        }
    };

    const showNotification = (message, type) => {
        alert(message);
    };

    const getApplyButtonText = (jobId, expired) => {
        if (expired) {
            return "⏰ Hết hạn";
        }

        const status = applicationStatuses[jobId];
        if (status === "pending") {
            return "⏳ Đã ứng tuyển";
        } else if (status === "accepted") {
            return "✅ Đã được chấp nhận";
        } else if (status === "rejected") {
            return "❌ Đã từ chối";
        }

        return "📝 Ứng tuyển ngay";
    };

    // Function để render button class
    const getApplyButtonClass = (jobId, expired) => {
        if (expired) {
            return "btn-apply disabled";
        }

        const status = applicationStatuses[jobId];
        if (status === "pending") {
            return "btn-apply applied-pending";
        } else if (status === "accepted") {
            return "btn-apply applied-accepted";
        } else if (status === "rejected") {
            return "btn-apply applied-rejected";
        }

        return "btn-apply";
    };

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            });
        } catch (error) {
            return "N/A";
        }
    };

    const getTimeAgo = (days) => {
        if (days === 0) return "Hôm nay";
        if (days === 1) return "Hôm qua";
        if (days < 7) return `${days} ngày trước`;
        if (days < 30) return `${Math.floor(days / 7)} tuần trước`;
        return `${Math.floor(days / 30)} tháng trước`;
    };

    const isJobExpired = (deadline) => {
        if (!deadline) return false;
        return new Date(deadline) < new Date();
    };

    // Filter và sort
    const filteredJobs = savedJobs.filter((saved) => {
        if (filter === "all") return true;
        if (filter === "active") return !isJobExpired(saved.job.deadline);
        if (filter === "expired") return isJobExpired(saved.job.deadline);
        return true;
    });

    const sortedJobs = [...filteredJobs].sort((a, b) => {
        switch (sortBy) {
            case "newest":
                return new Date(b.saved_date) - new Date(a.saved_date);
            case "oldest":
                return new Date(a.saved_date) - new Date(b.saved_date);
            case "company":
                return a.job.employer_name.localeCompare(b.job.employer_name);
            case "deadline":
                const deadlineA = a.job.deadline
                    ? new Date(a.job.deadline)
                    : new Date("2099-12-31");
                const deadlineB = b.job.deadline
                    ? new Date(b.job.deadline)
                    : new Date("2099-12-31");
                return deadlineA - deadlineB;
            default:
                return 0;
        }
    });

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Đang tải danh sách công việc đã lưu...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-content">
                    <h3>⚠️ Có lỗi xảy ra</h3>
                    <p>{error}</p>
                    <button
                        className="btn-primary"
                        onClick={() => fetchSavedJobs()}
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="saved-jobs">
            <div className="saved-jobs-header">
                <div className="header-content">
                    <h2>Công việc đã lưu</h2>
                    <div className="stats">
                        <span className="total-count">
                            Tổng cộng: <strong>{savedJobs.length}</strong> công
                            việc
                        </span>
                    </div>
                </div>

                <div className="filter-controls">
                    <div className="filter-group">
                        <label>Lọc:</label>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">Tất cả</option>
                            <option value="active">Còn hạn nộp</option>
                            <option value="expired">Hết hạn nộp</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Sắp xếp:</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="filter-select"
                        >
                            <option value="newest">Mới lưu nhất</option>
                            <option value="oldest">Cũ nhất</option>
                            <option value="company">Theo công ty</option>
                            <option value="deadline">Theo hạn nộp</option>
                        </select>
                    </div>
                </div>
            </div>

            {sortedJobs.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">💾</div>
                    <h3>
                        {filter === "all"
                            ? "Bạn chưa lưu công việc nào"
                            : `Không có công việc ${
                                  filter === "active" ? "còn hạn" : "hết hạn"
                              } nào`}
                    </h3>
                    <p>
                        Hãy tìm kiếm và lưu các công việc yêu thích để xem sau!
                    </p>
                    <button className="btn-primary">Tìm việc làm</button>
                </div>
            ) : (
                <div className="saved-jobs-list">
                    {sortedJobs.map((saved) => {
                        const job = saved.job;
                        const expired = isJobExpired(job.deadline);

                        return (
                            <div
                                key={saved._id}
                                className={`job-card-saved ${
                                    expired ? "expired" : ""
                                }`}
                            >
                                <div className="card-header-saved">
                                    <div className="job-main-info">
                                        <div className="job-title-section">
                                            <h3 className="job-title-save">
                                                {job.title}
                                            </h3>
                                            {expired && (
                                                <span className="expired-badge">
                                                    Hết hạn
                                                </span>
                                            )}
                                            {applicationStatuses ===
                                                "pending" && (
                                                <span className="status-badge pending">
                                                    Đã ứng tuyển
                                                </span>
                                            )}
                                            {applicationStatuses ===
                                                "accepted" && (
                                                <span className="status-badge accepted">
                                                    Được chấp nhận
                                                </span>
                                            )}
                                            {applicationStatuses ===
                                                "rejected" && (
                                                <span className="status-badge rejected">
                                                    Đã từ chối
                                                </span>
                                            )}
                                        </div>

                                        <div className="company-info-saved">
                                            <div className="company-name-saved">
                                                {job.employer_logo && (
                                                    <img
                                                        src={job.employer_logo}
                                                        alt={job.employer_name}
                                                        className="company-logo-saved"
                                                    />
                                                )}
                                                <span>{job.employer_name}</span>
                                            </div>
                                            <div className="job-location">
                                                {job.location_name}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="saved-info">
                                        <div className="saved-date">
                                            <small>
                                                Đã lưu{" "}
                                                {getTimeAgo(
                                                    saved.days_since_saved
                                                )}
                                            </small>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-body">
                                    <div className="job-details-saved">
                                        <div className="detail-row">
                                            <div className="detail-item">
                                                <span className="label">
                                                    Ngành nghề:
                                                </span>
                                                <span className="value">
                                                    {job.category_name}
                                                </span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="label">
                                                    Mức lương:
                                                </span>
                                                <span className="value salary">
                                                    {job.salary_range}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="detail-row">
                                            <div className="detail-item">
                                                <span className="label">
                                                    Loại hình:
                                                </span>
                                                <span className="value">
                                                    {job.job_type}
                                                </span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="label">
                                                    Hạn nộp:
                                                </span>
                                                <span
                                                    className={`value ${
                                                        expired
                                                            ? "expired"
                                                            : "active"
                                                    }`}
                                                >
                                                    {job.deadline
                                                        ? formatDate(
                                                              job.deadline
                                                          )
                                                        : "Không giới hạn"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {job.description && (
                                        <div className="job-description">
                                            <h4>Mô tả công việc:</h4>
                                            <p>
                                                {job.description.length > 200
                                                    ? `${job.description.substring(
                                                          0,
                                                          200
                                                      )}...`
                                                    : job.description}
                                            </p>
                                        </div>
                                    )}

                                    {job.benefits &&
                                        job.benefits.length > 0 && (
                                            <div className="job-benefits">
                                                <h4>Phúc lợi:</h4>
                                                <div className="benefits-list">
                                                    {job.benefits
                                                        .slice(0, 3)
                                                        .map(
                                                            (
                                                                benefit,
                                                                index
                                                            ) => (
                                                                <span
                                                                    key={index}
                                                                    className="benefit-tag"
                                                                >
                                                                    ✨ {benefit}
                                                                </span>
                                                            )
                                                        )}
                                                    {job.benefits.length >
                                                        3 && (
                                                        <span className="more-benefits">
                                                            +
                                                            {job.benefits
                                                                .length -
                                                                3}{" "}
                                                            khác
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                </div>

                                <div className="card-footer">
                                    <div className="job-actions-saved">
                                        <button
                                            className="btn-unsave"
                                            onClick={() =>
                                                handleUnsaveJob(saved._id)
                                            }
                                        >
                                            ❤️ Bỏ lưu
                                        </button>

                                        <button
                                            className={getApplyButtonClass(
                                                job._id,
                                                expired
                                            )}
                                            onClick={() =>
                                                !expired &&
                                                !applicationStatuses &&
                                                handleApplyJob(job)
                                            }
                                            disabled={
                                                expired || applicationStatuses
                                            }
                                        >
                                            {getApplyButtonText(
                                                job._id,
                                                expired
                                            )}
                                        </button>

                                        <button
                                            className="btn-view-detail"
                                            onClick={() =>
                                                window.open(
                                                    `/jobs/${job._id}`,
                                                    "_blank"
                                                )
                                            }
                                        >
                                            👁️ Xem chi tiết
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <ApplyJobModal
                isOpen={isApplyModalOpen}
                onClose={() => setIsApplyModalOpen(false)}
                job={selectedJob}
                candidateInfo={candidateInfo}
                onApply={handleSubmitApplication}
            />
        </div>
    );
};

export default SavedJobs;
