import { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/CategorySlide.css";

export default function CategorySlide() {
    const [categories, setCategories] = useState([]);

    // Gọi API để lấy danh mục và số lượng tin tuyển dụng
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3001/api/categories-with-jobs"
                );
                setCategories(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh mục tuyển dụng", error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="category-slide">
            <h2 className="category-slide-title">
                Danh Mục Tuyển Dụng Nổi Bật
            </h2>
            <p className="category-slide-subtitle">
                Tìm kiếm việc làm theo danh mục phù hợp với bạn.
            </p>

            <div className="category-grid">
                {categories.map((category, index) => (
                    <div key={index} className="category-card">
                        <div className="category-card-icon">
                            <img
                                src="/logo-danh-muc.png"
                                alt="Logo"
                                className="category-logo-img"
                            />
                        </div>
                        <h3>{category.categoryName}</h3>
                        <p className="category-job-count">
                            {category.jobCount} Tin tuyển dụng
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
