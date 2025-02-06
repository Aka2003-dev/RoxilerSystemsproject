import { useEffect, useState } from "react";
import axios from "axios";

const Statistics = ({ selectedMonth }) => {
    const [stats, setStats] = useState({
        totalSaleAmount: 0,
        totalSoldItems: 0,
        totalNotSoldItems: 0
    });

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/statistics?month=${selectedMonth}`);
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching statistics:", error);
            }
        };

        fetchStatistics();
    }, [selectedMonth]);

    return (
        <div className="grid grid-cols-3 gap-4 p-4 bg-yellow-100 rounded-lg shadow-md mt-4">
            <div className="p-4 bg-white rounded-lg text-center shadow">
                <h2 className="text-lg font-semibold text-gray-600">Total Sales</h2>
                <p className="text-2xl font-bold text-blue-600">${stats.totalSaleAmount}</p>
            </div>
            <div className="p-4 bg-white rounded-lg text-center shadow">
                <h2 className="text-lg font-semibold text-gray-600">Sold Items</h2>
                <p className="text-2xl font-bold text-green-600">{stats.totalSoldItems}</p>
            </div>
            <div className="p-4 bg-white rounded-lg text-center shadow">
                <h2 className="text-lg font-semibold text-gray-600">Unsold Items</h2>
                <p className="text-2xl font-bold text-red-600">{stats.totalNotSoldItems}</p>
            </div>
        </div>
    );
};

export default Statistics;
