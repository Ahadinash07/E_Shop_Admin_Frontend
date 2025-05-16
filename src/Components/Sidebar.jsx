import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaCogs, FaChalkboardTeacher, FaStore } from 'react-icons/fa';
import { AiOutlineAppstore } from "react-icons/ai";
import { useState } from "react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div className="w-full sm:w-64 bg-gray-800 text-white flex-none h-full p-4 sm:p-6">
      <div className="text-center text-3xl font-bold mb-8">Logo</div>
      <ul className="space-y-6">

        {/* Dashboard */}
        <li onClick={closeDropdown}>
          <Link to="/" 
            className={`flex items-center space-x-4 px-6 py-3 text-xl rounded-md transition-all duration-300 
            ${location.pathname === "/" ? "bg-white text-black" : "hover:bg-gray-500 "}`}>
            <FaHome />
            <span>Home</span>
          </Link>
        </li>

        {/* Role */}
        <li onClick={closeDropdown}>
          <Link to="/role" 
            className={`flex items-center space-x-4 px-6 py-3 text-xl rounded-md transition-all duration-300 
            ${location.pathname === "/role" ? "bg-white text-black" : "hover:bg-gray-500 "}`}>
            <FaChalkboardTeacher />
            <span>Role</span>
          </Link>
        </li>

        {/* Users */}
        <li onClick={closeDropdown}>
          <Link to="/users" 
            className={`flex items-center space-x-4 px-6 py-3 text-xl rounded-md transition-all duration-300 
            ${location.pathname === "/users" ? "bg-white text-black" : "hover:bg-gray-500 "}`}>
            <FaUsers />
            <span>Users</span>
          </Link>
        </li>

        {/* Product Dropdown */}
        <li className="relative">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`flex justify-between items-center w-full px-6 py-3 text-xl rounded-md transition-all duration-300 
            ${["/category", "/subcategory", "/products"].includes(location.pathname) ? "bg-white text-black" : "hover:bg-gray-500 "}`}>
            <div className="flex items-center space-x-4">
              <AiOutlineAppstore />
              <span>Product</span>
            </div>
            <span className="transition-transform duration-300" 
              style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </button>

          {/* Dropdown menu */}
          {isOpen && (
            <ul className="bg-gray-700 rounded-md shadow-lg mt-2 space-y-2 p-2">
              <li>
                <Link to="/category" 
                  className={`block px-6 py-2 rounded-md transition-all duration-300 
                  ${location.pathname === "/category" ? "bg-slate-400 text-black" : "hover:bg-gray-500 "}`}>
                  Category
                </Link>
              </li>
              <li>
                <Link to="/subcategory" 
                  className={`block px-6 py-2 rounded-md transition-all duration-300 
                  ${location.pathname === "/subcategory" ? "bg-slate-400 text-black" : "hover:bg-gray-500 "}`}>
                  SubCategory
                </Link>
              </li>
              <li>
                <Link to="/products" 
                  className={`block px-6 py-2 rounded-md transition-all duration-300 
                  ${location.pathname === "/products" ? "bg-slate-400 text-black" : "hover:bg-gray-500 "}`}>
                  Products
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Retailer */}
        <li onClick={closeDropdown}>
          <Link to="/retailer" 
            className={`flex items-center space-x-4 px-6 py-3 text-xl rounded-md transition-all duration-300 
            ${location.pathname === "/retailer" ? "bg-white text-black" : "hover:bg-gray-500 "}`}>
            <FaStore />
            <span>Retailer</span>
          </Link>
        </li>

        {/* Settings */}
        <li onClick={closeDropdown}>
          <Link to="/settings" 
            className={`flex items-center space-x-4 px-6 py-3 text-xl rounded-md transition-all duration-300 
            ${location.pathname === "/settings" ? "bg-white text-black" : "hover:bg-gray-500 "}`}>
            <FaCogs />
            <span>Settings</span>
          </Link>
        </li>

      </ul>
    </div>
  );
}

export default Sidebar;

















































