import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTable, usePagination, useSortBy } from "react-table";
import UpdateRoleModal from "./UpdateRoleModal";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import DeleteRoleModal from "./DeleteRoleModal";

const API_URL = "https://ahadinash07-e-shop-backend2-for-admin-retailer.vercel.app";

const Role = () => {
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [roleToUpdate, setRoleToUpdate] = useState(null);

  // Fetch roles on component mount
  useEffect(() => {
    fetchRoles();
  }, []);

  // Fetch roles from the API
  const fetchRoles = () => {
    axios
      .get(`${API_URL}/get_admin_role`)
      .then((response) => setRoles(response.data))
      .catch((error) => console.log("Error:", error));
  };

  const handleRoleDelete = (role) => {
    setSelectedRole(role);
    setShowModal(true);
  };

  const handleRoleUpdate = (role) => {
    setRoleToUpdate(role);
    setShowUpdateModal(true);
  };

  const onUpdateRole = (roleId, updatedData) => {
    setRoles((prevRoles) =>
      prevRoles.map((role) =>
        role.roleId === roleId ? { ...role, ...updatedData } : role
      )
    );
  };

  // Check if a role ID or name already exists
  const checkIfRoleExists = async (roleId, roleName) => {
    let errors = {};
    try {
      const responseRoleId = await axios.get(`${API_URL}/check_role_id_exists`, {
        params: { roleId },
      });
      if (responseRoleId.data.exists) {
        errors.roleId = "Role ID already exists";
      }

      const responseRoleName = await axios.get(`${API_URL}/check_role_name_exists`, {
        params: { roleName },
      });
      if (responseRoleName.data.exists) {
        errors.roleName = "Role Name already exists";
      }
    } catch (error) {
      console.log("Error checking role existence:", error);
    }
    return errors;
  };

  // Formik configuration for adding a role
  const formik = useFormik({
    initialValues: {
      roleId: "",
      roleName: "",
    },
    validationSchema: Yup.object({
      roleId: Yup.string().required("Role ID is required"),
      roleName: Yup.string().required("Role Name is required"),
    }),
    validate: async (values) => {
      const errors = await checkIfRoleExists(values.roleId, values.roleName);
      return errors;
    },
    onSubmit: async (values, { setTouched, setErrors }) => {
      setTouched({ roleId: true, roleName: true }, false);
      const existingErrors = await checkIfRoleExists(values.roleId, values.roleName);

      if (Object.keys(existingErrors).length > 0) {
        setErrors(existingErrors);
        return;
      }

      try {
        const response = await axios.post(`${API_URL}/add_admin_role`, {
          roleId: values.roleId,
          roleName: values.roleName,
        });

        if (!response.data.error) {
          formik.resetForm();
          fetchRoles(); // Refresh the roles list
        }
      } catch (error) {
        console.error("Error adding Roles:", error);
      }
    },
  });

  // Table columns configuration
  const columns = useMemo(
    () => [
      {
        Header: "Role ID",
        accessor: "roleId",
      },
      {
        Header: "Role Name",
        accessor: "roleName",
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleRoleUpdate(row.original)}
              className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleRoleDelete(row.original)}
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
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: roles,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  return (
    <div className="h-[89vh] bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Role Management</h1>
      <div className="flex gap-6">
        {/* Form */}
        <div className="w-1/3 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Add Role</h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-600 mb-2">Role ID</label>
              <input
                type="text"
                id="roleId"
                name="roleId"
                value={formik.values.roleId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.roleId && formik.errors.roleId && (
                <div className="text-red-600 text-sm mt-1">{formik.errors.roleId}</div>
              )}
            </div>
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-600 mb-2">Role Name</label>
              <input
                type="text"
                id="roleName"
                name="roleName"
                value={formik.values.roleName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.roleName && formik.errors.roleName && (
                <div className="text-red-600 text-sm mt-1">{formik.errors.roleName}</div>
              )}
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add Role
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="w-2/3 bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6 flex justify-between items-center">
            <input
              type="text"
              placeholder="Search roles..."
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
                        className="px-4 py-3 text-left text-lg font-semibold text-gray-700"
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

      {/* Modals */}
      <DeleteRoleModal
        showModal={showModal}
        setShowModal={setShowModal}
        role={selectedRole}
        setRoles={setRoles}
      />
      <UpdateRoleModal
        showModal={showUpdateModal}
        setShowModal={setShowUpdateModal}
        role={roleToUpdate}
        onUpdate={onUpdateRole}
      />
    </div>
  );
};

export default Role;




































































































// import { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { useTable, usePagination, useSortBy } from "react-table";

// const API_URL = "http://localhost:5373";

// const Role = () => {
//   const [roles, setRoles] = useState([]);

//   useEffect(() => {
//     fetchRoles();
//   }, []);

//   const fetchRoles = () => {
//     axios.get(`${API_URL}/get_admin_role`)
//       .then((response) => setRoles(response.data))
//       .catch((error) => console.log("Error:", error));
//   };

//   const checkIfRoleExists = async (roleId, roleName) => {
//     let errors = {};
//     try {
//       const responseRoleId = await axios.get(`${API_URL}/check_role_id_exists`, { params: { roleId } });
//       if (responseRoleId.data.exists) {
//         errors.roleId = "Role ID already exists";
//       }

//       const responseRoleName = await axios.get(`${API_URL}/check_role_name_exists`, { params: { roleName } });
//       if (responseRoleName.data.exists) {
//         errors.roleName = "Role Name already exists";
//       }
//     } catch (error) {
//       console.log("Error checking role existence:", error);
//     }
//     return errors;
//   };

//   const formik = useFormik({
//     initialValues: {
//       roleId: "",
//       roleName: "",
//     },
//     validationSchema: Yup.object({
//       roleId: Yup.string().required("Role ID is required"),
//       roleName: Yup.string().required("Role Name is required"),
//     }),
//     validate: async (values) => {
//       const errors = await checkIfRoleExists(values.roleId, values.roleName);
//       return errors;
//     },
//     onSubmit: async (values, { setTouched, setErrors }) => {
//       setTouched({ roleId: true, roleName: true }, false); // Trigger validation messages
//       const existingErrors = await checkIfRoleExists(values.roleId, values.roleName);

//       if (Object.keys(existingErrors).length > 0) {
//         setErrors(existingErrors);
//         return;
//       }

//       try {
//         const response = await axios.post(`${API_URL}/add_admin_role`, {
//           roleId: values.roleId,
//           roleName: values.roleName,
//         });

//         if (!response.data.error) {
//           formik.resetForm();
//           fetchRoles();
//         }
//       } catch (error) {
//         console.error("Error adding Roles:", error);
//       }
//     }
//   });

//   const columns = useMemo(
//     () => [
//       {
//         Header: "Role ID",
//         accessor: "roleId",
//       },
//       {
//         Header: "Role Name",
//         accessor: "roleName",
//       },
//     ],
//     []
//   );

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     prepareRow,
//     page, // This contains only the rows for the current page
//     canPreviousPage,
//     canNextPage,
//     pageOptions,
//     pageCount,
//     gotoPage,
//     nextPage,
//     previousPage,
//     setPageSize,
//     state: { pageIndex, pageSize },
//   } = useTable(
//     {
//       columns,
//       data: roles,
//       initialState: { pageIndex: 0, pageSize: 10 }, // Set initial page size to 10
//     },
//     useSortBy,
//     usePagination
//   );

//   return (
//     <>
//       <div className="container-fluid w-full h-[89.2vh] p-4 overflow-auto flex justify-around">
//         {/* Form */}
//         <div className="w-5/12 h-[60vh]">
//           <h2 className="text-4xl text-center py-2 text-gray-900 font-semibold">Add Role</h2>
//           <div className="p-8 bg-slate-200 rounded-lg shadow-black shadow-2xl h-[50vh]">
//             <form onSubmit={formik.handleSubmit}>
//               <div className="mb-8">
//                 <label className="block text-gray-700 text-2xl mb-2">Role ID</label>
//                 <input
//                   type="text"
//                   id="roleId"
//                   name="roleId"
//                   value={formik.values.roleId}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   className="w-full px-3 py-3 border rounded-lg"
//                 />
//                 {formik.touched.roleId && formik.errors.roleId && (
//                   <div className="text-red-600 text-sm">{formik.errors.roleId}</div>
//                 )}
//               </div>

//               <div className="mb-8">
//                 <label className="block text-gray-700 text-2xl mb-2">Role Name</label>
//                 <input
//                   id="roleName"
//                   name="roleName"
//                   value={formik.values.roleName}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   className="w-full px-3 py-3 border rounded-lg"
//                 />
//                 {formik.touched.roleName && formik.errors.roleName && (
//                   <div className="text-red-600 text-sm">{formik.errors.roleName}</div>
//                 )}
//               </div>

//               <button
//                 type="submit"
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg text-2xl" > Add Role </button>
//             </form>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="w-5/12 pl-6 h-[80vh]">
//           <h1 className="text-4xl text-center py-2 text-gray-900 font-semibold">Roles</h1>
//           <div className="min-w-full bg-slate-100 rounded-xl shadow-black shadow-2xl h-[75vh] flex flex-col overflow-hidden">
//             {/* Table Header */}
//             <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-xl">
//               <table {...getTableProps()} className="min-w-full">
//                 <thead>
//                   {headerGroups.map(headerGroup => (
//                     <tr {...headerGroup.getHeaderGroupProps()}>
//                       {headerGroup.headers.map(column => (
//                         <th
//                           {...column.getHeaderProps()}
//                           className="px-1 py-3 text-left"
//                         >
//                           {column.render('Header')}
//                         </th>
//                       ))}
//                     </tr>
//                   ))}
//                 </thead>
//               </table>
//             </div>

//             {/* Scrollable Table Body */}
//             <div className="overflow-auto flex-grow">
//               <table {...getTableProps()} className="min-w-full">
//                 <tbody {...getTableBodyProps()}>
//                   {page.map(row => {
//                     prepareRow(row);
//                     return (
//                       <tr {...row.getRowProps()} className="text-gray-800 even:bg-slate-100 odd:bg-slate-200">
//                         {row.cells.map(cell => (
//                           <td {...cell.getCellProps()} className="px-6 py-4">
//                             {cell.render('Cell')}
//                           </td>
//                         ))}
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination (Sticky at bottom) */}
//             <div className="p-4 flex justify-between items-center bg-white sticky bottom-0 border-t rounded-b-xl">
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => previousPage()}
//                   disabled={!canPreviousPage}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
//                 >
//                   Prev
//                 </button>
//                 <button
//                   onClick={() => nextPage()}
//                   disabled={!canNextPage}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
//                 >
//                   Next
//                 </button>
//               </div>
//               <span>
//                 Page{' '}
//                 <strong>
//                   {pageIndex + 1} of {pageOptions.length}
//                 </strong>
//               </span>
//               <span>
//                 | Go to page:{' '}
//                 <input
//                   type="number"
//                   defaultValue={pageIndex + 1}
//                   onChange={e => {
//                     const page = e.target.value ? Number(e.target.value) - 1 : 0;
//                     gotoPage(page);
//                   }}
//                   className="w-20 px-2 py-1 border rounded-lg"
//                 />
//               </span>{' '}
//               <select
//                 value={pageSize}
//                 onChange={e => {
//                   setPageSize(Number(e.target.value));
//                 }}
//                 className="px-2 py-1 border rounded-lg"
//               >
//                 {[10, 20, 30, 40, 50].map(pageSize => (
//                   <option key={pageSize} value={pageSize}>
//                     Show {pageSize}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Role;





















































































































































































































































































































































