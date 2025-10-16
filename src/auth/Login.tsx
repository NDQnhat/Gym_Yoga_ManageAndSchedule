import { useState } from 'react';
import { useNavigate } from "react-router";

export default function Login() {
    const navigate = useNavigate();
    

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-md w-full max-w-md p-8">
                <h2 className="text-2xl font-bold text-center mb-6">Đăng Nhập</h2>

                <form className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type='submit'
                        className="w-full bg-blue-600 my-5 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        Đăng Nhập
                    </button>
                </form>

                <div className="text-center text-sm text-gray-600">
                    Chưa có tài khoản?
                    <button className="text-blue-600 hover:underline font-medium ms-1 cursor-pointer" onClick={() => {
                        navigate("/signup");
                    }} >
                        Register now
                    </button>
                </div>
            </div>
        </div>
    );
}