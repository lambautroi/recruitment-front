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
        limit: 10
    });

    // Fetch jobs khi component mount
    useEffect(() => {
        fetchEmployerJobs();
    }, [pagination.currentPage, pagination.limit]);

    const fetchEmployerJobs = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:3001/api/employer/jobs`,
                {
                    params: {
                        page: pagination.currentPage,
                        limit: pagination.limit
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            
            setJobs(response.data.jobs);
            setPagination(prev => ({
                ...prev,
                totalPages: response.data.totalPages,
                totalJobs: response.data.totalJobs
            }));
        } catch (error) {
            console.error("Lỗi khi lấy danh sách tin tuyển dụng:", error);
            setError("Không thể tải danh sách tin tuyển dụng");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusToggle = async (jobId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
            await axios.put(
                `http://localhost:3001/api/employer/jobs/${jobId}/status`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            
            // Cập nhật trạng thái trong state
            setJobs(jobs.map(job => 
                job._id === jobId ? { ...job, status: newStatus } : job
            ));
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
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );
                
                // Xóa job khỏi state
                setJobs(jobs.filter(job => job._id !== jobId));
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

    const handleLimitChange = (e) => {
        setPagination(prev => ({
            ...prev,
            limit: parseInt(e.target.value),
            currentPage: 1
        }));
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({
            ...prev,
            currentPage: page
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
                <h2>Danh sách tin tuyển dụng</h2>
                <Link to="/employer/jobs/create" className="btn-create">
                    + Tạo mới
                </Link>
            </div>

            <div className="job-list-container">
                {/* Header Controls */}
                <div className="list-controls">
                    <div className="limit-control">
                        <select value={pagination.limit} onChange={handleLimitChange}>
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

                {/* Jobs Table */}
                <div className="jobs-table-container">
                    <table className="jobs-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>TIÊU ĐỀ</th>
                                <th>DANH MỤC TUYỂN DỤNG</th>
                                <th>THỜI GIAN HẾT HẠN</th>
                                <th>LƯỢT XEM</th>
                                <th>NỔI BẬT</th>
                                <th>TRẠNG THÁI</th>
                                <th>ỨNG VIÊN</th>
                                <th>HÀNH ĐỘNG</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map((job, index) => (
                                <tr key={job._id}>
                                    <td>{(pagination.currentPage - 1) * pagination.limit + index + 1}</td>
                                    <td className="job-title">{job.title}</td>
                                    <td>{job.category_name}</td>
                                    <td>{formatDate(job.expiration_date)}</td>
                                    <td>
                                        <span className="view-count">
                                            👁 0<br />
                                            Xem
                                        </span>
                                    </td>
                                    <td>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={job.featured || false}
                                                onChange={() => {/* Handle featured toggle */}}
                                            />
                                            <span className="slider"></span>
                                        </label>
                                    </td>
                                    <td>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={job.status === 'active'}
                                                onChange={() => handleStatusToggle(job._id, job.status)}
                                            />
                                            <span className="slider"></span>
                                        </label>
                                    </td>
                                    <td>
                                        <span className="applicant-count">
                                            👤 {job.applicant_count || 0}<br />
                                            Xem
                                        </span>
                                    </td>
                                    <td className="action-buttons">
                                        <Link 
                                            to={`/employer/jobs/edit/${job._id}`}
                                            className="btn-edit"
                                            title="Chỉnh sửa"
                                        >
                                            👁
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteJob(job._id)}
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

                {/* Pagination */}
                <div className="pagination-container">
                    <div className="pagination-info">
                        Hiển thị {(pagination.currentPage - 1) * pagination.limit + 1} đến {Math.min(pagination.currentPage * pagination.limit, pagination.totalJobs)} trong tổng số {pagination.totalJobs} mục
                    </div>
                    <div className="pagination-controls">
                        <button 
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1}
                            className="pagination-btn"
                        >
                            ‹
                        </button>
                        
                        {[...Array(pagination.totalPages)].map((_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={`pagination-btn ${pagination.currentPage === index + 1 ? 'active' : ''}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        
                        <button 
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.totalPages}
                            className="pagination-btn"
                        >
                            ›
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobManagement;