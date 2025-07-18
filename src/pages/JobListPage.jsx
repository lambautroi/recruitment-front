import React, { useState, useEffect } from "react";
import Navbar from "../components/homePage/Navbar";
import "../styles/JobListPage.css";
import { Link } from "react-router-dom";
import axios from "axios";

export default function JobListPage() {
    const [jobs, setJobs] = useState([]);
    const [filters, setFilters] = useState({
        search: "",
        location: "",
        category: "",
        position: "",
        formOfEmployment: "",
        salaryRange: 1000000,
        experience: "",
        education: "",
        limit: 10,
        sort: "newest",
    });

    const [filterOptions, setFilterOptions] = useState({
        locations: [],
        categories: [],
        positions: [],
        experiences: [],
        formOfEmployments: [],
        educations: [],
    });

    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3001/api/jobs/filter-options"
                );
                setFilterOptions(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy filter options", error);
            }
        };

        const fetchJobs = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3001/api/jobs/filter",
                    {
                        params: filters,
                    }
                );
                setJobs(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy công việc", error);
            }
        };

        fetchFilterOptions();
        fetchJobs();
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setFilters((prev) => {
            const newLevel = checked
                ? [...prev.level, value]
                : prev.level.filter((item) => item !== value);
            return { ...prev, level: newLevel };
        });
    };

    const clearFilters = () => {
        setFilters({
            search: "",
            location: "",
            category: "",
            position: "",
            formOfEmployment: "",
            salaryRange: 1000000,
            experience: "",
            education: "",
            limit: 10,
            sort: "newest",
        });
    };

    return (
        <div>
            <Navbar />
            <div className="job-list-banner">
                <div className="job-list-banner-content">
                    <h1 className="banner-title">Danh sách tuyển dụng</h1>
                    <div className="breadcrumb">
                        <Link to="/">Trang chủ</Link> &gt; Danh sách tuyển dụng
                    </div>
                </div>
            </div>

            <div className="job-list-content">
                {/* Sidebar: Bộ lọc nâng cao */}
                <div className="job-filters">
                    <h3>BỘ LỌC NÂNG CAO</h3>
                    <input
                        type="text"
                        name="search"
                        placeholder="Tìm kiếm công việc"
                        value={filters.search}
                        onChange={handleFilterChange}
                    />
                    <select name="location" onChange={handleFilterChange}>
                        <option value="">Tỉnh/Thành phố</option>
                        {filterOptions.locations.map((location) => (
                            <option key={location._id} value={location._id}>
                                {location.location_name}
                            </option>
                        ))}
                    </select>
                    <select name="category" onChange={handleFilterChange}>
                        <option value="">Danh mục nghề nghiệp</option>
                        {filterOptions.categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.category_name}
                            </option>
                        ))}
                    </select>
                    <select name="position" onChange={handleFilterChange}>
                        <option value="">Cấp bậc</option>
                        {filterOptions.positions.map((position) => (
                            <option key={position._id} value={position._id}>
                                {position.position_name}
                            </option>
                        ))}
                    </select>
                    <select
                        name="formOfEmployment"
                        onChange={handleFilterChange}
                    >
                        <option value="">Hình thức làm việc</option>
                        {filterOptions.formOfEmployments.map((form) => (
                            <option key={form._id} value={form._id}>
                                {form.form_name}
                            </option>
                        ))}
                    </select>
                    <select name="experience" onChange={handleFilterChange}>
                        <option value="">Kinh nghiệm</option>
                        {filterOptions.experiences.map((experience) => (
                            <option key={experience._id} value={experience._id}>
                                {experience.experience_level}
                            </option>
                        ))}
                    </select>
                    <select name="education" onChange={handleFilterChange}>
                        <option value="">Trình độ học vấn</option>
                        {filterOptions.educations.map((education) => (
                            <option key={education._id} value={education._id}>
                                {education.education_level}
                            </option>
                        ))}
                    </select>

                    {/* Mức lương (slider) */}
                    <div>
                        <label>Mức lương tối thiểu (VND):</label>
                        <input
                            type="range"
                            name="salaryRange"
                            min="1000000"
                            max="50000000"
                            step="500000"
                            value={filters.salaryRange}
                            onChange={handleFilterChange}
                        />
                        <p>
                            {new Intl.NumberFormat("vi-VN").format(
                                filters.salaryRange
                            )}{" "}
                            VND trở lên
                        </p>
                    </div>

                    <button onClick={clearFilters}>Xóa bộ lọc</button>
                </div>

                {/* Khu vực danh sách công việc */}
                <div className="job-list-page">
                    <div className="job-list-header">
                        <select
                            name="limit"
                            onChange={handleFilterChange}
                            value={filters.limit}
                        >
                            <option value="10">10 tin</option>
                            <option value="20">20 tin</option>
                            <option value="30">30 tin</option>
                        </select>
                        <select
                            name="sort"
                            onChange={handleFilterChange}
                            value={filters.sort}
                        >
                            <option value="newest">Mới nhất</option>
                            <option value="oldest">Cũ nhất</option>
                        </select>
                    </div>
                    <div className="job-cards">
                        {jobs.map((job, index) => (
                            <div key={index} className="job-card-page">
                                <div className="job-card-header">
                                    <div className="company-logo">
                                        <img
                                            src="/employer-logo.png"
                                            alt="Company Logo"
                                            onError={(e) => {
                                                e.target.src =
                                                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzMzNzNkYyIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJBcmlhbCI+QzwvdGV4dD4KPHN2Zz4K";
                                            }}
                                        />
                                    </div>
                                    <div className="job-info">
                                        <h3 className="job-title">
                                            <Link to={`/jobs/${job._id}`}>
                                                {job.title}
                                            </Link>
                                        </h3>
                                        <p className="job-location-type">
                                            {job.form_name} •{"       "}
                                            📍 {job.location_name}
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
                                    <span className="salary-icon">💰</span>
                                    <span className="salary-text">
                                        Mức lương từ{" "}
                                        {new Intl.NumberFormat("vi-VN").format(
                                            job.salary_range
                                        )}{" "}
                                        đ đến{" "}
                                        {new Intl.NumberFormat("vi-VN").format(
                                            parseInt(job.salary_range) + 5000000
                                        )}{" "}
                                        đ
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
