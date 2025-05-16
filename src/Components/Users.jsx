import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import moment from "moment";
import { FaUserPlus, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

import { useTable, usePagination, useGlobalFilter, useSortBy } from "react-table";
import AddUserModal from "./AddUserModal";
import DeleteUserModal from "./DeleteUserModal";
import RoleAssignmentModal from "./RoleAssignmentModal";
import UserUpdateModal from "./UpdateUserModal";

const API_URL = "https://e-shop-backend-sage.vercel.app";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState(null);

  // Fetch users
  useEffect(() => {
    axios
      .post(`${API_URL}/get_admin_user`)
      .then((res) => {
        setUsers(res.data[0]);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  // Fetch roles
  useEffect(() => {
    axios
      .get(`${API_URL}/get_admin_role`)
      .then((res) => {
        setRoles(res.data);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      });
  }, []);

  // Fetch user roles
  const getUserRoles = (userId) => {
    return axios
      .get(`${API_URL}/get_user_roles/${userId}`)
      .then((res) => {
        return res.data.map((role) => role.roleName).join(", ");
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
        return "";
      });
  };

  // Update users with roles
  useEffect(() => {
    const fetchUserRoles = async () => {
      const updatedUsers = await Promise.all(
        users.map(async (user) => {
          const roles = await getUserRoles(user.userId);
          return { ...user, roles };
        })
      );
      setUsers(updatedUsers);
    };

    if (users.length > 0) {
      fetchUserRoles();
    }
  }, [users.length]);

  // Toggle user status
  const toggleButton = (userId, currentStatus) => {
    const updatedStatus = currentStatus === "Active" ? "Inactive" : "Active";

    setUsers(
      users.map((user) =>
        user.userId === userId ? { ...user, status: updatedStatus } : user
      )
    );

    axios
      .post(`${API_URL}/update_admin_user_status`, { userId, status: updatedStatus })
      .then((res) => {
        console.log("Status updated successfully", res.data);
      })
      .catch((error) => {
        setUsers(
          users.map((user) =>
            user.userId === userId ? { ...user, status: currentStatus } : user
          )
        );
      });
  };

  // Handle delete user
  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  // Handle role assignment
  const handleRoleChange = (userId, role) => {
    console.log('Assigning Role - userId:', userId, 'role:', role);
  
    axios
      .post(`${API_URL}/add_admin_role_assign`, { userId, role })
      .then((res) => {
        console.log("Role assigned successfully", res.data);
        // Update the local state to reflect the new role
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.userId === userId
              ? { ...user, roles: [...user.roles.split(", "), role] }
              : user
          )
        );
      })
      .catch((error) => {
        console.error("Error assigning role:", error);
      });
  
    setShowRoleModal(false);
  };

  // Handle role modal
  const handleRoleModal = (user) => {
    setSelectedUser(user);
    setShowRoleModal(true);
  };

  // Handle update user
  const handleUpdateUser = (user) => {
    setUserToUpdate(user);
    setShowUpdateModal(true);
  };

  // Update user in the state
  const onUpdateUser = (userId, updatedData) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.userId === userId ? { ...user, ...updatedData } : user
      )
    );
  };

  // Table component
  const Table = ({ users }) => {
    const columns = useMemo(
      () => [
        { Header: "User ID", accessor: "userId" },
        { Header: "User Name", accessor: "userName" },
        { Header: "Email", accessor: "email" },
        {
          Header: "Roles",
          accessor: "roles",
          Cell: ({ row, value }) => (
            <div className="">
              <span>{value}</span>
              <div className="block">
                <button
                  onClick={() => handleRoleModal(row.original)}
                  className="px-2 py-1 rounded-md bg-blue-500 text-white hover:text-gray-300"
                >
                  <FaPlus />
                </button>
              </div>
            </div>
          ),
        },
        {
          Header: "Status",
          accessor: "status",
          Cell: ({ row }) => (
            <div className="flex items-center">
              <label className="cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={row.original.status === "Active"}
                    onChange={() =>
                      toggleButton(row.original.userId, row.original.status)
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-12 h-7 rounded-full shadow-inner transition-all duration-300 ${
                      row.original.status === "Active"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <div
                    className={`dot absolute w-5 h-5 bg-white rounded-full shadow left-1 top-1 transition-all duration-300 ${
                      row.original.status === "Active" ? "transform translate-x-5" : ""
                    }`}
                    style={{ top: "0.25rem" }}
                  ></div>
                </div>
              </label>
            </div>
          ),
        },
        {
          Header: "Registered On",
          accessor: "Registred_at",
          Cell: ({ value }) => moment(value).format("DD/MM/YYYY"),
        },
        {
          Header: "Actions",
          Cell: ({ row }) => (
            <div className="flex gap-2">
              <button
                onClick={() => handleUpdateUser(row.original)}
                className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(row.original)}
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
      state: { pageIndex, pageSize, globalFilter },
      setGlobalFilter,
    } = useTable(
      {
        columns,
        data: users,
        initialState: { pageIndex: 0, pageSize: 10 },
      },
      useGlobalFilter,
      useSortBy,
      usePagination
    );

    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="mb-6 flex justify-between items-center">
          <input
            type="text"
            value={globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search users..."
            className="px-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <FaUserPlus className="mr-2" /> Add User
          </button>
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
    );
  };

  return (
    <div className="h-[89vh] bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">User Management</h1>
      {users.length > 0 ? (
        <Table users={users} />
      ) : (
        <div className="text-center text-gray-600">No users available</div>
      )}

      {/* Modals */}
      <AddUserModal
        showModal={showAddModal}
        setShowModal={setShowAddModal}
        setUsers={setUsers}
      />
      <DeleteUserModal
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        user={selectedUser}
        setUsers={setUsers}
      />
      <RoleAssignmentModal
        showModal={showRoleModal}
        setShowModal={setShowRoleModal}
        selectedUser={selectedUser}
        roles={roles}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        handleRoleChange={handleRoleChange}
      />
      <UserUpdateModal
        showModal={showUpdateModal}
        setShowModal={setShowUpdateModal}
        user={userToUpdate}
        onUpdate={onUpdateUser}
      />
    </div>
  );
}












































// import { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import moment from "moment";
// import { FaUserPlus, FaEdit, FaTrash } from "react-icons/fa";
// import { useTable, usePagination, useGlobalFilter, useSortBy } from "react-table";
// import AddUserModal from "./AddUserModal";
// import DeleteUserModal from "./DeleteUserModal";
// import RoleAssignmentModal from "./RoleAssignmentModal";
// import UserUpdateModal from "./UpdateUserModal";

// const API_URL = "http://localhost:5373";

// export default function Users() {
//   const [users, setUsers] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [selectedRole, setSelectedRole] = useState("");
//   const [showRoleModal, setShowRoleModal] = useState(false);
//   const [showUpdateModal, setShowUpdateModal] = useState(false); //
//   const [userToUpdate, setUserToUpdate] = useState(null);

//   // Fetch users
//   useEffect(() => {
//     axios
//       .post(`${API_URL}/get_admin_user`)
//       .then((res) => {
//         setUsers(res.data[0]);
//       })
//       .catch((error) => {
//         console.error("Error fetching users:", error);
//       });
//   }, []);

//   // Fetch roles
//   useEffect(() => {
//     axios
//       .get(`${API_URL}/get_admin_role`)
//       .then((res) => {
//         setRoles(res.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching roles:", error);
//       });
//   }, []);

//   // Fetch user roles
//   const getUserRoles = (userId) => {
//     return axios
//       .get(`${API_URL}/get_user_roles/${userId}`)
//       .then((res) => {
//         return res.data.map((role) => role.roleName).join(", ");
//       })
//       .catch((error) => {
//         console.error("Error fetching roles:", error);
//         return "";
//       });
//   };

//   // Update users with roles
//   useEffect(() => {
//     const fetchUserRoles = async () => {
//       const updatedUsers = await Promise.all(
//         users.map(async (user) => {
//           const roles = await getUserRoles(user.userId);
//           return { ...user, roles };
//         })
//       );
//       setUsers(updatedUsers);
//     };

//     if (users.length > 0) {
//       fetchUserRoles();
//     }
//   }, [users.length]);

//   // Toggle user status
//   const toggleButton = (userId, currentStatus) => {
//     const updatedStatus = currentStatus === "Active" ? "Inactive" : "Active";

//     setUsers(
//       users.map((user) =>
//         user.userId === userId ? { ...user, status: updatedStatus } : user
//       )
//     );

//     axios
//       .post(`${API_URL}/update_admin_user_status`, { userId, status: updatedStatus })
//       .then((res) => {
//         console.log("Status updated successfully", res.data);
//       })
//       .catch((error) => {
//         setUsers(
//           users.map((user) =>
//             user.userId === userId ? { ...user, status: currentStatus } : user
//           )
//         );
//       });
//   };

//   // Handle delete user
//   const handleDelete = (user) => {
//     setSelectedUser(user);
//     setShowDeleteModal(true);
//   };

//   // Handle role assignment
//   const handleRoleChange = (userId, role) => {
//     setUsers(
//       users.map((user) =>
//         user.userId === userId
//           ? { ...user, roles: [...user.roles.split(", "), role] }
//           : user
//       )
//     );

//     axios
//       .post(`${API_URL}/add_admin_role_assign`, { userId, role })
//       .then((res) => {
//         console.log("Role assigned successfully", res.data);
//       })
//       .catch((error) => {
//         console.error("Error assigning role:", error);
//       });

//     setShowRoleModal(false);
//   };

//   // Handle role modal
//   const handleRoleModal = (user) => {
//     setSelectedUser(user);
//     setShowRoleModal(true);
//   };

//   // Handle update user
//   const handleUpdateUser = (user) => {
//     setUserToUpdate(user);
//     setShowUpdateModal(true);
//   };

//   // Update user in the state
//   const onUpdateUser = (userId, updatedData) => {
//     setUsers((prevUsers) =>
//       prevUsers.map((user) =>
//         user.userId === userId ? { ...user, ...updatedData } : user
//       )
//     );
//   };

//   // Table component
//   const Table = ({ users }) => {
//     const columns = useMemo(
//       () => [
//         { Header: "User ID", accessor: "userId" },
//         { Header: "User Name", accessor: "userName" },
//         { Header: "Email", accessor: "email" },
//         {
//           Header: "Roles",
//           accessor: "roles",
//           Cell: ({ row, value }) => (
//             <div>
//               {value}
//               <button
//                 onClick={() => handleRoleModal(row.original)}
//                 className="text-blue-600 hover:text-blue-800 block"
//               >
//                 Assign Role
//               </button>
//             </div>
//           ),
//         },
//         {
//           Header: "Status",
//           accessor: "status",
//           Cell: ({ row }) => (
//             <label className="cursor-pointer">
//               <div className="relative">
//                 <input
//                   type="checkbox"
//                   checked={row.original.status === "Active"}
//                   onChange={() =>
//                     toggleButton(row.original.userId, row.original.status)
//                   }
//                   className="sr-only"
//                 />
//                 <div
//                   className={`w-12 h-7 rounded-full shadow-inner transition-all duration-300 ${
//                     row.original.status === "Active"
//                       ? "bg-green-500"
//                       : "bg-red-500"
//                   }`}
//                 ></div>
//                 <div
//                   className={`dot absolute w-5 h-5 bg-white rounded-full shadow left-1 top-1 transition-all duration-300 ${
//                     row.original.status === "Active" ? "transform translate-x-5" : ""
//                   }`}
//                   style={{ top: "0.25rem" }}
//                 ></div>
//               </div>
//             </label>
//           ),
//         },
//         {
//           Header: "Registered On",
//           accessor: "Registred_at",
//           Cell: ({ value }) => moment(value).format("DD/MM/YYYY"),
//         },
//         {
//           Header: "Action",
//           Cell: ({ row }) => (
//             <div className="flex gap-2">
//               <button
//                 onClick={() => handleUpdateUser(row.original)}
//                 className="px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm sm:text-base"
//               >
//                 <FaEdit />
//               </button>
//               <button
//                 onClick={() => handleDelete(row.original)}
//                 className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm sm:text-base"
//               >
//                 <FaTrash />
//               </button>
//             </div>
//           ),
//         },
//       ],
//       []
//     );

//     const {
//       getTableProps,
//       getTableBodyProps,
//       headerGroups,
//       prepareRow,
//       page,
//       canPreviousPage,
//       canNextPage,
//       pageOptions,
//       pageCount,
//       gotoPage,
//       nextPage,
//       previousPage,
//       setPageSize,
//       state: { pageIndex, pageSize, globalFilter },
//       setGlobalFilter,
//     } = useTable(
//       {
//         columns,
//         data: users,
//         initialState: { pageIndex: 0, pageSize: 10 },
//       },
//       useGlobalFilter,
//       useSortBy,
//       usePagination
//     );

//     return (
//       <div className="overflow-x-auto">
//         <div className="mb-4">
//           <input
//             type="text"
//             value={globalFilter || ""}
//             onChange={(e) => setGlobalFilter(e.target.value)}
//             placeholder="Search..."
//             className="px-4 py-2 border rounded-lg w-full max-w-md"
//           />
//         </div>
//         <div className="overflow-auto h-[calc(100vh-300px)] border border-gray-200 rounded-lg">
//           <table
//             {...getTableProps()}
//             className="min-w-full bg-white rounded-lg shadow-lg"
//           >
//             <thead className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-400 text-white">
//               {headerGroups.map((headerGroup) => (
//                 <tr {...headerGroup.getHeaderGroupProps()}>
//                   {headerGroup.headers.map((column) => (
//                     <th
//                       {...column.getHeaderProps()}
//                       className="px-4 py-3 text-left text-sm sm:text-base z-10"
//                     >
//                       {column.render("Header")}
//                     </th>
//                   ))}
//                 </tr>
//               ))}
//             </thead>
//             <tbody {...getTableBodyProps()}>
//               {page.map((row) => {
//                 prepareRow(row);
//                 return (
//                   <tr
//                     {...row.getRowProps()}
//                     className="text-gray-800 bg-gray-100 hover:bg-indigo-300"
//                   >
//                     {row.cells.map((cell) => (
//                       <td
//                         {...cell.getCellProps()}
//                         className="px-4 py-4 text-sm sm:text-base"
//                       >
//                         {cell.render("Cell")}
//                       </td>
//                     ))}
//                   </tr>
//                 );
//               })}
//             </tbody>
//             <tfoot className="sticky bottom-0 bg-white border-t border-gray-200">
//               <tr>
//                 <td colSpan={columns.length} className="px-4 py-3">
//                   <div className="flex justify-between items-center">
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => previousPage()}
//                         disabled={!canPreviousPage}
//                         className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
//                       >
//                         Previous
//                       </button>
//                       <button
//                         onClick={() => nextPage()}
//                         disabled={!canNextPage}
//                         className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
//                       >
//                         Next
//                       </button>
//                     </div>
//                     <div>
//                       <span>
//                         Page{" "}
//                         <strong>
//                           {pageIndex + 1} of {pageOptions.length}
//                         </strong>{" "}
//                       </span>
//                       <select
//                         value={pageSize}
//                         onChange={(e) => {
//                           setPageSize(Number(e.target.value));
//                         }}
//                         className="px-4 py-2 border rounded-lg"
//                       >
//                         {[10, 20, 30, 40, 50].map((size) => (
//                           <option key={size} value={size}>
//                             Show {size}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                 </td>
//               </tr>
//             </tfoot>
//           </table>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <>
//       <div className="container-fluid bg-slate-200 w-full h-[89.5vh] p-2 overflow-auto">
//         <h1 className="text-4xl text-center text-gray-700 font-semibold">Users</h1>
//         <div className="flex justify-start mb-4">
//           <button
//             onClick={() => setShowAddModal(true)}
//             className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
//           >
//             <FaUserPlus className="mr-2" /> Add User
//           </button>
//         </div>
//         {users.length > 0 ? (
//           <Table users={users} />
//         ) : (
//           <div className="text-center text-gray-600 text-sm sm:text-base">
//             No users available
//           </div>
//         )}
//       </div>

//       {/* Modals */}
//       <AddUserModal
//         showModal={showAddModal}
//         setShowModal={setShowAddModal}
//         setUsers={setUsers}
//       />
//       <DeleteUserModal
//         showModal={showDeleteModal}
//         setShowModal={setShowDeleteModal}
//         user={selectedUser}
//         setUsers={setUsers}
//       />
//       <RoleAssignmentModal
//         showModal={showRoleModal}
//         setShowModal={setShowRoleModal}
//         selectedUser={selectedUser}
//         roles={roles}
//         selectedRole={selectedRole}
//         setSelectedRole={setSelectedRole}
//         handleRoleChange={handleRoleChange}
//       />
//       <UserUpdateModal
//         showModal={showUpdateModal}
//         setShowModal={setShowUpdateModal}
//         user={userToUpdate}
//         onUpdate={onUpdateUser}
//       />
//     </>
//   );
// }



















































































// import { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import moment from "moment";
// import { FaUserPlus, FaEdit, FaTrash } from "react-icons/fa";
// import { useTable, usePagination, useGlobalFilter, useSortBy } from "react-table";
// import AddUserModal from "./AddUserModal";
// import DeleteUserModal from "./DeleteUserModal";
// import RoleAssignmentModal from "./RoleAssignmentModal";
// import UserUpdateModal from "./UpdateUserModal"; // Step 1: Import the UserUpdateModal

// const API_URL = "http://localhost:5373";

// export default function Users() {
//   const [users, setUsers] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [selectedRole, setSelectedRole] = useState("");
//   const [showRoleModal, setShowRoleModal] = useState(false);
  

//   // Step 2: Add state for UserUpdateModal
//   const [showUpdateModal, setShowUpdateModal] = useState(false);
//   const [userToUpdate, setUserToUpdate] = useState(null);

//   // Fetch users once on component mount
//   useEffect(() => {
//     axios
//       .post(`${API_URL}/get_admin_user`)
//       .then((res) => {
//         // console.log("Fetched users:", res.data[0]); // Debugging: Log fetched data
//         setUsers(res.data[0]);
//       })
//       .catch((error) => {
//         console.error("Error fetching users:", error);
//       });
//   }, []);

//   // Fetch roles once on component mount
//   useEffect(() => {
//     axios
//       .get(`${API_URL}/get_admin_role`)
//       .then((res) => {
//         // console.log("Fetched roles:", res.data); // Debugging: Log fetched roles
//         setRoles(res.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching roles:", error);
//       });
//   }, []);

//   // Fetch user roles separately and update users
//   const getUserRoles = (userId) => {
//     return axios
//       .get(`${API_URL}/get_user_roles/${userId}`)
//       .then((res) => {
//         return res.data.map((role) => role.roleName).join(", ");
//       })
//       .catch((error) => {
//         console.error("Error fetching roles:", error);
//         return "";
//       });
//   };

//   // After users are loaded, fetch their roles (runs only once when users are fetched)
//   useEffect(() => {
//     const fetchUserRoles = async () => {
//       const updatedUsers = await Promise.all(
//         users.map(async (user) => {
//           const roles = await getUserRoles(user.userId); // Fetch roles for each user
//           return { ...user, roles }; // Add roles to each user
//         })
//       );
//       // console.log("Updated users with roles:", updatedUsers); // Debugging: Log updated users
//       setUsers(updatedUsers); // Update the state with user data including roles
//     };

//     if (users.length > 0) {
//       fetchUserRoles(); // Fetch roles only after users are available
//     }
//   }, [users.length]); // Only run the effect when `users` array is initially populated

//   const toggleButton = (userId, currentStatus) => {
//     const updatedStatus = currentStatus === "Active" ? "Inactive" : "Active";

//     setUsers(
//       users.map((user) =>
//         user.userId === userId ? { ...user, status: updatedStatus } : user
//       )
//     );

//     axios
//       .post(`${API_URL}/update_admin_user_status`, { userId, status: updatedStatus })
//       .then((res) => {
//         console.log("Status updated successfully", res.data);
//       })
//       .catch((error) => {
//         setUsers(
//           users.map((user) =>
//             user.userId === userId ? { ...user, status: currentStatus } : user
//           )
//         );
//       });
//   };

//   const handleDelete = (user) => {
//     setSelectedUser(user);
//     setShowDeleteModal(true);
//   };

//   const handleRoleChange = (userId, role) => {
//     // Update role for the user in the UI
//     setUsers(
//       users.map((user) =>
//         user.userId === userId
//           ? { ...user, roles: [...user.roles.split(", "), role] }
//           : user
//       )
//     );

//     // Send the new role to the server
//     axios
//       .post(`${API_URL}/add_admin_role_assign`, { userId, role })
//       .then((res) => {
//         console.log("Role assigned successfully", res.data);
//       })
//       .catch((error) => {
//         console.error("Error assigning role:", error);
//       });

//     setShowRoleModal(false);
//   };

//   const handleRoleModal = (user) => {
//     setSelectedUser(user);
//     setShowRoleModal(true);
//   };

//   // Step 3: Add handler to open UserUpdateModal
//   const handleUpdateUser = (user) => {
//     setUserToUpdate(user);
//     setShowUpdateModal(true);
//   };

//   // Table component using react-table
//   const Table = ({ users, onEdit }) => {
//     const columns = useMemo(
//       () => [
//         {
//           Header: "User ID",
//           accessor: "userId",
//         },
//         {
//           Header: "User Name",
//           accessor: "userName",
//         },
//         {
//           Header: "Email",
//           accessor: "email",
//         },
//         {
//           Header: "Roles",
//           accessor: "roles",
//           Cell: ({ row, value }) => (
//             <div>
//               {value}
//               <button
//                 onClick={() => handleRoleModal(row.original)}
//                 className="text-blue-600 hover:text-blue-800 block"
//               >
//                 Assign Role
//               </button>
//             </div>
//           ),
//         },
//         {
//           Header: "Status",
//           accessor: "status",
//           Cell: ({ row }) => (
//             <label className="cursor-pointer">
//               <div className="relative">
//                 <input
//                   type="checkbox"
//                   checked={row.original.status === "Active"}
//                   onChange={() =>
//                     toggleButton(row.original.userId, row.original.status)
//                   }
//                   className="sr-only"
//                 />
//                 <div
//                   className={`w-12 h-7 rounded-full shadow-inner transition-all duration-300 ${
//                     row.original.status === "Active"
//                       ? "bg-green-500"
//                       : "bg-red-500"
//                   }`}
//                 ></div>
//                 <div
//                   className={`dot absolute w-5 h-5 bg-white rounded-full shadow left-1 top-1 transition-all duration-300 ${
//                     row.original.status === "Active" ? "transform translate-x-5" : ""
//                   }`}
//                   style={{ top: "0.25rem" }} // Fix: Adjust the top position
//                 ></div>
//               </div>
//             </label>
//           ),
//         },
//         {
//           Header: "Registered On",
//           accessor: "Registred_at",
//           Cell: ({ value }) => moment(value).format("DD/MM/YYYY"),
//         },
//         {
//           Header: "Action",
//           Cell: ({ row }) => (
//             <div className="flex gap-2">
//               {/* Step 3: Add onClick handler for the Edit button */}
//               <button
//                 onClick={() => handleUpdateUser(row.original)}
//                 className="px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm sm:text-base"
//               >
//                 <FaEdit />
//               </button>
//               <button
//                 onClick={() => handleDelete(row.original)}
//                 className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm sm:text-base"
//               >
//                 <FaTrash />
//               </button>
//             </div>
//           ),
//         },
//       ],
//       [onEdit]
//     );

//     const {
//       getTableProps,
//       getTableBodyProps,
//       headerGroups,
//       prepareRow,
//       page,
//       canPreviousPage,
//       canNextPage,
//       pageOptions,
//       pageCount,
//       gotoPage,
//       nextPage,
//       previousPage,
//       setPageSize,
//       state: { pageIndex, pageSize, globalFilter },
//       setGlobalFilter,
//     } = useTable(
//       {
//         columns,
//         data: users,
//         initialState: { pageIndex: 0, pageSize: 10 },
//       },
//       useGlobalFilter,
//       useSortBy,
//       usePagination
//     );

//     return (
//       <div className="overflow-x-auto">
//         {/* Search Input */}
//         <div className="mb-4">
//           <input
//             type="text"
//             value={globalFilter || ""}
//             onChange={(e) => setGlobalFilter(e.target.value)}
//             placeholder="Search..."
//             className="px-4 py-2 border rounded-lg w-full max-w-md"
//           />
//         </div>

//         {/* Table Container */}
//         <div className="overflow-auto h-[calc(100vh-300px)] border border-gray-200 rounded-lg">
//           <table
//             {...getTableProps()}
//             className="min-w-full bg-white rounded-lg shadow-lg"
//           >
//             <thead className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-400 text-white">
//               {headerGroups.map((headerGroup) => (
//                 <tr {...headerGroup.getHeaderGroupProps()}>
//                   {headerGroup.headers.map((column) => (
//                     <th
//                       {...column.getHeaderProps()}
//                       className="px-4 py-3 text-left text-sm sm:text-base"
//                     >
//                       {column.render("Header")}
//                     </th>
//                   ))}
//                 </tr>
//               ))}
//             </thead>
//             <tbody {...getTableBodyProps()}>
//               {page.map((row) => {
//                 prepareRow(row);
//                 return (
//                   <tr
//                     {...row.getRowProps()}
//                     className="text-gray-800 bg-gray-100 hover:bg-indigo-300"
//                   >
//                     {row.cells.map((cell) => (
//                       <td
//                         {...cell.getCellProps()}
//                         className="px-4 py-4 text-sm sm:text-base"
//                       >
//                         {cell.render("Cell")}
//                       </td>
//                     ))}
//                   </tr>
//                 );
//               })}
//             </tbody>

//             {/* Pagination Footer */}
//             <tfoot className="sticky bottom-0 bg-white border-t border-gray-200">
//               <tr>
//                 <td colSpan={columns.length} className="px-4 py-3">
//                   <div className="flex justify-between items-center">
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => previousPage()}
//                         disabled={!canPreviousPage}
//                         className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
//                       >
//                         Previous
//                       </button>
//                       <button
//                         onClick={() => nextPage()}
//                         disabled={!canNextPage}
//                         className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
//                       >
//                         Next
//                       </button>
//                     </div>
//                     <div>
//                       <span>
//                         Page{" "}
//                         <strong>
//                           {pageIndex + 1} of {pageOptions.length}
//                         </strong>{" "}
//                       </span>
//                       <select
//                         value={pageSize}
//                         onChange={(e) => {
//                           setPageSize(Number(e.target.value));
//                         }}
//                         className="px-4 py-2 border rounded-lg"
//                       >
//                         {[10, 20, 30, 40, 50].map((size) => (
//                           <option key={size} value={size}>
//                             Show {size}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                 </td>
//               </tr>
//             </tfoot>
//           </table>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <>
//       <div className="container-fluid bg-slate-200 w-full h-[89.5vh] p-2 overflow-auto">
//         <h1 className="text-4xl text-center text-gray-700 font-semibold">Users</h1>

//         {/* Add User Button */}
//         <div className="flex justify-start mb-4">
//           <button
//             onClick={() => setShowAddModal(true)}
//             className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
//           >
//             <FaUserPlus className="mr-2" /> Add User
//           </button>
//         </div>

//         {/* Render Table */}
//         {users.length > 0 ? (
//           <Table users={users} />
//         ) : (
//           <div className="text-center text-gray-600 text-sm sm:text-base">
//             No users available
//           </div>
//         )}
//       </div>

//       {/* Modals */}
//       <AddUserModal
//         showModal={showAddModal}
//         setShowModal={setShowAddModal}
//         setUsers={setUsers} />
//       <DeleteUserModal
//         showModal={showDeleteModal}
//         setShowModal={setShowDeleteModal}
//         user={selectedUser}
//         setUsers={setUsers} />
//       <RoleAssignmentModal
//         showModal={showRoleModal}
//         setShowModal={setShowRoleModal}
//         selectedUser={selectedUser}
//         roles={roles}
//         selectedRole={selectedRole}
//         setSelectedRole={setSelectedRole}
//         handleRoleChange={handleRoleChange} />

//       {/* Step 4: Render the UserUpdateModal */}
//       {showUpdateModal && (
//         <UserUpdateModal
//           userId={userToUpdate.userId}
//           onClose={() => setShowUpdateModal(false)}
//           user={selectedUser}
//           setUsers={setUsers}
//           onUpdate={handleUpdateUser}
//         />
//       )}
//     </>
//   );
// }
































































































































































































































































































































































































































































































































































































































































































































// import { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import moment from "moment";
// import { FaUserPlus, FaEdit, FaTrash } from "react-icons/fa";
// import { useTable, usePagination, useGlobalFilter, useSortBy } from "react-table";
// import AddUserModal from "./AddUserModal";
// import DeleteUserModal from "./DeleteUserModal";
// import RoleAssignmentModal from "./RoleAssignmentModal";

// const API_URL = "http://localhost:5373";

// export default function Users() {
//   const [users, setUsers] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [selectedRole, setSelectedRole] = useState("");
//   const [showRoleModal, setShowRoleModal] = useState(false);

//   // Fetch users once on component mount
//   useEffect(() => {
//     axios
//       .post(`${API_URL}/get_admin_user`)
//       .then((res) => {
//         console.log("Fetched users:", res.data[0]); // Debugging: Log fetched data
//         setUsers(res.data[0]);
//       })
//       .catch((error) => {
//         console.error("Error fetching users:", error);
//       });
//   }, []);

//   // Fetch roles once on component mount
//   useEffect(() => {
//     axios
//       .get(`${API_URL}/get_admin_role`)
//       .then((res) => {
//         console.log("Fetched roles:", res.data); // Debugging: Log fetched roles
//         setRoles(res.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching roles:", error);
//       });
//   }, []);

//   // Fetch user roles separately and update users
//   const getUserRoles = (userId) => {
//     return axios
//       .get(`${API_URL}/get_user_roles/${userId}`)
//       .then((res) => {
//         return res.data.map((role) => role.roleName).join(", ");
//       })
//       .catch((error) => {
//         console.error("Error fetching roles:", error);
//         return "";
//       });
//   };

//   // After users are loaded, fetch their roles (runs only once when users are fetched)
//   useEffect(() => {
//     const fetchUserRoles = async () => {
//       const updatedUsers = await Promise.all(
//         users.map(async (user) => {
//           const roles = await getUserRoles(user.userId); // Fetch roles for each user
//           return { ...user, roles }; // Add roles to each user
//         })
//       );
//       console.log("Updated users with roles:", updatedUsers); // Debugging: Log updated users
//       setUsers(updatedUsers); // Update the state with user data including roles
//     };

//     if (users.length > 0) {
//       fetchUserRoles(); // Fetch roles only after users are available
//     }
//   }, [users.length]); // Only run the effect when `users` array is initially populated

//   const toggleButton = (userId, currentStatus) => {
//     const updatedStatus = currentStatus === "Active" ? "Inactive" : "Active";

//     setUsers(
//       users.map((user) =>
//         user.userId === userId ? { ...user, status: updatedStatus } : user
//       )
//     );

//     axios
//       .post(`${API_URL}/update_admin_user_status`, { userId, status: updatedStatus })
//       .then((res) => {
//         console.log("Status updated successfully", res.data);
//       })
//       .catch((error) => {
//         setUsers(
//           users.map((user) =>
//             user.userId === userId ? { ...user, status: currentStatus } : user
//           )
//         );
//       });
//   };

//   const handleDelete = (user) => {
//     setSelectedUser(user);
//     setShowDeleteModal(true);
//   };

//   const handleRoleChange = (userId, role) => {
//     // Update role for the user in the UI
//     setUsers(
//       users.map((user) =>
//         user.userId === userId
//           ? { ...user, roles: [...user.roles.split(", "), role] }
//           : user
//       )
//     );

//     // Send the new role to the server
//     axios
//       .post(`${API_URL}/add_admin_role_assign`, { userId, role })
//       .then((res) => {
//         console.log("Role assigned successfully", res.data);
//       })
//       .catch((error) => {
//         console.error("Error assigning role:", error);
//       });

//     setShowRoleModal(false);
//   };

//   const handleRoleModal = (user) => {
//     setSelectedUser(user);
//     setShowRoleModal(true);
//   };

//   // Table component using react-table
//   const Table = ({ users }) => {
//     const columns = useMemo(
//       () => [
//         {
//           Header: "User ID",
//           accessor: "userId",
//         },
//         {
//           Header: "User Name",
//           accessor: "userName",
//         },
//         {
//           Header: "Email",
//           accessor: "email",
//         },
//         {
//           Header: "Roles",
//           accessor: "roles",
//           Cell: ({ row, value }) => (
//             <div>
//               {value}
//               <button
//                 onClick={() => handleRoleModal(row.original)}
//                 className="text-blue-600 hover:text-blue-800 block"
//               >
//                 Assign Role
//               </button>
//             </div>
//           ),
//         },
//         {
//           Header: "Status",
//           accessor: "status",
//           Cell: ({ row }) => (
//             <label className="cursor-pointer">
//               <div className="relative">
//                 <input
//                   type="checkbox"
//                   checked={row.original.status === "Active"}
//                   onChange={() =>
//                     toggleButton(row.original.userId, row.original.status)
//                   }
//                   className="sr-only"
//                 />
//                 <div
//                   className={`w-12 h-7 rounded-full shadow-inner transition-all duration-300 ${
//                     row.original.status === "Active"
//                       ? "bg-green-500"
//                       : "bg-red-500"
//                   }`}
//                 ></div>
//                 <div
//                   className={`dot absolute w-5 h-5 bg-white rounded-full shadow left-1 top-1 transition-all duration-300 ${
//                     row.original.status === "Active" ? "transform translate-x-5" : ""
//                   }`}
//                 ></div>
//               </div>
//             </label>
//           ),
//         },
//         {
//           Header: "Registered On",
//           accessor: "Registred_at",
//           Cell: ({ value }) => moment(value).format("DD/MM/YYYY"),
//         },
//         {
//           Header: "Action",
//           Cell: ({ row }) => (
//             <div className="flex gap-2">
//               <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm sm:text-base">
//                 <FaEdit />
//               </button>
//               <button
//                 onClick={() => handleDelete(row.original)}
//                 className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm sm:text-base"
//               >
//                 <FaTrash />
//               </button>
//             </div>
//           ),
//         },
//       ],
//       []
//     );

//     const {
//       getTableProps,
//       getTableBodyProps,
//       headerGroups,
//       prepareRow,
//       page,
//       canPreviousPage,
//       canNextPage,
//       pageOptions,
//       pageCount,
//       gotoPage,
//       nextPage,
//       previousPage,
//       setPageSize,
//       state: { pageIndex, pageSize, globalFilter },
//       setGlobalFilter,
//     } = useTable(
//       {
//         columns,
//         data: users,
//         initialState: { pageIndex: 0, pageSize: 10 },
//       },
//       useGlobalFilter,
//       useSortBy,
//       usePagination
//     );

//     return (
//       <div className="overflow-x-auto">
//         {/* Search Input */}
//         <div className="mb-4">
//           <input
//             type="text"
//             value={globalFilter || ""}
//             onChange={(e) => setGlobalFilter(e.target.value)}
//             placeholder="Search..."
//             className="px-4 py-2 border rounded-lg w-full max-w-md"
//           />
//         </div>

//         {/* Table Container */}
//         <div className="overflow-auto h-[calc(100vh-300px)] border border-gray-200 rounded-lg">
//           <table
//             {...getTableProps()}
//             className="min-w-full bg-white rounded-lg shadow-lg"
//           >
//             <thead className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-400 text-white">
//               {headerGroups.map((headerGroup) => (
//                 <tr {...headerGroup.getHeaderGroupProps()}>
//                   {headerGroup.headers.map((column) => (
//                     <th
//                       {...column.getHeaderProps()}
//                       className="px-4 py-3 text-left text-sm sm:text-base"
//                     >
//                       {column.render("Header")}
//                     </th>
//                   ))}
//                 </tr>
//               ))}
//             </thead>
//             <tbody {...getTableBodyProps()}>
//               {page.map((row) => {
//                 prepareRow(row);
//                 return (
//                   <tr
//                     {...row.getRowProps()}
//                     className="text-gray-800 bg-gray-100 hover:bg-indigo-300"
//                   >
//                     {row.cells.map((cell) => (
//                       <td
//                         {...cell.getCellProps()}
//                         className="px-4 py-4 text-sm sm:text-base"
//                       >
//                         {cell.render("Cell")}
//                       </td>
//                     ))}
//                   </tr>
//                 );
//               })}
//             </tbody>

//             {/* Pagination Footer */}
//             <tfoot className="sticky bottom-0 bg-white border-t border-gray-200">
//               <tr>
//                 <td colSpan={columns.length} className="px-4 py-3">
//                   <div className="flex justify-between items-center">
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => previousPage()}
//                         disabled={!canPreviousPage}
//                         className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
//                       >
//                         Previous
//                       </button>
//                       <button
//                         onClick={() => nextPage()}
//                         disabled={!canNextPage}
//                         className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
//                       >
//                         Next
//                       </button>
//                     </div>
//                     <div>
//                       <span>
//                         Page{" "}
//                         <strong>
//                           {pageIndex + 1} of {pageOptions.length}
//                         </strong>{" "}
//                       </span>
//                       <select
//                         value={pageSize}
//                         onChange={(e) => {
//                           setPageSize(Number(e.target.value));
//                         }}
//                         className="px-4 py-2 border rounded-lg"
//                       >
//                         {[10, 20, 30, 40, 50].map((size) => (
//                           <option key={size} value={size}>
//                             Show {size}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                 </td>
//               </tr>
//             </tfoot>
//           </table>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <>
//       <div className="container-fluid bg-slate-200 w-full h-[89.5vh] p-2 overflow-auto">
//         <h1 className="text-4xl text-center text-gray-700 font-semibold">Users</h1>

