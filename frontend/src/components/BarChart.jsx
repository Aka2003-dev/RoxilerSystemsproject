import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the required components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ selectedMonth }) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        const fetchBarChartData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/bar-chart?month=${selectedMonth}`);
                setChartData({
                    labels: Object.keys(response.data),
                    datasets: [
                        {
                            label: "Number of Items",
                            data: Object.values(response.data),
                            backgroundColor: ["#4CAF50", "#FF9800", "#2196F3", "#9C27B0", "#F44336"],
                        }
                    ]
                });
            } catch (error) {
                console.error("Error fetching bar chart data:", error);
            }
        };

        fetchBarChartData();
    }, [selectedMonth]);

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-600 text-center mb-4">Transactions Price Distribution</h2>
            <Bar data={chartData} />
        </div>
    );
};

export default BarChart;