// import { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { useTable, usePagination, useSortBy } from "react-table";

// const API_URL = "http://localhost:5373";

// const Role = () => {
//   const [roles, setRoles] = useState([]);

//   useEffect(() => {
//     fetchRoles();
//   }, []);

//   const fetchRoles = () => {
//     axios.get(`${API_URL}/get_admin_role`)
//       .then((response) => setRoles(response.data))
//       .catch((error) => console.log("Error:", error));
//   };

//   const checkIfRoleExists = async (roleId, roleName) => {
//     let errors = {};
//     try {
//       const responseRoleId = await axios.get(`${API_URL}/check_role_id_exists`, { params: { roleId } });
//       if (responseRoleId.data.exists) {
//         errors.roleId = "Role ID already exists";
//       }

//       const responseRoleName = await axios.get(`${API_URL}/check_role_name_exists`, { params: { roleName } });
//       if (responseRoleName.data.exists) {
//         errors.roleName = "Role Name already exists";
//       }
//     } catch (error) {
//       console.log("Error checking role existence:", error);
//     }
//     return errors;
//   };

//   const formik = useFormik({
//     initialValues: {
//       roleId: "",
//       roleName: "",
//     },
//     validationSchema: Yup.object({
//       roleId: Yup.string().required("Role ID is required"),
//       roleName: Yup.string().required("Role Name is required"),
//     }),
//     validate: async (values) => {
//       const errors = await checkIfRoleExists(values.roleId, values.roleName);
//       return errors;
//     },
//     onSubmit: async (values, { setTouched, setErrors }) => {
//       setTouched({ roleId: true, roleName: true }, false); // Trigger validation messages
//       const existingErrors = await checkIfRoleExists(values.roleId, values.roleName);

