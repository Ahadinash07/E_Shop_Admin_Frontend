import { useState } from "react";
import axios from "axios";
import { FaUserPlus } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";

const API_URL = "https://e-shop-backend-sage.vercel.app";

const AddUserModal = ({ showModal, setShowModal, setUsers }) => {
  const [errorMessage, setErrorMessage] = useState("");

  // Formik setup
  const formik = useFormik({
    initialValues: {
      userId: "",
      userName: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      userId: Yup.string().required("User ID is required"),
      userName: Yup.string().required("User Name is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: (values) => {
      handleRegister(values);
    },
  });

  const handleRegister = async (values) => {
    try {
      const response = await axios.post(`${API_URL}/admin_user_registration`, values);
      if (response.data.message === "User registered successfully") {
        setUsers((prevUsers) => [
          ...prevUsers,
          {
            userId: values.userId,
            userName: values.userName,
            email: values.email,
            status: "Inactive",
            Registred_at: new Date(),
          },
        ]);
        formik.resetForm();
        setShowModal(false);
      } else {
        setErrorMessage(response.data.message);
        console.log(response.data.message);
      }
    } catch (error) {
      setErrorMessage("Error registering user. Please try again.");
    }
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-11/12 md:w-1/3 transform transition-all duration-300 scale-95 hover:scale-100">
            <h2 className="text-3xl font-semibold mb-6 flex items-center text-gray-800">
              <FaUserPlus className="mr-2 text-blue-600" /> Add New User
            </h2>

            {/* Display Error Message */}
            {errorMessage && (
              <p className="text-red-500 mb-4 text-sm">{errorMessage}</p>
            )}

            <form onSubmit={formik.handleSubmit}>
              {/* User ID Field */}
              <div className="mb-6">
                <label className="block text-gray-700 text-lg font-medium mb-2">User ID</label>
                <input
                  type="text"
                  name="userId"
                  value={formik.values.userId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full p-3 border ${
                    formik.touched.userId && formik.errors.userId
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter User ID"
                />
                {formik.touched.userId && formik.errors.userId && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.userId}</p>
                )}
              </div>

              {/* User Name Field */}
              <div className="mb-6">
                <label className="block text-gray-700 text-lg font-medium mb-2">User Name</label>
                <input
                  type="text"
                  name="userName"
                  value={formik.values.userName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full p-3 border ${
                    formik.touched.userName && formik.errors.userName
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter User Name"
                />
                {formik.touched.userName && formik.errors.userName && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.userName}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="mb-6">
                <label className="block text-gray-700 text-lg font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full p-3 border ${
                    formik.touched.email && formik.errors.email
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter Email"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="mb-6">
                <label className="block text-gray-700 text-lg font-medium mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full p-3 border ${
                    formik.touched.password && formik.errors.password
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter Password"
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => {
                    formik.resetForm();
                    setShowModal(false);
                  }}
                  className="px-6 py-3 text-lg bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 text-lg bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Register User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddUserModal;
























































// import { useState } from "react";
// import axios from "axios";
// import { FaUserPlus } from "react-icons/fa";
// import { useFormik } from "formik";
// import * as Yup from "yup";

// const API_URL = "http://localhost:5373";

// const AddUserModal = ({ showModal, setShowModal, setUsers }) => {
//   const [errorMessage, setErrorMessage] = useState("");

//   // Formik setup
//   const formik = useFormik({
//     initialValues: {
//       userId: "",
//       userName: "",
//       email: "",
//       password: "",
//     },
//     validationSchema: Yup.object({
//       userId: Yup.string().required("User ID is required"),
//       userName: Yup.string().required("User Name is required"),
//       email: Yup.string().email("Invalid email address").required("Email is required"),
//       password: Yup.string()
//         .min(6, "Password must be at least 6 characters")
//         .required("Password is required"),
//     }),
//     onSubmit: (values) => {
//       handleRegister(values);
//     },
//   });

//   const handleRegister = async (values) => {
//     try {
//       const response = await axios.post(`${API_URL}/admin_user_registration`, values);
//       if (response.data.message === "User registered successfully") {
//         setUsers((prevUsers) => [
//           ...prevUsers,
//           {
//             userId: values.userId,
//             userName: values.userName,
//             email: values.email,
//             status: "Inactive",
//             Registred_at: new Date(),
//           },
//         ]);
//         formik.resetForm();
//         setShowModal(false);
//       } else {
//         setErrorMessage(response.data.message);
//         console.log(response.data.message);
//       }
//     } catch (error) {
//       setErrorMessage("Error registering user. Please try again.");
//     }
//   };

//   return (
//     <>
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-8 rounded-xl shadow-2xl w-11/12 md:w-1/3 transform transition-all duration-300 scale-95 hover:scale-100">
//             <h2 className="text-3xl font-semibold mb-6 flex items-center text-gray-800">
//               <FaUserPlus className="mr-2 text-blue-600" /> Add New User
//             </h2>

//             {/* Display Error Message */}
//             {errorMessage && (
//               <p className="text-red-500 mb-4 text-sm">{errorMessage}</p>
//             )}

//             <form onSubmit={formik.handleSubmit}>
//               {/* User ID Field */}
//               <div className="mb-6">
//                 <label className="block text-gray-700 text-lg font-medium mb-2">User ID</label>
//                 <input
//                   type="text"
//                   name="userId"
//                   value={formik.values.userId}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   className={`w-full p-3 border ${
//                     formik.touched.userId && formik.errors.userId
//                       ? "border-red-500"
//                       : "border-gray-300"
//                   } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
//                   placeholder="Enter User ID"
//                 />
//                 {formik.touched.userId && formik.errors.userId && (
//                   <p className="text-red-500 text-xs mt-1">{formik.errors.userId}</p>
//                 )}
//               </div>

//               {/* User Name Field */}
//               <div className="mb-6">
//                 <label className="block text-gray-700 text-lg font-medium mb-2">User Name</label>
//                 <input
//                   type="text"
//                   name="userName"
//                   value={formik.values.userName}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   className={`w-full p-3 border ${
//                     formik.touched.userName && formik.errors.userName
//                       ? "border-red-500"
//                       : "border-gray-300"
//                   } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
//                   placeholder="Enter User Name"
//                 />
//                 {formik.touched.userName && formik.errors.userName && (
//                   <p className="text-red-500 text-xs mt-1">{formik.errors.userName}</p>
//                 )}
//               </div>

//               {/* Email Field */}
//               <div className="mb-6">
//                 <label className="block text-gray-700 text-lg font-medium mb-2">Email</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formik.values.email}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   className={`w-full p-3 border ${
//                     formik.touched.email && formik.errors.email
//                       ? "border-red-500"
//                       : "border-gray-300"
//                   } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
//                   placeholder="Enter Email"
//                 />
//                 {formik.touched.email && formik.errors.email && (
//                   <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
//                 )}
//               </div>

//               {/* Password Field */}
//               <div className="mb-6">
//                 <label className="block text-gray-700 text-lg font-medium mb-2">Password</label>
//                 <input
//                   type="password"
//                   name="password"
//                   value={formik.values.password}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   className={`w-full p-3 border ${
//                     formik.touched.password && formik.errors.password
//                       ? "border-red-500"
//                       : "border-gray-300"
//                   } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
//                   placeholder="Enter Password"
//                 />
//                 {formik.touched.password && formik.errors.password && (
//                   <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
//                 )}
//               </div>

//               {/* Buttons */}
//               <div className="flex justify-between">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     formik.resetForm();
//                     setShowModal(false);
//                   }}
//                   className="px-6 py-3 text-lg bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-6 py-3 text-lg bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
//                 >
//                   Register User
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default AddUserModal;





































































































// // AddUserModal.jsx

// import { useState } from "react";
// import axios from "axios";
// import { FaUserPlus } from "react-icons/fa"; // Add User Icon

// const AddUserModal = ({ showModal, setShowModal, setUsers }) => {
//   const [userId, setUserId] = useState("");
//   const [userName, setUserName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");

//   const handleRegister = () => {
//     if (!userId || !userName || !email || !password) {
//       setErrorMessage("Please fill in all fields");
//       return;
//     }

//     axios
//       .post("http://localhost:5373/admin_user_registration", { userId, userName, email, password })
//       .then((response) => {
//         if (response.data.message === "User registered successfully") {
//           // Update users list in parent component
//           setUsers((prevUsers) => [
//             ...prevUsers,
//             { userId, userName, email, status: "Inactive", Registred_at: new Date() }
//           ]);
//           setShowModal(false); // Close modal
//         } else {
//           setErrorMessage(response.data.message); // Display error message (e.g., User already exists)
//         }
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//         setErrorMessage("Error registering user");
//       });
//   };

//   return (
//     <>
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
//             <h2 className="text-xl font-semibold mb-4 flex items-center">
//               <FaUserPlus className="mr-2" /> Add New User
//             </h2>
//             {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
//             <div className="mb-4">
//               <label className="block text-gray-700">User ID</label>
//               <input
//                 type="text"
//                 value={userId}
//                 onChange={(e) => setUserId(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded-lg"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-gray-700">User Name</label>
//               <input
//                 type="text"
//                 value={userName}
//                 onChange={(e) => setUserName(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded-lg"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-gray-700">Email</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded-lg"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-gray-700">Password</label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded-lg"
//               />
//             </div>
//             <div className="flex justify-between">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-4 py-2 bg-gray-500 text-white rounded-lg"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleRegister}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//               >
//                 Register User
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default AddUserModal;
