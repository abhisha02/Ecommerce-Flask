import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/user/RegisterPage';
import LoginPage from './pages/common/LoginPage';
import AdminDashBoard from './pages/admin/AdminDashBoard';
import Dashboard from './pages/user/Dashboard';
import CartPage from './pages/user/CartPage';
import NotFoundPage from './pages/common/NotFoundPage';



const App = () => {
  return (
    <Routes>
      
       
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/cart" element={<CartPage />} />
             {/* Admin Routes */}
            <Route path="admin" element={<AdminDashBoard />}>
            
          
        </Route>
        
      
       
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;