import React from 'react'
import Header from './components/Header.jsx'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Products from './pages/Products.jsx'
import AboutUs from './pages/AboutUs.jsx'
import ContactUs from './pages/ContactUs.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import VerifyOtp from './pages/VerifyOtp.jsx'
import Footer from './components/Footer.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'


const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="overflow-x-hidden max-w-full">
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path='/' element={<Navigate to='/home' replace />} />
        <Route path='/home' element={<Home />} />
        <Route path='/products' element={<Products />} />
        <Route path='/about-us' element={<AboutUs />} />
        <Route path='/contact-us' element={<ContactUs />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/verify-otp' element={<VerifyOtp />} />
        <Route path="/products/:id" element={<ProductDetails />} />

        {/* Admin Routes */}
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/admin/dashboard' element={<AdminDashboard />} />

      </Routes>
      {!isAdminRoute && <Footer />}
    </div>
  )
}

export default App
