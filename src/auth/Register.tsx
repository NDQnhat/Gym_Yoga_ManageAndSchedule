import React, { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
// import type { ValidationSignupResult } from '../utils/core/ValidateRegister';
import { message } from 'antd';
import { validation } from '../utils/core/validation';
import { apis } from '../apis';

export interface FormSignup {
    fullname: string,
    email: string,
    phoneNum: string,
    password: string,
    rePass: string,
};

export interface ErrorType {
    fullname: string,
    email: string[],
    phoneNum: string,
    password: string,
    rePass: string,
};

export default function Register() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState<ErrorType>({ fullname: "", email: [], phoneNum: "", password: "", rePass: "" });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const data: FormSignup = {
            fullname: (e.target as any).fullname.value,
            phoneNum: (e.target as any).phoneNum.value,
            email: (e.target as any).email.value,
            password: (e.target as any).password.value,
            rePass: (e.target as any).rePass.value,
        };

        // client-side
        const result = validation.signup(data);
        setErrors(result);

        const hasError = Object.values(result).some(v =>
            Array.isArray(v) ? v.length > 0 : v !== ""
        );
        if (hasError) return;

        //cho server ktra email ton` tai.
        try {
            await apis.userApi.registerUser(data);
            message.success("Đăng ký thành công!");
            setTimeout(() => navigate("/signin"), 1000);
        } catch (err: any) {
            message.error(err.message || "Fail to Sign up!!");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-md w-full max-w-md p-8">
                <h2 className="text-2xl font-bold text-center mb-6">Đăng Ký Tài Khoản</h2>

                <form onSubmit={(e) => {
                    handleSubmit(e);
                }} className="space-y-4">
                    <div>
                        <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">
                            Họ và tên
                        </label>
                        <input
                            type="text"
                            name="fullname"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter fullname"
                            onChange={() =>
                                setErrors(prev => ({ ...prev, fullname: "" }))
                            }
                        />
                        {errors.fullname && <p className='mt-1 text-sm text-red-600 bg-red-100 border border-red-300 rounded px-3 py-1'>{errors.fullname}</p>}
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
                            onChange={() =>
                                setErrors(prev => ({ ...prev, email: [] }))
                            }
                        />
                        {errors.email.length > 0 && (
                            <ul className="mt-1 space-y-1">
                                {errors.email.map((item, idx) => (
                                    <li
                                        key={idx}
                                        className="text-sm text-red-600 bg-red-100 border border-red-300 rounded px-3 py-1"
                                    >
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        )}
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
                            onChange={() =>
                                setErrors(prev => ({ ...prev, phoneNum: "" }))
                            }
                        />
                        {errors.phoneNum && <p className='mt-1 text-sm text-red-600 bg-red-100 border border-red-300 rounded px-3 py-1'>{errors.phoneNum}</p>}
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
                            onChange={() =>
                                setErrors(prev => ({ ...prev, password: "" }))
                            }
                        />
                        {errors.password && <p className='mt-1 text-sm text-red-600 bg-red-100 border border-red-300 rounded px-3 py-1'>{errors.password}</p>}
                    </div>

                    <div>
                        <label htmlFor="rePass" className="block text-sm font-medium text-gray-700 mb-1">
                            Xác nhận mật khẩu
                        </label>
                        <input
                            type="password"
                            name="rePass"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Confirm your password"
                            onChange={() =>
                                setErrors(prev => ({ ...prev, rePass: "" }))
                            }
                        />
                        {errors.rePass && <p className='mt-1 text-sm text-red-600 bg-red-100 border border-red-300 rounded px-3 py-1'>{errors.rePass}</p>}
                    </div>

                    <button
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition my-3"
                    >
                        Đăng Ký
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Đã có tài khoản?
                    <button className="text-blue-600 hover:underline font-medium ms-1 cursor-pointer" onClick={() => {
                        navigate("/signin");
                    }}>
                        Login now
                    </button>
                </div>
            </div>
        </div>
    )
}
