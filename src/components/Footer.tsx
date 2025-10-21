import React from 'react'

export default function Footer() {
    return (
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
    )
}