//         {/* Add User Button */}
//         <div className="flex justify-start mb-4">
//           <button
//             onClick={() => setShowAddModal(true)}
//             className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
//           >
//             <FaUserPlus className="mr-2" /> Add User
//           </button>
//         </div>

//         {/* Render Table */}
//         {users.length > 0 ? (
//           <Table users={users} />
//         ) : (
//           <div className="text-center text-gray-600 text-sm sm:text-base">
//             No users available
//           </div>
//         )}
//       </div>

//       {/* Modals */}
//       <AddUserModal
//         showModal={showAddModal}
//         setShowModal={setShowAddModal}
//         setUsers={setUsers}
//       />
//       <DeleteUserModal
//         showModal={showDeleteModal}
//         setShowModal={setShowDeleteModal}
//         user={selectedUser}
//         setUsers={setUsers}
//       />
//       <RoleAssignmentModal
//         showModal={showRoleModal}
//         setShowModal={setShowRoleModal}
//         selectedUser={selectedUser}
//         roles={roles}
//         selectedRole={selectedRole}
//         setSelectedRole={setSelectedRole}
//         handleRoleChange={handleRoleChange}
//       />
//     </>
//   );
// }









































































// import { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import moment from "moment";
// import { FaUserPlus, FaEdit, FaTrash } from "react-icons/fa";
// import { useTable, usePagination, useGlobalFilter, useSortBy } from "react-table";
// import AddUserModal from "./AddUserModal";
// import DeleteUserModal from "./DeleteUserModal";
// import RoleAssignmentModal from "./RoleAssignmentModal";

