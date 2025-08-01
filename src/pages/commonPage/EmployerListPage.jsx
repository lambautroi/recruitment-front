import React, { useState, useEffect } from "react";
import Navbar from "../../components/homePage/Navbar";
import CompanyCard from "../../components/CompanyCard";
import "../../styles/EmployerListPage.css";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import axios from "axios";

const CompanyListPage = () => {
    const [companies, setCompanies] = useState([]);
    const [filters, setFilters] = useState({
        search: "",
        location: "",
        industry: "",
        sort: "newest",
        limit: 10,
    });
    const [filterOptions, setFilterOptions] = useState({
        locations: [],
        categories: [],
    });

    useEffect(() => {
        const fetchFilterOptions = async () => {
            const response = await axios.get(
                "http://localhost:3001/api/companies/filter-options"
            );
            setFilterOptions(response.data);
        };

        const fetchCompanies = async () => {
            const response = await axios.get(
                "http://localhost:3001/api/companies/filter",
                {
                    params: filters,
                }
            );
            setCompanies(response.data);
        };

        fetchFilterOptions();
        fetchCompanies();
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => {
        setFilters({
            search: "",
            location: "",
            industry: "",
            sort: "newest",
            limit: 10,
        });
    };

    return (
        <div>
            <Navbar />
            <div className="job-list-banner">
                <div className="job-list-banner-content">
                    <h1 className="banner-title">Danh sách doanh nghiệp</h1>
                    <div className="breadcrumb">
                        <Link to="/">Trang chủ</Link> &gt; Danh sách doanh
                        nghiệp
                    </div>
                </div>
            </div>

            <div className="company-list-content">
                <div className="company-filters">
                    <h3>BỘ LỌC NÂNG CAO</h3>

                    <input
                        type="text"
                        name="search"
                        value={filters.search}
                        onChange={handleFilterChange}
                        placeholder="Tìm kiếm doanh nghiệp"
                    />

                    <select
                        name="location"
                        value={filters.location}
                        onChange={handleFilterChange}
                    >
                        <option value="">Tỉnh/Thành phố</option>
                        {filterOptions.locations.map((location) => (
                            <option key={location._id} value={location._id}>
                                {location.location_name}
                            </option>
                        ))}
                    </select>

                    <select
                        name="industry"
                        value={filters.industry}
                        onChange={handleFilterChange}
                    >
                        <option value="">Danh mục nghề nghiệp</option>
                        {filterOptions.categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.category_name}
                            </option>
                        ))}
                    </select>

                    <button onClick={clearFilters}>Xóa bộ lọc</button>
                </div>

                <div className="company-list-page">
                    <div className="company-list-header">
                        <select
                            name="limit"
                            value={filters.limit}
                            onChange={handleFilterChange}
                        >
                            <option value="10">10 tin</option>
                            <option value="20">20 tin</option>
                            <option value="30">30 tin</option>
                        </select>
                        <select
                            name="sort"
                            value={filters.sort}
                            onChange={handleFilterChange}
                        >
                            <option value="newest">Mới nhất</option>
                            <option value="oldest">Cũ nhất</option>
                            <option value="most_jobs">Nhiều việc nhất</option>
                            <option value="name_asc">Tên A-Z</option>
                        </select>
                    </div>

                    <div className="company-cards">
                        {companies.map((company, index) => (
                            <CompanyCard key={index} company={company} />
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CompanyListPage;
