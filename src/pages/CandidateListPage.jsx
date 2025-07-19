import React, { useState, useEffect } from "react";
import Navbar from "../components/homePage/Navbar";
import CandidateCard from "../components/CandidateCard";
import "../styles/CandidateListPage.css";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import axios from "axios";

const CandidateListPage = () => {
    const [candidates, setCandidates] = useState([]);
    const [filters, setFilters] = useState({
        search: "",
        location: "",
        category: "",
        position: "",
        experience: "",
        education: "",
        gender: "",
        sort: "newest",
        limit: 10,
    });
    const [filterOptions, setFilterOptions] = useState({
        locations: [],
        categories: [],
        positions: [],
        experiences: [],
        educations: [],
    });

    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3001/api/candidates/filter-options"
                );
                setFilterOptions(response.data);
            } catch (error) {
                console.error("Error fetching filter options:", error);
            }
        };

        const fetchCandidates = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3001/api/candidates/filter",
                    {
                        params: filters,
                    }
                );
                setCandidates(response.data);
            } catch (error) {
                console.error("Error fetching candidates:", error);
            }
        };

        fetchFilterOptions();
        fetchCandidates();
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => {
        setFilters({
            search: "",
            location: "",
            category: "",
            position: "",
            experience: "",
            education: "",
            gender: "",
            sort: "newest",
            limit: 10,
        });
    };

    return (
        <div>
            <Navbar />
            <div className="job-list-banner">
                <div className="job-list-banner-content">
                    <h1 className="banner-title">Danh sách ứng viên</h1>
                    <div className="breadcrumb">
                        <Link to="/">Trang chủ</Link> &gt; Danh sách ứng viên
                    </div>
                </div>
            </div>

            <div className="candidate-list-content">
                {/* Left Sidebar - Filters */}
                <div className="candidate-filters">
                    <h3>BỘ LỌC NÂNG CAO</h3>
                    <button onClick={clearFilters} className="clear-filter-btn">
                        Xóa bộ lọc
                    </button>

                    <div className="filter-group">
                        <label>Tìm kiếm</label>
                        <input
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="Tìm kiếm ứng viên..."
                        />
                    </div>

                    <div className="filter-group">
                        <label>Tỉnh/Thành phố</label>
                        <select
                            name="location"
                            value={filters.location}
                            onChange={handleFilterChange}
                        >
                            <option value="">Tất cả</option>
                            {filterOptions.locations.map((location) => (
                                <option key={location._id} value={location._id}>
                                    {location.location_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Danh mục nghề nghiệp</label>
                        <select
                            name="category"
                            value={filters.category}
                            onChange={handleFilterChange}
                        >
                            <option value="">Tất cả</option>
                            {filterOptions.categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.category_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Cấp bậc/chức vụ</label>
                        <select
                            name="position"
                            value={filters.position}
                            onChange={handleFilterChange}
                        >
                            <option value="">Tất cả</option>
                            {filterOptions.positions.map((position) => (
                                <option key={position._id} value={position._id}>
                                    {position.position_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Kinh nghiệm làm việc</label>
                        <select
                            name="experience"
                            value={filters.experience}
                            onChange={handleFilterChange}
                        >
                            <option value="">Tất cả</option>
                            {filterOptions.experiences.map((experience) => (
                                <option
                                    key={experience._id}
                                    value={experience._id}
                                >
                                    {experience.experience_level}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Trình độ học vấn</label>
                        <select
                            name="education"
                            value={filters.education}
                            onChange={handleFilterChange}
                        >
                            <option value="">Tất cả</option>
                            {filterOptions.educations.map((education) => (
                                <option
                                    key={education._id}
                                    value={education._id}
                                >
                                    {education.education_level}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Giới tính</label>
                        <select
                            name="gender"
                            value={filters.gender}
                            onChange={handleFilterChange}
                        >
                            <option value="">Tất cả</option>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                        </select>
                    </div>
                </div>

                {/* Main Content - Candidate Cards */}
                <div className="candidate-list-page">
                    {/* Header Controls */}
                    <div className="candidate-list-header">
                        <div className="header-left">
                            <span className="result-text">Hiển thị</span>
                            <select
                                name="limit"
                                value={filters.limit}
                                onChange={handleFilterChange}
                            >
                                <option value="10">10 tin</option>
                                <option value="20">20 tin</option>
                                <option value="50">50 tin</option>
                            </select>
                        </div>
                        <div className="header-right">
                            <span className="sort-text">Sắp xếp</span>
                            <select
                                name="sort"
                                value={filters.sort}
                                onChange={handleFilterChange}
                            >
                                <option value="newest">Mới nhất</option>
                                <option value="oldest">Cũ nhất</option>
                                <option value="name_asc">Tên A-Z</option>
                                <option value="name_desc">Tên Z-A</option>
                            </select>
                        </div>
                    </div>

                    {/* Candidate Cards Grid */}
                    <div className="candidate-cards">
                        {candidates.map((candidate, index) => (
                            <CandidateCard key={index} candidate={candidate} />
                        ))}
                    </div>

                    {candidates.length === 0 && (
                        <div className="no-results">
                            <p>
                                Không tìm thấy ứng viên phù hợp với tiêu chí tìm
                                kiếm.
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CandidateListPage;
