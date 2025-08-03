import React, { useState, useEffect } from "react";
import axios from "axios";

const CandidateInfo = ({ userInfo }) => {
    const [activeSection, setActiveSection] = useState("general");
    const [candidateData, setCandidateData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [uploadingCV, setUploadingCV] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState("");
    const [cvFile, setCvFile] = useState(null);
    const [dropdownOptions, setDropdownOptions] = useState({
        categories: [],
        locations: [],
        positions: [],
        experiences: [],
        educations: [],
    });

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        address: "",
        birth_date: "",
        gender: "",
        marital_status: "",
        location_id: "",
        position_id: "",
        category_id: "",
        education: "",
        experience: "",
        salary_expectation: "",
        career_objective: "",
        work_preference: [],
        professional_skills: [],
        soft_skills: [],
        skills: [],
        profile_picture: "",
        resume_file: "",
        facebook: "",
    });

    // Helper function để lấy URL đầy đủ
    const getFileUrl = (filePath) => {
        if (!filePath) return "";
        if (filePath.startsWith("/uploads/")) {
            return `http://localhost:3001${filePath}`;
        }
        if (filePath.startsWith("http")) {
            return filePath;
        }
        return "";
    };

    useEffect(() => {
        fetchCandidateData();
        fetchDropdownOptions();
    }, [userInfo]);

    const fetchCandidateData = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3001/api/candidate/profile",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            const data = response.data;
            setCandidateData(data);

            setFormData({
                full_name: data.full_name || "",
                email: data.email || "",
                phone: data.phone || "",
                address: data.address || "",
                birth_date: data.birth_date
                    ? new Date(data.birth_date).toISOString().split("T")[0]
                    : "",
                gender: data.gender || "",
                marital_status: data.marital_status || "",
                location_id: data.location_id?._id || "",
                position_id: data.position_id?._id || "",
                category_id: data.category_id?._id || "",
                education: data.education?._id || "",
                experience: data.experience?._id || "",
                salary_expectation: data.salary_expectation || "",
                career_objective: data.career_objective || "",
                work_preference: data.work_preference || [],
                professional_skills: data.professional_skills || [],
                soft_skills: data.soft_skills || [],
                skills: data.skills || [],
                profile_picture: data.profile_picture || "",
                resume_file: data.resume_file || "",
                facebook: data.facebook || "",
            });

            setAvatarPreview(data.profile_picture || "");
        } catch (error) {
            console.error("Error fetching candidate data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDropdownOptions = async () => {
        try {
            const [categories, locations, positions, experiences, educations] =
                await Promise.all([
                    axios.get("http://localhost:3001/api/categories"),
                    axios.get("http://localhost:3001/api/locations"),
                    axios.get("http://localhost:3001/api/positions"),
                    axios.get("http://localhost:3001/api/experiences"),
                    axios.get("http://localhost:3001/api/educations"),
                ]);

            setDropdownOptions({
                categories: categories.data,
                locations: locations.data,
                positions: positions.data,
                experiences: experiences.data,
                educations: educations.data,
            });
        } catch (error) {
            console.error("Error fetching dropdown options:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleArrayChange = (field, value) => {
        const items = value
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item);
        setFormData((prev) => ({
            ...prev,
            [field]: items,
        }));
    };

    // Handle avatar upload
    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("Kích thước file phải nhỏ hơn 2MB");
                return;
            }

            if (!file.type.startsWith("image/")) {
                alert("Chỉ được phép tải lên file ảnh");
                return;
            }

            setAvatarFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle CV upload
    const handleCVChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("Kích thước file phải nhỏ hơn 5MB");
                return;
            }

            const allowedTypes = [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ];

            if (!allowedTypes.includes(file.type)) {
                alert("Chỉ được phép tải lên file PDF, DOC hoặc DOCX");
                return;
            }

            setCvFile(file);
        }
    };

    // Upload avatar
    const uploadAvatar = async () => {
        if (!avatarFile) return formData.profile_picture;

        const formDataUpload = new FormData();
        formDataUpload.append("avatar", avatarFile);

        try {
            setUploadingAvatar(true);
            const response = await axios.post(
                "http://localhost:3001/api/candidate/upload-avatar",
                formDataUpload,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data.avatarUrl;
        } catch (error) {
            console.error("Error uploading avatar:", error);
            throw error;
        } finally {
            setUploadingAvatar(false);
        }
    };

    // Upload CV
    const uploadCV = async () => {
        if (!cvFile) return formData.resume_file;

        const formDataUpload = new FormData();
        formDataUpload.append("cv", cvFile);

        try {
            setUploadingCV(true);
            const response = await axios.post(
                "http://localhost:3001/api/candidate/upload-cv",
                formDataUpload,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data.cvUrl;
        } catch (error) {
            console.error("Error uploading CV:", error);
            throw error;
        } finally {
            setUploadingCV(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            let avatarUrl = formData.profile_picture;
            let cvUrl = formData.resume_file;

            if (avatarFile) {
                avatarUrl = await uploadAvatar();
            }

            if (cvFile) {
                cvUrl = await uploadCV();
            }

            const dataToSend = {};
            Object.keys(formData).forEach((key) => {
                const value = formData[key];
                if (value !== "" && value !== null && value !== undefined) {
                    dataToSend[key] = value;
                }
            });

            if (avatarUrl) {
                dataToSend.profile_picture = avatarUrl;
            }
            if (cvUrl) {
                dataToSend.resume_file = cvUrl;
            }

            await axios.put(
                "http://localhost:3001/api/candidate/profile",
                dataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            alert("Cập nhật thông tin thành công!");
            await fetchCandidateData();
            setAvatarFile(null);
            setCvFile(null);
        } catch (error) {
            console.error("Error updating candidate data:", error);
            alert(
                `Có lỗi xảy ra: ${
                    error.response?.data?.message || error.message
                }`
            );
        } finally {
            setSaving(false);
        }
    };

    // Delete avatar
    const handleDeleteAvatar = async () => {
        if (window.confirm("Bạn có chắc chắn muốn xóa ảnh đại diện?")) {
            try {
                await axios.delete(
                    "http://localhost:3001/api/candidate/delete-avatar",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                );

                setFormData((prev) => ({ ...prev, profile_picture: "" }));
                setAvatarPreview("");
                setAvatarFile(null);
                alert("Xóa ảnh đại diện thành công!");
            } catch (error) {
                console.error("Error deleting avatar:", error);
                alert("Có lỗi xảy ra khi xóa ảnh đại diện");
            }
        }
    };

    // Delete CV
    const handleDeleteCV = async () => {
        if (window.confirm("Bạn có chắc chắn muốn xóa CV?")) {
            try {
                await axios.delete(
                    "http://localhost:3001/api/candidate/delete-cv",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                );

                setFormData((prev) => ({ ...prev, resume_file: "" }));
                setCvFile(null);
                alert("Xóa CV thành công!");
            } catch (error) {
                console.error("Error deleting CV:", error);
                alert("Có lỗi xảy ra khi xóa CV");
            }
        }
    };

    // Render các section khác nhau
    const renderGeneralInfo = () => (
        <div className="section-content">
            <h3>Thông tin chung</h3>
            <div className="form-group">
                <label>Họ và tên người ứng tuyển *</label>
                <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    required
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Ngày sinh *</label>
                    <input
                        type="date"
                        name="birth_date"
                        value={formData.birth_date}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Giới tính *</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                    >
                        <option value="">Chọn giới tính</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Tình trạng hôn nhân *</label>
                    <select
                        name="marital_status"
                        value={formData.marital_status}
                        onChange={handleInputChange}
                    >
                        <option value="">Chọn tình trạng</option>
                        <option value="Độc thân">Độc thân</option>
                        <option value="Đã kết hôn">Đã kết hôn</option>
                        <option value="Khác">Khác</option>
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label>Lĩnh vực nghề nghiệp *</label>
                <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                >
                    <option value="">Chọn lĩnh vực</option>
                    {dropdownOptions.categories.map((category) => (
                        <option key={category._id} value={category._id}>
                            {category.category_name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );

    const renderContactInfo = () => (
        <div className="section-content">
            <h3>Thông tin liên hệ</h3>

            <div className="form-group">
                <label>Email liên hệ tuyển dụng *</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email || userInfo?.email || ""}
                    disabled
                    className="disabled-input"
                    required
                />
                <small className="input-note">
                    Email liên hệ lấy từ tài khoản đăng nhập và không thể thay
                    đổi
                </small>
            </div>

            <div className="form-group">
                <label>Số điện thoại liên hệ *</label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                />
            </div>

            <div className="form-group">
                <label>Đường dẫn Facebook (Nếu có)</label>
                <input
                    type="url"
                    name="facebook"
                    value={formData.facebook || ""}
                    onChange={handleInputChange}
                    placeholder="https://www.facebook.com/yourprofile"
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Tỉnh/Thành phố *</label>
                    <select
                        name="location_id"
                        value={formData.location_id}
                        onChange={handleInputChange}
                    >
                        <option value="">Chọn tỉnh/thành phố</option>
                        {dropdownOptions.locations.map((location) => (
                            <option key={location._id} value={location._id}>
                                {location.location_name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label>Địa chỉ cụ thể *</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Số nhà, tên đường..."
                />
            </div>

            <div className="form-group">
                <label>Nơi làm việc mong muốn</label>
                <textarea
                    name="work_preference"
                    value={formData.work_preference.join(", ")}
                    onChange={(e) =>
                        handleArrayChange("work_preference", e.target.value)
                    }
                    rows="3"
                    placeholder="Nhập các địa điểm mong muốn làm việc (phân cách bằng dấu phẩy)"
                />
            </div>
        </div>
    );

    const renderEducationExperience = () => (
        <div className="section-content">
            <h3>Trình độ học vấn, kỹ năng bản thân</h3>

            <div className="form-row">
                <div className="form-group">
                    <label>Kinh nghiệm làm việc *</label>
                    <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                    >
                        <option value="">Chọn kinh nghiệm</option>
                        {dropdownOptions.experiences.map((exp) => (
                            <option key={exp._id} value={exp._id}>
                                {exp.experience_level}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Cấp bậc việc làm mong muốn *</label>
                    <select
                        name="position_id"
                        value={formData.position_id}
                        onChange={handleInputChange}
                    >
                        <option value="">Chọn cấp bậc</option>
                        {dropdownOptions.positions.map((position) => (
                            <option key={position._id} value={position._id}>
                                {position.position_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Mức lương mong muốn *</label>
                    <select
                        name="salary_expectation"
                        value={formData.salary_expectation}
                        onChange={handleInputChange}
                    >
                        <option value="">Chọn mức lương</option>
                        <option value="3 - 5 triệu">3 - 5 triệu</option>
                        <option value="5 - 7 triệu">5 - 7 triệu</option>
                        <option value="7 - 10 triệu">7 - 10 triệu</option>
                        <option value="10 - 15 triệu">10 - 15 triệu</option>
                        <option value="15 - 20 triệu">15 - 20 triệu</option>
                        <option value="Trên 20 triệu">Trên 20 triệu</option>
                        <option value="Thỏa thuận">Thỏa thuận</option>
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label>Trình độ học vấn *</label>
                <select
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                >
                    <option value="">Chọn trình độ</option>
                    {dropdownOptions.educations.map((edu) => (
                        <option key={edu._id} value={edu._id}>
                            {edu.education_level}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Mô tả về bản thân (Tùy chọn)</label>
                <textarea
                    name="career_objective"
                    value={formData.career_objective}
                    onChange={handleInputChange}
                    rows="6"
                    placeholder="Nhập mô tả về bản thân, mục tiêu nghề nghiệp..."
                />
            </div>
        </div>
    );

    const renderSkills = () => (
        <div className="section-content">
            <h3>Học vấn/bằng cấp và quá trình làm việc</h3>

            <div className="form-group">
                <label>Mục tiêu nghề nghiệp *</label>
                <textarea
                    name="career_objective"
                    value={formData.career_objective}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Mô tả mục tiêu nghề nghiệp của bạn"
                />
            </div>

            <div className="skills-section">
                {/* Kỹ năng chuyên môn */}
                <div className="skill-group">
                    <h4>Kỹ năng chuyên môn:</h4>
                    <div className="skill-tags">
                        {formData.professional_skills.map((skill, index) => (
                            <span key={index} className="skill-tag">
                                {skill}
                            </span>
                        ))}
                    </div>
                    <input
                        type="text"
                        placeholder="Nhập kỹ năng chuyên môn (phân cách bằng dấu phẩy)"
                        defaultValue={formData.professional_skills.join(", ")}
                        onBlur={(e) =>
                            handleArrayChange(
                                "professional_skills",
                                e.target.value
                            )
                        }
                    />
                </div>

                {/* Kỹ năng mềm */}
                <div className="skill-group">
                    <h4>Kỹ năng mềm:</h4>
                    <div className="skill-tags">
                        {formData.soft_skills.map((skill, index) => (
                            <span key={index} className="skill-tag soft">
                                {skill}
                            </span>
                        ))}
                    </div>
                    <input
                        type="text"
                        placeholder="Nhập kỹ năng mềm (phân cách bằng dấu phẩy)"
                        defaultValue={formData.soft_skills.join(", ")}
                        onBlur={(e) =>
                            handleArrayChange("soft_skills", e.target.value)
                        }
                    />
                </div>

                {/* Kỹ năng khác */}
                <div className="skill-group">
                    <h4>Kỹ năng khác:</h4>
                    <div className="skill-tags">
                        {formData.skills.map((skill, index) => (
                            <span key={index} className="skill-tag other">
                                {skill}
                            </span>
                        ))}
                    </div>
                    <input
                        type="text"
                        placeholder="Nhập kỹ năng khác (phân cách bằng dấu phẩy)"
                        defaultValue={formData.skills.join(", ")}
                        onBlur={(e) =>
                            handleArrayChange("skills", e.target.value)
                        }
                    />
                </div>
            </div>
        </div>
    );

    const renderAccountSettings = () => (
        <div className="section-content">
            <h3>Cài đặt tài khoản</h3>

            {/* Thông tin tài khoản */}
            <div className="account-info-section">
                <h4>Thông tin tài khoản</h4>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Email đăng nhập *</label>
                        <input
                            type="email"
                            value={userInfo?.email || ""}
                            disabled
                            className="disabled-input"
                        />
                        <small className="input-note">
                            Email đăng nhập không thể thay đổi
                        </small>
                    </div>

                    <div className="form-group">
                        <label>Vai trò</label>
                        <input
                            type="text"
                            value="Ứng viên"
                            disabled
                            className="disabled-input"
                        />
                    </div>
                </div>
            </div>

            {/* Ảnh đại diện */}
            <div className="avatar-section">
                <h4>Ảnh đại diện của người ứng tuyển *</h4>
                <div className="avatar-upload-container">
                    <div className="current-avatar">
                        <img
                            src={
                                avatarPreview ||
                                getFileUrl(formData.profile_picture) ||
                                "/default-avatar.png"
                            }
                            alt="Profile Avatar"
                            onError={(e) => {
                                e.target.src = "/default-avatar.png";
                            }}
                        />
                    </div>
                    <div className="upload-controls">
                        <input
                            type="file"
                            id="avatar-upload"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            style={{ display: "none" }}
                        />
                        <label htmlFor="avatar-upload" className="btn-upload">
                            {uploadingAvatar ? "Đang tải..." : "Chọn tệp"}
                        </label>

                        {formData.profile_picture && (
                            <button
                                type="button"
                                className="btn-delete"
                                onClick={handleDeleteAvatar}
                            >
                                Xóa ảnh
                            </button>
                        )}

                        <p className="upload-note">
                            {avatarFile
                                ? avatarFile.name
                                : "Không có tệp nào được chọn"}
                        </p>
                        <small className="upload-hint">
                            Định dạng: JPG, PNG. Kích thước tối đa: 2MB
                        </small>
                    </div>
                </div>
            </div>

            {/* CV Upload */}
            <div className="cv-section">
                <h4>
                    CV của bạn (Tùy chọn, khuyến khích tải lên CV của bạn để nhà
                    tuyển dụng có thể biết nhiều thông tin chi tiết hơn về bạn)
                </h4>
                <div className="cv-upload-container">
                    <div className="cv-current">
                        {formData.resume_file ? (
                            <div className="cv-info">
                                <span className="cv-icon">📄</span>
                                <div className="cv-details">
                                    <p>CV đã được tải lên</p>
                                    <a
                                        href={getFileUrl(formData.resume_file)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-view-cv"
                                    >
                                        Xem CV
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="cv-empty">
                                <span className="cv-icon">📄</span>
                                <p>Chưa có CV nào được tải lên</p>
                            </div>
                        )}
                    </div>

                    <div className="cv-upload-controls">
                        <input
                            type="file"
                            id="cv-upload"
                            accept=".pdf,.doc,.docx"
                            onChange={handleCVChange}
                            style={{ display: "none" }}
                        />
                        <label htmlFor="cv-upload" className="btn-upload-cv">
                            {uploadingCV ? "Đang tải..." : "Chọn file CV"}
                        </label>

                        {formData.resume_file && (
                            <button
                                type="button"
                                className="btn-delete"
                                onClick={handleDeleteCV}
                            >
                                Xóa CV
                            </button>
                        )}

                        <p className="upload-note">
                            {cvFile
                                ? cvFile.name
                                : "Không có tệp nào được chọn"}
                        </p>
                        <small className="upload-hint">
                            Định dạng: PDF, DOC, DOCX. Kích thước tối đa: 5MB
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );

    // Function renderContent bị thiếu - đây là nguyên nhân lỗi
    const renderContent = () => {
        switch (activeSection) {
            case "general":
                return renderGeneralInfo();
            case "contact":
                return renderContactInfo();
            case "education":
                return renderEducationExperience();
            case "skills":
                return renderSkills();
            case "settings":
                return renderAccountSettings();
            default:
                return renderGeneralInfo();
        }
    };

    if (loading) {
        return <div className="loading">Đang tải thông tin...</div>;
    }

    return (
        <div className="candidate-info">
            {/* Header với tabs */}
            <div className="info-header">
                <h2>Thông tin người ứng tuyển</h2>
            </div>

            {/* Navigation tabs */}
            <div className="section-tabs">
                <button
                    className={`tab-button ${
                        activeSection === "general" ? "active" : ""
                    }`}
                    onClick={() => setActiveSection("general")}
                >
                    Thông tin chung
                </button>
                <button
                    className={`tab-button ${
                        activeSection === "contact" ? "active" : ""
                    }`}
                    onClick={() => setActiveSection("contact")}
                >
                    Thông tin liên hệ
                </button>
                <button
                    className={`tab-button ${
                        activeSection === "education" ? "active" : ""
                    }`}
                    onClick={() => setActiveSection("education")}
                >
                    Trình độ học vấn, kỹ năng bản thân
                </button>
                <button
                    className={`tab-button ${
                        activeSection === "skills" ? "active" : ""
                    }`}
                    onClick={() => setActiveSection("skills")}
                >
                    Học vấn/bằng cấp và quá trình làm việc
                </button>
                <button
                    className={`tab-button ${
                        activeSection === "settings" ? "active" : ""
                    }`}
                    onClick={() => setActiveSection("settings")}
                >
                    Cài đặt tài khoản
                </button>
            </div>

            {/* Content */}
            <form className="candidate-form">
                {renderContent()}

                {/* Save button */}
                <div className="form-actions">
                    <button
                        type="button"
                        className="btn-save"
                        onClick={handleSave}
                        disabled={saving || uploadingAvatar || uploadingCV}
                    >
                        {saving ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CandidateInfo;
