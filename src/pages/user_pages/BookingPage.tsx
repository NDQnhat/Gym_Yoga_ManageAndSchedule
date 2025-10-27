import { Button, DatePicker, Empty, message, Modal, Pagination, Popconfirm, Table, type DatePickerProps } from 'antd'
import React, { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router';
import type { Bookings } from '../../types/bookings.type';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, StoreType } from '../../stores';
import { deleteBookings, getBookings, makeNewBookings, updateBookings } from '../../stores/thunk/bookings.thunk';
import type { UserBookings } from '../../types/user_bookings.type';
import ConvertBookings from './ConvertBookings';
import type { Course } from '../../types/course.type';
import { getCourses } from '../../stores/thunk/course.thunk';
import { validateBookingModal } from '../../utils/core/validate.booking_modal';
import { apis } from '../../apis';
import dayjs from 'dayjs';

interface DataEditType {
  bookingDate: string,
  bookingTime: string,
}

export default function BookingPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState<UserBookings[]>([]);
  const store = useSelector((state: StoreType) => state.bookingsThunk.data);
  const dispatch = useDispatch<AppDispatch>();
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [dateChosen, setDateChosen] = useState("");
  const [confirmToDel, setConfirmToDel] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(5);
  const [bookingsQuantity, setBookingsQuantity] = useState(0);
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [bookingIdToDelete, setBookingIdToDelete] = useState<string>("");
  const [bookings, setBookings] = useState<Bookings[]>([]);
  const [currentDataEdit, setCurrentDataEdit] = useState<DataEditType | null>(null);
  const [dataToUpdate, setDataToUpdate] = useState<Bookings>({ userId: "", status: "confirmed", courseId: "", bookingTime: "", bookingDate: "" });

  const showModal = () => {
    setIsModalOpen(true);
    // console.log(dateChosen);
    // console.log(typeof dateChosen);
  };

  const handleCancel = (type?: 'add/edit' | 'delete') => {
    if (type === 'add/edit') setIsModalOpen(false);
    if (type === 'delete') setConfirmToDel(false);
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
      /*render: (value, record, index) => ( Renderer of the table cell. value is the value of current cell; record is the value object of current row; index is the row number. The return value should be a ReactNode */
      render: (_: any, record: UserBookings) => (
        <div className="flex gap-2">
          <Button type="link" className="p-0" onClick={() => {
            // console.log("record: ", record);
            setCurrentDataEdit({ bookingDate: record.bookingDate, bookingTime: record.bookingTime });
            setDataToUpdate({
              id: record.bookingId,
              userId: localStorage.getItem("currentUserId") as string,
              status: "confirmed",
              courseId: record.courseId,
              bookingTime: record.bookingTime, //2 cai' nay` se~ update sau khi confirm ok
              bookingDate: record.bookingDate,
            });
            setModalType("edit");
            setIsModalOpen(true);
          }}>Sửa</Button>
          <Button type="link" onClick={() => {
            setConfirmToDel(true);
            setBookingIdToDelete(record.bookingId);
            // console.log("record del: ", record);
          }} danger className="p-0">Xóa</Button>
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem('currentUserId') || '';
    const courseName = (e.target as any).course?.value || '';
    const courseObj = allCourses.find(c => c.name === courseName);
    const courseId = courseObj ? courseObj.id : '';
    const bookingDate = dateChosen;
    const bookingTime = (e.target as any).bookingTime?.value || '';

    // Fetch toan` bo. booking cua user de? kiem? tra trung` lap.
    let allUserBookings: Bookings[] = [];
    try {
      const res = await apis.bookingsApi.getAll(userId);
      allUserBookings = res;
    } catch (err) {
      message.error('Không thể kiểm tra trùng lặp lịch tập!');
      return;
    }

    const errors = validateBookingModal(
      { userId, courseId, bookingDate, bookingTime },
      allUserBookings
    );
    if (errors.length > 0) {
      message.error(errors.map(e => e.message).join(' '));
      return;
    }

    const newBookings: Bookings = {
      userId,
      courseId,
      status: "confirmed",
      bookingTime,
      bookingDate
    };

    try {
      const action = await dispatch(makeNewBookings(newBookings));
      if (makeNewBookings.fulfilled.match(action)) {
        message.success("Thêm lịch mới thành công!");
        setIsModalOpen(false);
        const refreshed = await dispatch(getBookings({ id: userId, currentPage, perPage }));
        if (getBookings.fulfilled.match(refreshed)) {
          const converted = await ConvertBookings(refreshed.payload);
          setTableData(converted);
        }
      }
    } catch (error) {
      message.error((error as any).message);
    }
    setIsModalOpen(false);
  }

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // setDataToUpdate((prev) => ({
    //   ...prev,
    //   bookingDate: dateChosen,
    //   bookingTime: (e.target as any).bookingTime?.value || ''
    // })); dâtToUpdate la` bat' dong` bo. nen du~ lieu. van~ la` cu~

    const bookingDate = dateChosen;
    const bookingTime = (e.target as any).bookingTime?.value || '';
    const updatedData = {
      ...dataToUpdate,
      bookingDate,
      bookingTime,
    };

    try {
      console.log(dataToUpdate);
      await dispatch(updateBookings({ id: updatedData.id as string, newData: updatedData }));
      message.success("Update successfully!");
      setIsModalOpen(false);
      // Cho load lai. du~ lieu. table
      const userId = localStorage.getItem("currentUserId") || "";
      const action = await dispatch(getBookings({ id: userId, currentPage, perPage }));
      if (getBookings.fulfilled.match(action)) {
        const converted = await ConvertBookings(action.payload);
        setTableData(converted);
      }
    } catch (error) {
      message.error((error as any).message);
    }
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
        const action = await dispatch(getBookings({ id: userId, currentPage, perPage }));
        const quantity = await apis.bookingsApi.getUserBookingsQuantity(userId);
        setBookingsQuantity(quantity);
        if (getBookings.fulfilled.match(action)) {
          // const bookings = action.payload;
          setBookings(action.payload);
          const converted = await ConvertBookings(bookings);
          setTableData(converted);
        } else {
          setTableData([]);
        }

        const courseAction = await dispatch(getCourses());
        if (getCourses.fulfilled.match(courseAction)) {
          setAllCourses(courseAction.payload);
        }
      } catch (error) {
        message.error((error as any).message);
        setTableData([]);
      }
    };
    fetchData();
  }, [currentPage, perPage, bookings]);

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
            <Button type="primary" size="large" onClick={() => {
              setModalType('add');
              showModal()
            }}>
              Đặt lịch mới
            </Button>
            <Modal
              key={isModalOpen ? 'open' : 'closed'} // isModalOpen thay doi? -> key cua? modal thya doi? theo -> unmount va` reumount tu` dau`
              title={modalType === "add" ? "Đặt lịch mới" : "Chỉnh sửa lịch đặt"}
              open={isModalOpen}
              onOk={() => {
                if (modalType === "add") {
                  const form = document.getElementById("modalFormAdd") as HTMLFormElement;
                  form?.requestSubmit();
                  return;
                }

                if (modalType === "edit") {
                  const form = document.getElementById("modalFormEdit") as HTMLFormElement;
                  form?.requestSubmit();
                  return;
                }
              }}
              okText="Lưu"
              onCancel={() => handleCancel("add/edit")}
              cancelText="Hủy"
              cancelButtonProps={{ style: { background: "gray", color: "whitesmoke" } }}
            >
              {
                modalType === "add" ?
                  <form id='modalFormAdd' onSubmit={(e) => { handleSubmit(e) }}>
                    <div className='my-3'>
                      <label htmlFor="class" className="block mb-1 font-medium text-gray-700">Lớp học</label>
                      <select id="course" defaultValue="" name="course" className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option disabled value="">-- Chọn lớp học --</option>
                        {allCourses && allCourses.map((course) => (
                          <option key={course.id} value={course.name}>{course.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className='my-3'>
                      <label htmlFor="date" className="block mb-1 font-medium text-gray-700">Ngày tập</label>
                      <DatePicker onChange={onChange} className='w-full' style={{ border: "1px solid black" }} />
                    </div>
                    <div className='my-3'>
                      <label htmlFor="bookingTime" className="block mb-1 font-medium text-gray-700">Khung giờ</label>
                      <select id="bookingTime" defaultValue="" name="bookingTime" className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option disabled value="">-- Chọn khung giờ --</option>
                        <option value="07:00 - 09:00">Sáng (07:00 - 09:00)</option>
                        <option value="14:00 - 16:00">Chiều (14:00 - 16:00)</option>
                        <option value="18:00 - 20:00">Tối (18:00 - 20:00)</option>
                      </select>
                    </div>
                  </form>

                  : <form id='modalFormEdit' onSubmit={(e) => { handleEditSubmit(e) }}>
                    <div className='my-3'>
                      <label htmlFor="date" className="block mb-1 font-medium text-gray-700">Ngày tập</label>
                      <DatePicker onChange={onChange} defaultValue={currentDataEdit?.bookingDate ? dayjs(currentDataEdit.bookingDate) : undefined} className='w-full' style={{ border: "1px solid black" }} />
                    </div>
                    <div className='my-3'>
                      <label htmlFor="bookingTime" className="block mb-1 font-medium text-gray-700">Khung giờ</label>
                      <select id="bookingTime" defaultValue={currentDataEdit?.bookingTime} name="bookingTime" className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option disabled value="">-- Chọn khung giờ --</option>
                        <option value="07:00 - 09:00">Sáng (07:00 - 09:00)</option>
                        <option value="14:00 - 16:00">Chiều (14:00 - 16:00)</option>
                        <option value="18:00 - 20:00">Tối (18:00 - 20:00)</option>
                      </select>
                    </div>
                  </form>
              }

            </Modal>
          </div>

          <div className="pb-6">
            <Table
              columns={columns}
              dataSource={tableData}
              pagination={false}
              locale={{
                emptyText: <Empty description="Bạn chưa co lịch tập nào!!" />,
              }}
              rowKey={(record) => record.bookingDate + record.bookingTime + record.email}
            />
            <Pagination align="end" current={currentPage} pageSize={perPage} total={bookingsQuantity} onChange={onPageChange} style={{ marginTop: "24px" }} />
            <Modal
              title="Bạn có xác nhận muốn xóa lịch đặt này?"
              open={confirmToDel}
              onOk={async () => {
                if (bookingIdToDelete) {
                  try {
                    await dispatch(deleteBookings(bookingIdToDelete));
                    message.success("Delete successfully!");
                    setConfirmToDel(false);
                    // Cho load lai. du~ lieu. table
                    const userId = localStorage.getItem("currentUserId") || "";
                    const action = await dispatch(getBookings({ id: userId, currentPage, perPage }));
                    if (getBookings.fulfilled.match(action)) {
                      const converted = await ConvertBookings(action.payload);
                      setTableData(converted);
                    }
                  } catch (error) {
                    message.error((error as any).message);
                  }
                }
              }}
              okText="Xóa"
              okButtonProps={{ style: { background: "#f5222d", color: "whitesmoke" } }}
              onCancel={() => handleCancel("delete")}
              cancelText="Hủy"
              cancelButtonProps={{ style: { background: "gray", color: "whitesmoke" } }}
            ></Modal>
          </div>
        </div>
      </main >
    </div >
  )
}