// import { Link, useLocation } from 'react-router-dom';
// import { FaHome, FaUsers, FaCogs, FaChalkboardTeacher, FaStore } from 'react-icons/fa';
// import { AiOutlineAppstore } from "react-icons/ai";
// import { useState } from "react";

// const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const location = useLocation();

//   const closeDropdown = () => {
//     setIsOpen(false);
//   };

//   return (
//     <div className="w-full sm:w-64 bg-gray-800 text-white flex-none h-full p-4 sm:p-6">
//       <div className="text-center text-3xl font-bold mb-8">Logo</div>
//       <ul className="space-y-6">

//         {/* Dashboard */}
//         <li onClick={closeDropdown}>
//           <Link to="/" 
//             className={`flex items-center space-x-4 px-6 py-3 text-xl rounded-md transition-all duration-300 
//             ${location.pathname === "/" ? "bg-white text-black" : "hover:bg-gray-500 "}`}>
//             <FaHome />
//             <span>Home</span>
//           </Link>
//         </li>

//         {/* Role */}
//         <li onClick={closeDropdown}>
//           <Link to="/role" 
//             className={`flex items-center space-x-4 px-6 py-3 text-xl rounded-md transition-all duration-300 
//             ${location.pathname === "/role" ? "bg-white text-black" : "hover:bg-gray-500 "}`}>
//             <FaChalkboardTeacher />
//             <span>Role</span>
//           </Link>
//         </li>

//         {/* Users */}
//         <li onClick={closeDropdown}>
//           <Link to="/users" 
//             className={`flex items-center space-x-4 px-6 py-3 text-xl rounded-md transition-all duration-300 
//             ${location.pathname === "/users" ? "bg-white text-black" : "hover:bg-gray-500 "}`}>
//             <FaUsers />
//             <span>Users</span>
//           </Link>
//         </li>

//         {/* Product Dropdown */}
//         <li className="relative">
//           <button 
//             onClick={() => setIsOpen(!isOpen)}
//             className={`flex justify-between items-center w-full px-6 py-3 text-xl rounded-md transition-all duration-300 
//             ${["/category", "/subcategory", "/products"].includes(location.pathname) ? "bg-white text-black" : "hover:bg-gray-500 "}`}>
//             <div className="flex items-center space-x-4">
//               <AiOutlineAppstore />
//               <span>Product</span>
//             </div>
//             <span className="transition-transform duration-300" 
//               style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
//               ▼
//             </span>
//           </button>

//           {/* Dropdown menu (Positioned properly below without overlapping Settings) */}
//           {isOpen && (
//             <ul className="bg-gray-700 rounded-md shadow-lg mt-2 space-y-2 p-2">
//               <li>
//                 <Link to="/category" 
//                   className={`block px-6 py-2 rounded-md transition-all duration-300 
//                   ${location.pathname === "/category" ? "bg-slate-400 text-black" : "hover:bg-gray-500 "}`}>
//                   Category
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/subcategory" 
//                   className={`block px-6 py-2 rounded-md transition-all duration-300 
//                   ${location.pathname === "/subcategory" ? "bg-slate-400 text-black" : "hover:bg-gray-500 "}`}>
//                   SubCategory
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/products" 
//                   className={`block px-6 py-2 rounded-md transition-all duration-300 
//                   ${location.pathname === "/products" ? "bg-slate-400 text-black" : "hover:bg-gray-500 "}`}>
//                   Products
//                 </Link>
//               </li>
//             </ul>
//           )}
//         </li>

//         {/* Settings (No longer hidden by dropdown) */}
//         {/* <li onClick={closeDropdown}>
//           <Link to="/retailer" 
//             className={`flex items-center space-x-4 px-6 py-3 text-xl rounded-md transition-all duration-300 
//             ${location.pathname === "/retailer" ? "bg-white text-black" : "hover:bg-gray-500 "}`}>
//             <FaStore />
//             <span>Retailer</span>
//           </Link>
//         </li> */}

//         <li onClick={closeDropdown}>
//           <Link to="/settings" 
//             className={`flex items-center space-x-4 px-6 py-3 text-xl rounded-md transition-all duration-300 
//             ${location.pathname === "/settings" ? "bg-white text-black" : "hover:bg-gray-500 "}`}>
//             <FaCogs />
//             <span>Settings</span>
//           </Link>
//         </li>

