import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
} from "chart.js";
import axios from "axios";
import "../../styles/StatsPage.css";

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
);

export default function StatsPage() {
    const [userCount, setUserCount] = useState(0);
    const [employerCount, setEmployerCount] = useState(0);
    const [jobCount, setJobCount] = useState(0);
    const [categoryCount, setCategoryCount] = useState(0);
    const [userStats, setUserStats] = useState([]);
    const [employerStats, setEmployerStats] = useState([]);
    const [jobStats, setJobStats] = useState([]);

    // Fetch các thống kê từ backend
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const userRes = await axios.get(
                    "http://localhost:3001/api/stats/total-users"
                );
                setUserCount(userRes.data.userCount);

                const employerRes = await axios.get(
                    "http://localhost:3001/api/stats/total-employers"
                );
                setEmployerCount(employerRes.data.employerCount);

                const jobRes = await axios.get(
                    "http://localhost:3001/api/stats/total-jobs"
                );
                setJobCount(jobRes.data.jobCount);

                const categoryRes = await axios.get(
                    "http://localhost:3001/api/stats/total-categories"
                );
                setCategoryCount(categoryRes.data.categoryCount);

                const userByMonthRes = await axios.get(
                    "http://localhost:3001/api/stats/users-by-month"
                );
                setUserStats(userByMonthRes.data);

                const employerByMonthRes = await axios.get(
                    "http://localhost:3001/api/stats/employer-by-month"
                );
                setEmployerStats(employerByMonthRes.data);

                const jobByMonthRes = await axios.get(
                    "http://localhost:3001/api/stats/jobs-by-month"
                );
                setJobStats(jobByMonthRes.data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        fetchStats();
    }, []);

    // Dữ liệu cho biểu đồ ứng viên theo tháng
    const userData = {
        labels: userStats.map((stat) => `Tháng ${stat._id}`),
        datasets: [
            {
                label: "Số lượng ứng viên",
                data: userStats.map((stat) => stat.count),
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    // Dữ liệu cho biểu đồ doanh nghiệp theo tháng
    const employerData = {
        labels: employerStats.map((stat) => `Tháng ${stat._id}`),
        datasets: [
            {
                label: "Số lượng doanh nghiệp",
                data: employerStats.map((stat) => stat.count),
                backgroundColor: "rgba(213, 255, 114, 0.8)",
                borderColor: "rgba(167, 255, 2, 1)",
                borderWidth: 1,
            },
        ],
    };

    // Dữ liệu cho biểu đồ tin tuyển dụng theo tháng
    const jobData = {
        labels: jobStats.map((stat) => `Tháng ${stat._id}`),
        datasets: [
            {
                label: "Số lượng tin tuyển dụng",
                data: jobStats.map((stat) => stat.count),
                backgroundColor: "rgba(153, 102, 255, 0.2)",
                borderColor: "rgba(153, 102, 255, 1)",
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="stats-layout">
            <div className="stats-panels">
                <div className="stat-panel user">
                    <h4>Tổng số ứng viên</h4>
                    <p>{userCount}</p>
                </div>
                <div className="stat-panel employer">
                    <h4>Tổng số doanh nghiệp</h4>
                    <p>{employerCount}</p>
                </div>
                <div className="stat-panel job">
                    <h4>Tổng số tin tuyển dụng</h4>
                    <p>{jobCount}</p>
                </div>
                <div className="stat-panel category">
                    <h4>Tổng số danh mục nghề nghiệp</h4>
                    <p>{categoryCount}</p>
                </div>
            </div>
            <div className="stats-charts">
                <div className="chart-block">
                    <h4>Biểu đồ ứng viên theo tháng</h4>
                    <Bar data={userData} />
                </div>
                <div className="chart-block">
                    <h4>Biểu đồ doanh nghiệp theo tháng</h4>
                    <Bar data={employerData} />
                </div>
                <div className="chart-block">
                    <h4>Biểu đồ tin tuyển dụng theo tháng</h4>
                    <Bar data={jobData} />
                </div>
            </div>
        </div>
    );
}
