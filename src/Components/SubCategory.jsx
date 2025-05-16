import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import { FaTrash } from "react-icons/fa";
import DeleteSubCategoryModal from "./DeleteSubCategoryModal";

const API_URL = "https://e-shop-backend-sage.vercel.app";

const SubCategory = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowDeleteModal] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  // Fetch subcategories and categories on component mount
  useEffect(() => {
    fetchSubCategories();
    fetchCategories();
  }, []);

  // Fetch subcategories from the API
  const fetchSubCategories = () => {
    axios
      .get(`${API_URL}/api/subCategory`)
      .then((response) => setSubCategories(response.data.data))
      .catch((error) => console.log("Error:", error));
  };

  // Fetch categories from the API
  const fetchCategories = () => {
    axios
      .get(`${API_URL}/api/getCategories`)
      .then((response) => setCategories(response.data[0]))
      .catch((error) => console.log("Error:", error));
  };

  // Handle subcategory deletion
  const handleDeleteSubCategory = (subcategory) => {
    setSelectedSubCategory(subcategory);
    setShowDeleteModal(true);
  };

  // Formik configuration for adding a subcategory
  const formik = useFormik({
    initialValues: {
      subCatName: "",
      catId: "",
    },
    validationSchema: Yup.object({
      subCatName: Yup.string().required("Subcategory Name is required"),
      catId: Yup.string().required("Category is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.post(`${API_URL}/subCategory`, {
          subCatName: values.subCatName,
          catId: values.catId,
        });

        if (response.data.message === "Sub Category Created Successfully") {
          resetForm();
          fetchSubCategories(); // Refresh the subcategories list
        }
      } catch (error) {
        console.error("Error adding Subcategory:", error);
      }
    },
  });

  // Table columns configuration
  const columns = useMemo(
    () => [
      {
        Header: "Subcategory ID",
        accessor: "subCatId",
      },
      {
        Header: "Subcategory Name",
        accessor: "subCatName",
      },
      {
        Header: "Category ID",
        accessor: "catId",
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleDeleteSubCategory(row.original)}
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
      data: subCategories,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    usePagination
  );

  return (
    <div className="h-[89vh] bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Subcategory Management</h1>
      <div className="flex gap-6">
        {/* Form */}
        <div className="w-1/3 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Add Subcategory</h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-600 mb-2">
                Subcategory Name
              </label>
              <input
                type="text"
                id="subCatName"
                name="subCatName"
                value={formik.values.subCatName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-2 border ${
                  formik.touched.subCatName && formik.errors.subCatName
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter Subcategory Name"
              />
              {formik.touched.subCatName && formik.errors.subCatName && (
                <div className="text-red-600 text-sm mt-1">{formik.errors.subCatName}</div>
              )}
            </div>
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-600 mb-2">
                Category
              </label>
              <select
                id="catId"
                name="catId"
                value={formik.values.catId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-2 border ${
                  formik.touched.catId && formik.errors.catId
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="" disabled selected>
                  Select a category
                </option>
                {categories.map((category) => (
                  <option key={category.catId} value={category.catId}>
                    {category.catName}
                  </option>
                ))}
              </select>
              {formik.touched.catId && formik.errors.catId && (
                <div className="text-red-600 text-sm mt-1">{formik.errors.catId}</div>
              )}
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add Subcategory
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="w-2/3 bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6 flex justify-between items-center">
            <input
              type="text"
              placeholder="Search subcategories..."
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

      {/* Delete Subcategory Modal */}
      <DeleteSubCategoryModal
        showModal={showModal}
        setShowModal={setShowDeleteModal}
        subcategory={selectedSubCategory}
        setSubCategories={setSubCategories}
      />
    </div>
  );
};

export default SubCategory;









































































// import { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { useTable, usePagination, useGlobalFilter } from "react-table";

// const API_URL = "http://localhost:5373";

// const SubCategory = () => {
//   const [subCategories, setSubCategories] = useState([]);
//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     fetchSubCategories();
//     fetchCategories();
//   }, []);

//   const fetchSubCategories = () => {
//     axios
//       .get(`${API_URL}/subCategory`)
//       .then((response) => setSubCategories(response.data.data))
//       .catch((error) => console.log("Error:", error));
//   };

//   const fetchCategories = () => {
//     axios
//       .get(`${API_URL}/getCategories`)
//       .then((response) => setCategories(response.data))
//       .catch((error) => console.log("Error:", error));
//   };

//   const formik = useFormik({
//     initialValues: {
//       subCatName: "",
//       catId: "",
//     },
//     validationSchema: Yup.object({
//       subCatName: Yup.string().required("Subcategory Name is required"),
//       catId: Yup.string().required("Category is required"),
//     }),
//     onSubmit: async (values, { resetForm }) => {
//       try {
//         const response = await axios.post(`${API_URL}/subCategory`, {
//           subCatName: values.subCatName,
//           catId: values.catId,
//         });

//         if (response.data.message === "Sub Category Created Successfully") {
//           resetForm();
//           fetchSubCategories();
//         }
//       } catch (error) {
//         console.error("Error adding Subcategory:", error);
//       }
//     },
//   });

//   const columns = useMemo(
//     () => [
//       {
//         Header: "Subcategory ID",
//         accessor: "subCatId",
//       },
//       {
//         Header: "Subcategory Name",
//         accessor: "subCatName",
//       },
//       {
//         Header: "Category ID",
//         accessor: "catId",
//       },
//     ],
//     []
//   );

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     prepareRow,
//     page,
//     canPreviousPage,
//     canNextPage,
//     pageOptions,
//     pageCount,
//     gotoPage,
//     nextPage,
//     previousPage,
//     setPageSize,
//     setGlobalFilter,
//     state: { pageIndex, pageSize, globalFilter },
//   } = useTable(
//     {
//       columns,
//       data: subCategories,
//       initialState: { pageIndex: 0, pageSize: 10 },
//     },
//     useGlobalFilter,
//     usePagination
//   );

//   return (
//     <div className="container mx-auto p-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Form */}
//         <div className="bg-white p-6 rounded-lg shadow-black shadow-2xl ">
//           <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
//             Add Subcategory
//           </h2>
//           <form onSubmit={formik.handleSubmit} className="space-y-6">
//             <div>
//               <label className="block text-lg font-medium text-gray-700">
//                 Subcategory Name
//               </label>
//               <input
//                 type="text"
//                 id="subCatName"
//                 name="subCatName"
//                 value={formik.values.subCatName}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               {formik.touched.subCatName && formik.errors.subCatName && (
//                 <div className="text-red-500 text-sm mt-1">
//                   {formik.errors.subCatName}
//                 </div>
//               )}
//             </div>

//             <div>
//               <label className="block text-lg font-medium text-gray-700">
//                 Category
//               </label>
//               <select
//                 id="catId"
//                 name="catId"
//                 value={formik.values.catId}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="" disabled>
//                   Select a category
//                 </option>
//                 {categories.map((category) => (
//                   <option key={category.catId} value={category.catId}>
//                     {category.catName}
//                   </option>
//                 ))}
//               </select>
//               {formik.touched.catId && formik.errors.catId && (
//                 <div className="text-red-500 text-sm mt-1">
//                   {formik.errors.catId}
//                 </div>
//               )}
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300"
//             >
//               Add Subcategory
//             </button>
//           </form>
//         </div>

//         {/* Table */}
//         <div className="bg-white p-6 rounded-lg shadow-black shadow-2xl">
//           <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
//             Subcategories
//           </h1>
//           <div className="flex flex-col space-y-4">
//             {/* Search Input */}
//             <div className="p-4 bg-gray-50 rounded-lg">
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 value={globalFilter || ""}
//                 onChange={(e) => setGlobalFilter(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             {/* Table Header (Fixed) */}
//             <div className="overflow-auto">
//               <table className="min-w-full">
//                 <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
//                   {headerGroups.map((headerGroup) => (
//                     <tr {...headerGroup.getHeaderGroupProps()}>
//                       {headerGroup.headers.map((column) => (
//                         <th
//                           {...column.getHeaderProps()}
//                           className="px-3 py-3 text-left text-sm font-semibold uppercase"
//                         >
//                           {column.render("Header")}
//                         </th>
//                       ))}
//                     </tr>
//                   ))}
//                 </thead>
//               </table>
//             </div>

//             {/* Scrollable Table Body */}
//             <div className="overflow-auto" style={{ maxHeight: "400px" }}>
//               <table {...getTableProps()} className="min-w-full">
//                 <tbody {...getTableBodyProps()}>
//                   {page.map((row) => {
//                     prepareRow(row);
//                     return (
//                       <tr
//                         {...row.getRowProps()}
//                         className="hover:bg-gray-50 transition duration-200"
//                       >
//                         {row.cells.map((cell) => (
//                           <td
//                             {...cell.getCellProps()}
//                             className="px-6 py-4 text-sm text-gray-700"
//                           >
//                             {cell.render("Cell")}
//                           </td>
//                         ))}
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => previousPage()}
//                   disabled={!canPreviousPage}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition duration-300"
//                 >
//                   Prev
//                 </button>
//                 <button
//                   onClick={() => nextPage()}
//                   disabled={!canNextPage}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition duration-300"
//                 >
//                   Next
//                 </button>
//               </div>
//               <span className="text-sm text-gray-700">
//                 Page{" "}
//                 <strong>
//                   {pageIndex + 1} of {pageOptions.length}
//                 </strong>
//               </span>
//               <span className="text-sm text-gray-700">
//                 | Go to page:{" "}
//                 <input
//                   type="number"
//                   defaultValue={pageIndex + 1}
//                   onChange={(e) => {
//                     const page = e.target.value ? Number(e.target.value) - 1 : 0;
//                     gotoPage(page);
//                   }}
//                   className="w-16 px-2 py-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </span>{" "}
//               <select
//                 value={pageSize}
//                 onChange={(e) => {
//                   setPageSize(Number(e.target.value));
//                 }}
//                 className="px-2 py-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 {[10, 20, 30, 40, 50].map((size) => (
//                   <option key={size} value={size}>
//                     Show {size}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubCategory;











































































































// import { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { useTable, usePagination, useGlobalFilter } from "react-table";

// const API_URL = "http://localhost:5373";

// const SubCategory = () => {
//   const [subCategories, setSubCategories] = useState([]);
//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     fetchSubCategories();
//     fetchCategories();
//   }, []);

//   const fetchSubCategories = () => {
//     axios
//       .get(`${API_URL}/subCategory`)
//       .then((response) => setSubCategories(response.data.data))
//       .catch((error) => console.log("Error:", error));
//   };

//   const fetchCategories = () => {
//     axios
//       .get(`${API_URL}/getCategories`)
//       .then((response) => setCategories(response.data))
//       .catch((error) => console.log("Error:", error));
//   };

//   const formik = useFormik({
//     initialValues: {
//       subCatName: "",
//       catId: "",
//     },
//     validationSchema: Yup.object({
//       subCatName: Yup.string().required("Subcategory Name is required"),
//       catId: Yup.string().required("Category is required"),
//     }),
//     onSubmit: async (values, { resetForm }) => {
//       try {
//         const response = await axios.post(`${API_URL}/subCategory`, {
//           subCatName: values.subCatName,
//           catId: values.catId,
//         });

//         if (response.data.message === "Sub Category Created Successfully") {
//           resetForm();
//           fetchSubCategories();
//         }
//       } catch (error) {
//         console.error("Error adding Subcategory:", error);
//       }
//     },
//   });

//   const columns = useMemo(
//     () => [
//       {
//         Header: "Subcategory ID",
//         accessor: "subCatId",
//       },
//       {
//         Header: "Subcategory Name",
//         accessor: "subCatName",
//       },
//       {
//         Header: "Category ID",
//         accessor: "catId",
//       },
//     ],
//     []
//   );

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     prepareRow,
//     page,
//     canPreviousPage,
//     canNextPage,
//     pageOptions,
//     pageCount,
//     gotoPage,
//     nextPage,
//     previousPage,
//     setPageSize,
//     setGlobalFilter,
//     state: { pageIndex, pageSize, globalFilter },
//   } = useTable(
//     {
//       columns,
//       data: subCategories,
//       initialState: { pageIndex: 0, pageSize: 10 },
//     },
//     useGlobalFilter,
//     usePagination
//   );

//   return (
//     <div className="container mx-auto p-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Form */}
//         <div className="bg-white p-6 rounded-lg shadow-black shadow-2xl ">
//           <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
//             Add Subcategory
//           </h2>
//           <form onSubmit={formik.handleSubmit} className="space-y-6">
//             <div>
//               <label className="block text-lg font-medium text-gray-700">
//                 Subcategory Name
//               </label>
//               <input
//                 type="text"
//                 id="subCatName"
//                 name="subCatName"
//                 value={formik.values.subCatName}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               {formik.touched.subCatName && formik.errors.subCatName && (
//                 <div className="text-red-500 text-sm mt-1">
//                   {formik.errors.subCatName}
//                 </div>
//               )}
//             </div>

//             <div>
//               <label className="block text-lg font-medium text-gray-700">
//                 Category
//               </label>
//               <select
//                 id="catId"
//                 name="catId"
//                 value={formik.values.catId}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="" disabled>
//                   Select a category
//                 </option>
//                 {categories.map((category) => (
//                   <option key={category.catId} value={category.catId}>
//                     {category.catName}
//                   </option>
//                 ))}
//               </select>
//               {formik.touched.catId && formik.errors.catId && (
//                 <div className="text-red-500 text-sm mt-1">
//                   {formik.errors.catId}
//                 </div>
//               )}
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300"
//             >
//               Add Subcategory
//             </button>
//           </form>
//         </div>

//         {/* Table */}
//         <div className="bg-white p-6 rounded-lg shadow-black shadow-2xl">
//           <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
//             Subcategories
//           </h1>
//           <div className="flex flex-col space-y-4">
//             {/* Search Input */}
//             <div className="p-4 bg-gray-50 rounded-lg">
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 value={globalFilter || ""}
//                 onChange={(e) => setGlobalFilter(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             {/* Scrollable Table Body */}
//             <div className="overflow-auto">
//               <table {...getTableProps()} className="min-w-full">
//                 <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
//                   {headerGroups.map((headerGroup) => (
//                     <tr {...headerGroup.getHeaderGroupProps()}>
//                       {headerGroup.headers.map((column) => (
//                         <th
//                           {...column.getHeaderProps()}
//                           className="px-6 py-3 text-left text-sm font-semibold uppercase"
//                         >
//                           {column.render("Header")}
//                         </th>
//                       ))}
//                     </tr>
//                   ))}
//                 </thead>
//                 <tbody {...getTableBodyProps()}>
//                   {page.map((row) => {
//                     prepareRow(row);
//                     return (
//                       <tr
//                         {...row.getRowProps()}
//                         className="hover:bg-gray-50 transition duration-200"
//                       >
//                         {row.cells.map((cell) => (
//                           <td
//                             {...cell.getCellProps()}
//                             className="px-6 py-4 text-sm text-gray-700"
//                           >
//                             {cell.render("Cell")}
//                           </td>
//                         ))}
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => previousPage()}
//                   disabled={!canPreviousPage}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition duration-300"
//                 >
//                   Prev
//                 </button>
//                 <button
//                   onClick={() => nextPage()}
//                   disabled={!canNextPage}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition duration-300"
//                 >
//                   Next
//                 </button>
//               </div>
//               <span className="text-sm text-gray-700">
//                 Page{" "}
//                 <strong>
//                   {pageIndex + 1} of {pageOptions.length}
//                 </strong>
//               </span>
//               <span className="text-sm text-gray-700">
//                 | Go to page:{" "}
//                 <input
//                   type="number"
//                   defaultValue={pageIndex + 1}
//                   onChange={(e) => {
//                     const page = e.target.value ? Number(e.target.value) - 1 : 0;
//                     gotoPage(page);
//                   }}
//                   className="w-16 px-2 py-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </span>{" "}
//               <select
//                 value={pageSize}
//                 onChange={(e) => {
//                   setPageSize(Number(e.target.value));
//                 }}
//                 className="px-2 py-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 {[10, 20, 30, 40, 50].map((size) => (
//                   <option key={size} value={size}>
//                     Show {size}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubCategory;