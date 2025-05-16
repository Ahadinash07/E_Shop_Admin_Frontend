import { useState } from "react";
import axios from "axios";

const UserUpdateModal = ({ showModal, setShowModal, user, onUpdate }) => {
  const [userName, setUserName] = useState(user?.userName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put("https://e-shop-backend-sage.vercel.app/admin_user_update", {
        userId: user.userId,
        userName,
        email,
        password,
      });

      if (response.data.message) {
        // console.log(response.data.message);
        onUpdate(user.userId, { userName, email }); // Update the parent state
        setShowModal(false);
      } else {
        console.log(response.data.error);
      }
    } catch (error) {
      alert("Error updating user details");
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Update Details of {user.userId}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">User Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserUpdateModal;





































































// import { useState } from 'react';
// import axios from 'axios';

// const UserUpdateModal = ({ userId, onClose, onUpdate }) => {
//   const [userName, setUserName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.put('http://localhost:5373/admin_user_update', {
//         userId,
//         userName,
//         email,
//         password,
//       });

//       if (response.data.message) {
//         console.log(response.data.message);
//         onUpdate(userId, { userName, email }); // Step 2: Call onUpdate with updated data
//         onClose();
//       } else {
//         console.log(response.data.error);
//       }
//     } catch (error) {
//       alert('Error updating user details');
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
//         <h2 className="text-xl font-bold mb-4">Update Details of {userId}</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">User Name</label>
//             <input
//               type="text"
//               value={userName}
//               onChange={(e) => setUserName(e.target.value)}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//               required
//             />
//           </div>
//           <div className="flex justify-end">
//             <button
//               type="button"
//               onClick={onClose}
//               className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
//             >
//               Update
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UserUpdateModal;


















































// import { useState, useEffect } from "react";
// import axios from "axios";

// export default function UpdateUserModal({ showModal, setShowModal, user, setUsers }) {
//   // Initialize state with fallback values
//   const [userName, setUserName] = useState(user?.userName || "");
//   const [email, setEmail] = useState(user?.email || "");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     // Reinitialize form fields when the user prop changes
//     if (user) {
//       setUserName(user.userName);
//       setEmail(user.email);
//     }
//   }, [user]);

//   const handleUpdate = async () => {
//     if (!userName || !email || !password) {
//       setError("All fields are required.");
//       return;
//     }

//     try {
//       const response = await axios.put("http://localhost:5373/admin_user_update", {
//         userId: user.userId,
//         userName,
//         email,
//         password,
//       });

//       if (response.data.message === "User updated successfully") {
//         // Update user in the local state
//         setUsers((prevUsers) =>
//           prevUsers.map((u) =>
//             u.userId === user.userId
//               ? { ...u, userName, email }
//               : u
//           )
//         );
//         setShowModal(false);
//       } else {
//         setError(response.data.error || "Failed to update user.");
//       }
//     } catch (error) {
//       setError("Error updating user.");
//     }
//   };

//   return (
//     showModal && (
//       <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg p-6 w-1/3">
//           <h2 className="text-xl font-semibold mb-4">Update User</h2>
//           <div>
//             <label className="block mb-2">User Name</label>
//             <input
//               type="text"
//               value={userName}
//               onChange={(e) => setUserName(e.target.value)}
//               className="w-full px-4 py-2 border rounded-lg mb-4"
//             />
//           </div>
//           <div>
//             <label className="block mb-2">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-4 py-2 border rounded-lg mb-4"
//             />
//           </div>
//           <div>
//             <label className="block mb-2">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-4 py-2 border rounded-lg mb-4"
//             />
//           </div>
//           {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
//           <div className="flex justify-between">
//             <button
//               onClick={() => setShowModal(false)}
//               className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleUpdate}
//               className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
//             >
//               Update
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   );
// }




















































































// import { useState } from "react";
// import axios from "axios";

// export default function UpdateUserModal({ showModal, setShowModal, user, setUsers }) {
//   const [userName, setUserName] = useState(user.userName || "");
//   const [email, setEmail] = useState(user.email || "");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleUpdate = async () => {
//     if (!userName || !email || !password) {
//       setError("All fields are required.");
//       return;
//     }

//     try {
//       const response = await axios.put("http://localhost:5373/admin_user_update", {
//         userId: user.userId,
//         userName,
//         email,
//         password,
//       });

//       if (response.data.message === "User updated successfully") {
//         // Update user in the local state
//         setUsers((prevUsers) =>
//           prevUsers.map((u) =>
//             u.userId === user.userId
//               ? { ...u, userName, email }
//               : u
//           )
//         );
//         setShowModal(false);
//       } else {
//         setError(response.data.error || "Failed to update user.");
//       }
//     } catch (error) {
//       setError("Error updating user.");
//     }
//   };

//   return (
//     showModal && (
//       <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg p-6 w-1/3">
//           <h2 className="text-xl font-semibold mb-4">Update User</h2>
//           <div>
//             <label className="block mb-2">User Name</label>
//             <input
//               type="text"
//               value={userName}
//               onChange={(e) => setUserName(e.target.value)}
//               className="w-full px-4 py-2 border rounded-lg mb-4"
//             />
//           </div>
//           <div>
//             <label className="block mb-2">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-4 py-2 border rounded-lg mb-4"
//             />
//           </div>
//           <div>
//             <label className="block mb-2">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-4 py-2 border rounded-lg mb-4"
//             />
//           </div>
//           {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
//           <div className="flex justify-between">
//             <button
//               onClick={() => setShowModal(false)}
//               className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleUpdate}
//               className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
//             >
//               Update
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   );
// }



























































































// import { useState, useEffect, useRef } from "react";
// import axios from "axios";

// export default function UpdateUserModal({ showModal, setShowUpdateModal, user, setUsers }) {
//   const [userName, setUserName] = useState(user.userName || "");
//   const [email, setEmail] = useState(user.email || "");
//   const [password, setPassword] = useState("");
//   const formRef = useRef();

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const formData = new FormData(formRef.current);
//     const data = { userId: user.userId, userName: formData.get("userName"), email: formData.get("email"), password: formData.get("password"),};

//     axios.put("http://localhost:5373/admin_user_update", data)
//       .then((res) => {
//         alert(res.data.message);
//         setShowUpdateModal(false);
       
//         setUsers((prevUsers) =>
//           prevUsers.map((u) => u.userId === user.userId ? { ...u, userName: data.userName, email: data.email } : u )
//         );
//       })
//       .catch((err) => {
//         alert(err.response.data.error || "Failed to update user");
//       });
//   };

//   if (!showModal) return null;

//   return (
//     <div className="fixed inset-0 flex justify-center items-center bg-gray-700 bg-opacity-50">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
//         <h2 className="text-xl font-semibold mb-4">Update User</h2>
//         <form ref={formRef} onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label htmlFor="userName" className="block text-gray-700">User Name</label>
//             <input type="text" name="userName" id="userName" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full p-2 border border-gray-300 rounded mt-1"/>
//           </div>

//           <div className="mb-4">
//             <label htmlFor="email" className="block text-gray-700">Email</label>
//             <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border border-gray-300 rounded mt-1"/>
//           </div>

//           <div className="mb-4">
//             <label htmlFor="password" className="block text-gray-700">Password</label>
//             <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border border-gray-300 rounded mt-1"/>
//           </div>

//           <div className="flex justify-end">
//             <button type="button" onClick={() => setShowUpdateModal(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded">Cancel</button>

//             <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Update</button>
//           </div>
          
//         </form>
//       </div>
//     </div>
//   );
// }
