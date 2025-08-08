# Job Seeker Frontend - Hệ thống Tuyển dụng Việc làm

## 📋 Tổng quan

Frontend của hệ thống tuyển dụng việc làm được xây dựng bằng React.js, cung cấp giao diện người dùng hiện đại và responsive cho 3 nhóm đối tượng: Ứng viên, Nhà tuyển dụng và Quản trị viên.

## 🚀 Tính năng chính

### 👤 Dành cho Ứng viên (Candidates)

-   **Quản lý hồ sơ cá nhân**: Cập nhật thông tin, upload CV và ảnh đại diện
-   **Tìm kiếm việc làm**: Filter theo danh mục, địa điểm, mức lương
-   **Ứng tuyển**: Apply job với cover letter, theo dõi trạng thái
-   **Quản lý ứng tuyển**: Xem danh sách công việc đã ứng tuyển
-   **Lưu công việc**: Bookmark các công việc yêu thích

### 🏢 Dành cho Nhà tuyển dụng (Employers)

-   **Quản lý thông tin công ty**: Cập nhật profile doanh nghiệp
-   **Đăng tin tuyển dụng**: Tạo và chỉnh sửa tin tuyển dụng
-   **Quản lý ứng viên**: Xem CV, thay đổi trạng thái ứng tuyển
-   **Dashboard**: Thống kê và quản lý tổng quan
-   **Sắp xếp tin tuyển dụng**: Sort theo ngày, tiêu đề, số ứng viên

### ⚙️ Dành cho Quản trị viên (Admin)

-   **Dashboard**: Thống kê tổng quan hệ thống
-   **Quản lý người dùng**: CRUD operations cho users
-   **Quản lý trang chủ**: Customize homepage content
-   **Báo cáo**: Analytics và reporting

## 🛠 Công nghệ sử dụng

-   **Framework**: React.js 18.2.0
-   **Routing**: React Router DOM 6.0.0
-   **HTTP Client**: Axios 1.4.0
-   **Charts**: Chart.js 4.0.0 + React-Chartjs-2 5.2.0
-   **Styling**: CSS3 + Responsive Design
-   **State Management**: React Hooks (useState, useEffect)

## 📁 Cấu trúc thư mục

```
src/
├── components/           # Reusable components
│   ├── ApplyJobModal.jsx
│   ├── CandidateCard.jsx
│   ├── CompanyCard.jsx
│   ├── Footer.jsx
│   ├── admin/           # Admin-specific components
│   └── homePage/        # Homepage components
├── pages/               # Page components
│   ├── admin/           # Admin pages
│   ├── authPage/        # Authentication pages
│   ├── candidate/       # Candidate pages
│   ├── commonPage/      # Common pages
│   └── employer/        # Employer pages
├── styles/              # CSS files
│   ├── AdminDashboard.css
│   ├── CandidateDashboard.css
│   ├── EmployerDashboard.css
│   └── ...
├── App.jsx             # Main App component
└── main.jsx           # Entry point
```

## 🚦 Cài đặt và Chạy dự án

### Yêu cầu hệ thống

-   Node.js >= 16.0.0
-   npm >= 8.0.0

### Cài đặt

```bash
# Clone repository
git clone [repository-url]
cd recruitment-fr

# Cài đặt dependencies
npm install
```

### Cấu hình Environment

Tạo file `.env` trong thư mục root:

```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_UPLOAD_URL=http://localhost:3001/uploads
```

### Chạy ứng dụng

```bash
# Development mode
npm start

# Build for production
npm run build

# Preview production build
npm run preview
```

Ứng dụng sẽ chạy trên `http://localhost:3000`

## 📱 Responsive Design

Website được thiết kế responsive cho:

-   **Desktop**: >= 1024px
-   **Tablet**: 768px - 1023px
-   **Mobile**: < 768px

## 🔐 Authentication Flow

### Đăng ký/Đăng nhập

1. User chọn role (Candidate/Employer)
2. Điền thông tin và submit form
3. Nhận JWT token từ backend
4. Store token trong localStorage
5. Redirect đến dashboard tương ứng

### Route Protection

```jsx
// Protected route example
useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "user") {
        navigate("/login");
    }
}, []);
```

## 📊 State Management

Sử dụng React Hooks cho state management:

```jsx
// Example: Candidate Info Component
const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    // ...other fields
});

const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

## 🎨 Styling Guidelines

### CSS Organization

-   Component-specific CSS files
-   Global styles trong `index.css`
-   Responsive utilities
-   CSS Variables cho colors và spacing

### Design System

```css
/* Colors */
:root {
    --primary-color: #1976d2;
    --secondary-color: #f44336;
    --success-color: #4caf50;
    --warning-color: #ff9800;
    --text-primary: #2c3e50;
    --text-secondary: #64748b;
    --background: #f8f9fa;
}

/* Spacing */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}
```

## 🔄 API Integration

### Axios Configuration

```jsx
// API calls example
const fetchCandidateData = async () => {
    try {
        const response = await axios.get(
            "http://localhost:3001/api/candidate/profile",
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        setData(response.data);
    } catch (error) {
        setError("Không thể tải dữ liệu");
    }
};
```

### Error Handling

```jsx
const handleApiError = (error) => {
    if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
    } else {
        const message = error.response?.data?.message || "Có lỗi xảy ra";
        alert(message);
    }
};
```

## 📤 File Upload

### Supported File Types

-   **Images**: JPG, PNG (max 2MB)
-   **CV**: PDF, DOC, DOCX (max 5MB)

### Upload Implementation

```jsx
const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await axios.post(
            "http://localhost:3001/api/upload",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data.url;
    } catch (error) {
        throw new Error("Upload failed");
    }
};
```

## 🔍 Key Features Implementation

### Search & Filter

```jsx
const [filters, setFilters] = useState({
    category: "",
    location: "",
    salary: "",
    keyword: "",
});

const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
};
```

### Pagination

```jsx
const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 10,
    total: 0,
});

const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
};
```

### Modal Components

```jsx
const [showModal, setShowModal] = useState(false);
const [selectedJob, setSelectedJob] = useState(null);

const handleApplyJob = (job) => {
    setSelectedJob(job);
    setShowModal(true);
};
```

## 🚀 Performance Optimization

-   **Lazy Loading**: Components được load khi cần
-   **Image Optimization**: Compress và resize images
-   **Memoization**: Sử dụng React.memo cho heavy components
-   **Bundle Splitting**: Code splitting cho production

## 🧪 Testing

### Unit Testing

```bash
# Run tests
npm test

# Coverage report
npm run test:coverage
```

### E2E Testing

```bash
# Cypress tests
npm run cypress:open
```

## 🐛 Debugging

### Development Tools

-   React Developer Tools
-   Redux DevTools (nếu sử dụng)
-   Network tab để debug API calls
-   Console logs cho error tracking

### Common Issues

1. **CORS Errors**: Đảm bảo backend đã configure CORS
2. **Authentication**: Check token expiration
3. **File Upload**: Verify file size và format
4. **Responsive**: Test trên multiple devices

## 📝 Contributing

### Code Style

-   ESLint configuration
-   Prettier formatting
-   Conventional commits
-   Component naming: PascalCase
-   File naming: camelCase

### Pull Request Process

1. Fork repository
2. Create feature branch
3. Implement changes
4. Write tests
5. Submit PR with description

## 📞 Support

-   **Email**: [support-email]
-   **Documentation**: [docs-url]
-   **Issues**: [github-issues-url]

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Developed with ❤️ by [Your Name]**