//       if (Object.keys(existingErrors).length > 0) {
//         setErrors(existingErrors);
//         return;
//       }

//       try {
//         const response = await axios.post(`${API_URL}/add_admin_role`, {
//           roleId: values.roleId,
//           roleName: values.roleName,
//         });

//         if (!response.data.error) {
//           formik.resetForm();
//           fetchRoles();
//         }
//       } catch (error) {
//         console.error("Error adding Roles:", error);
//       }
//     }
//   });

//   const columns = useMemo(
//     () => [
//       {
//         Header: "Role ID",
//         accessor: "roleId",
//       },
//       {
//         Header: "Role Name",
//         accessor: "roleName",
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
//     state: { pageIndex, pageSize },
//   } = useTable(
//     {
//       columns,
//       data: roles,
//       initialState: { pageIndex: 0, pageSize: 10 },
//     },
//     useSortBy,
//     usePagination
//   );

//   return (
//     <>
//       <div className="container-fluid bg-indigo-300 w-full h-[87vh] p-4 overflow-auto flex">
//         {/* Form */}
//         <div className="w-5/12 h-[60vh]">
//           <h2 className="text-4xl text-center py-2 text-gray-900 font-semibold">Add Role</h2>
//           <div className="p-8 bg-white rounded-lg shadow-2xl h-[50vh]">
//             <form onSubmit={formik.handleSubmit}>
//               <div className="mb-6">
//                 <label className="block text-gray-700">Role ID</label>
//                 <input
//                   type="text"
//                   id="roleId"
//                   name="roleId"
//                   value={formik.values.roleId}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   className="w-full px-3 py-2 border rounded-lg"
//                 />
//                 {formik.touched.roleId && formik.errors.roleId && (
//                   <div className="text-red-600 text-sm">{formik.errors.roleId}</div>
//                 )}
//               </div>

//               <div className="mb-6">
//                 <label className="block text-gray-700">Role Name</label>
//                 <input
//                   id="roleName"
//                   name="roleName"
//                   value={formik.values.roleName}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   className="w-full px-3 py-2 border rounded-lg"
//                 />
//                 {formik.touched.roleName && formik.errors.roleName && (
//                   <div className="text-red-600 text-sm">{formik.errors.roleName}</div>
//                 )}
//               </div>

//               <button
//                 type="submit"
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg"
//               >
//                 Add Role
//               </button>
//             </form>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="w-7/12 pl-6">
//           <h1 className="text-4xl text-center py-2 text-gray-900 font-semibold">Roles</h1>
//           <div className="min-w-full bg-white rounded-lg shadow-2xl overflow-auto">
//             <table {...getTableProps()} className="min-w-full">
//               <thead>
//                 {headerGroups.map(headerGroup => (
//                   <tr {...headerGroup.getHeaderGroupProps()} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
//                     {headerGroup.headers.map(column => (
//                       <th
//                         {...column.getHeaderProps(column.getSortByToggleProps())}
//                         className="px-6 py-3 text-left"
//                       >
//                         {column.render('Header')}
//                         <span>
//                           {column.isSorted
//                             ? column.isSortedDesc
//                               ? ' 🔽'
//                               : ' 🔼'
//                             : ''}
//                         </span>
//                       </th>
//                     ))}
//                   </tr>
//                 ))}
//               </thead>
//               <tbody {...getTableBodyProps()}>
//                 {page.map(row => {
//                   prepareRow(row);
//                   return (
//                     <tr {...row.getRowProps()} className="text-gray-800 even:bg-gray-100 odd:bg-white hover:bg-indigo-300">
//                       {row.cells.map(cell => (
//                         <td {...cell.getCellProps()} className="px-6 py-4">
//                           {cell.render('Cell')}
//                         </td>
//                       ))}
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//             <div className="pagination p-4 flex justify-between items-center">
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => previousPage()}
//                   disabled={!canPreviousPage}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
//                 >
//                   Prev
//                 </button>
//                 <button
//                   onClick={() => nextPage()}
//                   disabled={!canNextPage}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
//                 >
//                   Next
//                 </button>
//               </div>
//               <span>
//                 Page{' '}
//                 <strong>
//                   {pageIndex + 1} of {pageOptions.length}
//                 </strong>{' '}
//               </span>
//               <span>
//                 | Go to page:{' '}
//                 <input
//                   type="number"
//                   defaultValue={pageIndex + 1}
//                   onChange={e => {
//                     const page = e.target.value ? Number(e.target.value) - 1 : 0;
//                     gotoPage(page);
//                   }}
//                   className="w-20 px-2 py-1 border rounded-lg"
//                 />
//               </span>{' '}
//               <select
//                 value={pageSize}
//                 onChange={e => {
//                   setPageSize(Number(e.target.value));
//                 }}
//                 className="px-2 py-1 border rounded-lg"
//               >
//                 {[10, 20, 30, 40, 50].map(pageSize => (
//                   <option key={pageSize} value={pageSize}>
//                     Show {pageSize}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Role;










































// import { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { useTable, usePagination, useSortBy } from "react-table";

// const API_URL = "http://localhost:5373";

// const Role = () => {
//   const [roles, setRoles] = useState([]);

//   useEffect(() => {
//     fetchRoles();
//   }, []);

//   const fetchRoles = () => {
//     axios.get(`${API_URL}/get_admin_role`)
//       .then((response) => setRoles(response.data))
//       .catch((error) => console.log("Error:", error));
//   };

//   const checkIfRoleExists = async (roleId, roleName) => {
//     let errors = {};
//     try {
//       const responseRoleId = await axios.get(`${API_URL}/check_role_id_exists`, { params: { roleId } });
//       if (responseRoleId.data.exists) {
//         errors.roleId = "Role ID already exists";
//       }

//       const responseRoleName = await axios.get(`${API_URL}/check_role_name_exists`, { params: { roleName } });
//       if (responseRoleName.data.exists) {
//         errors.roleName = "Role Name already exists";
//       }
//     } catch (error) {
//       console.log("Error checking role existence:", error);
//     }
//     return errors;
//   };