// const API_URL = "http://localhost:5373";

// export default function Users() {
//   const [users, setUsers] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [selectedRole, setSelectedRole] = useState("");
//   const [showRoleModal, setShowRoleModal] = useState(false);

//   // Fetch users once on component mount
//   useEffect(() => {
//     axios
//       .post(`${API_URL}/get_admin_user`)
//       .then((res) => {
//         console.log("Fetched users:", res.data[0]); // Debugging: Log fetched data
//         setUsers(res.data[0]);
//       })
//       .catch((error) => {
//         console.error("Error fetching users:", error);
//       });
//   }, []);

//   // Fetch roles once on component mount
//   useEffect(() => {
//     axios
//       .get(`${API_URL}/get_admin_role`)
//       .then((res) => {
//         console.log("Fetched roles:", res.data); // Debugging: Log fetched roles
//         setRoles(res.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching roles:", error);
//       });
//   }, []);

//   // Fetch user roles separately and update users
//   const getUserRoles = (userId) => {
//     return axios
//       .get(`${API_URL}/get_user_roles/${userId}`)
//       .then((res) => {
//         return res.data.map((role) => role.roleName).join(", ");
//       })
//       .catch((error) => {
//         console.error("Error fetching roles:", error);
//         return "";
//       });
//   };

