import React from 'react'
import Card from "../../components/Card"

// img dung` tam.
import cardimg1 from "../../assets/cardimg1.png"
import cardimg2 from "../../assets/cardimg2.png"
import cardimg3 from "../../assets/cardimg3.png"
import { useNavigate } from 'react-router'

export default function Home() {
    const navigate = useNavigate();

    const classes = [
        {
            id: 1,
            image: cardimg1,
            title: 'Gym',
            description: 'Tập luyện với các thiết bị hiện đại',
            buttonText: 'Đặt lịch'
        },
        {
            id: 2,
            image: cardimg2,
            title: 'Yoga',
            description: 'Thư giãn và cân bằng tâm trí',
            buttonText: 'Đặt lịch'
        },
        {
            id: 3,
            image: cardimg3,
            title: 'Zumba',
            description: 'Đốt cháy calories với những điệu nhảy sôi động',
            buttonText: 'Đặt lịch'
        }
    ];

    return (
        <div className="min-h-screen">
            <header className="bg-slate-800 text-white py-4 px-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold cursor-pointer" onClick={() => {
                        navigate("/");
                    }}>GYM MANAGEMENT</h1>
                    <nav className="flex gap-6">
                        <button className="hover:text-gray-300 cursor-pointer" onClick={() => {
                        navigate("/");
                    }}>Trang chủ</button>
                        <button className="hover:text-gray-300 cursor-pointer" onClick={() => {
                        // navigate("/");
                    }}>Lịch tập</button>
                        <button className="hover:text-gray-300 cursor-pointer" onClick={() => {
                        navigate("/signin");
                    }}>Đăng nhập</button>
                    </nav>
                </div>
            </header>

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
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
                        {classes.map((classItem) => (
                            <Card
                                key={classItem.id}
                                image={classItem.image}
                                title={classItem.title}
                                description={classItem.description}
                                buttonText={classItem.buttonText}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <footer className="bg-slate-800 text-white py-12 px-[72.5px]">
                <div className="max-w-7xl mx-2 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">Về chúng tôi</h3>
                        <p className="text-gray-300">
                            Gym Management - Nơi bạn bắt đầu hành trình fitness của mình với các trang thiết bị hiện đại và đội ngũ huấn luyện viên chuyên nghiệp.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4">Liên hệ</h3>
                        <p className="text-gray-300 mb-2">Email: contact@gym.com</p>
                        <p className="text-gray-300 mb-2">Phone: (123) 456-7890</p>
                        <p className="text-gray-300">Địa chỉ: 123 Đường ABC, Quận XYZ</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4">Theo dõi chúng tôi</h3>
                        <div className="flex gap-4">
                            <button className="text-gray-300 hover:text-white">Facebook</button>
                            <button className="text-gray-300 hover:text-white">Instagram</button>
                            <button className="text-gray-300 hover:text-white">Twitter</button>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
                    © 2024 Gym Management. All rights reserved.
                </div>
            </footer>
        </div>
    );
}