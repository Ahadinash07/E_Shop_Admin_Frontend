import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold tracking-wide">Dashboard</div>
        
        {/* Hamburger Icon on Small Screens */}
        <div className="sm:hidden">
          <button onClick={toggleMenu} className="text-2xl">
            {isOpen ? 'X' : '☰'}
          </button>
        </div>

        {/* Links Section */}
        <div className={`flex items-center space-x-6 ${isOpen ? 'block' : 'hidden'} sm:flex`}>
          <button className="bg-blue-700 hover:bg-blue-800 px-6 py-2 rounded-md transition-all duration-300"></button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;






























// import { useState } from 'react';

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleMenu = () => setIsOpen(!isOpen);

//   return (
//     <header className="bg-gray-800 text-white p-4 shadow-md">
//       <div className="flex items-center justify-between">
//         <div className="text-2xl font-semibold tracking-wide">Dashboard</div>
        
//         {/* Hamburger Icon on Small Screens */}
//         <div className="sm:hidden">
//           <button onClick={toggleMenu} className="text-2xl">
//             {isOpen ? 'X' : '☰'}
//           </button>
//         </div>

//         {/* Links Section */}
//         <div className={`flex items-center space-x-6 ${isOpen ? 'block' : 'hidden'} sm:flex`}>
//           <button className="bg-blue-700 hover:bg-blue-800 px-6 py-2 rounded-md transition-all duration-300"></button>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;









































































// const Navbar = () => {
//   return (
//     <header className="bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 p-4 shadow-md">
//       <div className="flex items-center justify-between">
//         <div className="text-2xl font-semibold tracking-wide">Dashboard</div>
//         <div className="flex items-center space-x-6">
//           <button className="bg-blue-700 hover:bg-blue-800 px-6 py-2 rounded-md transition-all duration-300">Button</button>
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Navbar;