//   // After users are loaded, fetch their roles (runs only once when users are fetched)
//   useEffect(() => {
//     const fetchUserRoles = async () => {
//       const updatedUsers = await Promise.all(
//         users.map(async (user) => {
//           const roles = await getUserRoles(user.userId); // Fetch roles for each user
//           return { ...user, roles }; // Add roles to each user
//         })
//       );
//       console.log("Updated users with roles:", updatedUsers); // Debugging: Log updated users
//       setUsers(updatedUsers); // Update the state with user data including roles
//     };

//     if (users.length > 0) {
//       fetchUserRoles(); // Fetch roles only after users are available
//     }
//   }, [users.length]); // Only run the effect when `users` array is initially populated

//   const toggleButton = (userId, currentStatus) => {
//     const updatedStatus = currentStatus === "Active" ? "Inactive" : "Active";

//     setUsers(
//       users.map((user) =>
//         user.userId === userId ? { ...user, status: updatedStatus } : user
//       )
//     );

//     axios
//       .post(`${API_URL}/update_admin_user_status`, { userId, status: updatedStatus })
//       .then((res) => {
//         console.log("Status updated successfully", res.data);
//       })
//       .catch((error) => {
//         setUsers(
//           users.map((user) =>
//             user.userId === userId ? { ...user, status: currentStatus } : user
//           )
//         );
//       });
//   };

//   const handleDelete = (user) => {
//     setSelectedUser(user);
//     setShowDeleteModal(true);
//   };

//   const handleRoleChange = (userId, role) => {
//     // Update role for the user in the UI
//     setUsers(
//       users.map((user) =>
//         user.userId === userId
//           ? { ...user, roles: [...user.roles.split(", "), role] }
//           : user
//       )
//     );

//     // Send the new role to the server
//     axios
//       .post(`${API_URL}/add_admin_role_assign`, { userId, role })
//       .then((res) => {
//         console.log("Role assigned successfully", res.data);
//       })
//       .catch((error) => {
//         console.error("Error assigning role:", error);
//       });

//     setShowRoleModal(false);
//   };

//   const handleRoleModal = (user) => {
//     setSelectedUser(user);
//     setShowRoleModal(true);
//   };

//   // Table component using react-table
//   const Table = ({ users }) => {
//     const columns = useMemo(
//       () => [
//         {
//           Header: "User ID",
//           accessor: "userId",
//         },
//         {
//           Header: "User Name",
//           accessor: "userName",
//         },
//         {
//           Header: "Email",
//           accessor: "email",
//         },
//         {
//           Header: "Roles",
//           accessor: "roles",
//           Cell: ({ row, value }) => (
//             <div>
//               {value}
//               <button
//                 onClick={() => handleRoleModal(row.original)}
//                 className="text-blue-600 hover:text-blue-800 block"
//               >
//                 Assign Role
//               </button>
//             </div>
//           ),
//         },
//         {
//           Header: "Status",
//           accessor: "status",
//           Cell: ({ row }) => (
//             <label className="cursor-pointer">
//               <div className="relative">
//                 <input
//                   type="checkbox"
//                   checked={row.original.status === "Active"}
//                   onChange={() =>
//                     toggleButton(row.original.userId, row.original.status)
//                   }
//                   className="sr-only"
//                 />
//                 <div
//                   className={`w-12 h-7 rounded-full shadow-inner transition-all duration-300 ${
//                     row.original.status === "Active"
//                       ? "bg-green-500"
//                       : "bg-red-500"
//                   }`}
//                 ></div>
//                 <div
//                   className={`dot absolute w-5 h-5 bg-white rounded-full shadow left-1 top-1 transition-all duration-300 ${
//                     row.original.status === "Active" ? "transform translate-x-5" : ""
//                   }`}
//                 ></div>
//               </div>
//             </label>
//           ),
//         },
//         {
//           Header: "Registered On",
//           accessor: "Registred_at",
//           Cell: ({ value }) => moment(value).format("DD/MM/YYYY"),
//         },
//         {
//           Header: "Action",
//           Cell: ({ row }) => (
//             <div className="flex gap-2">
//               <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm sm:text-base">
//                 <FaEdit />
//               </button>
//               <button
//                 onClick={() => handleDelete(row.original)}
//                 className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm sm:text-base"
//               >
//                 <FaTrash />
//               </button>
//             </div>
//           ),
//         },
//       ],
//       []
//     );

//     const {
//       getTableProps,
//       getTableBodyProps,
//       headerGroups,
//       prepareRow,
//       page,
//       canPreviousPage,
//       canNextPage,
//       pageOptions,
//       pageCount,
//       gotoPage,
//       nextPage,
//       previousPage,
//       setPageSize,
//       state: { pageIndex, pageSize, globalFilter },
//       setGlobalFilter,
//     } = useTable(
//       {
//         columns,
//         data: users,
//         initialState: { pageIndex: 0, pageSize: 10 },
//       },
//       useGlobalFilter,
//       useSortBy,
//       usePagination
//     );

//     return (
//       <div className="overflow-x-auto">
//         {/* Search Input */}
//         <div className="mb-4">
//           <input
//             type="text"
//             value={globalFilter || ""}
//             onChange={(e) => setGlobalFilter(e.target.value)}
//             placeholder="Search..."
//             className="px-4 py-2 border rounded-lg w-full max-w-md"
//           />
//         </div>

//         {/* Table */}
//         <div className="overflow-auto">
//           <table
//             {...getTableProps()}
//             className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden"
//           >
//             <thead className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-400 text-white">
//               {headerGroups.map((headerGroup) => (
//                 <tr {...headerGroup.getHeaderGroupProps()}>
//                   {headerGroup.headers.map((column) => (
//                     <th
//                       {...column.getHeaderProps()}
//                       className="px-4 py-3 text-left text-sm sm:text-base"
//                     >
//                       {column.render("Header")}
//                     </th>
//                   ))}
//                 </tr>
//               ))}
//             </thead>
//             <tbody {...getTableBodyProps()}>
//               {page.map((row) => {
//                 prepareRow(row);
//                 return (
//                   <tr
//                     {...row.getRowProps()}
//                     className="text-gray-800 bg-gray-100 hover:bg-indigo-300"
//                   >
//                     {row.cells.map((cell) => (
//                       <td
//                         {...cell.getCellProps()}
//                         className="px-4 py-4 text-sm sm:text-base"
//                       >
//                         {cell.render("Cell")}
//                       </td>
//                     ))}
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="flex justify-between items-center mt-4">
//           <div className="flex gap-2">
//             <button
//               onClick={() => previousPage()}
//               disabled={!canPreviousPage}
//               className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
//             >
//               Previous
//             </button>
//             <button
//               onClick={() => nextPage()}
//               disabled={!canNextPage}
//               className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
//             >
//               Next
//             </button>
//           </div>
//           <div>
//             <span>
//               Page{" "}
//               <strong>
//                 {pageIndex + 1} of {pageOptions.length}
//               </strong>{" "}
//             </span>
//             <select
//               value={pageSize}
//               onChange={(e) => {
//                 setPageSize(Number(e.target.value));
//               }}
//               className="px-4 py-2 border rounded-lg"
//             >
//               {[10, 20, 30, 40, 50].map((size) => (
//                 <option key={size} value={size}>
//                   Show {size}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <>
//       <div className="container-fluid bg-slate-200 w-full h-[89.5vh] p-2 overflow-auto">
//         <h1 className="text-4xl text-center text-gray-700 font-semibold">Users</h1>

//         {/* Add User Button */}
//         <div className="flex justify-start mb-4">
//           <button
//             onClick={() => setShowAddModal(true)}
//             className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
//           >
//             <FaUserPlus className="mr-2" /> Add User
//           </button>
//         </div>

//         {/* Render Table */}
//         {users.length > 0 ? (
//           <Table users={users} />
//         ) : (
//           <div className="text-center text-gray-600 text-sm sm:text-base">
//             No users available
//           </div>
//         )}
//       </div>

//       {/* Modals */}
//       <AddUserModal
//         showModal={showAddModal}
//         setShowModal={setShowAddModal}
//         setUsers={setUsers}
//       />
//       <DeleteUserModal
//         showModal={showDeleteModal}
//         setShowModal={setShowDeleteModal}
//         user={selectedUser}
//         setUsers={setUsers}
//       />
//       <RoleAssignmentModal
//         showModal={showRoleModal}
//         setShowModal={setShowRoleModal}
//         selectedUser={selectedUser}
//         roles={roles}
//         selectedRole={selectedRole}
//         setSelectedRole={setSelectedRole}
//         handleRoleChange={handleRoleChange}
//       />
//     </>
//   );
// }
















































































































































































































// import { useState, useEffect } from "react";
// import axios from "axios";
// import moment from "moment";
// import { FaUserPlus, FaEdit } from "react-icons/fa";
// import AddUserModal from "./AddUserModal";
// import DeleteUserModal from "./DeleteUserModal";
// import RoleAssignmentModal from "./RoleAssignmentModal";

// const API_URL = "http://localhost:5373";

// export default function Users() {
//   const [users, setUsers] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [selectedRole, setSelectedRole] = useState("");
//   const [showRoleModal, setShowRoleModal] = useState(false);

//   // Fetch users once on component mount
//   useEffect(() => {
//     axios.post(`${API_URL}/get_admin_user`)
//       .then((res) => {
//         setUsers(res.data[0]);
//       })
//       .catch((error) => {
//         console.error("Error fetching users:", error);
//       });
//   }, []);

//   // Fetch roles once on component mount
//   useEffect(() => {
//     axios.get(`${API_URL}/get_admin_role`)
//       .then((res) => {
//         setRoles(res.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching roles:", error);
//       });
//   }, []);

//   // Fetch user roles separately and update users
//   const getUserRoles = (userId) => {
//     return axios.get(`${API_URL}/get_user_roles/${userId}`)
//       .then((res) => {
//         return res.data.map(role => role.roleName).join(', ');
//       })
//       .catch((error) => {
//         console.error("Error fetching roles:", error);
//         return "";
//       });
//   };

//   // After users are loaded, fetch their roles (runs only once when users are fetched)
//   useEffect(() => {
//     const fetchUserRoles = async () => {
//       const updatedUsers = await Promise.all(
//         users.map(async (user) => {
//           const roles = await getUserRoles(user.userId); // Fetch roles for each user
//           return { ...user, roles }; // Add roles to each user
//         })
//       );
//       setUsers(updatedUsers); // Update the state with user data including roles
//     };

//     if (users.length > 0) {
//       fetchUserRoles(); // Fetch roles only after users are available
//     }
//   }, [users.length]); // Only run the effect when `users` array is initially populated

//   const toggleButton = (userId, currentStatus) => {
//     const updatedStatus = currentStatus === "Active" ? "Inactive" : "Active";

//     setUsers(
//       users.map((user) =>
//         user.userId === userId ? { ...user, status: updatedStatus } : user
//       )
//     );

//     axios.post(`${API_URL}/update_admin_user_status`, { userId, status: updatedStatus })
//       .then((res) => {
//         console.log("Status updated successfully", res.data);
//       })
//       .catch((error) => {
//         setUsers(
//           users.map((user) =>
//             user.userId === userId ? { ...user, status: currentStatus } : user
//           )
//         );
//       });
//   };

//   const handleDelete = (user) => {
//     setSelectedUser(user);
//     setShowDeleteModal(true);
//   };

//   const handleRoleChange = (userId, role) => {
//     // Update role for the user in the UI
//     setUsers(
//       users.map((user) =>
//         user.userId === userId ? { ...user, roles: [...user.roles.split(", "), role] } : user
//       )
//     );

//     // Send the new role to the server
//     axios.post(`${API_URL}/add_admin_role_assign`, { userId, role })
//       .then((res) => {
//         console.log("Role assigned successfully", res.data);
//       })
//       .catch((error) => {
//         console.error("Error assigning role:", error);
//       });

//     setShowRoleModal(false);
//   };

//   const handleRoleModal = (user) => {
//     setSelectedUser(user);
//     setShowRoleModal(true);
//   };

//   return (
//     <>
//       <div className="container-fluid bg-indigo-300 w-full h-[87vh] p-2 overflow-auto">
//         <h1 className="text-4xl text-center text-gray-700 font-semibold">Users</h1>

//         {/* Add User Button */}
//         <div className="flex justify-start mb-4">
//           <button onClick={() => setShowAddModal(true)} className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700">
//             <FaUserPlus className="mr-2" /> Add User
//           </button>
//         </div>

//         {/* Table Wrapper (Responsive) */}
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
//             <thead>
//               <tr className="bg-gradient-to-r from-blue-500 to-indigo-400 text-white">
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">User ID</th>
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">User Name</th>
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">Email</th>
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">Roles</th>
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">Status</th>
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">Registered On</th>
//                 <th className="px-4 py-3 text-center text-sm sm:text-base">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {users.length > 0 ? (
//                 users.map((user) => (
//                   <tr key={user.userId} className="text-gray-800 bg-gray-100 hover:bg-indigo-300">
//                     <td className="px-4 py-4 text-sm sm:text-base">{user.userId}</td>
//                     <td className="px-4 py-4 text-sm sm:text-base">{user.userName}</td>
//                     <td className="px-4 py-4 text-sm sm:text-base">{user.email}</td>

//                     <td className="px-4 py-4 text-sm sm:text-base">
//                       {user.roles}
//                       <button onClick={() => handleRoleModal(user)} className="text-blue-600 hover:text-blue-800 block">Assign Role</button>
//                     </td>
//                     <td className="px-4 py-4">
//                       <label className="cursor-pointer">
//                         <div className="relative">
//                           <input type="checkbox" checked={user.status === "Active"} onChange={() => toggleButton(user.userId, user.status)} className="sr-only"/>

