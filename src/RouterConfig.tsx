import React from 'react'
import { Route, Routes } from 'react-router'
import Login from './auth/Login'
import Register from './auth/Register'
import Home from './pages/home_pages/Home'
import BookingPage from './pages/user_pages/BookingPage'
import Dashboard from './pages/admin_pages/Dashboard'

export default function RouterConfig() {
  return (
    <Routes>
      <Route path='/signin' element={<Login />} />
      <Route path='/signup' element={<Register />} />
      <Route path='/' element={<Home />} />
      <Route path='/booking' element={<BookingPage />} />
      <Route path='/admin' element={<Dashboard />} />
    </Routes>
  )
}
