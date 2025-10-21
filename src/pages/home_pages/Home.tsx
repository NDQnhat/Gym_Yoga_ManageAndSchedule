import React, { useEffect } from 'react'
import Card from "../../components/Card"
import { useNavigate } from 'react-router'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import { getCourses } from '../../stores/slices/course.thunk'
import type { Course } from '../../types/course.type'
// import { message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, StoreType } from '../../stores'

export default function Home() {
    const navigate = useNavigate();
    // Không cần state cục bộ courses nữa
    const dispatch = useDispatch<AppDispatch>();
    const { data, loading, error } = useSelector((state: StoreType) => state.courseThunk);

    useEffect(() => {
        dispatch(getCourses());
    }, [dispatch]);

    return (
        <div className="min-h-screen">
            <Header />

            {/* <section className="relative h-[745px] flex items-center justify-center bg-[url('/src/assets/gym-bg.jpg')] bg-cover bg-center"> */}
            <section className="relative h-[196px] md:h-[428px] lg:h-[745] flex items-center justify-center bg-[url('/src/assets/home-gym-bg-test.jpg')] bg-cover bg-center"> {/*hinh` anh? mau~ */}
                <div className="relative text-center text-white z-956">
                    <h2 className="text-[50px] font-bold mb-4">Welcome to Our Gym</h2>
                    <p className="text-xl mb-6 text-[30px]">Transform Your Body, Transform Your Life</p>
                    <button className="bg-blue-600 text-white ps-[32px] pe-[37px] py-2 rounded-lg hover:bg-blue-700 transition text-lg font-medium cursor-pointer">
                        Bắt đầu ngay
                    </button>
                </div>
            </section>

            <section className="py-16 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-12">Các lớp học phổ biến</h2>
                    {loading && <p className='text-center'>Đang tải khóa học...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
                        {Array.isArray(data) && data.length > 0 && data.map((item: Course) => (
                            <Card
                                key={item.id}
                                image={item.imageUrl}
                                title={item.name}
                                description={item.description}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}