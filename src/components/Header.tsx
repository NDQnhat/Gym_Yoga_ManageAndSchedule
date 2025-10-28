import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { apis } from '../apis';
import { message } from 'antd';

export default function Header() {
    const navigate = useNavigate();
    const [currentUserId, setCurrentUserId] = useState("");
    const [currentUserRole, setCurrentUserRole] = useState("");
    const [username, setUsername] = useState("");

    useEffect(() => {
        const userId = localStorage.getItem("currentUserId") as string; /*khong .stringtify */
        if (!userId) return;

        setCurrentUserId(userId);

        const getUsername = async () => {
            try {
                const name = await apis.userApi.findNameById(userId);
                setUsername(name);
            } catch (error: any) {
                message.error(error.message || "Fail to find User!");
            }
        };
        getUsername();

        setCurrentUserRole(localStorage.getItem("currentRole") as string);
    }, []);

    return (
        <header className="bg-slate-800 text-white py-4 px-6 sticky top-0 z-999">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold pointer-events-none" onClick={() => {
                    navigate("/");
                }}>GYM MANAGEMENT</h1>
                <nav className="flex gap-6">
                    <button className="hover:text-gray-300 cursor-pointer" onClick={() => {
                        navigate("/");
                    }}>Trang chủ</button>

                    {currentUserRole === "admin" ?
                        <><button className="hover:text-gray-300 cursor-pointer" onClick={() => {
                                navigate("/admin");
                            }}>Quản lý</button>
                            <button className="hover:text-gray-300 cursor-pointer" onClick={() => {
                                navigate("/booking");
                            }}>Lịch tập</button></>
                        : <button className="hover:text-gray-300 cursor-pointer" onClick={() => {
                            navigate("/booking");
                        }}>Lịch tập</button>
                    }

                    {username ? (
                        <>
                            <div className='text-amber-300'>Xin chào, {username}</div>
                            <button
                                className="hover:text-gray-300 cursor-pointer"
                                onClick={() => {
                                    navigate("/signin");
                                    localStorage.clear();
                                }}
                            >
                                Đăng xuất
                            </button>
                        </>
                    ) : (
                        <button
                            className="hover:text-gray-300 cursor-pointer"
                            onClick={() => {
                                navigate("/signin");
                            }}
                        >
                            Đăng nhập
                        </button>
                    )}
                </nav>
            </div>
        </header>
    )
}