//   const formik = useFormik({
//     initialValues: {
//       roleId: "",
//       roleName: "",
//     },
//     validationSchema: Yup.object({
//       roleId: Yup.string().required("Role ID is required"),
//       roleName: Yup.string().required("Role Name is required"),
//     }),
//     validate: async (values) => {
//       const errors = await checkIfRoleExists(values.roleId, values.roleName);
//       return errors;
//     },
//     onSubmit: async (values, { setTouched, setErrors }) => {
//       setTouched({ roleId: true, roleName: true }, false); // Trigger validation messages
//       const existingErrors = await checkIfRoleExists(values.roleId, values.roleName);

//       if (Object.keys(existingErrors).length > 0) {
//         setErrors(existingErrors);
//         return;
//       }

//       try {
//         const response = await axios.post(`${API_URL}/add_admin_role`, {
//           roleId: values.roleId,
//           roleName: values.roleName,
//         });

//         if (!response.data.error) {
//           formik.resetForm();
//           fetchRoles();
//         }
//       } catch (error) {
//         console.error("Error adding Roles:", error);
//       }
//     }
//   });

//   const columns = useMemo(
//     () => [
//       {
//         Header: "Role ID",
//         accessor: "roleId",
//       },
//       {
//         Header: "Role Name",
//         accessor: "roleName",
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
//     state: { pageIndex, pageSize },
//   } = useTable(
//     {
//       columns,
//       data: roles,
//       initialState: { pageIndex: 0, pageSize: 10 },
//     },
//     useSortBy,
//     usePagination
//   );

//   return (
//     <>
//       <div className="container-fluid bg-indigo-300 w-full h-[87vh] p-4 overflow-auto flex">
//         {/* Form */}
//         <div className="w-5/12 h-[60vh]">
//           <h2 className="text-4xl text-center py-2 text-gray-900 font-semibold">Add Role</h2>
//           <div className="p-8 bg-white rounded-lg shadow-2xl h-[50vh]">
//             <form onSubmit={formik.handleSubmit}>
//               <div className="mb-6">
//                 <label className="block text-gray-700">Role ID</label>
//                 <input
//                   type="text"
//                   id="roleId"
//                   name="roleId"
//                   value={formik.values.roleId}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   className="w-full px-3 py-2 border rounded-lg"
//                 />
//                 {formik.touched.roleId && formik.errors.roleId && (
//                   <div className="text-red-600 text-sm">{formik.errors.roleId}</div>
//                 )}
//               </div>

//               <div className="mb-6">
//                 <label className="block text-gray-700">Role Name</label>
//                 <input
//                   id="roleName"
//                   name="roleName"
//                   value={formik.values.roleName}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   className="w-full px-3 py-2 border rounded-lg"
//                 />
//                 {formik.touched.roleName && formik.errors.roleName && (
//                   <div className="text-red-600 text-sm">{formik.errors.roleName}</div>
//                 )}
//               </div>

//               <button
//                 type="submit"
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg"
//               >
//                 Add Role
//               </button>
//             </form>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="w-7/12 pl-6">
//           <h1 className="text-4xl text-center py-2 text-gray-900 font-semibold">Roles</h1>
//           <div className="min-w-full bg-white rounded-lg shadow-2xl overflow-auto">
//             <table {...getTableProps()} className="min-w-full">
//               <thead>
//                 {headerGroups.map(headerGroup => (
//                   <tr {...headerGroup.getHeaderGroupProps()} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
//                     {headerGroup.headers.map(column => (
//                       <th
//                         {...column.getHeaderProps(column.getSortByToggleProps())}
//                         className="px-6 py-3 text-left"
//                       >
//                         {column.render('Header')}
//                         <span>
//                           {column.isSorted
//                             ? column.isSortedDesc
//                               ? ' 🔽'
//                               : ' 🔼'
//                             : ''}
//                         </span>
//                       </th>
//                     ))}
//                   </tr>
//                 ))}
//               </thead>
//               <tbody {...getTableBodyProps()}>
//                 {page.map(row => {
//                   prepareRow(row);
//                   return (
//                     <tr {...row.getRowProps()} className="text-gray-800 even:bg-gray-100 odd:bg-white hover:bg-indigo-300">
//                       {row.cells.map(cell => (
//                         <td {...cell.getCellProps()} className="px-6 py-4">
//                           {cell.render('Cell')}
//                         </td>
//                       ))}
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//             <div className="pagination p-4 flex justify-between items-center">
//               <div>
//                 <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400">
//                   {'<<'}
//                 </button>{' '}
//                 <button onClick={() => previousPage()} disabled={!canPreviousPage} className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400">
//                   {'<'}
//                 </button>{' '}
//                 <button onClick={() => nextPage()} disabled={!canNextPage} className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400">
//                   {'>'}
//                 </button>{' '}
//                 <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400">
//                   {'>>'}
//                 </button>{' '}
//               </div>
//               <span>
//                 Page{' '}
//                 <strong>
//                   {pageIndex + 1} of {pageOptions.length}
//                 </strong>{' '}
//               </span>
//               <span>
//                 | Go to page:{' '}
//                 <input
//                   type="number"
//                   defaultValue={pageIndex + 1}
//                   onChange={e => {
//                     const page = e.target.value ? Number(e.target.value) - 1 : 0;
//                     gotoPage(page);
//                   }}
//                   className="w-20 px-2 py-1 border rounded-lg"
//                 />
//               </span>{' '}
//               <select
//                 value={pageSize}
//                 onChange={e => {
//                   setPageSize(Number(e.target.value));
//                 }}
//                 className="px-2 py-1 border rounded-lg"
//               >
//                 {[10, 20, 30, 40, 50].map(pageSize => (
//                   <option key={pageSize} value={pageSize}>
//                     Show {pageSize}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Role;
































































// import { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { useTable, usePagination, useSortBy } from "react-table";

// const API_URL = "http://localhost:5373";

// const Role = () => {
//   const [roles, setRoles] = useState([]);

//   useEffect(() => {
//     fetchRoles();
//   }, []);

//   const fetchRoles = () => {
//     axios.get(`${API_URL}/get_admin_role`)
//       .then((response) => setRoles(response.data))
//       .catch((error) => console.log("Error:", error));
//   };

//   const checkIfRoleExists = async (roleId, roleName) => {
//     let errors = {};
//     try {
//       const responseRoleId = await axios.get(`${API_URL}/check_role_id_exists`, { params: { roleId } });
//       if (responseRoleId.data.exists) {
//         errors.roleId = "Role ID already exists";
//       }

//       const responseRoleName = await axios.get(`${API_URL}/check_role_name_exists`, { params: { roleName } });
//       if (responseRoleName.data.exists) {
//         errors.roleName = "Role Name already exists";
//       }
//     } catch (error) {
//       console.log("Error checking role existence:", error);
//     }
//     return errors;
//   };

