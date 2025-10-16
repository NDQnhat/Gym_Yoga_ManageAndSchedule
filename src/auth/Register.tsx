import React, { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import type { ValidationSignupResult } from '../utils/core/ValidateRegister';
import { validate } from '../utils';

export interface FormSignup {
    fullname: string,
    email: string,
    phoneNum: string, 
    password: string,
    confirmPassword: string,
};

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormSignup | null>(null);
    const [showError,setShowError] = useState<boolean>(false);
    const [errors, setErrors] = useState<string[]>([]);

    const handleSubmit = (e: FormEvent) => {
        setFormData({
            fullname: (e.target as any).fullname,
            phoneNum: (e.target as any).phoneNum,
            email: (e.target as any).email,
            password: (e.target as any).password,
            confirmPassword: (e.target as any).confirmPassword,
        });

        const result: ValidationSignupResult = validate.signup(formData as FormSignup);

        {/*if (result.errors.length !== 0) {
            setErrors(result.errors);
        }*/}

        if (!result.isValid) {
            setErrors(result.errors);
            setShowError(true);
            return;
        }

        alert("Đăng ký thanh công!");
        navigate("/signin");
    }

    useEffect(() => {}, [showError]);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-md w-full max-w-md p-8">
                <h2 className="text-2xl font-bold text-center mb-6">Đăng Ký Tài Khoản</h2>

                <form onSubmit={(e) => {
                    handleSubmit(e);
                }} className="space-y-4">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                            Họ và tên
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter fullname"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter email"
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Số điện thoại
                        </label>
                        <input
                            type="text"
                            name="phoneNum"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your phone number"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            name="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Xác nhận mật khẩu
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Confirm your password"
                        />
                    </div>

                    {
                        !showError && 
                        (<div className="space-y-1 mb-4">
                            {errors.map((item, index) => {
                                return <p key={index} className="text-red-600 text-sm">{item}</p>
                            })}
                        </div>)
                    }

                    <button
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition my-3"
                    >
                        Đăng Ký
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Đã có tài khoản?
                    <button className="text-blue-600 hover:underline font-medium ms-1 cursor-pointer" onClick={() => {
                        navigate("/signin")
                    }}>
                        Đăng nhập ngay
                    </button>
                </div>
            </div>
        </div>
    )
}
