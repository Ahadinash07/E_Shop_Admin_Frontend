import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useTable } from "react-table";
import OrderTrackingModal from "./OrderTrackingModal";

const RetailerOrdersModal = ({ showModal, setShowModal, retailer }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
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
      if (showModal && retailer?.retailerId) {
        setLoading(true);
        try {
          const response = await axios.get(
            `https://e-shop-backend-sage.vercel.app/retailers/${retailer.retailerId}/orders`
          );
          if (isMounted) {
            setOrders(response.data.data || []);
          }
        } catch (error) {
          console.error("Error fetching retailer orders:", error);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }
    };

    if (showModal) {
      fetchOrders();
    }

    return () => {
      isMounted = false;
    };
  }, [showModal, retailer?.retailerId]);

  if (!showModal) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              Orders for {retailer?.Retailer_Name}
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
            <p>No orders found for this retailer.</p>
          ) : (
            <div className="overflow-auto">
              <table {...getTableProps()} className="w-full">
                <thead>
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
                              className="px-4 py-2 bg-gray-100 text-left"
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
                              className="px-4 py-2 border"
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
      </div>

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

export default RetailerOrdersModal;