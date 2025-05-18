import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import { FaTrash } from "react-icons/fa";
import DeleteCategoryModal from "./DeleteCategoryModal";

const API_URL = "https://ahadinash07-e-shop-backend2-for-admin-retailer.vercel.app";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories from the API
  const fetchCategories = () => {
    axios
      .get(`${API_URL}/api/getCategories`)
      .then((response) => setCategories(response.data[0]))
      .catch((error) => console.log("Error:", error));
  };

  // Handle category deletion
  const handleDeleteCategory = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  // Formik configuration for adding a category
  const formik = useFormik({
    initialValues: {
      catName: "",
    },
    validationSchema: Yup.object({
      catName: Yup.string().required("Category Name is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.post(`${API_URL}/api/addCategory`, {
          catName: values.catName,
        });

        if (!response.data.error) {
          resetForm();
          fetchCategories(); // Refresh the categories list
        }
      } catch (error) {
        console.error("Error adding Category:", error);
      }
    },
  });

  // Table columns configuration
  const columns = useMemo(
    () => [
      {
        Header: "Category ID",
        accessor: "catId",
      },
      {
        Header: "Category Name",
        accessor: "catName",
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleDeleteCategory(row.original)}
              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <FaTrash />
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
      data: categories,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    usePagination
  );

  return (
    <div className="h-[89vh] bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Category Management</h1>
      <div className="flex gap-6">
        {/* Form */}
        <div className="w-1/3 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Add Category</h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-600 mb-2">
                Category Name
              </label>
              <input
                type="text"
                id="catName"
                name="catName"
                value={formik.values.catName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-2 border ${
                  formik.touched.catName && formik.errors.catName
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter Category Name"
              />
              {formik.touched.catName && formik.errors.catName && (
                <div className="text-red-600 text-sm mt-1">{formik.errors.catName}</div>
              )}
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add Category
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="w-2/3 bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6 flex justify-between items-center">
            <input
              type="text"
              placeholder="Search categories..."
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
      </div>

      {/* Delete Category Modal */}
      <DeleteCategoryModal
        showModal={showModal}
        setShowModal={setShowModal}
        category={selectedCategory}
        setCategories={setCategories}
      />
    </div>
  );
};

export default Category;















































































// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useFormik } from "formik";
// import * as Yup from "yup";

// const CategoryManager = () => {
//   const [categories, setCategories] = useState([]);
//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const categoriesPerPage = 5;

//   // Fetch categories from backend
//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get("http://localhost:5373/getCategories");
//       setCategories(response.data);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // Formik Form Validation
//   const formik = useFormik({
//     initialValues: { catName: "" },
//     validationSchema: Yup.object({
//       catName: Yup.string()
//         .min(2, "Category name is too short")
//         .max(50, "Category name is too long")
//         .required("Category name is required"),
//     }),
//     onSubmit: async (values, { resetForm }) => {
//       try {
//         await axios.post("http://localhost:5373/addCategory", values);
//         resetForm();
//         fetchCategories();
//       } catch (error) {
//         console.error("Error adding category:", error);
//       }
//     },
//   });

//   // Filtered categories based on search
//   const filteredCategories = categories.filter((cat) =>
//     cat.catName.toLowerCase().includes(search.toLowerCase())
//   );

//   // Pagination Logic
//   const indexOfLastCategory = currentPage * categoriesPerPage;
//   const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
//   const currentCategories = filteredCategories.slice(
//     indexOfFirstCategory,
//     indexOfLastCategory
//   );

//   const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);

//   return (
//     <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-6 text-center">Category Manager</h2>

//       {/* Side-by-Side Layout */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Category Form */}
//         <div className="p-4 border border-gray-300 rounded-md shadow-sm">
//           <h3 className="text-xl font-semibold mb-4">Add Category</h3>
//           <form onSubmit={formik.handleSubmit} className="space-y-4">
//             <div>
//               <input
//                 type="text"
//                 name="catName"
//                 value={formik.values.catName}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 placeholder="Enter category name"
//                 className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
//               />
//               {formik.touched.catName && formik.errors.catName ? (
//                 <p className="text-red-500">{formik.errors.catName}</p>
//               ) : null}
//             </div>
//             <button
//               type="submit"
//               className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//             >
//               Add Category
//             </button>
//           </form>
//         </div>

//         {/* Categories Table */}
//         <div className="p-4 border border-gray-300 rounded-md shadow-sm">
//           <h3 className="text-xl font-semibold mb-4">Categories</h3>
//           {/* Search Input */}
//           <input
//             type="text"
//             placeholder="Search categories..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full p-2 mb-4 border border-gray-300 rounded-md"
//           />

//           {/* Scrollable Table */}
//           <div className="overflow-auto border border-gray-300 rounded-md max-h-80">
//             <table className="w-full min-w-max border-collapse">
//               <thead className="sticky top-0 bg-gray-200">
//                 <tr>
//                   <th className="border border-gray-300 p-2">Category ID</th>
//                   <th className="border border-gray-300 p-2">Category Name</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentCategories.length > 0 ? (
//                   currentCategories.map((cat) => (
//                     <tr key={cat.catId} className="hover:bg-gray-100">
//                       <td className="border border-gray-300 p-2">
//                         {cat.catId}
//                       </td>
//                       <td className="border border-gray-300 p-2">
//                         {cat.catName}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan="2"
//                       className="border border-gray-300 p-2 text-center"
//                     >
//                       No categories found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex justify-center items-center space-x-2 mt-4">
//               <button
//                 onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1}
//                 className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
//               >
//                 Prev
//               </button>
//               {Array.from({ length: totalPages }, (_, i) => (
//                 <button
//                   key={i + 1}
//                   onClick={() => setCurrentPage(i + 1)}
//                   className={`px-3 py-1 rounded ${
//                     currentPage === i + 1
//                       ? "bg-blue-500 text-white"
//                       : "bg-gray-300"
//                   }`}
//                 >
//                   {i + 1}
//                 </button>
//               ))}
//               <button
//                 onClick={() =>
//                   setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//                 }
//                 disabled={currentPage === totalPages}
//                 className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CategoryManager;






























// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useFormik } from "formik";
// import * as Yup from "yup";

// const Category = () => {
//   const [categories, setCategories] = useState([]);
//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const categoriesPerPage = 5;

//   // Fetch categories from backend
//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get("http://localhost:5373/getCategories");
//       setCategories(response.data);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // Formik Form Validation
//   const formik = useFormik({
//     initialValues: { catName: "" },
//     validationSchema: Yup.object({
//       catName: Yup.string()
//         .min(2, "Category name is too short")
//         .max(50, "Category name is too long")
//         .required("Category name is required"),
//     }),
//     onSubmit: async (values, { resetForm }) => {
//       try {
//         await axios.post("http://localhost:5373/addCategory", values);
//         resetForm();
//         fetchCategories();
//       } catch (error) {
//         console.error("Error adding category:", error);
//       }
//     },
//   });

//   // Filtered categories based on search
//   const filteredCategories = categories.filter((cat) =>
//     cat.catName.toLowerCase().includes(search.toLowerCase())
//   );

//   // Pagination Logic
//   const indexOfLastCategory = currentPage * categoriesPerPage;
//   const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
//   const currentCategories = filteredCategories.slice(
//     indexOfFirstCategory,
//     indexOfLastCategory
//   );

//   const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);

//   return (
//     <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-4 text-center">Category</h2>

//       {/* Category Form */}
//       <form onSubmit={formik.handleSubmit} className="mb-6 space-y-4">
//         <div className="flex">
//           <input
//             type="text"
//             name="catName"
//             value={formik.values.catName}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             placeholder="Enter category name"
//             className="flex-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
//           />
//           <button
//             type="submit"
//             className="ml-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//           >
//             Add
//           </button>
//         </div>
//         {formik.touched.catName && formik.errors.catName ? (
//           <p className="text-red-500">{formik.errors.catName}</p>
//         ) : null}
//       </form>

//       {/* Search Input */}
//       <input
//         type="text"
//         placeholder="Search categories..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="w-full p-2 mb-4 border border-gray-300 rounded-md"
//       />

//       {/* Categories Table */}
//       <div className="overflow-auto border border-gray-300 rounded-md max-h-80">
//         <table className="w-full min-w-max border-collapse">
//           <thead className="sticky top-0 bg-gray-200">
//             <tr>
//               <th className="border border-gray-300 p-2">Category ID</th>
//               <th className="border border-gray-300 p-2">Category Name</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentCategories.length > 0 ? (
//               currentCategories.map((cat) => (
//                 <tr key={cat.catId} className="hover:bg-gray-100">
//                   <td className="border border-gray-300 p-2">{cat.catId}</td>
//                   <td className="border border-gray-300 p-2">{cat.catName}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="2" className="border border-gray-300 p-2 text-center">
//                   No categories found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-center items-center space-x-2 mt-4">
//           <button
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//             className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
//           >
//             Prev
//           </button>
//           {Array.from({ length: totalPages }, (_, i) => (
//             <button
//               key={i + 1}
//               onClick={() => setCurrentPage(i + 1)}
//               className={`px-3 py-1 rounded ${
//                 currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-300"
//               }`}
//             >
//               {i + 1}
//             </button>
//           ))}
//           <button
//             onClick={() =>
//               setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//             }
//             disabled={currentPage === totalPages}
//             className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Category;