//   const formik = useFormik({
//     initialValues: {
//       roleId: "",
//       roleName: "",
//     },
//     validationSchema: Yup.object({
//       roleId: Yup.string().required("Role ID is required"),
//       roleName: Yup.string().required("Role Name is required"),
//     }),
//     validate: async (values) => {
//       const errors = await checkIfRoleExists(values.roleId, values.roleName);
//       return errors;
//     },
//     onSubmit: async (values, { setTouched, setErrors }) => {
//       setTouched({ roleId: true, roleName: true }, false); // Trigger validation messages
//       const existingErrors = await checkIfRoleExists(values.roleId, values.roleName);

//       if (Object.keys(existingErrors).length > 0) {
//         setErrors(existingErrors);
//         return;
//       }

//       try {
//         const response = await axios.post(`${API_URL}/add_admin_role`, {
//           roleId: values.roleId,
//           roleName: values.roleName,
//         });

//         if (!response.data.error) {
//           formik.resetForm();
//           fetchRoles();
//         }
//       } catch (error) {
//         console.error("Error adding Roles:", error);
//       }
//     }
//   });

//   const columns = useMemo(
//     () => [
//       {
//         Header: "Role ID",
//         accessor: "roleId",
//       },
//       {
//         Header: "Role Name",
//         accessor: "roleName",
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
//     state: { pageIndex, pageSize },
//   } = useTable(
//     {
//       columns,
//       data: roles,
//       initialState: { pageIndex: 0, pageSize: 10 },
//     },
//     useSortBy,
//     usePagination
//   );

//   return (
//     <>
//       <div className="container-fluid bg-indigo-300 w-full h-[87vh] p-4 overflow-auto flex">
//         {/* Form */}
//         <div className="w-5/12 h-[60vh]">
//           <h2 className="text-4xl text-center py-2 text-gray-900 font-semibold">Add Role</h2>
//           <div className="p-8 bg-white rounded-lg shadow-2xl h-[50vh]">
//             <form onSubmit={formik.handleSubmit}>
//               <div className="mb-6">
//                 <label className="block text-gray-700">Role ID</label>
//                 <input
//                   type="text"
//                   id="roleId"
//                   name="roleId"
//                   value={formik.values.roleId}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   className="w-full px-3 py-2 border rounded-lg"
//                 />
//                 {formik.touched.roleId && formik.errors.roleId && (
//                   <div className="text-red-600 text-sm">{formik.errors.roleId}</div>
//                 )}
//               </div>

//               <div className="mb-6">
//                 <label className="block text-gray-700">Role Name</label>
//                 <input
//                   id="roleName"
//                   name="roleName"
//                   value={formik.values.roleName}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   className="w-full px-3 py-2 border rounded-lg"
//                 />
//                 {formik.touched.roleName && formik.errors.roleName && (
//                   <div className="text-red-600 text-sm">{formik.errors.roleName}</div>
//                 )}
//               </div>

//               <button
//                 type="submit"
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg"
//               >
//                 Add Role
//               </button>
//             </form>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="w-7/12 pl-6">
//           <h1 className="text-4xl text-center py-2 text-gray-900 font-semibold">Roles</h1>
//           <div className="min-w-full bg-white rounded-lg shadow-2xl overflow-auto">
//             <table {...getTableProps()} className="min-w-full">
//               <thead>
//                 {headerGroups.map(headerGroup => (
//                   <tr {...headerGroup.getHeaderGroupProps()} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
//                     {headerGroup.headers.map(column => (
//                       <th
//                         {...column.getHeaderProps(column.getSortByToggleProps())}
//                         className="px-6 py-3 text-left"
//                       >
//                         {column.render('Header')}
//                         <span>
//                           {column.isSorted
//                             ? column.isSortedDesc
//                               ? ' 🔽'
//                               : ' 🔼'
//                             : ''}
//                         </span>
//                       </th>
//                     ))}
//                   </tr>
//                 ))}
//               </thead>
//               <tbody {...getTableBodyProps()}>
//                 {page.map(row => {
//                   prepareRow(row);
//                   return (
//                     <tr {...row.getRowProps()} className="text-gray-800 bg-gray-100 hover:bg-indigo-300">
//                       {row.cells.map(cell => (
//                         <td {...cell.getCellProps()} className="px-6 py-4">
//                           {cell.render('Cell')}
//                         </td>
//                       ))}
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//             <div className="pagination p-4">
//               <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
//                 {'<<'}
//               </button>{' '}
//               <button onClick={() => previousPage()} disabled={!canPreviousPage}>
//                 {'<'}
//               </button>{' '}
//               <button onClick={() => nextPage()} disabled={!canNextPage}>
//                 {'>'}
//               </button>{' '}
//               <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
//                 {'>>'}
//               </button>{' '}
//               <span>
//                 Page{' '}
//                 <strong>
//                   {pageIndex + 1} of {pageOptions.length}
//                 </strong>{' '}
//               </span>
//               <span>
//                 | Go to page:{' '}
//                 <input
//                   type="number"
//                   defaultValue={pageIndex + 1}
//                   onChange={e => {
//                     const page = e.target.value ? Number(e.target.value) - 1 : 0;
//                     gotoPage(page);
//                   }}
//                   style={{ width: '100px' }}
//                 />
//               </span>{' '}
//               <select
//                 value={pageSize}
//                 onChange={e => {
//                   setPageSize(Number(e.target.value));
//                 }}
//               >
//                 {[10, 20, 30, 40, 50].map(pageSize => (
//                   <option key={pageSize} value={pageSize}>
//                     Show {pageSize}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Role;

































































































































































































// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useFormik } from "formik";
// import * as Yup from "yup";

// const API_URL = "http://localhost:5373";

// const Role = () => {
//   const [roles, setRoles] = useState([]);

//   useEffect(() => {
//     fetchRoles();
//   }, []);

//   const fetchRoles = () => {
//     axios.get(`${API_URL}/get_admin_role`)
//       .then((response) => setRoles(response.data))
//       .catch((error) => console.log("Error:", error));
//   };

//   const checkIfRoleExists = async (roleId, roleName) => {
//     let errors = {};
//     try {
//       const responseRoleId = await axios.get(`${API_URL}/check_role_id_exists`, { params: { roleId } });
//       if (responseRoleId.data.exists) {
//         errors.roleId = "Role ID already exists";
//       }

//       const responseRoleName = await axios.get(`${API_URL}/check_role_name_exists`, { params: { roleName } });
//       if (responseRoleName.data.exists) {
//         errors.roleName = "Role Name already exists";
//       }
//     } catch (error) {
//       console.log("Error checking role existence:", error);
//     }
//     return errors;
//   };

