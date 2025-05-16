import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import Navbar from './Components/Navbar';
import Settings from './Components/Settings';
import Profile from './Components/Profile';
import Users from './Components/Users';
import Dashboard from './Components/Dashboard';
import Role from './Components/Role';
import Category from './Components/Category';
import SubCategory from './Components/SubCategory';
import Products from './Components/Products';
import Retailer from './Components/Retailer';
import RetailerOrdersPage from './Components/RetailerOrdersPage'; // New import
import RetailerProductsPage from './Components/RetailerProductsPage'; // New import

const App = () => {
  return (
    <Router>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />

        <div className="flex flex-col flex-grow">
          {/* Navbar */}
          <Navbar />

          {/* Main Content */}
          <main className="flex-grow p-2">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/role" element={<Role />} />
              <Route path="/users" element={<Users />} />
              <Route path="/category" element={<Category />} />
              <Route path="/subcategory" element={<SubCategory />} />
              <Route path="/products" element={<Products />} />
              <Route path="/retailer" element={<Retailer />} />
              <Route path="/retailer/:retailerId/orders" element={<RetailerOrdersPage />} />
              <Route path="/retailer/:retailerId/products" element={<RetailerProductsPage />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;