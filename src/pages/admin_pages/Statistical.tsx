import { Button, Card, Col, DatePicker, Empty, Input, message, Modal, Pagination, Row, Select, Spin, Table, type DatePickerProps } from 'antd'
import { Column } from '@ant-design/plots';
import React, { useEffect, useState, type FormEvent } from 'react'
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../stores';
import { deleteBookings, getAllUsersBookingsPaginate, getBookings, makeNewBookings, updateBookings } from '../../stores/thunk/bookings.thunk';
import { apis } from '../../apis';
import { getCourses } from '../../stores/thunk/course.thunk';
import type { Course } from '../../types/course.type';
import type { Bookings } from '../../types/bookings.type';
import ConvertBookings from '../user_pages/ConvertBookings';
import type { UserBookings } from '../../types/user_bookings.type';
import { LoadingOutlined } from '@ant-design/icons';
import type { DataEditType } from '../user_pages/BookingPage';
import { validateBookingModal } from '../../utils/core/validate.booking_modal';
import dayjs from 'dayjs';
import { fetchUsersData } from '../../stores/thunk/user.thunk';
import type { User } from '../../types/user.type';

interface SelectOptionType {
    key: string,
    value: string,
    children: string,
}

export default function Statistical() {
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const dispatch = useDispatch<AppDispatch>();
    const [allCourses, setAllCourses] = useState<Course[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [tableData, setTableData] = useState<UserBookings[]>([]);
    const [dateFilterChosen, setDateFilterChosen] = useState("");
    const [emailFilter, setEmailFilter] = useState("");
    const [courseFilter, setCourseFilter] = useState<SelectOptionType>({ children: "", key: "", value: "" });
    const [statsData, setStatsData] = useState<{ type: string, quantity: number, color: string }[]>([]);
    const [config, setConfig] = useState({});
    const [chartLoading, setChartLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"add" | "edit">("add");
    const [dateChosen, setDateChosen] = useState("");
    const [currentDataEdit, setCurrentDataEdit] = useState<DataEditType | null>(null);
    const [confirmToDel, setConfirmToDel] = useState(false);
    const [bookingIdToDelete, setBookingIdToDelete] = useState<string>("");
    const [dataToUpdate, setDataToUpdate] = useState<Bookings>({ userId: "", status: "confirmed", courseId: "", bookingTime: "", bookingDate: "" });

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
            render: (_: any, record: any) => (
                <div className="flex gap-2">
                    <Button type="link" className="p-0" onClick={() => {
                        // console.log("record: ", record);
                        setCurrentDataEdit({ bookingDate: record.bookingDate, bookingTime: record.bookingTime });
                        setDataToUpdate({
                            id: record.bookingId,
                            userId: record.userId,
                            status: "confirmed",
                            courseId: record.courseId,
                            bookingTime: record.bookingTime,
                            bookingDate: record.bookingDate,
                        });
                        setDateChosen(record.bookingDate);
                        setModalType("edit");
                        setIsModalOpen(true);
                    }}>Sửa</Button>
                    <Button type="link" onClick={() => {
                        setConfirmToDel(true);
                        setBookingIdToDelete(record.bookingId);
                    }} danger className="p-0">Xóa</Button>
                </div>
            ),
        },
    ];

    const onChangeDateFilter: DatePickerProps['onChange'] = (date, dateString) => {
        if (!date) {
            setDateFilterChosen("");
            return;
        }
        setDateFilterChosen(dateString as string);
    };

    const onChangeEmail = (e: any) => {
        setEmailFilter(e.target.value);
    }

    const onChangeCourseFilter = (value: string, option: any) => {
        setCourseFilter(option);
    }

    const onPageChange = (page: number) => {
        setCurrentPage(page);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = (type?: 'add/edit' | 'delete') => {
        if (type === 'add/edit') setIsModalOpen(false);
        if (type === 'delete') setConfirmToDel(false);
    };

    const checkExistance = async (userId: string, courseId: string, bookingDate: string, bookingTime: string) => {
        // Fetch toan` bo. booking cua user de? kiem? tra trung` lap.
        let allUserBookings: Bookings[] = [];
        try {
            const res = await apis.bookingsApi.getAll(userId);
            allUserBookings = res;
        } catch (err) {
            message.error("Không thể kiểm tra trùng lặp lịch tập!");
            return false;
        }

        const errors = validateBookingModal(
            { userId, courseId, bookingDate, bookingTime },
            allUserBookings
        );
        if (errors.length > 0) {
            message.error(errors.map(e => e.message).join(' '));
            return false;
        }
        return true;
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const userId = (e.target as any).user?.value || '';
        const courseId = (e.target as any).course?.value || '';
        const bookingDate = dateChosen;
        const bookingTime = (e.target as any).bookingTime?.value || '';

        const isValid = await checkExistance(userId, courseId, bookingDate, bookingTime);
        if (!isValid) return;

        const newBookings: Bookings = {
            userId,
            courseId,
            status: "confirmed",
            bookingTime,
            bookingDate,
        };

        try {
            const action = await dispatch(makeNewBookings(newBookings));
            if (makeNewBookings.fulfilled.match(action)) {
                message.success("Thêm lịch mới cho người dùng thành công!");
                setIsModalOpen(false);
                // Cho load lai. du~ lieu. table
                const refreshed = await dispatch(getAllUsersBookingsPaginate({ currentPage, perPage, email: emailFilter, course: courseFilter.value, date: dateFilterChosen }));
                setTotalPages((refreshed.payload as any).items);
                if (getAllUsersBookingsPaginate.fulfilled.match(refreshed)) {
                    setTotalPages((refreshed.payload as any).items);
                    const bookingsData = (refreshed.payload as any).data ?? [];
                    const converted = await ConvertBookings(bookingsData);
                    setTableData(converted);
                }
            }
        } catch (error) {
            message.error((error as any).message);
        }
        setIsModalOpen(false);
    }

    const onChange: DatePickerProps['onChange'] = (_, dateString) => {
        setDateChosen(dateString as string);
    };

    const handleEditSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const bookingDate = dateChosen;
        const bookingTime = (e.target as any).bookingTime?.value || '';
        const updatedData = {
            ...dataToUpdate,
            bookingDate,
            bookingTime,
        };

        if (dataToUpdate.bookingDate === updatedData.bookingDate && dataToUpdate.bookingTime === updatedData.bookingTime) {
            message.warning("Nothing to change!!");
            setIsModalOpen(false);
            return;
        }

        const userId = localStorage.getItem("currentUserId") || "";
        const isValid = await checkExistance(userId, updatedData.courseId, bookingDate, bookingTime);
        if (!isValid) return;

        try {
            await dispatch(updateBookings({ id: updatedData.id as string, newData: updatedData }));
            message.success("Update successfully!");
            setIsModalOpen(false);
            // Cho load lai. du~ lieu. table
            const refreshed = await dispatch(getAllUsersBookingsPaginate({ currentPage, perPage, email: emailFilter, course: courseFilter.value, date: dateFilterChosen }));
            setTotalPages((refreshed.payload as any).items);
            if (getAllUsersBookingsPaginate.fulfilled.match(refreshed)) {
                setTotalPages((refreshed.payload as any).items);
                const bookingsData = (refreshed.payload as any).data ?? [];
                const converted = await ConvertBookings(bookingsData);
                setTableData(converted);
            }
        } catch (error) {
            message.error((error as any).message);
        }
    }

    useEffect(() => {
        const loadCoursesAndUsers = async () => {
            try {
                const courseAction = await dispatch(getCourses());
                const userAction = await dispatch(fetchUsersData());
                if (getCourses.fulfilled.match(courseAction)) {
                    setAllCourses(courseAction.payload);
                }
                if (fetchUsersData.fulfilled.match(userAction)) {
                    setAllUsers(userAction.payload);
                    return;
                }
                setAllCourses([]);
                setAllUsers([]);

            } catch (error) {
                setAllCourses([]);
                setAllUsers([]);
                message.error((error as any).message);
            }
        }
        loadCoursesAndUsers();
        console.log(allUsers);
    }, [dispatch]);

    const getRandomRgb = () => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgba(${r}, ${g}, ${b})`;
    }

    useEffect(() => {
        if (!allCourses || allCourses.length === 0) {
            setStatsData([]);
            setConfig({});
            return;
        }


        const buildStats = async () => {
            setChartLoading(true);
            try {
                const results = await Promise.allSettled(
                    allCourses.map((course) => apis.bookingsApi.getCourseBookingQuantity(course.id as string))
                );
                // console.log(results);

                const data = await Promise.all(
                    allCourses.map(async (course, index) => ({
                        type: course.name,
                        // quantity: await apis.bookingsApi.getCourseBookingQuantity(course.id),
                        quantity: (results[index] as any).status === "fulfilled" ? (results[index] as any).value : 0,
                        color: getRandomRgb(),
                    }))
                );
                setStatsData(data);

                const maxQuantity = Math.max(...data.map(d => d.quantity));

                const temp = {
                    data,
                    xField: 'type',
                    yField: 'quantity',
                    style: {
                        fill: (datum: any) => {
                            const index = data.findIndex(item => item.type === datum.type);
                            return index !== -1 ? data[index].color : '#999';
                        },
                    },
                    markBackground: {
                        style: {
                            fill: '#eee',
                        },
                    },
                    scale: {
                        y: {
                            domain: [0, Math.max(maxQuantity, 1)], //de? khi chua co' khoa' hoc. nao` duoc. dat. thi` y=1
                        },
                    },
                    legend: false,
                }
                setConfig(temp);
            }
            catch (error) {
                setStatsData([]);
                setConfig({});
            } finally {
                setChartLoading(false);
            }
        }
        buildStats();
    }, [allCourses]);

    useEffect(() => {
        const fetchAndFilterData = async () => {
            try {
                const action = await dispatch(getAllUsersBookingsPaginate({ currentPage, perPage, email: emailFilter, course: courseFilter.value, date: dateFilterChosen }));
                setTotalPages((action.payload as any).items);
                // console.log((action.payload as any).items);
                if (!getAllUsersBookingsPaginate.fulfilled.match(action)) {
                    setTableData([]);
                    return;
                }

                const converted = await ConvertBookings(((action.payload as any).data) as Bookings[]);
                setTableData(converted);
            } catch (error) {
                message.error((error as any).message);
                setTableData([]);
                setTotalPages(1);
            }
        };
        fetchAndFilterData();
    }, [perPage, currentPage, courseFilter, emailFilter, dateFilterChosen, dispatch]);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-[28px] font-semibold text-gray-800">Thống kê lịch tập</h1>
            </div>
            <Row gutter={[24, 24]} className="mb-8">
                {statsData.map((stat, index) => (
                    <Col xs={24} sm={12} lg={8} key={index}>
                        <Card className="border-0 shadow-sm">
                            <div className="text-sm mb-2 font-bold">Tổng số lịch {stat.type}</div>
                            <div className="text-4xl font-bold" style={{ color: stat.color }}>
                                {stat.quantity}
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {
                chartLoading
                    ? <div style={{ padding: 40, textAlign: 'center' }}><Spin indicator={<LoadingOutlined spin />} /><span className='ms-3'>Đang tải biểu đồ...</span></div>
                    : (Array.isArray((config as any).data) && (config as any).data.length > 0
                        ? <Column {...(config as any)} />
                        : <div style={{ padding: 40, textAlign: 'center' }}><Empty description="Không có dữ liệu biểu đồ" /></div>)
            }

            <div className="bg-white p-6 rounded-lg shadow-sm mb-6" id='filterAction'>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Bộ lọc</h3>

                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={8}>
                        <div className="mb-2">
                            <label className="text-sm text-gray-600">Lớp học</label>
                        </div>
                        <Select placeholder="Tất cả" className="w-full" size="large" onChange={onChangeCourseFilter}>
                            <Select.Option value="">Tất cả</Select.Option>
                            {allCourses && allCourses.map(course => {
                                return <Select.Option key={course.id} value={course.name}>{course.name}</Select.Option>
                            })}
                        </Select>
                    </Col>

                    <Col xs={24} sm={8}>
                        <div className="mb-2">
                            <label className="text-sm text-gray-600">Email</label>
                        </div>
                        <Input onChange={onChangeEmail} placeholder="Tìm theo email" size="large" className="w-full" />
                    </Col>

                    <Col xs={24} sm={8}>
                        <div className="mb-2">
                            <label className="text-sm text-gray-600">Ngày</label>
                        </div>
                        <DatePicker onChange={onChangeDateFilter} placeholder="Chọn ngày" className="w-full" size="large" /> {/*neu' can` co' the? them format="DD/MM/YY" */}
                    </Col>
                </Row>
            </div>

            <div className="py-6">
                <Button type="primary" size="large" onClick={() => {
                    setModalType('add');
                    showModal();
                }} className="bg-blue-500 hover:bg-blue-600 mb-4">+ Thêm lịch mới</Button>
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
                                    <label htmlFor="user" className="block mb-1 font-medium text-gray-700">Người dùng</label>
                                    <select id="user" defaultValue="" name="user" className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option disabled value="">-- Chọn người dùng --</option>
                                        {allUsers && allUsers.map((user) => (
                                            <option key={user.id} value={user.id}>{user.fullname}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='my-3'>
                                    <label htmlFor="course" className="block mb-1 font-medium text-gray-700">Lớp học</label>
                                    <select id="course" defaultValue="" name="course" className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option disabled value="">-- Chọn lớp học --</option>
                                        {allCourses && allCourses.map((course) => (
                                            <option key={course.id} value={course.id}>{course.name}</option>
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

                <Table
                    columns={columns}
                    dataSource={tableData}
                    pagination={false}
                    locale={{
                        emptyText: <Empty description="Chưa có lịch tập của User nào!!" />,
                    }}
                    rowKey={(record) => record.bookingId}
                />
                <Pagination align="center" current={currentPage} pageSize={perPage} total={totalPages} onChange={onPageChange} style={{ marginTop: "24px" }} />

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
                                const refreshed = await dispatch(getAllUsersBookingsPaginate({ currentPage, perPage, email: emailFilter, course: courseFilter.value, date: dateFilterChosen }));
                                setTotalPages((refreshed.payload as any).items);
                                if (getAllUsersBookingsPaginate.fulfilled.match(refreshed)) {
                                    setTotalPages((refreshed.payload as any).items);
                                    const bookingsData = (refreshed.payload as any).data ?? [];
                                    const converted = await ConvertBookings(bookingsData);
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
    )
}