//   const formik = useFormik({
//     initialValues: {
//       roleId: "",
//       roleName: "",
//     },
//     validationSchema: Yup.object({
//       roleId: Yup.string().required("Role ID is required"),
//       roleName: Yup.string().required("Role Name is required"),
//     }),
//     validate: async (values) => {
//       const errors = await checkIfRoleExists(values.roleId, values.roleName);
//       return errors;
//     },
//     onSubmit: async (values, { setTouched, setErrors }) => {
//       setTouched({ roleId: true, roleName: true }, false); // Trigger validation messages
//       const existingErrors = await checkIfRoleExists(values.roleId, values.roleName);

//       if (Object.keys(existingErrors).length > 0) {
//         setErrors(existingErrors);
//         return;
//       }

//       try {
//         const response = await axios.post(`${API_URL}/add_admin_role`, {
//           roleId: values.roleId,
//           roleName: values.roleName,
//         });

//         if (!response.data.error) {
//           formik.resetForm();
//           fetchRoles();
//         }
//       } catch (error) {
//         console.error("Error adding Roles:", error);
//       }
//     }
//   });

//   return (
//     <>
//       <div className="container-fluid bg-indigo-300 w-full h-[87vh] p-4 overflow-auto flex">
//         {/* Form */}
//         <div className="w-5/12 h-[60vh]">
//           <h2 className="text-4xl text-center py-2 text-gray-900 font-semibold">Add Role</h2>
//           <div className="p-8 bg-white rounded-lg shadow-2xl h-[50vh]">
//             <form onSubmit={formik.handleSubmit}>
//               <div className="mb-6">
//                 <label className="block text-gray-700">Role ID</label>
//                 <input
//                   type="text"
//                   id="roleId"
//                   name="roleId"
//                   value={formik.values.roleId}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   className="w-full px-3 py-2 border rounded-lg"
//                 />
//                 {formik.touched.roleId && formik.errors.roleId && (
//                   <div className="text-red-600 text-sm">{formik.errors.roleId}</div>
//                 )}
//               </div>

//               <div className="mb-6">
//                 <label className="block text-gray-700">Role Name</label>
//                 <input
//                   id="roleName"
//                   name="roleName"
//                   value={formik.values.roleName}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   className="w-full px-3 py-2 border rounded-lg"
//                 />
//                 {formik.touched.roleName && formik.errors.roleName && (
//                   <div className="text-red-600 text-sm">{formik.errors.roleName}</div>
//                 )}
//               </div>

//               <button
//                 type="submit"
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg"
//               >
//                 Add Role
//               </button>
//             </form>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="w-7/12 pl-6">
//           <h1 className="text-4xl text-center py-2 text-gray-900 font-semibold">Roles</h1>
//           <table className="min-w-full bg-white rounded-lg shadow-2xl overflow-hidden">
//             <thead>
//               <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
//                 <th className="px-6 py-3 text-left">Role ID</th>
//                 <th className="px-6 py-3 text-left">Role Name</th>
//               </tr>
//             </thead>
//             <tbody>
//               {roles.length > 0 ? (
//                 roles.map((role) => (
//                   <tr key={role.roleId} className="text-gray-800 bg-gray-100 hover:bg-indigo-300">
//                     <td className="px-6 py-4">{role.roleId}</td>
//                     <td className="px-6 py-4">{role.roleName}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="2" className="px-6 py-4 text-center text-gray-600">No data available</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Role;






















































































































































































// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useFormik } from "formik";
// import * as Yup from "yup";

// const API_URL = "http://localhost:5373";

// const Role = () => {
//   const [roles, setRoles] = useState([]);
  
//   useEffect(() => {
//     fetchRoles();
//   },[]);

//   const fetchRoles = () => {
//     axios.get(`${API_URL}/get_admin_role`)
//     .then((response) => setRoles(response.data))
//     .catch((error) => console.log("Error:", error));
//   }

//   const formik = useFormik({
//     initialValues: {
//       roleId: "",
//       roleName: "",
//     },
//     validationSchema: Yup.object({
//       roleId: Yup.string().required("Role ID is required"),
//       roleName: Yup.string().required("Role Name is required"),
//     }),
//     onSubmit: async (values) => {
//       try {
//         const response = await axios.post(`${API_URL}/add_admin_role`, {
//           roleId: values.roleId,
//           roleName: values.roleName,
//         });
        
//         if(response.data.error){
//           // alert(response.data.error);
//         } else {
//           formik.resetForm(); // Reset the form
//           fetchRoles();
//         }
//       } catch (error) {
//         console.error("Error adding Roles:", error);
//       }
//     }
//   });

//   return(
//     <>
//       <div className="container-fluid bg-indigo-300 w-full h-[84.6vh] p-4 overflow-auto flex">
//         {/* Form */}
//         <div className="w-5/12 h-[60vh]">
//           <h2 className="text-4xl text-center py-6 text-gray-700 font-semibold">Add Role</h2>
//           <div className="p-8 bg-white rounded-lg shadow-2xl h-[50vh]">
//             <form onSubmit={formik.handleSubmit}>
//               <div className="mb-6">
//                 <label className="block text-gray-700">Role ID</label>
//                 <input 
//                   type="text" 
//                   id="roleId"
//                   name="roleId"
//                   value={formik.values.roleId}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   className="w-full px-3 py-2 border rounded-lg"
//                 />
//                 {formik.touched.roleId && formik.errors.roleId ? (
//                   <div className="text-red-600 text-sm">{formik.errors.roleId}</div>
//                 ) : null}
//               </div>

//               <div className="mb-6">
//                 <label className="block text-gray-700">Role Name</label>
//                 <input
//                   id="roleName"
//                   name="roleName"
//                   value={formik.values.roleName}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   className="w-full px-3 py-2 border rounded-lg"
//                 />
//                 {formik.touched.roleName && formik.errors.roleName ? (
//                   <div className="text-red-600 text-sm">{formik.errors.roleName}</div>
//                 ) : null}
//               </div>

//               <button 
//                 type="submit" 
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg"
//                 disabled={!(formik.isValid && formik.dirty)}
//               >
//                 Add Role
//               </button>
//             </form>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="w-7/12 pl-6">
//           <h1 className="text-4xl text-center py-6 text-gray-700 font-semibold">Roles</h1>
//           <table className="min-w-full bg-white rounded-lg shadow-2xl overflow-hidden">
//             <thead>
//               <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
//                 <th className="px-6 py-3 text-left">Role ID</th>
//                 <th className="px-6 py-3 text-left">Role Name</th>
//               </tr>
//             </thead>
//             <tbody>
//               {roles.length > 0 ? (
//                 roles.map((role) => (
//                   <tr key={role.roleId} className="text-gray-800 bg-gray-100 hover:bg-indigo-300">
//                     <td className="px-6 py-4">{role.roleId}</td>
//                     <td className="px-6 py-4">{role.roleName}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="2" className="px-6 py-4 text-center text-gray-600">No data available</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Role;

















































































