//       </ul>
//     </div>
//   );
// }

// export default Sidebar;


















































// import { Link } from 'react-router-dom';
// import { FaHome, FaUsers, FaCogs, FaChalkboardTeacher } from 'react-icons/fa';
// import { AiOutlineAppstore } from "react-icons/ai";
// import { useState } from "react";

// const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(false); // State for dropdown

//   return (
//     <div className="w-full sm:w-64 bg-gray-800 text-white flex-none h-full p-4 sm:p-6">
//       <div className="text-center text-3xl font-bold mb-8">Logo</div>
//       <ul className="space-y-6">
        
//         {/* Dashboard */}
//         <li>
//           <Link to="/" className="flex items-center space-x-4 px-6 py-3 text-xl rounded-md hover:bg-white hover:text-black transition-all duration-300">
//             <FaHome />
//             <span>Dashboard</span>
//           </Link>
//         </li>

//         {/* Role */}
//         <li>
//           <Link to="/role" className="flex items-center space-x-4 px-6 py-3 text-xl rounded-md hover:bg-white hover:text-black transition-all duration-300">
//             <FaChalkboardTeacher />
//             <span>Role</span>
//           </Link>
//         </li>

//         {/* Users */}
//         <li>
//           <Link to="/users" className="flex items-center space-x-4 px-6 py-3 text-xl rounded-md hover:bg-white hover:text-black transition-all duration-300">
//             <FaUsers />
//             <span>Users</span>
//           </Link>
//         </li>

//         {/* Product Taxonomy Dropdown */}
//         <li className="relative">
//           <button 
//             onClick={() => setIsOpen(!isOpen)}
//             className="flex justify-between items-center w-full px-6 py-3 text-xl rounded-md hover:bg-white hover:text-black transition-all duration-300"
//           >
//             <div className="flex items-center space-x-4">
//               <AiOutlineAppstore />
//               <span>Product</span>
//             </div>
//             <span className="transition-transform duration-300" 
//               style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
//               ▼
//             </span>
//           </button>

//           {/* Dropdown menu */}
//           {isOpen && (
//             <ul className="absolute left-0 mt-2 w-full bg-gray-700 rounded-md shadow-lg">
//               <li>
//                 <Link to="/category" className="block px-6 py-2 hover:bg-white hover:text-black transition-all duration-300">Category</Link>
//               </li>
//               <li>
//                 <Link to="/subcategory" className="block px-6 py-2 hover:bg-white hover:text-black transition-all duration-300">SubCategory</Link>
//               </li>
//               <li>
//                 <Link to="/products" className="block px-6 py-2 hover:bg-white hover:text-black transition-all duration-300">Products</Link>
//               </li>
//             </ul>
//           )}
//         </li>

//         {/* Settings */}
//         <li>
//           <Link to="/settings" className="flex items-center space-x-4 px-6 py-3 text-xl rounded-md hover:bg-white hover:text-black transition-all duration-300">
//             <FaCogs />
//             <span>Settings</span>
//           </Link>
//         </li>
//       </ul>
//     </div>
//   );
// }

// export default Sidebar;


























































































































































// import { Link } from 'react-router-dom';
// import { FaHome, FaUsers, FaCogs, FaChalkboardTeacher, } from 'react-icons/fa';
// // import { HiTag } from "react-icons/hi";
// import { AiOutlineAppstore } from "react-icons/ai";
// // import { MdSubdirectoryArrowRight } from "react-icons/md";
// // import { HiOutlineTag } from "react-icons/hi";

