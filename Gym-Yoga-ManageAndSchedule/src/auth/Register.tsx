import React from 'react'
import { useNavigate } from 'react-router'

export default function Register() {
    const navigate = useNavigate();

    // const [formData, setFormData] = useState({
    //     fullName: '',
    //     email: '',
    //     phone: '',
    //     password: '',
    //     confirmPassword: '',
    //     role: 'user'
    // });

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     console.log('Register data:', formData);
    // };

    // const handleChange = (e) => {
    //     setFormData({
    //         ...formData,
    //         [e.target.name]: e.target.value
    //     });
    // };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-md w-full max-w-md p-8">
                <h2 className="text-2xl font-bold text-center mb-6">Đăng Ký Tài Khoản</h2>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                            Họ và tên
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            // value={formData.fullName}
                            // onChange={handleChange}
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
                            id="email"
                            name="email"
                            // value={formData.email}
                            // onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter email"
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Số điện thoại
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            // value={formData.phone}
                            // onChange={handleChange}
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
                            id="password"
                            name="password"
                            // value={formData.password}
                            // onChange={handleChange}
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
                            id="confirmPassword"
                            name="confirmPassword"
                            // value={formData.confirmPassword}
                            // onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Confirm your password"
                        />
                    </div>

                    <button
                        // onClick={handleSubmit}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition my-3"
                    >
                        Đăng Ký
                    </button>
                </div>

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
