import { Button, message, Modal, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';

export default function BookingPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: 'Lớp học',
      dataIndex: 'className',
      key: 'className',
    },
    {
      title: 'Ngày tập',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Khung giờ',
      dataIndex: 'timeSlot',
      key: 'timeSlot',
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      key: 'action',
      render: () => (
        <div className="flex gap-2">
          <Button type="link" className="p-0">Sửa</Button>
          <Button type="link" danger className="p-0">Xóa</Button>
        </div>
      ),
    },
  ];
  const data: any = [];

  useEffect(() => {
    if (!localStorage.getItem("currentUserId")) {
      message.error("Sign in required");
      setTimeout(() => { navigate("/signin") }, 500);
    }
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-slate-800 text-white lg:px-20 md:px-8 py-4 flex justify-between items-center">
        <h1 className="font-bold px-4 pointer-events-none">GYM MANAGEMENT</h1>
        <div className="flex gap-4 lg:px-4 md:px-6">
          <a href="#" className="hover:text-gray-300" onClick={() => { navigate("/") }}>Trang chủ</a>
          <a href="#" className="hover:text-gray-300">Lịch tập</a>
        </div>
      </header>

      <main className="mx-auto lg:px-20 md:px-8 py-9">
        <div className="px-4">
          <div className="pb-7 flex justify-between items-center">
            <h2 className="text-[30px] font-semibold">Quản lý lịch tập</h2>
            <Button type="primary" size="large" onClick={showModal}>
              Đặt lịch mới
            </Button>
            <Modal
              title="Đặt lịch mới"
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <div>
                <div className='my-3'>
                  <label htmlFor="class" className="block mb-1 font-medium text-gray-700">Lớp học</label>
                  <select id="class" name="class" className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option disabled selected>-- Chọn lớp học --</option>
                    <option value="yoga">Yoga</option>
                    <option value="cardio">Cardio</option>
                    <option value="gym">Gym</option>
                  </select>
                </div>
                <div className='my-3'>
                  <label htmlFor="date" className="block mb-1 font-medium text-gray-700">Ngày tập</label>
                  <input type="date" id="date" name="date" className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className='my-3'>
                  <label htmlFor="timeSlot" className="block mb-1 font-medium text-gray-700">Khung giờ</label>
                  <select id="timeSlot" name="timeSlot" className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option disabled selected>-- Chọn khung giờ --</option>
                    <option value="07:00 - 09:00">Sáng (07:00 - 09:00)</option>
                    <option value="14:00 - 16:00">Chiều (14:00 - 16:00)</option>
                    <option value="18:00 - 20:00">Tối (18:00 - 20:00)</option>
                  </select>
                </div>
              </div>

            </Modal>
          </div>

          <div className="pb-6">
            <Table
              columns={columns}
              dataSource={data}
              pagination={false}
              locale={{ emptyText: 'Không có dữ liệu' }}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