//                           <div className={`w-12 h-7 rounded-full shadow-inner transition-all duration-300 ${user.status === "Active" ? "bg-green-500" : "bg-red-500"}`}></div>

//                           <div className={`dot absolute w-5 h-5 bg-white rounded-full shadow left-1 top-1 transition-all duration-300 ${user.status === "Active" ? "transform translate-x-5" : ""}`}></div>
//                         </div>
//                       </label>
//                     </td>

//                     <td className="px-4 py-4 text-sm sm:text-base">{moment(user.Registred_at).format("DD/MM/YYYY")}</td>

//                     <td className="px-4 py-4 flex gap-2 justify-center">
//                       <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm sm:text-base"><FaEdit /></button>
//                       <button onClick={() => handleDelete(user)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm sm:text-base">Delete</button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="px-4 py-4 text-center text-gray-600 text-sm sm:text-base">No users available</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Modals */}
//       <AddUserModal showModal={showAddModal} setShowModal={setShowAddModal} setUsers={setUsers} />
//       <DeleteUserModal showModal={showDeleteModal} setShowModal={setShowDeleteModal} user={selectedUser} setUsers={setUsers} />
//       <RoleAssignmentModal showModal={showRoleModal} setShowModal={setShowRoleModal} selectedUser={selectedUser} roles={roles} selectedRole={selectedRole} setSelectedRole={setSelectedRole} handleRoleChange={handleRoleChange}/>
//     </>
//   );
// }



























































































































































































































































































































































































































// // src/components/Users.jsx
// import { useState, useEffect } from "react";
// import axios from "axios";
// import moment from "moment";
// import { FaUserPlus } from "react-icons/fa";
// import AddUserModal from "./AddUserModal";
// import DeleteUserModal from "./DeleteUserModal";
// import RoleAssignmentModal from "./RoleAssignmentModal";

// const API_URL = "http://localhost:5373";

// export default function Users() {
//   const [users, setUsers] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showRoleModal, setShowRoleModal] = useState(false);

//   useEffect(() => {
//     // Fetch users
//     axios.post(`${API_URL}/get_user`)
//       .then((res) => {
//         setUsers(res.data[0]);
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });

//     // Fetch available roles
//     axios.get(`${API_URL}/get_admin_role`)
//       .then((res) => {
//         setRoles(res.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching roles:", error);
//       });
//   }, []);

//   // Handle role assignment API logic
//   const handleRoleAssign = (userId, role) => {
//     // Update role for the user in the UI
//     setUsers((prevUsers) =>
//       prevUsers.map((user) =>
//         user.userId === userId ? { ...user, roles: [...user.roles.split(", "), role] } : user
//       )
//     );

//     // Send the new role to the server
//     axios.post(`${API_URL}/assign_role_to_user`, { userId, role })
//       .then((res) => {
//         console.log("Role assigned successfully", res.data);
//       })
//       .catch((error) => {
//         console.error("Error assigning role:", error);
//       });
//   };

//   return (
//     <>
//       <div className="container-fluid bg-indigo-300 w-full h-[84.6vh] p-6 overflow-auto">
//         <h1 className="text-4xl text-center py-6 text-gray-700 font-semibold">Users</h1>

//         {/* Add User Button */}
//         <div className="flex justify-start mb-4">
//           <button onClick={() => setShowAddModal(true)} className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700">
//             <FaUserPlus className="mr-2" /> Add User
//           </button>
//         </div>

//         {/* Table Wrapper (Responsive) */}
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
//             <thead>
//               <tr className="bg-gradient-to-r from-blue-500 to-indigo-400 text-white">
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">User ID</th>
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">User Name</th>
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">Email</th>
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">Roles</th>
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">Status</th>
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">Registered On</th>
//                 <th className="px-4 py-3 text-center text-sm sm:text-base">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {users.length > 0 ? (
//                 users.map((user) => (
//                   <tr key={user.userId} className="text-gray-800 bg-gray-100 hover:bg-indigo-300">
//                     <td className="px-4 py-4 text-sm sm:text-base">{user.userId}</td>
//                     <td className="px-4 py-4 text-sm sm:text-base">{user.userName}</td>
//                     <td className="px-4 py-4 text-sm sm:text-base">{user.email}</td>
//                     <td className="px-4 py-4 text-sm sm:text-base">
//                       {user.roles || 'Loading roles...'}
//                       <button
//                         onClick={() => { setSelectedUser(user); setShowRoleModal(true); }}
//                         className="ml-2 text-blue-600 hover:text-blue-800"
//                       >
//                         Assign Role
//                       </button>
//                     </td>
//                     <td className="px-4 py-4">
//                       <label className="cursor-pointer">
//                         <div className="relative">
//                           <input
//                             type="checkbox"
//                             checked={user.status === "Active"}
//                             onChange={() => toggleButton(user.userId, user.status)}
//                             className="sr-only"
//                           />
//                           <div className={`w-12 h-7 rounded-full shadow-inner transition-all duration-300 ${user.status === "Active" ? "bg-green-500" : "bg-red-500"}`}></div>
//                           <div className={`dot absolute w-5 h-5 bg-white rounded-full shadow left-1 top-1 transition-all duration-300 ${user.status === "Active" ? "transform translate-x-5" : ""}`}></div>
//                         </div>
//                       </label>
//                     </td>
//                     <td className="px-4 py-4 text-sm sm:text-base">{moment(user.Registred_at).format("DD/MM/YYYY")}</td>

//                     <td className="px-4 py-4 flex gap-2 justify-center">
//                       <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm sm:text-base">
//                         Update
//                       </button>
//                       <button onClick={() => handleDelete(user)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm sm:text-base">
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="px-4 py-4 text-center text-gray-600 text-sm sm:text-base">
//                     No users available
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Modals */}
//       <AddUserModal showModal={showAddModal} setShowModal={setShowAddModal} setUsers={setUsers} />
//       <DeleteUserModal showModal={showDeleteModal} setShowModal={setShowDeleteModal} user={selectedUser} setUsers={setUsers} />
//       <RoleAssignmentModal showModal={showRoleModal} setShowModal={setShowRoleModal} selectedUser={selectedUser} roles={roles} onRoleAssign={handleRoleAssign}/>
//     </>
//   );
// }

























































































// import { useState, useEffect } from "react";
// import axios from "axios";
// import moment from "moment";
// import { FaUserPlus } from "react-icons/fa";
// import AddUserModal from "./AddUserModal";
// import DeleteUserModal from "./DeleteUserModal";

// const API_URL = "http://localhost:5373";

// export default function Users() {
//   const [users, setUsers] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [selectedRole, setSelectedRole] = useState("");
//   const [showRoleModal, setShowRoleModal] = useState(false);

//   useEffect(() => {
//     // Fetch users
//     axios.post(`${API_URL}/get_user`)
//       .then((res) => {
//         setUsers(res.data[0]);
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });

//     // Fetch available roles
//     axios.get(`${API_URL}/get_admin_role`)
//       .then((res) => {
//         setRoles(res.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching roles:", error);
//       });
//   }, []);

//   // Fetch user roles and update users
//   const getUserRoles = (userId) => {
//     return axios.get(`${API_URL}/get_user_roles/${userId}`)
//       .then((res) => {
//         return res.data.map(role => role.roleName).join(', ');
//       })
//       .catch((error) => {
//         console.error("Error fetching roles:", error);
//         return "";
//       });
//   };

//   useEffect(() => {
//     const fetchUserRoles = async () => {
//       const updatedUsers = await Promise.all(
//         users.map(async (user) => {
//           const roles = await getUserRoles(user.userId);
//           return { ...user, roles };
//         })
//       );
//       setUsers(updatedUsers);
//     };

//     if (users.length > 0) {
//       fetchUserRoles();
//     }
//   }, [users]);

//   const toggleButton = (userId, currentStatus) => {
//     const updatedStatus = currentStatus === "Active" ? "Inactive" : "Active";

//     setUsers(
//       users.map((user) =>
//         user.userId === userId ? { ...user, status: updatedStatus } : user
//       )
//     );

//     axios.post(`${API_URL}/update_admin_user_status`, { userId, status: updatedStatus })
//       .then((res) => {
//         console.log("Status updated successfully", res.data);
//       })
//       .catch((error) => {
//         setUsers(
//           users.map((user) =>
//             user.userId === userId ? { ...user, status: currentStatus } : user
//           )
//         );
//       });
//   };

//   const handleDelete = (user) => {
//     setSelectedUser(user);
//     setShowDeleteModal(true);
//   };

//   const handleRoleChange = (userId, role) => {
//     // Update role for the user in the UI
//     setUsers(
//       users.map((user) =>
//         user.userId === userId ? { ...user, roles: [...user.roles.split(", "), role] } : user
//       )
//     );

//     // Send the new role to the server
//     axios.post(`${API_URL}/assign_role_to_user`, { userId, role })
//       .then((res) => {
//         console.log("Role assigned successfully", res.data);
//       })
//       .catch((error) => {
//         console.error("Error assigning role:", error);
//       });

//     setShowRoleModal(false);
//   };

//   const handleRoleModal = (user) => {
//     setSelectedUser(user);
//     setShowRoleModal(true);
//   };

//   return (
//     <>
//       <div className="container-fluid bg-indigo-300 w-full h-[84.6vh] p-6 overflow-auto">
//         <h1 className="text-4xl text-center py-6 text-gray-700 font-semibold">Users</h1>

//         {/* Add User Button */}
//         <div className="flex justify-start mb-4">
//           <button onClick={() => setShowAddModal(true)} className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700">
//             <FaUserPlus className="mr-2" /> Add User
//           </button>
//         </div>

//         {/* Table Wrapper (Responsive) */}
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
//             <thead>
//               <tr className="bg-gradient-to-r from-blue-500 to-indigo-400 text-white">
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">User ID</th>
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">User Name</th>
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">Email</th>
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">Roles</th>
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">Status</th>
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">Registered On</th>
//                 <th className="px-4 py-3 text-center text-sm sm:text-base">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {users.length > 0 ? (
//                 users.map((user) => (
//                   <tr key={user.userId} className="text-gray-800 bg-gray-100 hover:bg-indigo-300">
//                     <td className="px-4 py-4 text-sm sm:text-base">{user.userId}</td>
//                     <td className="px-4 py-4 text-sm sm:text-base">{user.userName}</td>
//                     <td className="px-4 py-4 text-sm sm:text-base">{user.email}</td>
//                     <td className="px-4 py-4 text-sm sm:text-base">
//                       {user.roles || 'Loading roles...'}
//                       <button
//                         onClick={() => handleRoleModal(user)}
//                         className="ml-2 text-blue-600 hover:text-blue-800"
//                       >
//                         Assign Role
//                       </button>
//                     </td>
//                     <td className="px-4 py-4">
//                       <label className="cursor-pointer">
//                         <div className="relative">
//                           <input
//                             type="checkbox"
//                             checked={user.status === "Active"}
//                             onChange={() => toggleButton(user.userId, user.status)}
//                             className="sr-only"
//                           />
//                           <div className={`w-12 h-7 rounded-full shadow-inner transition-all duration-300 ${user.status === "Active" ? "bg-green-500" : "bg-red-500"}`}></div>
//                           <div className={`dot absolute w-5 h-5 bg-white rounded-full shadow left-1 top-1 transition-all duration-300 ${user.status === "Active" ? "transform translate-x-5" : ""}`}></div>
//                         </div>
//                       </label>
//                     </td>
//                     <td className="px-4 py-4 text-sm sm:text-base">{moment(user.Registred_at).format("DD/MM/YYYY")}</td>

//                     <td className="px-4 py-4 flex gap-2 justify-center">
//                       <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm sm:text-base">
//                         Update
//                       </button>
//                       <button onClick={() => handleDelete(user)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm sm:text-base">
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="px-4 py-4 text-center text-gray-600 text-sm sm:text-base">
//                     No users available
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Modals */}
//       <AddUserModal showModal={showAddModal} setShowModal={setShowAddModal} setUsers={setUsers} />
//       <DeleteUserModal showModal={showDeleteModal} setShowModal={setShowDeleteModal} user={selectedUser} setUsers={setUsers} />

//       {/* Role Assignment Modal */}
//       {showRoleModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg">
//             <h2 className="text-xl font-semibold">Assign Role to {selectedUser.userName}</h2>
//             <select
//               value={selectedRole}
//               onChange={(e) => setSelectedRole(e.target.value)}
//               className="w-full px-4 py-2 border rounded-lg mt-4"
//             >
//               <option value="">Select Role</option>
//               {roles.map((role) => (
//                 <option key={role.roleId} value={role.roleName}>
//                   {role.roleName}
//                 </option>
//               ))}
//             </select>
//             <div className="mt-4 flex justify-between">
//               <button
//                 onClick={() => setShowRoleModal(false)}
//                 className="bg-gray-500 text-white px-4 py-2 rounded-lg"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => handleRoleChange(selectedUser.userId, selectedRole)}
//                 className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//               >
//                 Assign Role
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }


































































































// import { useState, useEffect } from "react";
// import axios from "axios";
// import moment from "moment";
// import { FaUserPlus } from "react-icons/fa";
// import AddUserModal from "./AddUserModal";
// import DeleteUserModal from "./DeleteUserModal";

// const API_URL = "http://localhost:5373";

// export default function Users() {
//   const [users, setUsers] = useState([]);
//   const [roles, setRoles] = useState([]); // Store available roles
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [selectedRole, setSelectedRole] = useState(""); // For role assignment
//   const [showRoleModal, setShowRoleModal] = useState(false); // Show role assignment modal

//   useEffect(() => {
//     // Fetch users
//     axios.post(`${API_URL}/get_user`)
//       .then((res) => {
//         setUsers(res.data[0]);
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });

