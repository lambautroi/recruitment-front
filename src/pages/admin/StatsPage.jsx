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

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
);

export default function StatsPage() {
    const data = {
        labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4"],
        datasets: [
            {
                label: "Doanh thu theo tháng",
                data: [4000, 5000, 6000, 7000],
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
            {
                label: "Số tin tuyển dụng",
                data: [50, 60, 70, 80],
                backgroundColor: "rgba(153, 102, 255, 0.2)",
                borderColor: "rgba(153, 102, 255, 1)",
                borderWidth: 1,
            },
        ],
    };

    return (
        <div>
            <h2>Trang Thống Kê</h2>
            <div>
                <h4>Doanh thu theo tháng</h4>
                <Bar data={data} />
            </div>
        </div>
    );
}
