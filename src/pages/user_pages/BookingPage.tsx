import { Button, DatePicker, message, Modal, Table, type DatePickerProps } from 'antd'
import React, { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router';
import type { Bookings } from '../../types/bookings.type';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, StoreType } from '../../stores';
import { getBookings } from '../../stores/slices/bookings.thunk';
import type { UserBookings } from '../../types/user_bookings.type';
import ConvertBookings from './ConvertBookings';
import type { Course } from '../../types/course.type';
import { getCourses } from '../../stores/slices/course.thunk';
import { validateBookingModal } from '../../utils/core/validate.booking_modal';

export default function BookingPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState<UserBookings[]>([]);
  const store = useSelector((state: StoreType) => state.bookingsThunk.data);
  const dispatch = useDispatch<AppDispatch>();
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [dateChosen, setDateChosen] = useState("");

  const showModal = () => {
    setIsModalOpen(true);
    // console.log(dateChosen);
    // console.log(typeof dateChosen);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: 'Lớp học',
      dataIndex: 'course',
      key: 'course',
    },
    {
      title: 'Ngày tập',
      dataIndex: 'bookingDate',
      key: 'bookingDate',
    },
    {
      title: 'Khung giờ',
      dataIndex: 'bookingTime',
      key: 'bookingTime',
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullname',
      key: 'fullname',
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

  const onChange: DatePickerProps['onChange'] = (_, dateString) => {
    // console.log(dateString);
    // console.log(typeof dateString);
    setDateChosen(dateString as string);
  };

  useEffect(() => {
    if (!localStorage.getItem("currentUserId")) {
      message.error("Sign in required");
      setTimeout(() => { navigate("/signin") }, 500);
    }
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem('currentUserId') || '';
    const courseName = (e.target as any).course?.value || '';
    const courseObj = allCourses.find(c => c.name === courseName);
    const courseId = courseObj ? courseObj.id : '';
    const bookingDate = dateChosen;
    const bookingTime = (e.target as any).bookingTime?.value || '';

    const errors = validateBookingModal(
      { userId, courseId, bookingDate, bookingTime },
      store // store là bookingsThunk.data
    );
    if (errors.length > 0) {
      message.error(errors.map(e => e.message).join(' '));
      return;
    }
    // khi form đóng thì tự đổi sang option đuầ tiên trong select ?????
    console.log(courseName);
    console.log(bookingTime);
    
    message.success("Thêm lịch mới thành công!");
    (e.target as any).reset(); //khong rest form??
    setIsModalOpen(false);
    // ...existing logic submit booking...
  }

  useEffect(() => {
    const userId = localStorage.getItem("currentUserId");
    if (!userId) {
      message.error("Log in required!!");
      setTimeout(() => navigate("/signin"), 500);
      return;
    }
    const fetchData = async () => {
      try {
        const action = await dispatch(getBookings(userId));
        if (getBookings.fulfilled.match(action)) {
          const bookings = action.payload;
          const converted = await ConvertBookings(bookings);
          setTableData(converted);
        }

        const courseAction = await dispatch(getCourses());
        if (getCourses.fulfilled.match(courseAction)) {
          setAllCourses(courseAction.payload);
        }
      } catch (error) {
        message.error((error as any).message);
      }
    };
    fetchData();
  }, [store]);

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
              onOk={() => {
                const form = document.getElementById("modalFormAdd") as HTMLFormElement;
                form?.requestSubmit();
                // setIsModalOpen(false);
              }}
              okText="Lưu"
              onCancel={handleCancel}
              cancelText="Hủy"
              cancelButtonProps={{ style: { background: "gray", color: "whitesmoke" } }}
            >
              <form id='modalFormAdd' onSubmit={(e) => {handleSubmit(e)}}>
                <div className='my-3'>
                  <label htmlFor="class" className="block mb-1 font-medium text-gray-700">Lớp học</label>
                  <select id="course" name="course" className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option disabled selected value="">-- Chọn lớp học --</option>
                    {allCourses && allCourses.map((course) => (
                      <option key={course.id} value={course.name}>{course.name}</option>
                    ))}
                  </select>
                </div>
                <div className='my-3'>
                  <label htmlFor="date" className="block mb-1 font-medium text-gray-700">Ngày tập</label>
                  {/* <input type="date" id="date" name="date" className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" /> */}
                  <DatePicker onChange={onChange} className='w-full' style={{border: "1px solid black"}} />
                </div>
                <div className='my-3'>
                  <label htmlFor="bookingTime" className="block mb-1 font-medium text-gray-700">Khung giờ</label>
                  <select id="bookingTime" name="bookingTime" className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option disabled selected value="">-- Chọn khung giờ --</option>
                    <option value="07:00 - 09:00">Sáng (07:00 - 09:00)</option>
                    <option value="14:00 - 16:00">Chiều (14:00 - 16:00)</option>
                    <option value="18:00 - 20:00">Tối (18:00 - 20:00)</option>
                  </select>
                </div>
              </form>

            </Modal>
          </div>

          <div className="pb-6">
            <Table
              columns={columns}
              dataSource={tableData}
              pagination={false}
              locale={{ emptyText: 'Không có dữ liệu' }}
              rowKey={(record) => record.bookingDate + record.bookingTime + record.email}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
