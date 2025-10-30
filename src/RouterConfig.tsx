import React from 'react'
import { Route, Routes } from 'react-router'
import Login from './auth/Login'
import Register from './auth/Register'
import Home from './pages/home_pages/Home'
import BookingPage from './pages/user_pages/BookingPage'
import AdminLayout from './pages/admin_pages/AdminLayout'
import ServicesManagement from './pages/admin_pages/ServicesManagement'
import Statistical from './pages/admin_pages/Statistical'
import ProtectAdmin from './ProtectAdmin'
import UserManagement from './pages/admin_pages/UserManagement'

export default function RouterConfig() {
  return (
    <Routes>
      <Route path='/signin' element={<Login />} />
      <Route path='/signup' element={<Register />} />
      <Route path='/' element={<Home />} />
      <Route path='/booking' element={<BookingPage />} />
      <Route path='/admin' element={<ProtectAdmin><AdminLayout /></ProtectAdmin>} >
        <Route index element={<Statistical />} />
        <Route path='services' element={<ServicesManagement />} />
        <Route path='manage-users' element={<UserManagement />} />
      </Route>
    </Routes>
  )
}
