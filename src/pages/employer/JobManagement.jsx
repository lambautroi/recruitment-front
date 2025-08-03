import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../styles/JobManagement.css";

const JobManagement = ({ userInfo }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalJobs: 0,
        limit: 10,
    });
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [jobInfo, setJobInfo] = useState(null);
    const [applicantsLoading, setApplicantsLoading] = useState(false);
    const [applicantsPagination, setApplicantsPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalApplicants: 0,
        limit: 10,
    });
    const [applicantsFilter, setApplicantsFilter] = useState("all");

    useEffect(() => {
        fetchEmployerJobs();
    }, [pagination.currentPage, pagination.limit]);

    useEffect(() => {
        if (selectedJobId) {
            fetchApplicants();
        }
    }, [
        selectedJobId,
        applicantsPagination.currentPage,
        applicantsPagination.limit,
        applicantsFilter,
    ]);

    const fetchEmployerJobs = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:3001/api/employer/jobs`,
                {
                    params: {
                        page: pagination.currentPage,
                        limit: pagination.limit,
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            setJobs(response.data.jobs);
            setPagination((prev) => ({
                ...prev,
                totalPages: response.data.totalPages,
                totalJobs: response.data.totalJobs,
            }));
        } catch (error) {
            console.error("Lỗi khi lấy danh sách tin tuyển dụng:", error);
            setError("Không thể tải danh sách tin tuyển dụng");
        } finally {
            setLoading(false);
        }
    };

    const fetchApplicants = async () => {
        try {
            setApplicantsLoading(true);
            const response = await axios.get(
                `http://localhost:3001/api/employer/jobs/${selectedJobId}/applicants`,
                {
                    params: {
                        page: applicantsPagination.currentPage,
                        limit: applicantsPagination.limit,
                        status:
                            applicantsFilter === "all"
                                ? undefined
                                : applicantsFilter,
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            setApplicants(response.data.applicants);
            setApplicantsPagination((prev) => ({
                ...prev,
                totalPages: response.data.totalPages,
                totalApplicants: response.data.totalApplicants,
            }));
        } catch (error) {
            console.error("Error fetching applicants:", error);
            alert("Không thể tải danh sách ứng viên");
        } finally {
            setApplicantsLoading(false);
        }
    };

    const fetchJobInfo = async (jobId) => {
        try {
            const response = await axios.get(
                `http://localhost:3001/api/employer/jobs/${jobId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            setJobInfo(response.data);
        } catch (error) {
            console.error("Error fetching job info:", error);
        }
    };

    const handleViewApplicants = async (jobId) => {
        setSelectedJobId(jobId);
        setApplicantsPagination((prev) => ({ ...prev, currentPage: 1 }));
        await fetchJobInfo(jobId);
    };

    const handleStatusChange = async (applicationId, newStatus) => {
        try {
            await axios.put(
                `http://localhost:3001/api/employer/jobs/applications/${applicationId}/status`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            setApplicants(
                applicants.map((applicant) =>
                    applicant.application_id === applicationId
                        ? { ...applicant, status: newStatus }
                        : applicant
                )
            );

            alert("Cập nhật trạng thái thành công!");
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Không thể cập nhật trạng thái ứng viên");
        }
    };

    const handleStatusToggle = async (jobId, currentStatus) => {
        try {
            const newStatus =
                currentStatus === "active" ? "inactive" : "active";
            await axios.put(
                `http://localhost:3001/api/employer/jobs/${jobId}/status`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            // Cập nhật trạng thái trong state
            setJobs(
                jobs.map((job) =>
                    job._id === jobId ? { ...job, status: newStatus } : job
                )
            );
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
            alert("Không thể cập nhật trạng thái tin tuyển dụng");
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa tin tuyển dụng này?")) {
            try {
                await axios.delete(
                    `http://localhost:3001/api/employer/jobs/${jobId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                );

                // Xóa job khỏi state
                setJobs(jobs.filter((job) => job._id !== jobId));
                alert("Đã xóa tin tuyển dụng thành công!");
            } catch (error) {
                console.error("Lỗi khi xóa tin tuyển dụng:", error);
                alert("Không thể xóa tin tuyển dụng");
            }
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("vi-VN");
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleLimitChange = (e) => {
        setPagination((prev) => ({
            ...prev,
            limit: parseInt(e.target.value),
            currentPage: 1,
        }));
    };

    const handlePageChange = (page) => {
        setPagination((prev) => ({
            ...prev,
            currentPage: page,
        }));
    };

    const handleApplicantsLimitChange = (e) => {
        setApplicantsPagination((prev) => ({
            ...prev,
            limit: parseInt(e.target.value),
            currentPage: 1,
        }));
    };

    const handleApplicantsPageChange = (page) => {
        setApplicantsPagination((prev) => ({
            ...prev,
            currentPage: page,
        }));
    };

    if (loading) {
        return (
            <div className="job-management">
                <div className="loading">Đang tải...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="job-management">
                <div className="error">{error}</div>
            </div>
        );
    }

    return (
        <div className="job-management">
            <div className="page-header">
                <h2>
                    {selectedJobId
                        ? "Danh sách ứng viên"
                        : "Danh sách tin tuyển dụng"}
                </h2>
                {selectedJobId ? (
                    <button
                        onClick={() => setSelectedJobId(null)}
                        className="btn-back"
                    >
                        ← Quay lại danh sách tin tuyển dụng
                    </button>
                ) : (
                    <Link to="/employer/jobs/create" className="btn-create">
                        Tạo tin mới
                    </Link>
                )}
            </div>

            {selectedJobId ? (
                <div className="applicants-section">
                    {jobInfo && (
                        <div className="job-info-header">
                            <div className="job-title-inline">
                                🔥 {jobInfo.title}
                            </div>
                            <div className="job-meta-inline">
                                📂 {jobInfo.category_id?.category_name} | 📍{" "}
                                {jobInfo.location_id?.location_name} | 👥{" "}
                                {applicantsPagination.totalApplicants} ứng viên
                            </div>
                        </div>
                    )}

                    <div className="applicants-controls">
                        <div className="filter-controls">
                            <div className="filter-group">
                                <label>Lọc theo trạng thái:</label>
                                <select
                                    value={applicantsFilter}
                                    onChange={(e) =>
                                        setApplicantsFilter(e.target.value)
                                    }
                                    className="filter-select"
                                >
                                    <option value="all">Tất cả</option>
                                    <option value="pending">
                                        Chờ xét duyệt
                                    </option>
                                    <option value="applied">
                                        Đã ứng tuyển
                                    </option>
                                    <option value="accepted">
                                        Đã chấp nhận
                                    </option>
                                    <option value="rejected">Đã từ chối</option>
                                </select>
                            </div>
                        </div>

                        <div className="limit-control">
                            <select
                                value={applicantsPagination.limit}
                                onChange={handleApplicantsLimitChange}
                            >
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                            <span>Dữ liệu/Trang</span>
                        </div>
                    </div>

                    <div className="applicants-table-container">
                        {applicantsLoading ? (
                            <div className="loading">Đang tải ứng viên...</div>
                        ) : applicants.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">👤</div>
                                <h4>
                                    {applicantsFilter === "all"
                                        ? "Chưa có ứng viên nào ứng tuyển"
                                        : `Không có ứng viên nào ở trạng thái "${applicantsFilter}"`}
                                </h4>
                                <p>
                                    Hãy chờ các ứng viên ứng tuyển vào vị trí
                                    này!
                                </p>
                            </div>
                        ) : (
                            <table className="applicants-table">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>HỌ VÀ TÊN</th>
                                        <th>EMAIL</th>
                                        <th>SỐ ĐIỆN THOẠI</th>
                                        <th>NGÀY ỨNG TUYỂN</th>
                                        <th>TRẠNG THÁI</th>
                                        <th>HÀNH ĐỘNG</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applicants.map((applicant, index) => (
                                        <tr key={applicant.application_id}>
                                            <td>
                                                {(applicantsPagination.currentPage -
                                                    1) *
                                                    applicantsPagination.limit +
                                                    index +
                                                    1}
                                            </td>
                                            <td className="candidate-name">
                                                <div className="candidate-info-manager">
                                                    <div className="candidate-avatar">
                                                        <img
                                                            src={
                                                                applicant.profile_picture ||
                                                                "/default-avatar.png"
                                                            }
                                                            alt={
                                                                applicant.full_name
                                                            }
                                                            onError={(e) => {
                                                                e.target.src =
                                                                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNlMGU3ZmYiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIxNiIgcj0iNiIgZmlsbD0iIzYzNjZmMSIvPgo8cGF0aCBkPSJtNiAzNGMwLTcuNzMgNi4yNy0xNCAxNC0xNHMxNCA2LjI3IDE0IDE0IiBmaWxsPSIjNjM2NmYxIi8+Cjwvc3ZnPgo=";
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="candidate-details">
                                                        <span className="name">
                                                            {applicant.full_name ||
                                                                "Chưa cập nhật"}
                                                        </span>
                                                        <small className="position">
                                                            {applicant.position_name ||
                                                                "Chưa xác định"}
                                                        </small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{applicant.email}</td>
                                            <td>
                                                {applicant.phone ||
                                                    "Chưa cập nhật"}
                                            </td>
                                            <td>
                                                {formatDateTime(
                                                    applicant.applied_date
                                                )}
                                            </td>
                                            <td>
                                                <select
                                                    value={applicant.status}
                                                    onChange={(e) =>
                                                        handleStatusChange(
                                                            applicant.application_id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`status-select status-${applicant.status}`}
                                                >
                                                    <option value="pending">
                                                        Chờ xét duyệt
                                                    </option>
                                                    <option value="applied">
                                                        Đã ứng tuyển
                                                    </option>
                                                    <option value="accepted">
                                                        Chấp nhận
                                                    </option>
                                                    <option value="rejected">
                                                        Từ chối
                                                    </option>
                                                </select>
                                            </td>
                                            <td className="action-buttons">
                                                <Link
                                                    to={`/employer/candidates/${applicant.candidate_id}`}
                                                    className="btn-view"
                                                    title="Xem chi tiết"
                                                >
                                                    👁️ Xem
                                                </Link>

                                                {applicant.resume_file && (
                                                    <a
                                                        href={`http://localhost:3001${applicant.resume_file}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn-download"
                                                        title="Tải CV"
                                                    >
                                                        📄 CV
                                                    </a>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {applicants.length > 0 && (
                        <div className="pagination-container">
                            <div className="pagination-info">
                                Hiển thị{" "}
                                {(applicantsPagination.currentPage - 1) *
                                    applicantsPagination.limit +
                                    1}{" "}
                                đến{" "}
                                {Math.min(
                                    applicantsPagination.currentPage *
                                        applicantsPagination.limit,
                                    applicantsPagination.totalApplicants
                                )}{" "}
                                trong tổng số{" "}
                                {applicantsPagination.totalApplicants} ứng viên
                            </div>
                            <div className="pagination-controls">
                                <button
                                    onClick={() =>
                                        handleApplicantsPageChange(
                                            applicantsPagination.currentPage - 1
                                        )
                                    }
                                    disabled={
                                        applicantsPagination.currentPage === 1
                                    }
                                    className="pagination-btn"
                                >
                                    ‹
                                </button>

                                {[
                                    ...Array(applicantsPagination.totalPages),
                                ].map((_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() =>
                                            handleApplicantsPageChange(
                                                index + 1
                                            )
                                        }
                                        className={`pagination-btn ${
                                            applicantsPagination.currentPage ===
                                            index + 1
                                                ? "active"
                                                : ""
                                        }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() =>
                                        handleApplicantsPageChange(
                                            applicantsPagination.currentPage + 1
                                        )
                                    }
                                    disabled={
                                        applicantsPagination.currentPage ===
                                        applicantsPagination.totalPages
                                    }
                                    className="pagination-btn"
                                >
                                    ›
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="job-list-container">
                    <div className="list-controls">
                        <div className="limit-control">
                            <select
                                value={pagination.limit}
                                onChange={handleLimitChange}
                            >
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                            <span>Dữ liệu/Trang</span>
                        </div>
                        <div className="search-control">
                            <input type="text" placeholder="Tìm kiếm" />
                        </div>
                    </div>

                    <div className="jobs-table-container">
                        <table className="jobs-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>TIÊU ĐỀ</th>
                                    <th>DANH MỤC TUYỂN DỤNG</th>
                                    <th>THỜI GIAN HẾT HẠN</th>
                                    <th>TRẠNG THÁI</th>
                                    <th>ỨNG VIÊN</th>
                                    <th>HÀNH ĐỘNG</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map((job, index) => (
                                    <tr key={job._id}>
                                        <td>
                                            {(pagination.currentPage - 1) *
                                                pagination.limit +
                                                index +
                                                1}
                                        </td>
                                        <td className="job-title-manager">
                                            {job.title}
                                        </td>
                                        <td>{job.category_name}</td>
                                        <td>
                                            {formatDate(job.expiration_date)}
                                        </td>
                                        <td>
                                            <label className="toggle-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        job.status === "active"
                                                    }
                                                    onChange={() =>
                                                        handleStatusToggle(
                                                            job._id,
                                                            job.status
                                                        )
                                                    }
                                                />
                                                <span className="slider"></span>
                                            </label>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() =>
                                                    handleViewApplicants(
                                                        job._id
                                                    )
                                                }
                                                className="applicant-count"
                                                title="Xem danh sách ứng viên"
                                            >
                                                👤 {job.applicant_count || 0}
                                                <br />
                                                Xem
                                            </button>
                                        </td>
                                        <td className="action-buttons">
                                            <Link
                                                to={`/employer/jobs/edit/${job._id}`}
                                                className="btn-edit"
                                                title="Chỉnh sửa"
                                            >
                                                ✏️
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDeleteJob(job._id)
                                                }
                                                className="btn-delete"
                                                title="Xóa"
                                            >
                                                🗑
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Jobs Pagination */}
                    <div className="pagination-container">
                        <div className="pagination-info">
                            Hiển thị{" "}
                            {(pagination.currentPage - 1) * pagination.limit +
                                1}{" "}
                            đến{" "}
                            {Math.min(
                                pagination.currentPage * pagination.limit,
                                pagination.totalJobs
                            )}{" "}
                            trong tổng số {pagination.totalJobs} mục
                        </div>
                        <div className="pagination-controls">
                            <button
                                onClick={() =>
                                    handlePageChange(pagination.currentPage - 1)
                                }
                                disabled={pagination.currentPage === 1}
                                className="pagination-btn"
                            >
                                ‹
                            </button>

                            {[...Array(pagination.totalPages)].map(
                                (_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() =>
                                            handlePageChange(index + 1)
                                        }
                                        className={`pagination-btn ${
                                            pagination.currentPage === index + 1
                                                ? "active"
                                                : ""
                                        }`}
                                    >
                                        {index + 1}
                                    </button>
                                )
                            )}

                            <button
                                onClick={() =>
                                    handlePageChange(pagination.currentPage + 1)
                                }
                                disabled={
                                    pagination.currentPage ===
                                    pagination.totalPages
                                }
                                className="pagination-btn"
                            >
                                ›
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobManagement;
