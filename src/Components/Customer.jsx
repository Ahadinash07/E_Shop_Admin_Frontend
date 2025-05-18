import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import { FaTrash, FaEye, FaToggleOn, FaToggleOff } from "react-icons/fa";
import CustomerDetailsModal from "./CustomerDetailsModal";
import CustomerOrdersModal from "./CustomerOrdersModal";

const API_URL = "https://ahadinash07-e-shop-backend2-for-admin-retailer.vercel.app";

const Customer = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from the API
  const fetchUsers = () => {
    axios
      .get(`${API_URL}/users`)
      .then((response) => setUsers(response.data.data))
      .catch((error) => console.log("Error:", error));
  };

  // Handle user status toggle
  const handleToggleStatus = (userId, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    axios
      .put(`${API_URL}/users/${userId}/status`, { status: newStatus })
      .then(() => {
        fetchUsers(); // Refresh the users list
      })
      .catch((error) => console.log("Error:", error));
  };

  // Table columns configuration
  const columns = useMemo(
    () => [
      {
        Header: "User ID",
        accessor: "user_id",
      },
      {
        Header: "Username",
        accessor: "username",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Phone",
        accessor: "phone",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) => (
          <div className="flex items-center">
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                row.original.status === "Active"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {row.original.status}
            </span>
            <button
              onClick={() =>
                handleToggleStatus(row.original.user_id, row.original.status)
              }
              className="ml-2 text-xl"
            >
              {row.original.status === "Active" ? (
                <FaToggleOn className="text-green-500" />
              ) : (
                <FaToggleOff className="text-red-500" />
              )}
            </button>
          </div>
        ),
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedUser(row.original);
                setShowDetailsModal(true);
              }}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <FaEye />
            </button>
            <button
              onClick={() => {
                setSelectedUser(row.original);
                setShowOrdersModal(true);
              }}
              className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              Orders
            </button>
          </div>
        ),
      },
    ],
    []
  );

  // React Table configuration
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  } = useTable(
    {
      columns,
      data: users,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    usePagination
  );

  return (
    <div className="h-[89vh] bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">User Management</h1>
      
      {/* Table */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search users..."
            value={globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="overflow-auto max-h-[60vh]">
          <table {...getTableProps()} className="w-full">
            <thead className="bg-gray-100 sticky top-0 z-10">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                      className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
                    >
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        className="px-4 py-3 text-base text-gray-700"
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
            >
              Previous
            </button>
            <button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span>
              Page <strong>{pageIndex + 1}</strong> of{" "}
              <strong>{pageOptions.length}</strong>
            </span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-4 py-2 border rounded-lg"
            >
              {[10, 20, 30, 40, 50].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      <CustomerDetailsModal
        showModal={showDetailsModal}
        setShowModal={setShowDetailsModal}
        user={selectedUser}
      />

      {/* User Orders Modal */}
      <CustomerOrdersModal
        showModal={showOrdersModal}
        setShowModal={setShowOrdersModal}
        user={selectedUser}
      />
    </div>
  );
};

export default Customer;