import { useState } from "react";
// import axios from "axios";

const RoleAssignmentModal = ({ showModal, setShowModal, selectedUser, roles, handleRoleChange }) => {
  const [selectedRole, setSelectedRole] = useState("");

  const onRoleAssign = () => {
    if (selectedRole) {
      handleRoleChange(selectedUser.userId, selectedRole);
      setShowModal(false);
    }
  };

  return (
    showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Assign Role to {selectedUser.userName}</h2>
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-600 mb-2">Select Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Choose a Role</option>
              {roles.map((role) => (
                <option key={role.roleId} value={role.roleId}>
                  {role.roleName}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-between gap-4">
            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3 px-6 bg-gray-300 text-gray-800 rounded-lg text-lg font-medium hover:bg-gray-400 transition duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onRoleAssign}
              className="w-full py-3 px-6 bg-blue-500 text-white rounded-lg text-lg font-medium hover:bg-blue-600 transition duration-200"
            >
              Assign Role
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default RoleAssignmentModal;





































































































































































// const RoleAssignmentModal = ({ showModal, setShowModal, selectedUser, roles, onRoleAssign, setUsers }) => {
//     const [selectedRole, setSelectedRole] = useState("");
  
//     const handleRoleChange = () => {
//       if (selectedRole) {
//         onRoleAssign(selectedUser.userId, selectedRole);  // Send the roleId (not roleName)
//         setShowModal(false);
  
//         // After role assignment, you can update the users list if needed
//         setUsers(prevUsers => 
//           prevUsers.map(user => 
//             user.userId === selectedUser.userId 
//               ? { ...user, roles: [...user.roles.split(", "), selectedRole] } 
//               : user
//           )
//         );
//       }
//     };
  
//     return (
//       showModal && (
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
//                 <option key={role.roleId} value={role.roleId}>  {/* Using roleId here */}
//                   {role.roleName}
//                 </option>
//               ))}
//             </select>
//             <div className="mt-4 flex justify-between">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="bg-gray-500 text-white px-4 py-2 rounded-lg"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleRoleChange}
//                 className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//               >
//                 Assign Role
//               </button>
//             </div>
//           </div>
//         </div>
//       )
//     );
//   };
  
//   export default RoleAssignmentModal;
  

































































































































































// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const RoleAssignmentModal = ({ showModal, setShowModal, selectedUser, roles, onRoleAssign }) => {
//   const [selectedRole, setSelectedRole] = useState("");

//   const handleRoleChange = (userId, roleId) => {
//     // Update role for the user in the UI
//     setUsers(
//       users.map((user) =>
//         user.userId === userId ? { ...user, roles: [...user.roles.split(", "), roleId] } : user
//       )
//     );
  
//     // Send the new role to the server with the correct roleId
//     axios.post(`${API_URL}/add_admin_role_assign`, { userId, roleId })  // Send roleId instead of roleName
//       .then((res) => {
//         console.log("Role assigned successfully", res.data);
//       })
//       .catch((error) => {
//         console.error("Error assigning role:", error);
//       });
  
//     setShowRoleModal(false);
//   };
  

//   return (
//     showModal && (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//         <div className="bg-white p-6 rounded-lg shadow-lg">
//           <h2 className="text-xl font-semibold">Assign Role to {selectedUser.userName}</h2>
//           <select
//             value={selectedRole}
//             onChange={(e) => setSelectedRole(e.target.value)}
//             className="w-full px-4 py-2 border rounded-lg mt-4"
//           >
//             <option value="">Select Role</option>
//             {roles.map((role) => (
//               <option key={role.roleId} value={role.roleName}>
//                 {role.roleName}
//               </option>
//             ))}
//           </select>
//           <div className="mt-4 flex justify-between">
//             <button
//               onClick={() => setShowModal(false)}
//               className="bg-gray-500 text-white px-4 py-2 rounded-lg"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleRoleChange}
//               className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//             >
//               Assign Role
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   );
// };

// export default RoleAssignmentModal;























































































// import React from 'react';

// const RoleAssignmentModal = ({ showModal, setShowModal, selectedUser, roles, selectedRole, setSelectedRole, handleRoleChange }) => {
//   if (!showModal) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//       <div className="bg-white p-6 rounded-lg shadow-lg">
//         <h2 className="text-xl font-semibold">Assign Role to {selectedUser.userName}</h2>
//         <select
//           value={selectedRole}
//           onChange={(e) => setSelectedRole(e.target.value)}
//           className="w-full px-4 py-2 border rounded-lg mt-4"
//         >
//           <option value="">Select Role</option>
//           {roles.map((role) => (
//             <option key={role.roleId} value={role.roleName}>
//               {role.roleName}
//             </option>
//           ))}
//         </select>
//         <div className="mt-4 flex justify-between">
//           <button
//             onClick={() => setShowModal(false)}
//             className="bg-gray-500 text-white px-4 py-2 rounded-lg"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={() => handleRoleChange(selectedUser.userId, selectedRole)}
//             className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//           >
//             Assign Role
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RoleAssignmentModal;
