import React, { useState, useEffect } from "react";
import Navbar from "../../components/homePage/Navbar";
import CandidateCard from "../../components/CandidateCard";
import "../../styles/CandidateListPage.css";
import Footer from "../../components/Footer";
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
                <div className="candidate-filters">
                    <h3>BỘ LỌC NÂNG CAO</h3>
                    
                    <input
                        type="text"
                        name="search"
                        placeholder="Tìm kiếm ứng viên"
                        value={filters.search}
                        onChange={handleFilterChange}
                    />
                    
                    <select name="location" onChange={handleFilterChange} value={filters.location}>
                        <option value="">Tỉnh/Thành phố</option>
                        {filterOptions.locations.map((location) => (
                            <option key={location._id} value={location._id}>
                                {location.location_name}
                            </option>
                        ))}
                    </select>
                    
                    <select name="category" onChange={handleFilterChange} value={filters.category}>
                        <option value="">Danh mục nghề nghiệp</option>
                        {filterOptions.categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.category_name}
                            </option>
                        ))}
                    </select>
                    
                    <select name="position" onChange={handleFilterChange} value={filters.position}>
                        <option value="">Cấp bậc</option>
                        {filterOptions.positions.map((position) => (
                            <option key={position._id} value={position._id}>
                                {position.position_name}
                            </option>
                        ))}
                    </select>
                    
                    <select name="experience" onChange={handleFilterChange} value={filters.experience}>
                        <option value="">Kinh nghiệm</option>
                        {filterOptions.experiences.map((experience) => (
                            <option key={experience._id} value={experience._id}>
                                {experience.experience_level}
                            </option>
                        ))}
                    </select>
                    
                    <select name="education" onChange={handleFilterChange} value={filters.education}>
                        <option value="">Trình độ học vấn</option>
                        {filterOptions.educations.map((education) => (
                            <option key={education._id} value={education._id}>
                                {education.education_level}
                            </option>
                        ))}
                    </select>
                    
                    <select name="gender" onChange={handleFilterChange} value={filters.gender}>
                        <option value="">Giới tính</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                    </select>

                    <button onClick={clearFilters}>Xóa bộ lọc</button>
                </div>

                <div className="candidate-list-page">
                    <div className="candidate-list-header">
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
                            <option value="name_asc">Tên A-Z</option>
                            <option value="name_desc">Tên Z-A</option>
                        </select>
                    </div>

                    <div className="candidate-cards">
                        {candidates.map((candidate, index) => (
                            <CandidateCard key={index} candidate={candidate} />
                        ))}
                    </div>

                    {candidates.length === 0 && (
                        <div className="no-results">
                            <p>
                                Không tìm thấy ứng viên phù hợp với tiêu chí tìm kiếm.
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