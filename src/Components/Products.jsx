import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import debounce from "lodash/debounce";
import ProductDetailsModal from "./ProductDetailsModal";

const API_URL = "https://e-shop-backend-sage.vercel.app";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/products`);
        if (isMounted) {
          // Log the response to inspect price values
          console.log("Products response:", response.data.data);
          setProducts(response.data.data || []);
        }
      } catch (error) {
        if (isMounted) {
          setError("Failed to fetch products. Please try again.");
          console.error("Error fetching products:", error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const columns = useMemo(
    () => [
      { Header: "Product ID", accessor: "productId" },
      { Header: "Product Name", accessor: "productName" },
      { Header: "Category", accessor: "category" },
      { Header: "Subcategory", accessor: "subcategory" },
      { Header: "Brand", accessor: "brand" },
      {
        Header: "Price",
        accessor: "price",
        Cell: ({ value }) => {
          // Ensure value is a number; handle string, null, or undefined
          const price = parseFloat(value);
          return isNaN(price) ? "N/A" : `₹${price.toFixed(2)}`;
        },
      },
      { Header: "Quantity", accessor: "quantity" },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <button
            onClick={() => {
              setSelectedProduct(row.original);
              setShowDetailsModal(true);
            }}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            View Details
          </button>
        ),
      },
    ],
    []
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
      data: products,
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">All Products</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="px-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : products.length === 0 ? (
          <p>No products found.</p>
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
        )}
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

      {selectedProduct && (
        <ProductDetailsModal
          showModal={showDetailsModal}
          setShowModal={setShowDetailsModal}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default Products;