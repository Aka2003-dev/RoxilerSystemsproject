import React, { useEffect, useState } from "react";
import axios from "axios";
import Statistics from "./Statistics";
import BarChart from "./BarChart";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const Table = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("March");
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactions = async (month, query = "", pageNum = 1) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/products?month=${month}&search=${query}&page=${pageNum}`);
      setTransactions(data.transactions);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching transactions", error);
    }
  };

  useEffect(() => {
    fetchTransactions(selectedMonth, searchText, page);
  }, [selectedMonth, searchText, page]);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setPage(1);
  };

  return (
    <div className="p-4 bg-green-100 ">
      

      <div className="flex justify-between mb-4 mt-6">
        <select
          className="p-2 border rounded-md"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {months.map((month) => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>

        <input
          type="text"
          className="p-2 border rounded-md w-64"
          placeholder="Search transactions..."
          value={searchText}
          onChange={handleSearchChange}
        />
      </div>

 
      <table className="w-full bg-white shadow-md rounded-lg">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Title</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-left">Price</th>
            <th className="p-3 text-left">Sold</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b">
                <td className="p-3">{transaction.id}</td>
                <td className="p-3">{transaction.title}</td>
                <td className="p-3">{transaction.description}</td>
                <td className="p-3">${transaction.price}</td>
                <td className="p-3">{transaction.sold ? "✔️" : "❌"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="p-3 text-center text-gray-500">No transactions found</td>
            </tr>
          )}
        </tbody>
      </table>

    
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="text-gray-700">Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
        >
          Next
        </button>
      </div>

     
      <Statistics selectedMonth={selectedMonth} />

     
      <div className="mt-6">
        <BarChart selectedMonth={selectedMonth} />
      </div>
      
    </div>
  );
};

export default Table;
