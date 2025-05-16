import { useEffect, useState } from "react";

const Dashboard = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    // Simulate dynamic sales data (e.g., sales over 12 months)
    const generateSalesData = () => {
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      const data = months.map((month, index) => ({
        month,
        sales: Math.floor(Math.random() * 10000) + 5000, // Random sales between 5000 and 15000
      }));
      setSalesData(data);
    };

    generateSalesData();
  }, []);

  useEffect(() => {
    const loadGoogleCharts = () => {
      window.google.charts.load("current", { packages: ["corechart", "line"] });
      window.google.charts.setOnLoadCallback(drawChart);
    };

    const drawChart = () => {
      if (!window.google || !window.google.visualization) {
        console.error("Google Charts failed to load.");
        return;
      }

      // Prepare data for the chart
      const chartData = [["Month", "Sales"]];
      salesData.forEach(({ month, sales }) => {
        chartData.push([month, sales]);
      });

      var data = new window.google.visualization.arrayToDataTable(chartData);

      var options = {
        title: "E-Commerce Sales Trends (2023)",
        hAxis: {
          title: "Month",
          titleTextStyle: {
            color: "#333",
            fontSize: 14,
          },
          textStyle: {
            color: "#666",
          },
        },
        vAxis: {
          title: "Sales ($)",
          titleTextStyle: {
            color: "#333",
            fontSize: 14,
          },
          textStyle: {
            color: "#666",
          },
        },
        series: {
          0: { color: "#1f77b4" }, // Blue for Sales
        },
        tooltip: {
          isHtml: true, // Enable HTML tooltips
          trigger: "both", // Display tooltips on hover and click
        },
        chartArea: {
          width: "80%",
          height: "70%",
        },
        legend: { position: "top", alignment: "center" },
        backgroundColor: "#f4f4f9", // Light background
        animation: {
          startup: true,
          easing: "inAndOut",
          duration: 1500,
        },
      };

      var chart = new window.google.visualization.LineChart(
        document.getElementById("ecommerce_sales_chart")
      );
      chart.draw(data, options);
    };

    if (!window.google || !window.google.charts) {
      const script = document.createElement("script");
      script.src = "https://www.gstatic.com/charts/loader.js";
      script.onload = loadGoogleCharts;
      document.body.appendChild(script);
    } else {
      loadGoogleCharts();
    }
  }, [salesData]); // Re-render chart when salesData changes

  const data = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@gmail.com`,
    phone: `123-456-78${i}`,
    city: `City ${i % 10}`,
  }));

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const filteredData = data.filter(
    (row) =>
      row.name.toLowerCase().includes(search.toLowerCase()) ||
      row.email.toLowerCase().includes(search.toLowerCase()) ||
      row.phone.includes(search) ||
      row.city.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="overflow-auto h-[91vh] w-[83.8vw] bg-black">
      <div className="flex gap-2 m-2 p-2 bg-white rounded-md">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="w-96 h-44 font-semibold text-xl flex justify-center items-center bg-blue-100 rounded-lg shadow-2xl shadow-gray-500 text-center transition-transform hover:scale-105 duration-300 ease-in-out"
          >
            Card {index + 1}
          </div>
        ))}
      </div>

      <div className="h-[66vh] bg-white mx-2 rounded flex shadow-md shadow-neutral-500">
        {/* E-Commerce Sales Chart */}
        <div className="h-[64vh] w-[41vw] m-2 bg-white rounded shadow-md shadow-black p-4">
          <div id="ecommerce_sales_chart" className="w-full h-full"></div>
        </div>

        {/* Table Section */}
        <div className="h-[64vh] w-[41vw] my-2 me-2 bg-white rounded shadow-md shadow-black p-4">
          <div className="w-full">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-3 border rounded mb-4 text-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* Scrollable Table Container */}
            <div className="overflow-auto max-h-[445px] border rounded-lg shadow-md">
              <table className="w-full border-collapse min-w-[600px]">
                <thead className="bg-gray-500 text-white sticky top-0">
                  <tr>
                    <th className="p-3 border text-left">ID</th>
                    <th className="p-3 border text-left">Name</th>
                    <th className="p-3 border text-left">Email</th>
                    <th className="p-3 border text-left">Phone</th>
                    <th className="p-3 border text-left">City</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-200 transition duration-200">
                        <td className="p-3 border text-center">{row.id}</td>
                        <td className="p-3 border">{row.name}</td>
                        <td className="p-3 border">{row.email}</td>
                        <td className="p-3 border">{row.phone}</td>
                        <td className="p-3 border">{row.city}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-3 text-center">No data found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-4 gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 hover:bg-blue-500 bg-gray-600 font-semibold text-white rounded disabled:opacity-50 transition duration-200"
              >
                Prev
              </button>
              <span className="text-lg font-bold">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 hover:bg-blue-500 bg-gray-600 font-semibold text-white rounded disabled:opacity-50 transition duration-200"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
