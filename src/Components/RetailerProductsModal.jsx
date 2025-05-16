import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useTable } from "react-table";

const RetailerProductsModal = ({ showModal, setShowModal, retailer }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

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
        Cell: ({ value }) => `₹${value}`,
      },
      {
        Header: "Quantity",
        accessor: "quantity",
      },
      {
        Header: "Added At",
        accessor: "addedAt",
        Cell: ({ value }) => new Date(value).toLocaleString(),
      },
    ],
    []
  );

  const data = useMemo(() => products, [products]);

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

    const fetchProducts = async () => {
      if (showModal && retailer?.retailerId) {
        setLoading(true);
        try {
          const response = await axios.get(
            `https://e-shop-backend-sage.vercel.app/retailers/${retailer.retailerId}/products`
          );
          if (isMounted) {
            setProducts(response.data.data || []);
          }
        } catch (error) {
          console.error("Error fetching retailer products:", error);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }
    };

    if (showModal) {
      fetchProducts();
    }

    return () => {
      isMounted = false;
    };
  }, [showModal, retailer?.retailerId]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            Products for {retailer?.Retailer_Name}
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products found for this retailer.</p>
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
  );
};

export default RetailerProductsModal;