//     // Fetch available roles
//     axios.get(`${API_URL}/get_admin_role_assign`)
//       .then((res) => {
//         setRoles(res.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching roles:", error);
//       });
//   }, []);

//   // Fetch user roles and update users
//   const getUserRoles = (userId) => {
//     return axios.get(`${API_URL}/get_user_roles/${userId}`)
//       .then((res) => {
//         return res.data.map(role => role.roleName).join(', ');
//       })
//       .catch((error) => {
//         console.error("Error fetching roles:", error);
//         return "";
//       });
//   };

//   useEffect(() => {
//     const fetchUserRoles = async () => {
//       const updatedUsers = await Promise.all(
//         users.map(async (user) => {
//           const roles = await getUserRoles(user.userId);
//           return { ...user, roles };
//         })
//       );
//       setUsers(updatedUsers);
//     };

//     if (users.length > 0) {
//       fetchUserRoles();
//     }
//   }, [users]);

//   const toggleButton = (userId, currentStatus) => {
//     const updatedStatus = currentStatus === "Active" ? "Inactive" : "Active";

//     setUsers(
//       users.map((user) =>
//         user.userId === userId ? { ...user, status: updatedStatus } : user
//       )
//     );

//     axios.post(`${API_URL}/update_admin_user_status`, { userId, status: updatedStatus })
//       .then((res) => {
//         console.log("Status updated successfully", res.data);
//       })
//       .catch((error) => {
//         setUsers(
//           users.map((user) =>
//             user.userId === userId ? { ...user, status: currentStatus } : user
//           )
//         );
//       });
//   };

//   const handleDelete = (user) => {
//     setSelectedUser(user);
//     setShowDeleteModal(true);
//   };

//   const handleRoleChange = (userId, role) => {
//     // Update role for the user in the UI
//     setUsers(
//       users.map((user) =>
//         user.userId === userId ? { ...user, roles: [...user.roles.split(", "), role] } : user
//       )
//     );

//     // Send the new role to the server
//     axios.post(`${API_URL}/assign_role_to_user`, { userId, role })
//       .then((res) => {
//         console.log("Role assigned successfully", res.data);
//       })
//       .catch((error) => {
//         console.error("Error assigning role:", error);
//       });

//     setShowRoleModal(false);
//   };

//   const handleRoleModal = (user) => {
//     setSelectedUser(user);
//     setShowRoleModal(true);
//   };

//   return (
//     <>
//       <div className="container-fluid bg-indigo-300 w-full h-[84.6vh] p-6 overflow-auto">
//         <h1 className="text-4xl text-center py-6 text-gray-700 font-semibold">Users</h1>

//         {/* Add User Button */}
//         <div className="flex justify-start mb-4">
//           <button onClick={() => setShowAddModal(true)} className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700">
//             <FaUserPlus className="mr-2" /> Add User
//           </button>
//         </div>

//         {/* Table Wrapper (Responsive) */}
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
//             <thead>
//               <tr className="bg-gradient-to-r from-blue-500 to-indigo-400 text-white">
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">User ID</th>
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">User Name</th>
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">Email</th>
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">Roles</th>
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">Status</th>
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">Registered On</th>
//                 <th className="px-4 py-3 text-center text-sm sm:text-base">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {users.length > 0 ? (
//                 users.map((user) => (
//                   <tr key={user.userId} className="text-gray-800 bg-gray-100 hover:bg-indigo-300">
//                     <td className="px-4 py-4 text-sm sm:text-base">{user.userId}</td>
//                     <td className="px-4 py-4 text-sm sm:text-base">{user.userName}</td>
//                     <td className="px-4 py-4 text-sm sm:text-base">{user.email}</td>
//                     <td className="px-4 py-4 text-sm sm:text-base flex">
//                       {user.roles}
//                       <button
//                         onClick={() => handleRoleModal(user)}
//                         className="ml-2 text-blue-600 hover:text-blue-800">
//                         Assign Role</button>
//                     </td>
//                     <td className="px-4 py-4">
//                       <label className="cursor-pointer">
//                         <div className="relative">
//                           <input
//                             type="checkbox"
//                             checked={user.status === "Active"}
//                             onChange={() => toggleButton(user.userId, user.status)}
//                             className="sr-only"
//                           />
//                           <div className={`w-12 h-7 rounded-full shadow-inner transition-all duration-300 ${user.status === "Active" ? "bg-green-500" : "bg-red-500"}`}></div>
//                           <div className={`dot absolute w-5 h-5 bg-white rounded-full shadow left-1 top-1 transition-all duration-300 ${user.status === "Active" ? "transform translate-x-5" : ""}`}></div>
//                         </div>
//                       </label>
//                     </td>
//                     <td className="px-4 py-4 text-sm sm:text-base">{moment(user.Registred_at).format("DD/MM/YYYY")}</td>

//                     <td className="px-4 py-4 flex gap-2 justify-center">
//                       <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm sm:text-base">
//                         Update
//                       </button>
//                       <button onClick={() => handleDelete(user)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm sm:text-base">
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="px-4 py-4 text-center text-gray-600 text-sm sm:text-base">
//                     No users available
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Modals */}
//       <AddUserModal showModal={showAddModal} setShowModal={setShowAddModal} setUsers={setUsers} />
//       <DeleteUserModal showModal={showDeleteModal} setShowModal={setShowDeleteModal} user={selectedUser} setUsers={setUsers} />

//       {/* Role Assignment Modal */}
//       {showRoleModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg">
//             <h2 className="text-xl font-semibold">Assign Role to {selectedUser?.userName}</h2>
//             <select
//               value={selectedRole}
//               onChange={(e) => setSelectedRole(e.target.value)}
//               className="mt-4 p-2 border rounded-md"
//             >
//               <option value="">Select Role</option>
//               {roles.map((role) => (
//                 <option key={role.roleId} value={role.roleName}>
//                   {role.roleName}
//                 </option>
//               ))}
//             </select>
//             <div className="mt-4 flex gap-4">
//               <button
//                 onClick={() => handleRoleChange(selectedUser.userId, selectedRole)}
//                 className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
//               >
//                 Assign Role
//               </button>
//               <button
//                 onClick={() => setShowRoleModal(false)}
//                 className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }




















































































// import { useState, useEffect } from "react";
// import axios from "axios";
// import moment from "moment";
// import { FaUserPlus } from "react-icons/fa";
// import AddUserModal from "./AddUserModal";
// import DeleteUserModal from "./DeleteUserModal";

// const API_URL = "http://localhost:5373";

// export default function Users() {
//   const [users, setUsers] = useState([]);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);

//   useEffect(() => {
//     // Fetch users
//     axios.post(`${API_URL}/get_user`)
//       .then((res) => {
//         setUsers(res.data[0]);
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   }, []);

//   // Fetch user roles and update users
//   const getUserRoles = (userId) => {
//     return axios.get(`${API_URL}/get_user_roles/${userId}`)
//       .then((res) => {
//         return res.data.map(role => role.roleName).join(', ');
//       })
//       .catch((error) => {
//         console.error("Error fetching roles:", error);
//         return "";
//       });
//   };

//   useEffect(() => {
//     const fetchUserRoles = async () => {
//       const updatedUsers = await Promise.all(
//         users.map(async (user) => {
//           const roles = await getUserRoles(user.userId);
//           return { ...user, roles };
//         })
//       );
//       setUsers(updatedUsers);
//     };

//     if (users.length > 0) {
//       fetchUserRoles();
//     }
//   }, [users]);

//   const toggleButton = (userId, currentStatus) => {
//     const updatedStatus = currentStatus === "Active" ? "Inactive" : "Active";

//     setUsers(
//       users.map((user) =>
//         user.userId === userId ? { ...user, status: updatedStatus } : user
//       )
//     );

//     axios.post(`${API_URL}/update_admin_user_status`, { userId, status: updatedStatus })
//       .then((res) => {
//         console.log("Status updated successfully", res.data);
//       })
//       .catch((error) => {
//         setUsers(
//           users.map((user) =>
//             user.userId === userId ? { ...user, status: currentStatus } : user
//           )
//         );
//       });
//   };

//   const handleDelete = (user) => {
//     setSelectedUser(user);
//     setShowDeleteModal(true);
//   };

//   return (
//     <>
//       <div className="container-fluid bg-indigo-300 w-full h-[84.6vh] p-6 overflow-auto">
//         <h1 className="text-4xl text-center py-6 text-gray-700 font-semibold">Users</h1>

//         {/* Add User Button */}
//         <div className="flex justify-start mb-4">
//           <button onClick={() => setShowAddModal(true)} className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700">
//             <FaUserPlus className="mr-2" /> Add User
//           </button>
//         </div>

//         {/* Table Wrapper (Responsive) */}
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
//             <thead>
//               <tr className="bg-gradient-to-r from-blue-500 to-indigo-400 text-white">
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">User ID</th>
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">User Name</th>
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">Email</th>
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">Roles</th>
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">Status</th>
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">Registered On</th>
//                 <th className="px-4 py-3 text-center text-sm sm:text-base">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {users.length > 0 ? (
//                 users.map((user) => (
//                   <tr key={user.userId} className="text-gray-800 bg-gray-100 hover:bg-indigo-300">
//                     <td className="px-4 py-4 text-sm sm:text-base">{user.userId}</td>
//                     <td className="px-4 py-4 text-sm sm:text-base">{user.userName}</td>
//                     <td className="px-4 py-4 text-sm sm:text-base">{user.email}</td>
//                     <td className="px-4 py-4 text-sm sm:text-base">{user.roles}</td>
//                     <td className="px-4 py-4">
//                       <label className="cursor-pointer">
//                         <div className="relative">
//                           <input
//                             type="checkbox"
//                             checked={user.status === "Active"}
//                             onChange={() => toggleButton(user.userId, user.status)}
//                             className="sr-only"
//                           />
//                           <div className={`w-12 h-7 rounded-full shadow-inner transition-all duration-300 ${user.status === "Active" ? "bg-green-500" : "bg-red-500"}`}></div>
//                           <div className={`dot absolute w-5 h-5 bg-white rounded-full shadow left-1 top-1 transition-all duration-300 ${user.status === "Active" ? "transform translate-x-5" : ""}`}></div>
//                         </div>
//                       </label>
//                     </td>
//                     <td className="px-4 py-4 text-sm sm:text-base">{moment(user.Registred_at).format("DD/MM/YYYY")}</td>

//                     <td className="px-4 py-4 flex gap-2 justify-center">
//                       <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm sm:text-base">
//                         Update
//                       </button>
//                       <button onClick={() => handleDelete(user)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm sm:text-base">
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="px-4 py-4 text-center text-gray-600 text-sm sm:text-base">
//                     No users available
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Modals */}
//       <AddUserModal showModal={showAddModal} setShowModal={setShowAddModal} setUsers={setUsers} />
//       <DeleteUserModal showModal={showDeleteModal} setShowModal={setShowDeleteModal} user={selectedUser} setUsers={setUsers} />
//     </>
//   );
// }
















































































// import { useState, useEffect } from "react";
// import axios from "axios";
// import moment from "moment";
// import { FaUserPlus } from "react-icons/fa";
// import AddUserModal from "./AddUserModal";
// import DeleteUserModal from "./DeleteUserModal";

// const API_URL = "http://localhost:5373";

// export default function Users() {
//   const [users, setUsers] = useState([]);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);

//   useEffect(() => {
//     // Fetch users
//     axios.post(`${API_URL}/get_user`)
//       .then((res) => {
//         setUsers(res.data[0]);
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   }, []);

//   // Fetch user roles dynamically
//   const getUserRoles = (userId) => {
//     axios.get(`${API_URL}/get_user_roles/${userId}`)
//       .then((res) => {
//         return res.data.map(role => role.roleName).join(', ');
//       })
//       .catch((error) => {
//         console.error("Error fetching roles:", error);
//         return "";
//       });
//   };

//   const toggleButton = (userId, currentStatus) => {
//     const updatedStatus = currentStatus === "Active" ? "Inactive" : "Active";

//     setUsers(
//       users.map((user) =>
//         user.userId === userId ? { ...user, status: updatedStatus } : user
//       )
//     );

//     axios.post(`${API_URL}/update_admin_user_status`, { userId, status: updatedStatus })
//       .then((res) => {
//         console.log("Status updated successfully", res.data);
//       })
//       .catch((error) => {
//         setUsers(
//           users.map((user) =>
//             user.userId === userId ? { ...user, status: currentStatus } : user
//           )
//         );
//       });
//   };

//   const handleDelete = (user) => {
//     setSelectedUser(user);
//     setShowDeleteModal(true);
//   };

//   return (
//     <>
//       <div className="container-fluid bg-indigo-300 w-full h-[84.6vh] p-6 overflow-auto">
//         <h1 className="text-4xl text-center py-6 text-gray-700 font-semibold">Users</h1>

//         {/* Add User Button */}
//         <div className="flex justify-start mb-4">
//           <button onClick={() => setShowAddModal(true)} className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700">
//             <FaUserPlus className="mr-2" /> Add User
//           </button>
//         </div>

