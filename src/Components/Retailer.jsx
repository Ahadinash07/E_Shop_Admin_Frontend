import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // Add useNavigate
import axios from "axios";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import { FaEye, FaToggleOn, FaToggleOff } from "react-icons/fa";
import RetailerDetailsModal from "./RetailerDetailsModal";
import debounce from "lodash/debounce";

const API_URL = "https://ahadinash07-e-shop-backend2-for-admin-retailer.vercel.app";

const Retailer = () => {
  const [retailers, setRetailers] = useState([]);
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  // Memoize selectedRetailer to prevent new references
  const memoizedRetailer = useMemo(() => selectedRetailer, [selectedRetailer]);

  useEffect(() => {
    let isMounted = true;

    const fetchRetailers = async () => {
      try {
        const response = await axios.get(`${API_URL}/retailers`);
        if (isMounted) {
          setRetailers(response.data.data || []);
        }
      } catch (error) {
        console.log("Error fetching retailers:", error);
      }
    };

    fetchRetailers();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleStatus = useCallback(async (retailerId, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    try {
      await axios.put(`${API_URL}/retailers/${retailerId}/status`, { status: newStatus });
      setRetailers((prevRetailers) =>
        prevRetailers.map((retailer) =>
          retailer.retailerId === retailerId
            ? { ...retailer, status: newStatus }
            : retailer
        )
      );
    } catch (error) {
      console.log("Error toggling status:", error);
    }
  }, []);

  const columns = useMemo(
    () => [
      { Header: "Retailer ID", accessor: "retailerId" },
      { Header: "Retailer Name", accessor: "Retailer_Name" },
      { Header: "Email", accessor: "email" },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) => (
          <div className="flex items-center">
            <button
              onClick={() =>
                handleToggleStatus(row.original.retailerId, row.original.status)
              }
              className="ml-2 text-3xl"
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
        Header: "Registered At",
        accessor: "Registered_at",
        Cell: ({ value }) => new Date(value).toLocaleString(),
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedRetailer(row.original);
                setShowDetailsModal(true);
              }}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <FaEye />
            </button>
            <button
              onClick={() => {
                navigate(`/retailer/${row.original.retailerId}/orders`);
              }}
              className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Orders
            </button>
            <button
              onClick={() => {
                navigate(`/retailer/${row.original.retailerId}/products`);
              }}
              className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              Products
            </button>
          </div>
        ),
      },
    ],
    [handleToggleStatus, navigate] // Add navigate to dependencies
  );

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
      data: retailers,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    usePagination
  );

  const debouncedSetGlobalFilter = useMemo(
    () => debounce((value) => {
      setGlobalFilter(value || undefined);
    }, 300),
    [setGlobalFilter]
  );

  useEffect(() => {
    debouncedSetGlobalFilter(searchInput);
    return () => {
      debouncedSetGlobalFilter.cancel();
    };
  }, [searchInput, debouncedSetGlobalFilter]);

  return (
    <div className="h-[89vh] bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Retailer Management</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search retailers..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="px-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
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
              {page.map((row) => {
                prepareRow(row);
                const { key, ...rowProps } = row.getRowProps();
                return (
                  <tr key={key} {...rowProps} className="hover:bg-gray-50 transition-colors">
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

      <RetailerDetailsModal
        showModal={showDetailsModal}
        setShowModal={setShowDetailsModal}
        retailer={memoizedRetailer}
      />
    </div>
  );
};

export default Retailer;
