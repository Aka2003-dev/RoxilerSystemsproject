const axios = require("axios");

const API_URL = "https://s3.amazonaws.com/roxiler.com/product_transaction.json";

exports.getAllProducts = async (req, res) => {
    try {
        console.log("🔍 API Hit: /api/products");
        console.log("Query Params:", req.query);

        const { data } = await axios.get(API_URL);
        const { month = "March", search = "", page = 1 } = req.query;

        if (!data || !Array.isArray(data)) {
            console.error("❌ API response is not an array:", data);
            return res.status(500).json({ message: "Invalid API response" });
        }

        // Array for month indexing
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const monthIndex = months.indexOf(month) + 1;
        console.log("🗓️ Selected Month:", month, "➡️", monthIndex);

        // Filter month from data
        let filteredTransactions = data.filter((item) => {
            const itemMonth = new Date(item.dateOfSale).getMonth() + 1;
            return itemMonth === monthIndex;
        });

        console.log("✅ Filtered Transactions Count:", filteredTransactions.length);

        // Apply search filter
        if (search) {
            filteredTransactions = filteredTransactions.filter((item) =>
                item.title?.toLowerCase().includes(search.toLowerCase()) ||
                item.description?.toLowerCase().includes(search.toLowerCase()) ||
                item.price?.toString().includes(search)
            );
            console.log("🔍 After Search Filter:", filteredTransactions.length);
        }

        // Page No.
        const itemsPerPage = 10;
        const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
        const paginatedTransactions = filteredTransactions.slice((page - 1) * itemsPerPage, page * itemsPerPage);

        console.log(`📄 Page: ${page}/${totalPages} | Showing ${paginatedTransactions.length} items`);

        res.json({ transactions: paginatedTransactions, totalPages });
    } catch (error) {
        console.error("❌ Error fetching transactions:", error.message);
        res.status(500).json({ message: "Error fetching transactions" });
    }
};



exports.getStatistics = async (req, res) => {
    try {
        console.log("📊 API Hit: /api/statistics");
        console.log("Query Params:", req.query);

        const { data } = await axios.get(API_URL);
        const { month = "March" } = req.query;

        if (!data || !Array.isArray(data)) {
            console.error("❌ API response is not an array:", data);
            return res.status(500).json({ message: "Invalid API response" });
        }

        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const monthIndex = months.indexOf(month) + 1;
        const filteredTransactions = data.filter((item) => {
            const itemMonth = new Date(item.dateOfSale).getMonth() + 1;
            return itemMonth === monthIndex;
        });

        console.log("✅ Filtered Transactions Count:", filteredTransactions.length);

        // Calculate statistics
        const totalSaleAmount = filteredTransactions
            .filter((item) => item.sold)
            .reduce((sum, item) => sum + item.price, 0);

        const totalSoldItems = filteredTransactions.filter((item) => item.sold).length;
        const totalNotSoldItems = filteredTransactions.filter((item) => !item.sold).length;

        res.json({
            totalSaleAmount,
            totalSoldItems,
            totalNotSoldItems
        });
    } catch (error) {
        console.error("❌ Error fetching statistics:", error.message);
        res.status(500).json({ message: "Error fetching statistics" });
    }
};

exports.getBarChartData = async (req, res) => {
    try {
        console.log("📊 API Hit: /api/bar-chart");
        console.log("Query Params:", req.query);

        const { data } = await axios.get(API_URL);
        const { month = "March" } = req.query;

        if (!data || !Array.isArray(data)) {
            console.error("❌ API response is not an array:", data);
            return res.status(500).json({ message: "Invalid API response" });
        }

        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const monthIndex = months.indexOf(month) + 1;
        const filteredTransactions = data.filter((item) => {
            const itemMonth = new Date(item.dateOfSale).getMonth() + 1;
            return itemMonth === monthIndex;
        });

        console.log("✅ Filtered Transactions Count:", filteredTransactions.length);

        // Define price ranges
        const priceRanges = {
            "0-100": 0,
            "101-500": 0,
            "501-1000": 0,
            "1001-5000": 0,
            "5001+": 0
        };

        // Categorize transactions into price ranges
        filteredTransactions.forEach((item) => {
            if (item.price <= 100) priceRanges["0-100"]++;
            else if (item.price <= 500) priceRanges["101-500"]++;
            else if (item.price <= 1000) priceRanges["501-1000"]++;
            else if (item.price <= 5000) priceRanges["1001-5000"]++;
            else priceRanges["5001+"]++;
        });

        console.log("📊 Bar Chart Data:", priceRanges);

        res.json(priceRanges);
    } catch (error) {
        console.error("❌ Error fetching bar chart data:", error.message);
        res.status(500).json({ message: "Error fetching bar chart data" });
    }
};

