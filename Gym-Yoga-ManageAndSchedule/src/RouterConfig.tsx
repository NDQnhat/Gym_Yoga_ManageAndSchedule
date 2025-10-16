import React from 'react'
import { Route, Routes } from 'react-router'
import Login from './auth/Login'
import Register from './auth/Register'
import Home from './pages/home_pages/Home'

export default function RouterConfig() {
  return (
    <Routes>
        <Route path='/signin' element={<Login/>} />
        <Route path='/signup' element={<Register/>} />
        <Route path='/' element={<Home/>} />
    </Routes>
  )
}