//         {/* Table Wrapper (Responsive) */}
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
//             <thead>
//               <tr className="bg-gradient-to-r from-blue-500 to-indigo-400 text-white">
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">User ID</th>
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">User Name</th>
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">Email</th>
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">Roles</th> {/* Dynamic role column */}
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">Status</th>
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">Registered On</th>
//                 <th className="px-4 py-3 text-center text-sm sm:text-base">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {users.length > 0 ? (
//                 users.map((user) => (
//                   <tr key={user.userId} className="text-gray-800 bg-gray-100 hover:bg-indigo-300">
//                     <td className="px-4 py-4 text-sm sm:text-base">{user.userId}</td>
//                     <td className="px-4 py-4 text-sm sm:text-base">{user.userName}</td>
//                     <td className="px-4 py-4 text-sm sm:text-base">{user.email}</td>
//                     <td className="px-4 py-4 text-sm sm:text-base">{getUserRoles(user.userId)}</td>
//                     <td className="px-4 py-4">
//                       <label className="cursor-pointer">
//                         <div className="relative">
//                           <input
//                             type="checkbox"
//                             checked={user.status === "Active"}
//                             onChange={() => toggleButton(user.userId, user.status)}
//                             className="sr-only"
//                           />
//                           <div className={`w-12 h-7 rounded-full shadow-inner transition-all duration-300 ${user.status === "Active" ? "bg-green-500" : "bg-red-500"}`}></div>
//                           <div className={`dot absolute w-5 h-5 bg-white rounded-full shadow left-1 top-1 transition-all duration-300 ${user.status === "Active" ? "transform translate-x-5" : ""}`}></div>
//                         </div>
//                       </label>
//                     </td>
//                     <td className="px-4 py-4 text-sm sm:text-base">{moment(user.Registred_at).format("DD/MM/YYYY")}</td>

//                     <td className="px-4 py-4 flex gap-2 justify-center">
//                       <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm sm:text-base">
//                         Update
//                       </button>
//                       <button onClick={() => handleDelete(user)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm sm:text-base">
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="px-4 py-4 text-center text-gray-600 text-sm sm:text-base">
//                     No users available
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Modals */}
//       <AddUserModal showModal={showAddModal} setShowModal={setShowAddModal} setUsers={setUsers} />
//       <DeleteUserModal showModal={showDeleteModal} setShowModal={setShowDeleteModal} user={selectedUser} setUsers={setUsers} />
//     </>
//   );
// }



























































































// import { useState, useEffect } from "react";
// import axios from "axios";
// import moment from "moment";
// import { FaUserPlus } from "react-icons/fa";
// import AddUserModal from "./AddUserModal";
// import DeleteUserModal from "./DeleteUserModal";
// // import UpdateUserModal from "./UpdateUserModal"

// const API_URL = "http://localhost:5373";

// export default function Users() {
//   const [users, setUsers] = useState([]);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [showUpdateModal, setShowUpdateModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);

//   useEffect(() => {
//     axios.post(`${API_URL}/get_user`)
//       .then((res) => {
//         setUsers(res.data[0]);
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   }, []);
 
//   useEffect(() => {})

//   const toggleButton = (userId, currentStatus) => {
//     const updatedStatus = currentStatus === "Active" ? "Inactive" : "Active";

//     setUsers(
//       users.map((user) =>
//         user.userId === userId ? { ...user, status: updatedStatus } : user
//       )
//     );

//     axios.post(`${API_URL}/update_admin_user_status`, { userId, status: updatedStatus })
//       .then((res) => {
//         console.log("Status updated successfully", res.data);
//       })
//       .catch((error) => {
//         setUsers(
//           users.map((user) =>
//             user.userId === userId ? { ...user, status: currentStatus } : user
//           )
//         );
//       });
//   };

//   // const handleUpdate = (user) => {
//   //   setSelectedUser(user);
//   //   setShowUpdateModal(true);
//   // };

//   const handleDelete = (user) => {
//     setSelectedUser(user);
//     setShowDeleteModal(true);
//   };

//   return (
//     <>
//       <div className="container-fluid bg-indigo-300 w-full h-[84.6vh] p-6 overflow-auto">
//         <h1 className="text-4xl text-center py-6 text-gray-700 font-semibold">Users</h1>

//         {/* Add User Button */}
//         <div className="flex justify-start mb-4">
//           <button onClick={() => setShowAddModal(true)} className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700">
//             <FaUserPlus className="mr-2" /> Add User</button>
//         </div>

//         {/* Table Wrapper (Responsive) */}
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
//             <thead>
//               <tr className="bg-gradient-to-r from-blue-500 to-indigo-400 text-white">
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">User ID</th>
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">User Name</th>
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">Email</th>
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">Role</th>
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">Status</th>
//                 <th className="px-4 py-3 text-left text-sm sm:text-base">Registered On</th>
//                 <th className="px-4 py-3 text-center text-sm sm:text-base">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {users.length > 0 ? (
//                 users.map((user) => (
//                   <tr key={user.userId} className="text-gray-800 bg-gray-100 hover:bg-indigo-300">
//                     <td className="px-4 py-4 text-sm sm:text-base">{user.userId}</td>
//                     <td className="px-4 py-4 text-sm sm:text-base">{user.userName}</td>
//                     <td className="px-4 py-4 text-sm sm:text-base">{user.email}</td>
//                     <td className="px-4 py-4 text-sm sm:text-base"></td>

//                     <td className="px-4 py-4">
//                       <label className="cursor-pointer">
//                         <div className="relative">
//                           <input
//                             type="checkbox"
//                             checked={user.status === "Active"}
//                             onChange={() => toggleButton(user.userId, user.status)}
//                             className="sr-only"/>

//                           <div className={`w-12 h-7 rounded-full shadow-inner transition-all duration-300 ${user.status === "Active" ? "bg-green-500" : "bg-red-500"}`}></div>
//                           <div className={`dot absolute w-5 h-5 bg-white rounded-full shadow left-1 top-1 transition-all duration-300 ${user.status === "Active" ? "transform translate-x-5" : ""}`}></div>
//                         </div>
//                       </label>
//                     </td>

//                     <td className="px-4 py-4 text-sm sm:text-base">{moment(user.Registred_at).format("DD/MM/YYYY")}</td>

//                     <td className="px-4 py-4 flex gap-2 justify-center">
//                       {/* <button onClick={() => handleUpdate(user)} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm sm:text-base">
//                         Update
//                       </button> */}
//                       <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm sm:text-base">Update</button>
//                       <button onClick={() => handleDelete(user)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm sm:text-base">Delete</button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" className="px-4 py-4 text-center text-gray-600 text-sm sm:text-base">No users available</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Modals */}
//       <AddUserModal showModal={showAddModal} setShowModal={setShowAddModal} setUsers={setUsers} />
//       <DeleteUserModal showModal={showDeleteModal} setShowModal={setShowDeleteModal} user={selectedUser} setUsers={setUsers} />
//       {/* <UpdateUserModal showModal={showUpdateModal} setShowModal={setShowUpdateModal} user={selectedUser} setUsers={setUsers} /> */}
//     </>
//   );
// }











































































































































































// import { useState, useEffect } from "react";
// import axios from "axios";
// import moment from "moment";
// import { FaUserPlus } from "react-icons/fa";
// import AddUserModal from "./AddUserModal";
// // import UpdateUserModal from "./UpdateUserModal";
// import DeleteUserModal from "./DeleteUserModal";

// const API_URL = "http://localhost:5373";

// export default function Users() {
//   const [users, setUsers] = useState([]);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showUpdateModal, setShowUpdateModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);

//   useEffect(() => {
//     axios.post(`${API_URL}/get_user`)
//       .then((res) => {
//         setUsers(res.data[0]);
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   }, []);

//   const toggleButton = (userId, currentStatus) => {
//     const updatedStatus = currentStatus === "Active" ? "Inactive" : "Active";

//     setUsers(
//       users.map((user) =>
//         user.userId === userId ? { ...user, status: updatedStatus } : user
//       )
//     );

//     axios.post(`${API_URL}/update_admin_user_status`, { userId, status: updatedStatus })
//       .then((res) => {
//         console.log("Status updated successfully", res.data);
//       })
//       .catch((error) => {
//         setUsers(
//           users.map((user) =>
//             user.userId === userId ? { ...user, status: currentStatus } : user
//           )
//         );
//       });
//   };

//   const handleUpdate = (user) => {
//     setSelectedUser(user);
//     setShowUpdateModal(true);
//   };

//   const handleDelete = (user) => {
//     setSelectedUser(user);
//     setShowDeleteModal(true);
//   };

//   return (
//     <>
//       <div className="container-fluid bg-indigo-300 w-full h-[84.6vh] p-6 overflow-auto">
//         <h1 className="text-4xl text-center py-6 text-gray-700 font-semibold">Users</h1>

//         {/* Add User Button */}
//         <div className="flex justify-start mb-4">
//           <button onClick={() => setShowAddModal(true)} className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"><FaUserPlus className="mr-2" /> Add User</button>
//         </div>

//         <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
//           <thead>
//             <tr className="bg-gradient-to-r from-blue-500 to-indigo-400 text-white">
//               <th className="px-6 py-3 text-left">User ID</th>
//               <th className="px-6 py-3 text-left">User Name</th>
//               <th className="px-6 py-3 text-left">Email</th>
//               <th className="px-6 py-3 text-left">Status</th>
//               <th className="px-6 py-3 text-left">Registered On</th>
//               <th className="px-6 py-3 text-center">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {users.length > 0 ? (
//               users.map((user) => (
//                 <tr key={user.userId} className="text-gray-800 bg-gray-100 hover:bg-indigo-300">
//                   <td className="px-6 py-4">{user.userId}</td>
//                   <td className="px-6 py-4">{user.userName}</td>
//                   <td className="px-6 py-4">{user.email}</td>

//                   <td className="px-6 py-4">
//                     <label className="cursor-pointer">
//                       <div className="relative">
//                         <input type="checkbox" checked={user.status === "Active"} onChange={() => toggleButton(user.userId, user.status)} className="sr-only"/>

//                         <div className={`w-12 h-7 rounded-full shadow-inner transition-all duration-300 ${ user.status === "Active" ? "bg-green-500" : "bg-red-500" }`}></div>

//                         <div className={`dot absolute w-5 h-5 bg-white rounded-full shadow left-1 top-1 transition-all duration-300 ${ user.status === "Active" ? "transform translate-x-5" : "" }`}></div>

//                       </div>
//                     </label>
//                   </td>

//                   <td className="px-6 py-4">{moment(user.Registred_at).format("DD/MM/YYYY")}</td>

//                   <td className="px-6 py-4 flex gap-4">
//                     <button onClick={() => handleUpdate(user)} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">Update</button>
//                     <button onClick={() => handleDelete(user)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5" className="px-6 py-4 text-center text-gray-600">No users available</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Modals */}
//       <AddUserModal showModal={showAddModal} setShowModal={setShowAddModal} setUsers={setUsers} />
//       <DeleteUserModal showModal={showDeleteModal} setShowModal={setShowDeleteModal} user={selectedUser} setUsers={setUsers}/>        




//       {/* <UpdateUserModal showModal={showUpdateModal} setShowModal={setShowUpdateModal} user={selectedUser} setUsers={setUsers}/> */}


//       {/* <DeleteUserModal showModal={showDeleteModal} setShowModal={setShowDeleteModal} user={selectedUser} setUsers={setUsers}/> */}
//     </>
//   );
// }










































































// import { useState, useEffect } from "react";
// import axios from "axios";
// import moment from "moment";
// import { FaUserPlus } from "react-icons/fa"; // Add User Icon
// import AddUserModal from "./AddUserModal"; // Import the modal

// const API_URL = "http://localhost:5373";

// export default function Users() {
//   const [users, setUsers] = useState([]);
//   const [showModal, setShowModal] = useState(false); // Control modal visibility

//   useEffect(() => {
//     axios
//       .post(`${API_URL}/get_user`)
//       .then((res) => {
//         setUsers(res.data[0]);
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   }, []);

//   const toggleBotton = (userId, currentStatus) => {
//     const updatedStatus = currentStatus === "Active" ? "Inactive" : "Active";

//     setUsers(
//       users.map((user) =>
//         user.userId === userId ? { ...user, status: updatedStatus } : user
//       )
//     );

//     axios
//       .post(`${API_URL}/update_admin_user_status`, { userId, status: updatedStatus })
//       .then((res) => {
//         console.log("Status updated successfully", res.data);
//       })
//       .catch((error) => {
//         setUsers(
//           users.map((user) =>
//             user.userId === userId ? { ...user, status: currentStatus } : user
//           )
//         );
//       });
//   };

//   return (
//     <>
//       <div className="container-fluid bg-gray-200 w-full h-[84.6vh] p-6 overflow-auto">
//         <h1 className="text-4xl text-center py-6 text-gray-700 font-semibold">Users</h1>

//         {/* Add User Button */}
//         <div className="flex justify-start mb-4">
//           <button onClick={() => setShowModal(true)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><FaUserPlus className="mr-2" />Add User</button>
//         </div>

//         <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
//           <thead>
//             <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
//               <th className="px-6 py-3 text-left">User ID</th>
//               <th className="px-6 py-3 text-left">User Name</th>
//               <th className="px-6 py-3 text-left">Email</th>
//               <th className="px-6 py-3 text-left">Status</th>
//               <th className="px-6 py-3 text-left">Registered On</th>
//               <th className="px-6 py-3 text-left">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {users.length > 0 ? (
//               users.map((user) => (
//                 <tr key={user.userId} className="text-gray-800 bg-gray-300 hover:bg-gray-100">
//                   <td className="px-6 py-4">{user.userId}</td>
//                   <td className="px-6 py-4">{user.userName}</td>
//                   <td className="px-6 py-4">{user.email}</td>

//                   <td className="px-6 py-4">
//                     <label className="cursor-pointer">
//                       <div className="relative">
//                         <input type="checkbox" checked={user.status === "Active"} onChange={() => toggleBotton(user.userId, user.status)} className="sr-only"/>

//                         <div className={`w-12 h-7 rounded-full shadow-inner transition-all duration-300 ${user.status === "Active" ? "bg-green-500" : "bg-red-500"}`}></div>