// const Sidebar = () => {
//   return (
//     <div className="w-full sm:w-64 bg-gray-800 text-white flex-none h-full p-4 sm:p-6">
//       <div className="text-center text-3xl font-bold mb-8">Logo</div>
//       <ul className="space-y-6">
//         <li>
//           <Link to="/" className="flex items-center space-x-4 px-6 py-3 text-xl rounded-md hover:bg-white hover:text-black transition-all duration-300 active:bg-blue-700">
//             <FaHome />
//             <span>Dashboard</span>
//           </Link>
//         </li>
//         <li>
//           <Link to="/role" className="flex items-center space-x-4 px-6 py-3 text-xl rounded-md hover:bg-white hover:text-black transition-all duration-300">
//             <FaChalkboardTeacher />
//             <span>Role</span>
//           </Link>
//         </li>
//         <li>
//           <Link to="/users" className="flex items-center space-x-4 px-6 py-3 text-xl rounded-md hover:bg-white hover:text-black transition-all duration-300">
//             <FaUsers />
//             <span>Users</span>
//           </Link>
//         </li>
//         <li>
//           {/* <Link to="/profile" className="flex items-center space-x-4 px-6 py-3 text-xl rounded-md hover:bg-white hover:text-black transition-all duration-300">
//             <FaUser />
//             <span>Profile</span>
//           </Link> */}
//         </li>
//         <li>
//           <Link to="/category" className="flex items-center space-x-4 px-6 py-3 text-xl rounded-md hover:bg-white hover:text-black transition-all duration-300">
//             <AiOutlineAppstore />
//             <span>Product Taxonomy</span>
//           </Link>
//         </li>
//         {/* <li>
//           <Link to="/subcategory" className="flex items-center space-x-4 px-6 py-3 text-xl rounded-md hover:bg-white hover:text-black transition-all duration-300">
//             <HiOutlineTag />
//             <span>Sub Category</span>
//           </Link>
//         </li> */}
//         <li>
//           <Link to="/settings" className="flex items-center space-x-4 px-6 py-3 text-xl rounded-md hover:bg-white hover:text-black transition-all duration-300">
//             <FaCogs />
//             <span>Settings</span>
//           </Link>
//         </li>
//       </ul>
//     </div>
//   );
// }

// export default Sidebar;









































// import { Link } from 'react-router-dom';

// const Sidebar = () => {
//   return (
//     <div className="w-full sm:w-64 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 flex-none h-full p-4 sm:p-6">
//       <div className="text-center text-3xl font-bold mb-8">Logo</div>
//       <ul className="space-y-6">
//         <li><Link to="/" className="block px-6 py-3 text-xl rounded-md hover:bg-indigo-300 transition-all duration-300">Dashboard</Link></li>
//         <li><Link to="/role" className="block px-6 py-3 text-xl rounded-md hover:bg-indigo-300 transition-all duration-300">Role</Link></li>
//         <li><Link to="/users" className="block px-6 py-3 text-xl rounded-md hover:bg-indigo-300 transition-all duration-300">Users</Link></li>
//         <li><Link to="/profile" className="block px-6 py-3 text-xl rounded-md hover:bg-indigo-300 transition-all duration-300">Profile</Link></li>
//         <li><Link to="/settings" className="block px-6 py-3 text-xl rounded-md hover:bg-indigo-300 transition-all duration-300">Settings</Link></li>
//       </ul>
//     </div>
//   );
// }

// export default Sidebar;










































































// import { Link } from 'react-router-dom';

// const Sidebar = () => {
//   return (
//     <div className="w-64 sm:w-48 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 flex-none h-full p-4 md:p-6">
//       <div className="text-center text-3xl font-bold mb-8">Logo</div>
//       <ul className="space-y-6">
//         <li><Link to="/" className="block px-6 py-3 text-xl rounded-md hover:bg-indigo-300 transition-all duration-300">Dashboard</Link></li>
//         <li><Link to="/role" className="block px-6 py-3 text-xl rounded-md hover:bg-indigo-300 transition-all duration-300">Role</Link></li>
//         <li><Link to="/users" className="block px-6 py-3 text-xl rounded-md hover:bg-indigo-300 transition-all duration-300">Users</Link></li>
//         <li><Link to="/profile" className="block px-6 py-3 text-xl rounded-md hover:bg-indigo-300 transition-all duration-300">Profile</Link></li>
//         <li><Link to="/settings" className="block px-6 py-3 text-xl rounded-md hover:bg-indigo-300 transition-all duration-300">Settings</Link></li>
//       </ul>
//     </div>
//   );
// }

// export default Sidebar;