// import { useState, useEffect } from "react";
// import axios from "axios";

// const API_URL = "http://localhost:5373";

// const Role = () => {
//   const [roles, setRoles] = useState([]);
//   const [roleId, setRoleId] = useState("");
//   const [roleName, setRoleName] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchRoles();
//   },[]);

//   const fetchRoles = () => {
//     axios.get(`${API_URL}/get_admin_role`)
//     .then((response) => setRoles(response.data))
//     .catch((error) => console.log("Error:", error));
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     try{
//       const response = await axios.post(`${API_URL}/add_admin_role`, {roleId, roleName});
//       if(response.data.error){
//         setError(response.data.error);
//       }else{
//         setRoleId("");
//         setRoleName("");
//         fetchRoles();
//       }
//     }catch(error){
//          setError("Error adding Roles", error); 
//       }
//     }


//     return(
//       <>
      
//       <div className="container-fluid bg-indigo-300 w-full h-[84.6vh] p-4 overflow-auto flex">

//       {/* Form */}
      
//       <div className="w-5/12 h-[60vh]">
//       <h2 className="text-4xl text-center py-6 text-gray-700 font-semibold">Add Role</h2>
//         <div className="p-8  bg-white rounded-lg shadow-2xl h-[50vh]">
      
//       <form onSubmit={handleSubmit}>
//         <div className="mb-6">
//           <label className="block text-gray-700">Role ID</label>
//           <input type="text" value={roleId} onChange={(e) => setRoleId(e.target.value)} className="w-full px-3 py-2 border rounded-lg required" />
//         </div>

//         <div className="mb-6">
//           <label className="block text-gray-700">Role Name</label>
//           <input value={roleName} onChange={(e) => setRoleName(e.target.value)} className="w-full px-3 py-2 border rounded-lg required" />
           
//         </div>

//         <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Add Role</button>

//       </form>
      
//       </div>
//       </div>

//       {/* Table */}

//       <div className="w-7/12 pl-6">
//       <h1 className="text-4xl text-center py-6 text-gray-700 font-semibold">Roles</h1>
//       <table className="min-w-full bg-white rounded-lg shadow-2xl overflow-hidden">
//         <thead>
//           <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
//             <th className="px-6 py-3 text-left">Role ID</th>
//             <th className="px-6 py-3 text-left">Role Name</th>
//           </tr>
//         </thead>
//         <tbody>
//           {roles.length > 0 ? (
//             roles.map((role) => (
//               <tr key={role.roleId} className="text-gray-800 bg-gray-100 hover:bg-indigo-300">
//                 <td className="px-6 py-4">{role.roleId}</td>
//                 <td className="px-6 py-4">{role.roleName}</td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="2" className="px-6 py-4 text-center text-gray-600">No data available</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>

//       </div>


//       </>
//     )


// }

// export default Role;















































































// import { useState, useEffect } from "react";
// import axios from "axios";

// const API_URL = "http://localhost:5373";

// const Role = () => {
//   const [roles, setRoles] = useState([]);
//   const [roleId, setRoleId] = useState("");
//   const [roleName, setRoleName] = useState("");
//   const [error, setError] = useState("");
//   const roleOptions = ['Admin', 'HR', 'Manager', 'SW', 'Clerk'];

//   useEffect(() => {
//     fetchRoles();
//   }, []);

//   const fetchRoles = () => {
//     axios
//       .get(`${API_URL}/get_admin_role`)
//       .then((response) => {
//         setRoles(response.data);
//       })
//       .catch((error) => console.log("Error", error));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     try {
//       const response = await axios.post(`${API_URL}/add_admin_role`, {
//         roleId,
//         roleName,
//       });
//       if (response.data.error) {
//         setError(response.data.error);
//       } else {
//         setRoleId("");
//         setRoleName("");
//         fetchRoles();
//       }
//     } catch (error) {
//       setError("Error adding role");
//     }
//   };

//   return (
//     <div className="container-fluid bg-gray-200 w-full h-[84.6vh] p-8 overflow-auto flex">
//       {/* Form Section */}
//       <div className="w-5/12 p-8 mt-10 bg-white h-[50vh] rounded-lg shadow-2xl">
//         <h2 className="text-2xl font-semibold text-gray-700 mb-6">Add Role</h2>
//         {/* {error && <p className="text-red-500">{error}</p>} */}
//         <form onSubmit={handleSubmit}>
//           <div className="mb-6">
//             <label className="block text-gray-700">Role ID:</label>
//             <input type="text" value={roleId} onChange={(e) => setRoleId(e.target.value)} className="w-full px-3 py-2 border rounded-lg" required/>
//           </div>

//           <div className="mb-6">
//             <label className="block text-gray-700">Role Name:</label>
//             <select value={roleName} onChange={(e) => setRoleName(e.target.value)} className="w-full px-3 py-2 border rounded-lg" required>
//               <option value="" selected disabled>Select a role</option>
//               {roleOptions.map((role) => (<option key={role} value={role}>{role}</option>))}
//             </select>
//           </div>

//           <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Add Role</button>
//         </form>
//       </div>
      
//       {/* Table Section */}
//       <div className="w-7/12 pl-6">
//         <h1 className="text-4xl text-center py-6 text-gray-700 font-semibold">Roles</h1>
//         <table className="min-w-full bg-white rounded-lg shadow-2xl overflow-hidden">
//           <thead>
//             <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
//               <th className="px-6 py-3 text-left">Role ID</th>
//               <th className="px-6 py-3 text-left">Role Name</th>
//             </tr>
//           </thead>
//           <tbody>
//             {roles.length > 0 ? (
//               roles.map((role) => (
//                 <tr key={role.roleId} className="text-gray-800 bg-gray-300 hover:bg-gray-100">
//                   <td className="px-6 py-4">{role.roleId}</td>
//                   <td className="px-6 py-4">{role.roleName}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="2" className="px-6 py-4 text-center text-gray-600">No data available</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Role;

































































































// import { useState, useEffect } from "react";
// import axios from "axios"; 

// const API_URL = "http://localhost:5373"

// const Role = () => {
//   const [roles, setRoles] = useState([]);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     axios.get(`${API_URL}/get_admin_role`)
//       .then((response) => {
//         setRoles(response.data);
//       })
//       .catch((error) => console.log("Error", error));
//   }, []);

//   return (
//     <>
//       <div className="container-fluid bg-gray-200 w-full h-[84.6vh] p-6 overflow-auto">
//         <h1 className="text-4xl text-center py-6 text-gray-700 font-semibold">Roles</h1>

//         {/* Table */}
//         <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
//           <thead>
//             <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
//               <th className="px-6 py-3 text-left">Role ID</th>
//               <th className="px-6 py-3 text-left">Role Name</th>
//             </tr>
//           </thead>
//           <tbody>
//             {roles.length > 0 ? (
//               roles.map((role) => (
//                 <tr key={role.roleId} className="text-gray-800 bg-gray-300 hover:bg-gray-100">
//                   <td className="px-6 py-4">{role.roleId}</td>
//                   <td className="px-6 py-4">{role.roleName}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="2" className="px-6 py-4 text-center text-gray-600">No data available</td>
//               </tr>
//             )}
//           </tbody>
//         </table>

        
//       </div>
//     </>
//   );
// };

// export default Role;




















































































































// import { useState, useEffect } from "react";
// import axios from "axios";
// import { FaPlusCircle } from "react-icons/fa"; // For Add Role icon

// const Role = () => {
//   const [roles, setRoles] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [roleId, setRoleId] = useState("");
//   const [roleName, setRoleName] = useState("");

//   useEffect(() => {
//     axios
//       .get("http://localhost:5373/get_admin_role")
//       .then((response) => {
//         setRoles(response.data);
//       })
//       .catch((error) => console.log("Error", error));
//   }, []);

//   const handleAddRole = () => {
//     axios
//       .post("http://localhost:5373/add_admin_role", { roleId, roleName })
//       .then((response) => {
//         if (response.data.error) {
//           alert("Error adding role");
//         } else {
//           setRoles((prevRoles) => [...prevRoles, { roleId, roleName }]);
//           setShowModal(false);
//         }
//       })
//       .catch((error) => console.log("Error", error));
//   };

//   return (
//     <>
//       <div className="container-fluid bg-gray-100 w-full h-[84.6vh] p-6 overflow-auto">
//         <h1 className="text-4xl text-center py-6 text-gray-700 font-semibold">Roles</h1>

//         {/* Add Role Button */}
//         <div className="flex justify-start mb-4">
//           <button
//             onClick={() => setShowModal(true)}
//             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             <FaPlusCircle className="mr-2" />
//             Add Role
//           </button>
//         </div>

//         {/* Table */}
//         <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
//           <thead>
//             <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
//               <th className="px-6 py-3 text-left">Role ID</th>
//               <th className="px-6 py-3 text-left">Role Name</th>
//             </tr>
//           </thead>
//           <tbody>
//             {roles.length > 0 ? (
//               roles.map((role) => (
//                 <tr key={role.roleId} className="text-gray-800 hover:bg-gray-100">
//                   <td className="px-6 py-4">{role.roleId}</td>
//                   <td className="px-6 py-4">{role.roleName}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="2" className="px-6 py-4 text-center text-gray-600">
//                   No data available
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>

//         {/* Add Role Modal */}
//         {showModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//             <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
//               <h2 className="text-xl font-semibold mb-4">Add New Role</h2>
//               <div className="mb-4">
//                 <label className="block text-gray-700">Role ID</label>
//                 <input
//                   type="text"
//                   value={roleId}
//                   onChange={(e) => setRoleId(e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-lg"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700">Role Name</label>
//                 <input
//                   type="text"
//                   value={roleName}
//                   onChange={(e) => setRoleName(e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-lg"
//                 />
//               </div>
//               <div className="flex justify-between">
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="px-4 py-2 bg-gray-500 text-white rounded-lg"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleAddRole}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 >
//                   Add Role
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Role;















































































