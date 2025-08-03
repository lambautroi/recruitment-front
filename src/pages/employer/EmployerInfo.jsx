import React, { useState, useEffect } from "react";
import axios from "axios";

const EmployerInfo = ({ userInfo }) => {
    const [activeSubTab, setActiveSubTab] = useState("general");
    const [employerData, setEmployerData] = useState({
        employer_name: "",
        employer_description: "",
        contact_info: "",
        location_id: "",
        category_id: "",
        established_date: "",
        tax_code: "",
        company_size: "",
        business_license: "",
        phone: "",
        email: "",
        website: "",
        address: "",
        business_type: "",
        employer_logo: "",
    });
    const [originalData, setOriginalData] = useState({});
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState("");

    const getLogoUrl = (logoPath) => {
        if (!logoPath) return "/employer-logo.png";

        if (logoPath.startsWith("/uploads/")) {
            return `http://localhost:3001${logoPath}`;
        }

        if (logoPath.startsWith("http")) {
            return logoPath;
        }

        return "/employer-logo.png";
    };

    useEffect(() => {
        fetchEmployerData();
        fetchFilterOptions();
    }, []);

    const fetchEmployerData = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `http://localhost:3001/api/employer/profile`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const data = response.data;
            const formattedData = {
                employer_name: data.employer_name || "",
                employer_description: data.employer_description || "",
                contact_info: data.contact_info || "",
                location_id: data.location_id?._id || "",
                category_id: data.category_id?._id || "",
                established_date: data.established_date
                    ? new Date(data.established_date)
                          .toISOString()
                          .split("T")[0]
                    : "",
                tax_code: data.tax_code || "",
                company_size: data.company_size || "",
                business_license: data.business_license || "",
                phone: data.phone || "",
                email: data.email || "",
                website: data.website || "",
                address: data.address || "",
                business_type: data.business_type || "",
                employer_logo: data.employer_logo || "",
            };

            setEmployerData(formattedData);
            setOriginalData(formattedData);
            setLogoPreview(data.employer_logo || "");
        } catch (error) {
            console.error("Error fetching employer data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFilterOptions = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3001/api/companies/filter-options"
            );
            setCategories(response.data.categories);
            setLocations(response.data.locations);
        } catch (error) {
            console.error("Error fetching filter options:", error);
        }
    };

    const handleInputChange = (field, value) => {
        setEmployerData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleLogoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogoPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadLogo = async () => {
        if (!logoFile) return employerData.employer_logo;

        const formData = new FormData();
        formData.append("logo", logoFile);

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "http://localhost:3001/api/employer/upload-logo",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data.logoUrl;
        } catch (error) {
            console.error("Error uploading logo:", error);
            throw error;
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            let logoUrl = employerData.employer_logo;

            if (logoFile) {
                logoUrl = await uploadLogo();
            }

            const dataToSend = {};

            Object.keys(employerData).forEach((key) => {
                const value = employerData[key];
                if (value !== "" && value !== null && value !== undefined) {
                    dataToSend[key] = value;
                }
            });

            if (logoUrl) {
                dataToSend.employer_logo = logoUrl;
            }

            console.log("Sending data:", dataToSend);

            const token = localStorage.getItem("token");
            const response = await axios.put(
                "http://localhost:3001/api/employer/profile",
                dataToSend,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            alert("Cập nhật thông tin thành công!");
            await fetchEmployerData();
            setLogoFile(null);
        } catch (error) {
            console.error("Error updating employer data:", error);
            alert(
                `Có lỗi xảy ra: ${
                    error.response?.data?.message || error.message
                }`
            );
        } finally {
            setSaving(false);
        }
    };

    const renderGeneralInfo = () => (
        <div className="info-section">
            <h3>Thông tin chung</h3>
            <div className="form-grid">
                <div className="form-group">
                    <label>Tên doanh nghiệp *</label>
                    <input
                        type="text"
                        value={employerData.employer_name}
                        onChange={(e) =>
                            handleInputChange("employer_name", e.target.value)
                        }
                        placeholder="VD: Công ty TNHH ABC"
                    />
                </div>

                <div className="form-group">
                    <label>Lĩnh vực hoạt động *</label>
                    <select
                        value={employerData.category_id}
                        onChange={(e) =>
                            handleInputChange("category_id", e.target.value)
                        }
                    >
                        <option value="">-- Chọn lĩnh vực --</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.category_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Loại hình tổ chức của doanh nghiệp *</label>
                    <select
                        value={employerData.business_type}
                        onChange={(e) =>
                            handleInputChange("business_type", e.target.value)
                        }
                    >
                        <option value="">-- Chọn loại hình --</option>
                        <option value="Công ty TNHH">Công ty TNHH</option>
                        <option value="Công ty cổ phần">Công ty cổ phần</option>
                        <option value="Doanh nghiệp tư nhân">
                            Doanh nghiệp tư nhân
                        </option>
                        <option value="Khác">Khác</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Quy mô của doanh nghiệp *</label>
                    <select
                        value={employerData.company_size}
                        onChange={(e) =>
                            handleInputChange("company_size", e.target.value)
                        }
                    >
                        <option value="">-- Chọn quy mô --</option>
                        <option value="Dưới 50 nhân viên">
                            Dưới 50 nhân viên
                        </option>
                        <option value="50-100 nhân viên">
                            50-100 nhân viên
                        </option>
                        <option value="100-500 nhân viên">
                            100-500 nhân viên
                        </option>
                        <option value="Trên 500 nhân viên">
                            Trên 500 nhân viên
                        </option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Mã số thuế *</label>
                    <input
                        type="text"
                        value={employerData.tax_code}
                        onChange={(e) =>
                            handleInputChange("tax_code", e.target.value)
                        }
                        placeholder="VD: 0123456789"
                    />
                </div>

                <div className="form-group">
                    <label>Ngày thành lập *</label>
                    <input
                        type="date"
                        value={employerData.established_date}
                        onChange={(e) =>
                            handleInputChange(
                                "established_date",
                                e.target.value
                            )
                        }
                    />
                </div>

                <div className="form-group full-width">
                    <label>Giới thiệu về doanh nghiệp</label>
                    <textarea
                        rows="6"
                        value={employerData.employer_description}
                        onChange={(e) =>
                            handleInputChange(
                                "employer_description",
                                e.target.value
                            )
                        }
                        placeholder="Mô tả về hoạt động, tầm nhìn, sứ mệnh của doanh nghiệp..."
                    />
                </div>
            </div>
        </div>
    );

    const renderContactInfo = () => (
        <div className="info-section">
            <h3>Thông tin liên hệ</h3>
            <div className="form-grid">
                <div className="form-group">
                    <label>Tỉnh/Thành phố *</label>
                    <select
                        value={employerData.location_id}
                        onChange={(e) =>
                            handleInputChange("location_id", e.target.value)
                        }
                    >
                        <option value="">-- Chọn tỉnh/thành phố --</option>
                        {locations.map((location) => (
                            <option key={location._id} value={location._id}>
                                {location.location_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Số điện thoại *</label>
                    <input
                        type="tel"
                        value={employerData.phone}
                        onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                        }
                        placeholder="VD: 0123456789"
                    />
                </div>

                <div className="form-group">
                    <label>Email liên hệ *</label>
                    <input
                        type="email"
                        value={employerData.email}
                        onChange={(e) =>
                            handleInputChange("email", e.target.value)
                        }
                        placeholder="VD: contact@company.com"
                    />
                </div>

                <div className="form-group">
                    <label>Website</label>
                    <input
                        type="url"
                        value={employerData.website}
                        onChange={(e) =>
                            handleInputChange("website", e.target.value)
                        }
                        placeholder="VD: https://company.com"
                    />
                </div>

                <div className="form-group full-width">
                    <label>Địa chỉ chi tiết *</label>
                    <textarea
                        rows="3"
                        value={employerData.address}
                        onChange={(e) =>
                            handleInputChange("address", e.target.value)
                        }
                        placeholder="VD: Số 123, Đường ABC, Phường XYZ, Quận DEF"
                    />
                </div>
            </div>
        </div>
    );

    const renderAccountSettings = () => (
        <div className="info-section">
            <h3>Cài đặt tài khoản</h3>

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
                            value="Nhà tuyển dụng"
                            disabled
                            className="disabled-input"
                        />
                    </div>
                </div>
            </div>

            <div className="logo-section">
                <h4>Ảnh đại diện doanh nghiệp</h4>
                <div className="logo-upload-container">
                    <div className="current-logo">
                        <img
                            src={
                                logoPreview ||
                                getLogoUrl(employerData.employer_logo)
                            }
                            alt="Company Logo"
                            onError={(e) => {
                                e.target.src = "/employer-logo.png";
                            }}
                        />
                    </div>
                    <div className="upload-controls">
                        <input
                            type="file"
                            id="logo-upload"
                            accept="image/*"
                            onChange={handleLogoChange}
                            style={{ display: "none" }}
                        />
                        <label htmlFor="logo-upload" className="btn-upload">
                            Chọn tệp
                        </label>
                        <p className="upload-note">
                            {logoFile
                                ? logoFile.name
                                : "Không có tệp nào được chọn"}
                        </p>
                        <small className="upload-hint">
                            Định dạng: JPG, PNG. Kích thước tối đa: 2MB
                        </small>
                    </div>
                </div>
            </div>

            <div className="contact-display-section">
                <h4>Hiển thị công khai</h4>
                <div className="form-grid">
                    <div className="form-group full-width">
                        <label>Thông tin liên hệ hiển thị</label>
                        <input
                            type="text"
                            value={employerData.contact_info}
                            onChange={(e) =>
                                handleInputChange(
                                    "contact_info",
                                    e.target.value
                                )
                            }
                            placeholder="VD: Liên hệ: 0123456789 - hr@company.com"
                        />
                        <small className="input-note">
                            Thông tin này sẽ hiển thị công khai cho ứng viên
                        </small>
                    </div>

                    <div className="form-group full-width">
                        <label>Giấy phép kinh doanh</label>
                        <input
                            type="text"
                            value={employerData.business_license}
                            onChange={(e) =>
                                handleInputChange(
                                    "business_license",
                                    e.target.value
                                )
                            }
                            placeholder="VD: Giấy phép kinh doanh số 0123456789"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return <div className="loading">Đang tải thông tin...</div>;
    }

    return (
        <div className="employer-info">
            <div className="page-header">
                <h2>Thông tin doanh nghiệp</h2>
            </div>

            {/* Sub Tabs */}
            <div className="sub-tabs">
                <button
                    className={`sub-tab ${
                        activeSubTab === "general" ? "active" : ""
                    }`}
                    onClick={() => setActiveSubTab("general")}
                >
                    Thông tin chung
                </button>
                <button
                    className={`sub-tab ${
                        activeSubTab === "contact" ? "active" : ""
                    }`}
                    onClick={() => setActiveSubTab("contact")}
                >
                    Thông tin liên hệ
                </button>
                <button
                    className={`sub-tab ${
                        activeSubTab === "account" ? "active" : ""
                    }`}
                    onClick={() => setActiveSubTab("account")}
                >
                    Cài đặt tài khoản
                </button>
            </div>

            {/* Content */}
            <div className="tab-content">
                {activeSubTab === "general" && renderGeneralInfo()}
                {activeSubTab === "contact" && renderContactInfo()}
                {activeSubTab === "account" && renderAccountSettings()}
            </div>

            {/* Save Button */}
            <div className="form-actions">
                <button
                    type="button"
                    className="btn-save"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
            </div>
        </div>
    );
};

export default EmployerInfo;
