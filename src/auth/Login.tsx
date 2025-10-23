import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from "react-router";
import { validation } from '../utils/core/validation';
// import { apis } from '../apis';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, StoreType } from '../stores';
import { checkSigninData } from '../stores/slices/user.thunk';
import { message } from 'antd';
import { userAction } from '../stores/slices/user.slice';

export interface FormSignin {
    email: string,
    password: string,
}

export default function Login() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState<FormSignin>({ email: "", password: "" });
    const dispatch = useDispatch<AppDispatch>();
    const userStore = useSelector((state: StoreType) => state.user);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const data: FormSignin = {
            email: (e.target as any).email.value,
            password: (e.target as any).password.value,
        };

        // client-side
        const result = validation.signin(data);
        setErrors(result);

        const hasError = Object.values(result).some(v => v !== "");
        if (hasError) return;

        //cho server ktra du~ lieu.
        const response = await dispatch(checkSigninData(data));

        if (checkSigninData.fulfilled.match(response)) {
            // console.log(response);
            localStorage.setItem("currentUserId", response.payload[0].id);
            localStorage.setItem("currentRole", response.payload[0].role);
            // userStore.data = response.payload;
            dispatch(userAction.setUser(response.payload[0]));
            message.success("Sign in successfully!");
            if (localStorage.getItem("currentRole") == "admin") {
                setTimeout(() => navigate("/admin"), 1000);
                return;
            }
            setTimeout(() => navigate("/"), 1000);
        } else {
            message.error((response.error as any).message || "Fail to Sign in!!");
        }
    };

    useEffect(() => {
        if (localStorage.getItem("currentUserId")) {
            message.success("You have already sign in!!");
            setTimeout(() => {
                if (localStorage.getItem("currentRole") == "admin") {
                    navigate("/admin");
                    return;
                }
                navigate("/");
            }, 1000);
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-md w-full max-w-md p-8">
                <h2 className="text-2xl font-bold text-center mb-6">Đăng Nhập</h2>

                <form className="space-y-4" onSubmit={(e) => handleSubmit(e)}>
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
                            onChange={() =>
                                setErrors(prev => ({ ...prev, email: "" }))
                            }
                        />
                        {errors.email && <p className='mt-1 text-sm text-red-600 bg-red-100 border border-red-300 rounded px-3 py-1'>{errors.email}</p>}
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
                            onChange={() =>
                                setErrors(prev => ({ ...prev, password: "" }))
                            }
                        />
                        {errors.password && <p className='mt-1 text-sm text-red-600 bg-red-100 border border-red-300 rounded px-3 py-1'>{errors.password}</p>}
                    </div>

                    <button
                        type='submit'
                        className="w-full bg-blue-600 mb-5 text-white py-2 rounded-md hover:bg-blue-700 transition"
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