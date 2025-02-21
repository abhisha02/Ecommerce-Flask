import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AdminDashBoard from './pages/admin/AdminDashBoard';
import Dashboard from './pages/Dashboard';
import CartPage from './pages/CartPage';



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
        
      
       
   
    </Routes>
  );
};

export default App;