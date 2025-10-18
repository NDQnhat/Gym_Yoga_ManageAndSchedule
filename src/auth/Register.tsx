import React, { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
// import type { ValidationSignupResult } from '../utils/core/ValidateRegister';
import { validate } from '../utils';
import { message } from 'antd';
import { registerUser } from '../stores/slices/user.slice';

export interface FormSignup {
    fullname: string,
    email: string,
    phoneNum: string,
    password: string,
    rePass: string,
};

export default function Register() {
    const navigate = useNavigate();
    // const [formData, setFormData] = useState<FormSignup | null>(null);
    const [showError, setShowError] = useState<boolean>(false);
    const [errors, setErrors] = useState<string[]>([]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const data: FormSignup = {
            fullname: (e.target as any).fullname.value, // chú ý tên field: fullName
            phoneNum: (e.target as any).phoneNum.value,
            email: (e.target as any).email.value,
            password: (e.target as any).password.value,
            rePass: (e.target as any).rePass.value,
        };

        const result = validate.signup(data);

        if (!result.isValid) {
            setErrors(result.errors);
            setShowError(true);
            message.error("Vui lòng kiểm tra lại thông tin đăng ký!");
            return;
        }

        try {
            await dispatch(registerUser(data));
            message.success("Đăng ký thành công!");
            setTimeout(() => {
                navigate("/signin");
            }, 1000);
        } catch (err: any) {
            message.error(err.message || "Đăng ký thất bại!");
        }


        {/*alert("Đăng ký thành công!"*/ }

        // message.success("Đăng ký thành công!!");
        // setTimeout(() => {
            navigate("/signin");
        // }, 1000);
    };


    useEffect(() => { }, [showError]);

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
                            name="fullname"
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
                        <label htmlFor="rePass" className="block text-sm font-medium text-gray-700 mb-1">
                            Xác nhận mật khẩu
                        </label>
                        <input
                            type="password"
                            name="rePass"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Confirm your password"
                        />
                    </div>

                    {
                        showError &&
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
function dispatch(arg0: any) {
    throw new Error('Function not implemented.');
}

