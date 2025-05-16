import { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://e-shop-backend-sage.vercel.app';

const DeleteUserModal = ({ showModal, setShowModal, user, setUsers }) => {

  const handleDelete = () => {
    // Correct the URL by using the userId dynamically
    axios.delete(`${API_URL}/delete_user/${user.userId}`)
      .then((res) => {
        setShowModal(false);
        // Directly update the state after deletion
        setUsers((prevUsers) => prevUsers.filter((u) => u.userId !== user.userId));
      })
      .catch((err) => {
        alert(err.response?.data?.error || "Failed to delete user");
      });
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-700 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-semibold mb-4">Delete User</h2>
        <p className="mb-4">Are you sure you want to delete this user?</p>
        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded">Cancel</button>
          <button type="button" onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;





































// import { useState } from 'react';
// import axios from 'axios';

// const API_URL = 'http://localhost:5373';

// const DeleteUserModal = ({ showModal, setShowModal, user, setUsers }) => {

//     const handleDelete = () => {
//         // Correct the URL by using the userId dynamically
//         axios.delete(`${API_URL}/delete_user/${user.userId}`)
//         .then((res) => {
//             setShowModal(false);
//             // Directly update the state after deletion
//             setUsers((prevUsers) => prevUsers.filter((u) => u.userId !== user.userId));
//         })
//         .catch((err) => {
//             alert(err.response?.data?.error || "Failed to delete user");
//         });
//     };

//     if (!showModal) return null;

//     return (
//         <div className="fixed inset-0 flex justify-center items-center bg-gray-700 bg-opacity-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
//                 <h2 className="text-xl font-semibold mb-4">Delete User</h2>
//                 <p className="mb-4">Are you sure you want to delete this user?</p>
//                 <div className="flex justify-end gap-4">
//                     <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded">Cancel</button>
//                     <button type="button" onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DeleteUserModal;









































































// import { useState } from "react";
// import axios from "axios";

// export default function DeleteUserModal({ showModal, setShowModal, user, setUsers }) {
//   const handleDelete = () => {
//     axios.delete(`http://localhost:5373/admin_user_delete/${user.userId}`)
//       .then((res) => {
//         alert(res.data.message);
//         setShowModal(false);
//         setUsers((prevUsers) => prevUsers.filter((u) => u.userId !== user.userId));
//       })
//       .catch((err) => {
//         alert(err.response.data.error || "Failed to delete user");
//       });
//   };

//   if (!showModal) return null;

//   return (
//     <div className="fixed inset-0 flex justify-center items-center bg-gray-700 bg-opacity-50">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
//         <h2 className="text-xl font-semibold mb-4">Delete User</h2>
//         <p className="mb-4">Are you sure you want to delete this user?</p>
//         <div className="flex justify-end gap-4">
//           <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded">Cancel</button>

//           <button type="button" onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
//         </div>
//       </div>
//     </div>
//   );
// }
