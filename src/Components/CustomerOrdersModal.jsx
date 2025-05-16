import { useState, useEffect } from "react";
import axios from "axios";
import { useTable } from "react-table";
import OrderTrackingModal from "./OrderTrackingModal";

const CustomerOrdersModal = ({ showModal, setShowModal, user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);

  useEffect(() => {
    if (user && showModal) {
      setLoading(true);
      axios
        .get(`https://e-shop-backend-sage.vercel.app/users/${user.user_id}/orders`)
        .then((response) => {
          setOrders(response.data.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user orders:", error);
          setLoading(false);
        });
    }
  }, [user, showModal]);

  const columns = [
    {
      Header: "Order ID",
      accessor: "order_id",
    },
    {
      Header: "Total Amount",
      accessor: "total_amount",
      Cell: ({ value }) => `$${value}`,
    },
    {
      Header: "Payment Method",
      accessor: "payment_method",
    },
    {
      Header: "Payment Status",
      accessor: "payment_status",
      Cell: ({ value }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            value === "Completed"
              ? "bg-green-100 text-green-800"
              : value === "Failed"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      Header: "Order Status",
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
  ];

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data: orders,
  });

  if (!showModal) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              Orders for {user?.first_name} {user?.last_name}
            </h2>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No orders found for this user.</p>
          ) : (
            <div className="overflow-auto">
              <table {...getTableProps()} className="w-full">
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps()}
                          className="px-4 py-2 bg-gray-100 text-left"
                        >
                          {column.render("Header")}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {rows.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()} className="hover:bg-gray-50">
                        {row.cells.map((cell) => (
                          <td {...cell.getCellProps()} className="px-4 py-2 border">
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Order Tracking Modal */}
      {selectedOrder && (
        <OrderTrackingModal
          showModal={showTrackingModal}
          setShowModal={setShowTrackingModal}
          order={selectedOrder}
        />
      )}
    </>
  );
};

export default CustomerOrdersModal;