//                         <div className={`dot absolute w-5 h-5 bg-white rounded-full shadow left-1 top-1 transition-all duration-300 ${user.status === "Active" ? "transform translate-x-5" : ""}`}></div>
//                       </div>
//                     </label>
//                   </td>

//                   <td className="px-6 py-4">{moment(user.Registred_at).format("DD/MM/YYYY")}</td>
//                   <td className="px-6 py-4"></td>

//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5" className="px-6 py-4 text-center text-gray-600">No users available</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Add User Modal */}
//       <AddUserModal showModal={showModal} setShowModal={setShowModal} setUsers={setUsers}/>
//     </>
//   );
// }























































































// import {useState, useEffect} from 'react';
// import axios from 'axios';
// import moment from 'moment';

// const API_URL = 'http://localhost:5373';

// export default function Users() {

//   const [ users, setUsers ] = useState([]);

//   useEffect(() => {
//     axios.post(`${API_URL}/get_user`)
//     .then(res => {
//       setUsers(res.data[0]);
//       // console.log(res.data[0]);
//     })
//     .catch(error => {
//       console.error("Error:", error);
//     });
//   }, []);

//   const toggleBotton = (userId, currentStatus) => {
//     const updatedStatus = currentStatus === "Active" ? "Inactive" : "Active";
  
//     setUsers(users.map(user => user.userId === userId ? { ...user, status: updatedStatus} : user));

//     axios.post(`${API_URL}/update_admin_user_status`, {userId, status: updatedStatus})
//     .then(res => {
//       console.log("Status updated successfully", res.data);
//     })
//     .catch(error => {
//       setUsers(users.map(user => user.userId === userId ? { ...user, status: currentStatus} : user));
//     });
//   };

//   return(
//     <>

    

//     <div className="container-fluid bg-gray-200 w-full h-[84.6vh] p-6 overflow-auto">

//       <h1 className="text-4xl text-center py-6 tect-gray-700 font-semibold">Users</h1>

//     <table className="min-w-full bg-white rounded-lg shodow-lg overflow-hidden">

//     <thead>
//       <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
//         <th className="px-6 py-3 text-left">User ID</th>  
//         <th className="px-6 py-3 text-left">User Name</th> 
//         <th className="px-6 py-3 text-left">Email</th> 
//         <th className="px-6 py-3 text-left">Status</th> 
//         <th className="px-6 py-3 text-left">Registered On</th>   
//       </tr>
//     </thead>

//     <tbody>
//       {users.length > 0 ? (users.map((user) => (
//         <tr key={user.userId} className="text-gray-800 bg-gray-300 hover:bg-gray-100">
//           <td className="px-6 py-4">{user.userId}</td>
//           <td className="px-6 py-4">{user.userName}</td>
//           <td className="px-6 py-4">{user.email}</td>
//           <td className="px-6 py-4 flex items-center justify-between w-full">
//             {/* <span className={`${user.status === "Active" ? 'text-green-500' : 'text-red-500'} font-semibold`}>{user.status}</span> */}
//             <label className="inline-flex items-center cursor-pointer">
//               <div className="relative">
//                 <input type="checkbox" checked={user.status === "Active"} onChange={() => toggleBotton(user.userId, user.status)} className="sr-only"/>
//                 <div className={`w-12 h-7 rounded-full shadow-inner transition-all duration-300 ${user.status === "Active" ? 'bg-green-500' : 'bg-red-500'}`}></div>
//                 <div className={`dot absolute w-5 h-5 bg-white rounded-full shadow left-1 top-1 transition-all duration-300 ${user.status === "Active" ? 'transform translate-x-5' : ''}`}></div>
//                 </div>
//                 </label>
//                 </td>
//           <td className="px-6 py-4">{moment(user.Registred_at).format('DD/MM/YYYY')}</td>
//         </tr>

//       ))) : (
//         <tr>
//           <td colSpan="5" className="px-6 py-4 text-center text-gray-600">No user available</td>
//           </tr>
//       )}
//       </tbody>
//       </table>
//       </div>
//       </>
//   );
// }














































































// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import moment from 'moment';

// export default function Users() {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     axios.post('http://localhost:5373/get_user')
//       .then(response => {
//         setUsers(response.data[0]);
//         // console.log(response.data[0]);
//       })
//       .catch(error => {
//         console.log("Error", error);
//       });
//   }, []);

// const toggleStatus = (userId, currentStatus) => {
//   const newStatus = currentStatus === "Active" ? "Inactive" : "Active";


//   setUsers(users.map(user =>
//     user.userId === userId
//       ? { ...user, status: newStatus }
//       : user
//   ));

//   axios.post('http://localhost:5373/update_admin_user_status', { userId, status: newStatus })
//     .then(response => {
//       console.log('Status updated successfully', response.data);
//     })
//     .catch(error => {
//       // console.error("Error updating status:", error);
//       setUsers(users.map(user =>
//         user.userId === userId
//           ? { ...user, status: currentStatus }
//           : user
//       ));
//     });
// };


//   return (
//     <div className="container-fluid bg-gray-100 w-full h-[84.6vh] p-6 overflow-auto">
//       <h1 className="text-4xl text-center py-6 text-gray-700 font-semibold">Users</h1>

//       {/* Table */}
//       <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
//         <thead>
//           <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
//             <th className="px-6 py-3 text-left">User ID</th>
//             <th className="px-6 py-3 text-left">User Name</th>
//             <th className="px-6 py-3 text-left">Email</th>
//             <th className="px-6 py-3 text-left">Status</th>
//             <th className="px-6 py-3 text-left">Registered On</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.length > 0 ? (
//             users.map((user) => (
//               <tr key={user.userId} className="text-gray-800 hover:bg-gray-100">
//                 <td className="px-6 py-4">{user.userId}</td>
//                 <td className="px-6 py-4">{user.userName}</td>
//                 <td className="px-6 py-4">{user.email}</td>

//                 {/* Toggle Button */}
//                 <td className="px-6 py-4 flex items-center space-x-2">

//                   <span className={`${user.status === "Active" ? 'text-green-500' : 'text-red-500'} font-semibold`}>{user.status}</span>

//                   <label className="inline-flex items-center cursor-pointer">
//                     <div className="relative">

//                       <input type="checkbox" checked={user.status === "Active"} onChange={() => toggleStatus(user.userId, user.status)} className="sr-only"/>

//                       <div className={`w-12 h-7 rounded-full shadow-inner transition-all duration-300 ${user.status === "Active" ? 'bg-green-500' : 'bg-red-500'}`}></div>

//                       <div className={`dot absolute w-5 h-5 bg-white rounded-full shadow left-1 top-1 transition-all duration-300 ${user.status === "Active" ? 'transform translate-x-5' : ''}`}></div>
                    
//                     </div>
//                   </label>
//                 </td>

//                 <td className="px-6 py-4">{moment(user.Registred_at).format('DD/MM/YYYY')}</td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="5" className="px-6 py-4 text-center text-gray-600">No users available</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }



































































// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import moment from 'moment';

// export default function Users() {
//   const [users, setUsers] = useState([]);

//   // UseEffect to fetch users data
//   useEffect(() => {
//     axios.post('http://localhost:5373/get_user')
//       .then(response => {
//         setUsers(response.data);
//         console.log(response.data);
//       })
//       .catch(error => {
//         console.log("Error", error);
//       });
//   }, []);

//   // Function to toggle user status
//   const toggleStatus = (userId) => {
//     setUsers(users.map(user => 
//       user.userId === userId 
//         ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" } 
//         : user
//     ));
//   };

//   return (
//     <div className="container-fluid bg-gray-100 w-full h-[84.6vh] p-6 overflow-auto">
//       <h1 className="text-4xl text-center py-6 text-gray-700 font-semibold">Users</h1>

//       {/* Table */}
//       <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
//         <thead>
//           <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
//             <th className="px-6 py-3 text-left">User ID</th>
//             <th className="px-6 py-3 text-left">User Name</th>
//             <th className="px-6 py-3 text-left">Email</th>
//             <th className="px-6 py-3 text-left">Status</th>
//             <th className="px-6 py-3 text-left">Registered On</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.length > 0 ? (
//             users.map((user) => (
//               <tr key={user.userId} className="text-gray-800 hover:bg-gray-100">
//                 <td className="px-6 py-4">{user.userId}</td>
//                 <td className="px-6 py-4">{user.userName}</td>
//                 <td className="px-6 py-4">{user.email}</td>

//                 {/* Status and Toggle Button */}
//                 <td className="px-6 py-4 flex items-center space-x-2">
//                   <span className={`${user.status === "Active" ? 'text-green-500' : 'text-red-500'} font-semibold`}>
//                     {user.status}
//                   </span>
//                   <label className="inline-flex items-center cursor-pointer">
//                     <div className="relative">
//                       <input
//                         type="checkbox"
//                         checked={user.status === "Active"}
//                         onChange={() => toggleStatus(user.userId)}
//                         className="sr-only"
//                       />
//                       <div
//                         className={`w-12 h-7 rounded-full shadow-inner transition-all duration-300 ${
//                           user.status === "Active" ? 'bg-green-500' : 'bg-red-500'
//                         }`}
//                       ></div>
//                       <div
//                         className={`dot absolute w-5 h-5 bg-white rounded-full shadow left-1 top-1 transition-all duration-300 ${
//                           user.status === "Active" ? 'transform translate-x-5' : ''
//                         }`}
//                       ></div>
//                     </div>
//                   </label>
//                 </td>

//                 <td className="px-6 py-4">{moment(user.Registred_at).format('DD/MM/YYYY')}</td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="5" className="px-6 py-4 text-center text-gray-600">No users available</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }





























































// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import moment from 'moment';

// export default function Users() {
//   const [users, setUsers] = useState([]);

//   // UseEffect to fetch users data
//   useEffect(() => {
//     axios.post('http://localhost:5373/get_user')
//       .then(response => {
//         setUsers(response.data);
//         console.log(response.data);
//       })
//       .catch(error => {
//         console.log("Error", error);
//       });
//   }, []);

//   // Function to toggle user status
//   const toggleStatus = (userId) => {
//     setUsers(users.map(user => 
//       user.userId === userId 
//         ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" } 
//         : user
//     ));
//   };

//   return (
//     <div className="container-fluid bg-slate-300 w-full h-[86.5vh] p-6 overflow-auto">
//       <h1 className="text-3xl text-center py-4">Users</h1>

//       {/* Table */}
//       <table className="min-w-full bg-dark text-white table-auto">
//         <thead>
//           <tr className="bg-gray-800">
//             <th className="px-4 py-2 text-start">User ID</th>
//             <th className="px-4 py-2 text-start">User Name</th>
//             <th className="px-4 py-2 text-start">Email</th>
//             <th className="px-4 py-2 text-start">Status</th>
//             <th className="px-4 py-2 text-start">Registered On</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.length > 0 ? (
//             users.map((user) => (
//               <tr key={user.userId} className="text-white bg-black hover:bg-white hover:text-black">
//                 <td className="px-4 py-2">{user.userId}</td>
//                 <td className="px-4 py-2">{user.userName}</td>
//                 <td className="px-4 py-2">{user.email}</td>

//                 {/* Status and Toggle Button */}
//                 <td className="px-4 py-2 flex items-center space-x-2">
//                   <span>{user.status}</span>
//                   <label className="inline-flex items-center cursor-pointer">
                    
//                     <div className="relative">
//                       <input
//                         type="checkbox"
//                         checked={user.status === "Active"}
//                         onChange={() => toggleStatus(user.userId)}
//                         className="sr-only"
//                       />
//                       <div
//                         className={`w-10 h-6 rounded-full shadow-inner transition-all duration-300 ${
//                           user.status === "Active" ? 'bg-green-500' : 'bg-red-500'
//                         }`}
//                       ></div>
//                       <div
//                         className={`dot absolute w-4 h-4 bg-white rounded-full shadow left-1 top-1 transition-all duration-300 ${
//                           user.status === "Active" ? 'transform translate-x-4' : ''
//                         }`}
//                       ></div>
//                     </div>
                    
//                   </label>
//                 </td>

//                 <td className="px-4 py-2">{moment(user.Registred_at).format('DD/MM/YYYY')}</td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="5" className="px-4 py-2 text-center text-black">No users available</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }














































































// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import moment from 'moment';


// export default function Users() {
//   const [users, setUsers] = useState([]);

// //   const DateFormat = moment()

//   useEffect(() => {
//     axios.post('http://localhost:5373/get_user')
//       .then(response => {
//         setUsers(response.data);
//         console.log(response.data) 
//       })
//       .catch(error => {
//         console.log("Error", error);
//       });
//   }, []);

//   return (
//         <div className="container-fluid bg-slate-300 w-full h-[86.5vh] p-6 overflow-auto">
//           <h1 className="text-3xl text-center py-4">Users</h1>

//           {/* Table */}
//           <table className="min-w-full bg-dark text-white table-auto">
//             <thead>
//               <tr className="bg-gray-800">
//                 <th className="px-4 py-2 text-start">User ID</th>
//                 <th className="px-4 py-2 text-start">User Name</th>
//                 <th className="px-4 py-2 text-start">Email</th>
//                 <th className="px-4 py-2 text-start">Status</th>
//                 <th className="px-4 py-2 text-start">Registered On</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.length > 0 ? (
//                 users.map((user) => (
//                   <tr key={user.userId} className="text-white bg-black hover:bg-white hover:text-black">
//                     <td className="px-4 py-2">{user.userId}</td>
//                     <td className="px-4 py-2">{user.userName}</td>
//                     <td className="px-4 py-2">{user.email}</td>
//                     <td className="px-4 py-2">{user.status} </td>
//                     <td className="px-4 py-2">{moment(user.Registred_at).format('DD/MM/YYYY')}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="5" className="px-4 py-2 text-center text-black">No users available</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//   );
// }