// import { useState, useEffect } from "react";
// import axios from "axios";

// const Role = () => {
//   const [roles, setRoles] = useState([]);

//   useEffect(() => {
//     axios
//       .get('http://localhost:5373/get_admin_role')
//       .then((response) => {
//         setRoles(response.data);
//         console.log(response.data);
//       })
//       .catch((error) => console.log("Error", error));
//   }, []);

//   return (
//     <>
//       <div className="container-fluid bg-gray-100 w-full h-[84.6vh] p-6 overflow-auto">
//         <h1 className="text-4xl text-center py-6 text-gray-700 font-semibold">Roles</h1>

//         {/* Table */}
//         <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
//           <thead>
//             <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
//               <th className="px-6 py-3 text-left">Role ID</th>
//               <th className="px-6 py-3 text-left">Role Name</th>
//             </tr>
//           </thead>
//           <tbody>
//             {roles.length > 0 ? (
//               roles.map((role) => (
//                 <tr key={role.roleId} className="text-gray-800 hover:bg-gray-100">
//                   <td className="px-6 py-4">{role.roleId}</td>
//                   <td className="px-6 py-4">{role.roleName}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="2" className="px-6 py-4 text-center text-gray-600">
//                   No data available
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </>
//   );
// };

// export default Role;







































































// import { useState, useEffect } from "react";
// import axios from "axios";



// const Role = () => {
// const [roles, setRoles] = useState([]);

// useEffect(() => {
//     axios.get('http://localhost:5373/get_admin_role')
//     .then(response => {
//         setRoles(response.data);
//         console.log(response.data);
//     })
//     .catch(error => console.log("Error", error));
// }, []);


//   return (
//     <>
//     <div className="container-fluid bg-slate-300 w-full h-[86.5vh] p-6 overflow-auto">
//     <h1 className="text-3xl text-center py-4">Role</h1>

//     <table className="min-w-full bg-dark text-white table-auto">
//     <thead>
//         <tr className="bg-gray-800">
//         <th className="px-4 py-2">Role ID</th>
//         <th className="px-4 py-2">Role Name</th>
//         </tr>
//     </thead>
//     <tbody>
//         {roles.length > 0 ? (
//             roles.map((role) => (
//                 <tr key={role.roleId} className="text-white bg-black text-center hover:bg-white hover:text-black">
//                     <td className="px-4 py-2">{role.roleId}</td>
//                     <td className="px-4 py-2">{role.roleName}</td>
//                 </tr>
//             ))
//         ) : (
//             <tr>
//                 <td colSpan="5" className="px-4 py-2 text-center text-black">No data available</td>
//             </tr>
//         )}
//     </tbody>
//     </table>

//     </div>
//     </>
//   )
// }

// export default Role