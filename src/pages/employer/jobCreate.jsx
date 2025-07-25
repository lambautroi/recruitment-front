import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/JobCreate.css";

const JobCreate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [dropdownOptions, setDropdownOptions] = useState({
        categories: [],
        locations: [],
        positions: [],
        experiences: [],
        educations: [],
        formOfEmployments: [],
    });

    const [formData, setFormData] = useState({
        title: "",
        category_id: "",
        location_id: "",
        position_id: "",
        experience_id: "",
        education_id: "",
        form_of_employment_id: "",
        salary_range_min: "",
        salary_range_max: "",
        quantity: 1,
        job_description: "",
        expiration_date: "",
        status: "active",
    });

    // Fetch dropdown options khi component mount
    useEffect(() => {
        fetchDropdownOptions();
    }, []);

    const fetchDropdownOptions = async () => {
        try {
            const requests = [
                axios.get("http://localhost:3001/api/categories"),
                axios.get("http://localhost:3001/api/locations"),
                axios.get("http://localhost:3001/api/positions"),
                axios.get("http://localhost:3001/api/experiences"),
                axios.get("http://localhost:3001/api/educations"),
                axios.get("http://localhost:3001/api/form-of-employments"),
            ];

            const results = await Promise.allSettled(requests);

            setDropdownOptions({
                categories:
                    results[0].status === "fulfilled"
                        ? results[0].value.data
                        : [],
                locations:
                    results[1].status === "fulfilled"
                        ? results[1].value.data
                        : [],
                positions:
                    results[2].status === "fulfilled"
                        ? results[2].value.data
                        : [],
                experiences:
                    results[3].status === "fulfilled"
                        ? results[3].value.data
                        : [],
                educations:
                    results[4].status === "fulfilled"
                        ? results[4].value.data
                        : [],
                formOfEmployments:
                    results[5].status === "fulfilled"
                        ? results[5].value.data
                        : [],
            });

            // Log các request thất bại
            results.forEach((result, index) => {
                if (result.status === "rejected") {
                    const endpoints = [
                        "categories",
                        "locations",
                        "positions",
                        "experiences",
                        "educations",
                        "form-of-employments",
                    ];
                    console.error(
                        `Failed to fetch ${endpoints[index]}:`,
                        result.reason
                    );
                }
            });
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu dropdown:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            // Chuẩn bị dữ liệu gửi đi
            const submitData = {
                ...formData,
                salary_range:
                    formData.salary_range_min && formData.salary_range_max
                        ? `${formData.salary_range_min}-${formData.salary_range_max}`
                        : formData.salary_range_min || "Thỏa thuận",
                job_description: {
                    content: formData.job_description,
                },
            };

            // Loại bỏ các trường không cần thiết
            delete submitData.salary_range_min;
            delete submitData.salary_range_max;

            const response = await axios.post(
                "http://localhost:3001/api/employer/jobs",
                submitData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            alert("Tạo tin tuyển dụng thành công!");
            navigate("/employer/dashboard");
        } catch (error) {
            console.error("Lỗi khi tạo tin tuyển dụng:", error);
            if (error.response?.data?.message) {
                alert(`Lỗi: ${error.response.data.message}`);
            } else {
                alert("Không thể tạo tin tuyển dụng");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="job-create">
            <div className="job-create-header">
                <h2>Tạo tin tuyển dụng mới</h2>
                <button
                    className="btn-back"
                    onClick={() => navigate("/employer/dashboard")}
                >
                    ← Quay lại
                </button>
            </div>

            <form onSubmit={handleSubmit} className="job-create-form">
                {/* Tiêu đề tin tuyển dụng */}
                <div className="form-group">
                    <label htmlFor="title">Tiêu đề tin tuyển dụng *</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        placeholder="Nhập tiêu đề công việc"
                    />
                </div>

                {/* Công ty/doanh nghiệp - Chỉ hiển thị, không cho sửa */}
                <div className="form-group">
                    <label>Công ty/doanh nghiệp *</label>
                    <input
                        type="text"
                        value="ABC Company"
                        disabled
                        className="disabled-input"
                    />
                </div>

                {/* Danh mục tuyển dụng */}
                <div className="form-group">
                    <label htmlFor="category_id">Danh mục tuyển dụng *</label>
                    <select
                        id="category_id"
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Chọn danh mục</option>
                        {dropdownOptions.categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.category_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Cấp bậc việc làm cần tuyển dụng */}
                <div className="form-group">
                    <label htmlFor="position_id">
                        Cấp bậc việc làm cần tuyển dụng *
                    </label>
                    <select
                        id="position_id"
                        name="position_id"
                        value={formData.position_id}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Chọn cấp bậc</option>
                        {dropdownOptions.positions.map((position) => (
                            <option key={position._id} value={position._id}>
                                {position.position_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Hình thức trả lương */}
                <div className="form-group">
                    <label htmlFor="form_of_employment_id">
                        Hình thức trả lương *
                    </label>
                    <select
                        id="form_of_employment_id"
                        name="form_of_employment_id"
                        value={formData.form_of_employment_id}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Chọn hình thức</option>
                        {dropdownOptions.formOfEmployments.map((form) => (
                            <option key={form._id} value={form._id}>
                                {form.form_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Mức lương */}
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="salary_range_min">
                            Mức lương tối thiểu (VND) *
                        </label>
                        <input
                            type="number"
                            id="salary_range_min"
                            name="salary_range_min"
                            value={formData.salary_range_min}
                            onChange={handleInputChange}
                            placeholder="7000000"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="salary_range_max">
                            Mức lương tối đa (VND) *
                        </label>
                        <input
                            type="number"
                            id="salary_range_max"
                            name="salary_range_max"
                            value={formData.salary_range_max}
                            onChange={handleInputChange}
                            placeholder="15000000"
                        />
                    </div>
                </div>

                {/* Thời gian hết hạn tuyển dụng */}
                <div className="form-group">
                    <label htmlFor="expiration_date">
                        Thời gian hết hạn tuyển dụng *
                    </label>
                    <input
                        type="date"
                        id="expiration_date"
                        name="expiration_date"
                        value={formData.expiration_date}
                        onChange={handleInputChange}
                        required
                        min={new Date().toISOString().split("T")[0]}
                    />
                </div>

                {/* Kinh nghiệm làm việc mong muốn */}
                <div className="form-group">
                    <label htmlFor="experience_id">
                        Kinh nghiệm làm việc mong muốn *
                    </label>
                    <select
                        id="experience_id"
                        name="experience_id"
                        value={formData.experience_id}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Chọn kinh nghiệm</option>
                        {dropdownOptions.experiences.map((exp) => (
                            <option key={exp._id} value={exp._id}>
                                {exp.experience_level}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Trình độ học vấn mong muốn */}
                <div className="form-group">
                    <label htmlFor="education_id">
                        Trình độ học vấn mong muốn *
                    </label>
                    <select
                        id="education_id"
                        name="education_id"
                        value={formData.education_id}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Chọn trình độ</option>
                        {dropdownOptions.educations.map((edu) => (
                            <option key={edu._id} value={edu._id}>
                                {edu.education_level}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Giới tính */}
                <div className="form-group">
                    <label>Giới tính *</label>
                    <select>
                        <option value="both">Nam và nữ</option>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                    </select>
                </div>

                {/* Số lượng cần tuyển */}
                <div className="form-group">
                    <label htmlFor="quantity">Số lượng cần tuyển *</label>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        min="1"
                        required
                    />
                </div>

                {/* Hình thức làm việc */}
                <div className="form-group">
                    <label htmlFor="location_id">Hình thức làm việc *</label>
                    <select
                        id="location_id"
                        name="location_id"
                        value={formData.location_id}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Chọn địa điểm</option>
                        {dropdownOptions.locations.map((location) => (
                            <option key={location._id} value={location._id}>
                                {location.location_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Mô tả về công việc */}
                <div className="form-group">
                    <label htmlFor="job_description">
                        Mô tả về công việc *
                    </label>
                    <textarea
                        id="job_description"
                        name="job_description"
                        value={formData.job_description}
                        onChange={handleInputChange}
                        rows="10"
                        placeholder="Nhập mô tả chi tiết về công việc..."
                        required
                    />
                </div>

                {/* Submit buttons */}
                <div className="form-actions">
                    <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => navigate("/employer/dashboard")}
                        disabled={loading}
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="btn-submit"
                        disabled={loading}
                    >
                        {loading ? "Đang tạo..." : "Tạo tin tuyển dụng"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JobCreate;
