import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { usePagination, useGlobalFilter, useTable } from "react-table";
import debounce from "lodash/debounce";
import ProductDetailsModal from "./ProductDetailsModal";

const API_URL = "https://e-shop-backend-sage.vercel.app";

const RetailerProductsPage = () => {
  const { retailerId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [retailerName, setRetailerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [productsResponse, retailerResponse] = await Promise.all([
          axios.get(`${API_URL}/retailers/${retailerId}/products`),
          axios.get(`${API_URL}/retailers/${retailerId}`),
        ]);

        if (isMounted) {
          console.log("Products response:", productsResponse.data.data);
          setProducts(productsResponse.data.data || []);
          setRetailerName(
            retailerResponse.data.data?.Retailer_Name || "Unknown Retailer"
          );
        }
      } catch (error) {
        if (isMounted) {
          setError("Failed to fetch data. Please try again.");
          console.error("Error fetching retailer products:", error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [retailerId]);

  // Safe JSON parsing
  const safeParseJSON = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      try {
        return JSON.parse(value) || [];
      } catch (e) {
        console.error("Failed to parse JSON:", value, e);
        return [];
      }
    }
    return [];
  };

  // Dummy columns for react-table (needed for pagination and filtering)
  const columns = useMemo(
    () => [
      { Header: "Product Name", accessor: "productName" },
      { Header: "Category", accessor: "category" },
      { Header: "Subcategory", accessor: "subcategory" },
      { Header: "Brand", accessor: "brand" },
    ],
    []
  );

  const {
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  } = useTable(
    {
      columns,
      data: products,
      initialState: { pageIndex: 0, pageSize: 9 }, // 9 cards (3x3 grid)
    },
    useGlobalFilter,
    usePagination
  );

  const debouncedSetGlobalFilter = useMemo(
    () => debounce((value) => setGlobalFilter(value || undefined), 300),
    [setGlobalFilter]
  );

  useEffect(() => {
    debouncedSetGlobalFilter(searchInput);
    return () => debouncedSetGlobalFilter.cancel();
  }, [searchInput, debouncedSetGlobalFilter]);

  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
  };

  return (
    <div className="h-[89vh] bg-gray-100 p-6 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Inventory for {retailerName}
        </h1>
        <button
          onClick={() => navigate("/retailer")}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
        >
          Back to Retailers
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6 flex-1 flex flex-col">
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
          <p className="text-gray-600 text-lg">Loading products...</p>
        ) : error ? (
          <p className="text-red-500 text-lg font-medium">{error}</p>
        ) : products.length === 0 ? (
          <p className="text-gray-600 text-lg italic">No products found for this retailer.</p>
        ) : (
          <div className="flex-1 overflow-y-auto max-h-[60vh]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {page.map((row) => {
                const product = row.original;
                const imageUrl = safeParseJSON(product.images)[0] || "https://via.placeholder.com/150";
                return (
                  <div
                    key={row.id}
                    onClick={() => handleCardClick(product)}
                    className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
                  >
                    <img
                      src={imageUrl}
                      alt={product.productName}
                      className="w-full h-40 object-contain rounded-lg mb-4"
                      onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                    />
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {product.productName}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {product.brand || "N/A"} | {product.category || "N/A"}
                    </p>
                    <p className="text-blue-600 font-bold mt-2">
                      {isNaN(parseFloat(product.price))
                        ? "N/A"
                        : `₹${parseFloat(product.price).toFixed(2)}`}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      Quantity: {product.quantity || "0"}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        handleCardClick(product);
                      }}
                      className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                    >
                      View Details
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {/* Pagination */}
        {products.length > 0 && (
          <div className="mt-6 flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors duration-200"
              >
                Previous
              </button>
              <button
                onClick={() => nextPage()}
                disabled={!canNextPage}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors duration-200"
              >
                Next
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-700">
                Page <strong>{pageIndex + 1}</strong> of{" "}
                <strong>{pageOptions.length}</strong>
              </span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[9, 18, 27, 36, 45].map((size) => (
                  <option key={size} value={size}>
                    Show {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
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

export default RetailerProductsPage;

































// import { useState, useEffect, useMemo } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useTable } from "react-table";

// const API_URL = "http://localhost:5373";

// const RetailerProductsPage = () => {
//   const { retailerId } = useParams(); // Get retailerId from URL
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [retailerName, setRetailerName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const columns = useMemo(
//     () => [
//       { Header: "Product ID", accessor: "productId" },
//       { Header: "Product Name", accessor: "productName" },
//       { Header: "Category", accessor: "category" },
//       { Header: "Subcategory", accessor: "subcategory" },
//       { Header: "Brand", accessor: "brand" },
//       {
//         Header: "Price",
//         accessor: "price",
//         Cell: ({ value }) => `$${value}`,
//       },
//       {
//         Header: "Quantity",
//         accessor: "quantity",
//       },
//       {
//         Header: "Added At",
//         accessor: "addedAt",
//         Cell: ({ value }) => new Date(value).toLocaleString(),
//       },
//     ],
//     []
//   );

//   const data = useMemo(() => products, [products]);

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     rows,
//     prepareRow,
//   } = useTable({
//     columns,
//     data,
//   });

//   useEffect(() => {
//     let isMounted = true;

//     const fetchProducts = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         // Fetch products
//         const productsResponse = await axios.get(
//           `${API_URL}/retailers/${retailerId}/products`
//         );
//         // Fetch retailer details to get the name
//         const retailerResponse = await axios.get(
//           `${API_URL}/retailers/${retailerId}`
//         );

//         if (isMounted) {
//           setProducts(productsResponse.data.data || []);
//           setRetailerName(
//             retailerResponse.data.data?.Retailer_Name || "Unknown Retailer"
//           );
//         }
//       } catch (error) {
//         if (isMounted) {
//           setError("Failed to fetch products. Please try again.");
//           console.error("Error fetching retailer products:", error);
//         }
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     };

//     fetchProducts();

//     return () => {
//       isMounted = false;
//     };
//   }, [retailerId]);

//   return (
//     <div className="h-[89vh] bg-gray-100 p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">
//           Products for {retailerName}
//         </h1>
//         <button
//           onClick={() => navigate("/retailer")}
//           className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
//         >
//           Back to Retailers
//         </button>
//       </div>
//       <div className="bg-white rounded-lg shadow-lg p-6">
//         {loading ? (
//           <p>Loading products...</p>
//         ) : error ? (
//           <p className="text-red-500">{error}</p>
//         ) : products.length === 0 ? (
//           <p>No products found for this retailer.</p>
//         ) : (
//           <div className="overflow-auto max-h-[60vh]">
//             <table {...getTableProps()} className="w-full">
//               <thead className="bg-gray-100 sticky top-0 z-10">
//                 {headerGroups.map((headerGroup) => {
//                   const { key, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
//                   return (
//                     <tr key={key} {...headerGroupProps}>
//                       {headerGroup.headers.map((column) => {
//                         const { key: columnKey, ...columnProps } = column.getHeaderProps();
//                         return (
//                           <th
//                             key={columnKey}
//                             {...columnProps}
//                             className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
//                           >
//                             {column.render("Header")}
//                           </th>
//                         );
//                       })}
//                     </tr>
//                   );
//                 })}
//               </thead>
//               <tbody {...getTableBodyProps()}>
//                 {rows.map((row) => {
//                   prepareRow(row);
//                   const { key, ...rowProps } = row.getRowProps();
//                   return (
//                     <tr key={key} {...rowProps} className="hover:bg-gray-50">
//                       {row.cells.map((cell) => {
//                         const { key: cellKey, ...cellProps } = cell.getCellProps();
//                         return (
//                           <td
//                             key={cellKey}
//                             {...cellProps}
//                             className="px-4 py-3 text-base text-gray-700"
//                           >
//                             {cell.render("Cell")}
//                           </td>
//                         );
//                       })}
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RetailerProductsPage;