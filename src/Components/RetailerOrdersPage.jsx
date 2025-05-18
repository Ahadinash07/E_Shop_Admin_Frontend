import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTable } from "react-table";
import OrderTrackingModal from "./OrderTrackingModal";

const API_URL = "https://ahadinash07-e-shop-backend2-for-admin-retailer.vercel.app";

const RetailerOrdersPage = () => {
  const { retailerId } = useParams(); // Get retailerId from URL
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [retailerName, setRetailerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);

  const columns = useMemo(
    () => [
      { Header: "Order ID", accessor: "order_id" },
      {
        Header: "Customer",
        accessor: "first_name",
        Cell: ({ row }) => `${row.original.first_name} ${row.original.last_name}`,
      },
      {
        Header: "Total Amount",
        accessor: "total_amount",
        Cell: ({ value }) => `₹${value}`,
      },
      {
        Header: "Status",
        accessor: "order_status",
        Cell: ({ value }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              value === "Delivered"
                ? "bg-green-100 text-green-800"
                : value === "Cancelled"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {value}
          </span>
        ),
      },
      {
        Header: "Date",
        accessor: "created_at",
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <button
            onClick={() => {
              setSelectedOrder(row.original);
              setShowTrackingModal(true);
            }}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Track
          </button>
        ),
      },
    ],
    []
  );

  const data = useMemo(() => orders, [orders]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch orders
        const ordersResponse = await axios.get(
          `${API_URL}/retailers/${retailerId}/orders`
        );
        // Fetch retailer details to get the name
        const retailerResponse = await axios.get(
          `${API_URL}/retailers/${retailerId}`
        );

        if (isMounted) {
          setOrders(ordersResponse.data.data || []);
          setRetailerName(
            retailerResponse.data.data?.Retailer_Name || "Unknown Retailer"
          );
        }
      } catch (error) {
        if (isMounted) {
          setError("Failed to fetch orders. Please try again.");
          console.error("Error fetching retailer orders:", error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, [retailerId]);

  return (
    <div className="h-[89vh] bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Orders for {retailerName}
        </h1>
        <button
          onClick={() => navigate("/retailer")}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Back to Retailers
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        {loading ? (
          <p>Loading orders...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : orders.length === 0 ? (
          <p>No orders found for this retailer.</p>
        ) : (
          <div className="overflow-auto max-h-[60vh]">
            <table {...getTableProps()} className="w-full">
              <thead className="bg-gray-100 sticky top-0 z-10">
                {headerGroups.map((headerGroup) => {
                  const { key, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
                  return (
                    <tr key={key} {...headerGroupProps}>
                      {headerGroup.headers.map((column) => {
                        const { key: columnKey, ...columnProps } = column.getHeaderProps();
                        return (
                          <th
                            key={columnKey}
                            {...columnProps}
                            className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
                          >
                            {column.render("Header")}
                          </th>
                        );
                      })}
                    </tr>
                  );
                })}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  const { key, ...rowProps } = row.getRowProps();
                  return (
                    <tr key={key} {...rowProps} className="hover:bg-gray-50">
                      {row.cells.map((cell) => {
                        const { key: cellKey, ...cellProps } = cell.getCellProps();
                        return (
                          <td
                            key={cellKey}
                            {...cellProps}
                            className="px-4 py-3 text-base text-gray-700"
                          >
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderTrackingModal
          showModal={showTrackingModal}
          setShowModal={setShowTrackingModal}
          order={selectedOrder}
        />
      )}
    </div>
  );
};

export default RetailerOrdersPage;