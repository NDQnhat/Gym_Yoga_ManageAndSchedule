import { Button, Card, Col, DatePicker, Empty, Input, message, Pagination, Row, Select, Table } from 'antd'
import { Column } from '@ant-design/plots';
import React, { useEffect, useState } from 'react'
import { Option } from 'antd/es/mentions';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../stores';
import { getAllUsersBookingsPaginate } from '../../stores/thunk/bookings.thunk';
import { apis } from '../../apis';
import { getCourses } from '../../stores/thunk/course.thunk';
import type { Course } from '../../types/course.type';
import type { Bookings } from '../../types/bookings.type';
import ConvertBookings from '../user_pages/ConvertBookings';
import type { UserBookings } from '../../types/user_bookings.type';

export default function Statistical() {
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage] = useState(5);
    const [bookingsQuantity, setBookingsQuantity] = useState(0);
    // const [bookingsQuantity, setBookingsQuantity] = useState<any>(0);
    const dispatch = useDispatch<AppDispatch>();
    const [allCourses, setAllCourses] = useState<Course[]>([]);
    const [bookings, setBookings] = useState<Bookings[]>([]);
    const [tableData, setTableData] = useState<UserBookings[]>([]);

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
                    <Button type="link" className="p-0" onClick={() => { }}>Sửa</Button>
                    <Button type="link" onClick={() => { }} danger className="p-0">Xóa</Button>
                </div>
            ),
        },
    ];

    const statsData = [
        { type: 'Gym', quantity: 1, color: '#2563EB' },
        { type: 'Yoga', quantity: 3, color: '#059669' },
        { type: 'Zumba', quantity: 2, color: '#7C3AED' },
    ];

    const config = {
        data: statsData,
        xField: 'type',
        yField: 'quantity',
        style: {
            fill: (datum: any) => {
                if (datum.type === 'Gym') return '#2563EB';
                if (datum.type === 'Yoga') return '#059669';
                if (datum.type === 'Zumba') return '#7C3AED';
                return '#999';
            },
        },
        markBackground: {
            style: {
                fill: '#eee',
            },
        },
        scale: {
            y: {
                domain: [0, 3],
            },
        },
        legend: false,
    };

    const onPageChange = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const action = await dispatch(getAllUsersBookingsPaginate({ currentPage, perPage }));
                const quantity = await apis.bookingsApi.getAllUsersBookingsQuantity();
                setBookingsQuantity(quantity);
                if (getAllUsersBookingsPaginate.fulfilled.match(action)) {
                    // console.log("action", action);
                    // console.log(action.payload);
                    const temp: any = action.payload;
                    // console.log("temp:", temp);
                    setBookings(temp.data);
                    // setBookings(action.payload.data.data);
                    
                    const converted = await ConvertBookings(temp.data);
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
    }, [perPage, currentPage]);

    useEffect(() => {
        console.log("bookings", bookings);// setBooking la` bat' dong` bo. nen useefect tren khong doi. gia tri. cua? booking sau khi set duo.
    }, [bookings]);

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

            <div className="bg-white p-6 rounded-lg shadow-sm mb-6"><Column {...config} /></div>

            <div className="bg-white p-6 rounded-lg shadow-sm mb-6" id='filterAction'>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Bộ lọc</h3>

                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={8}>
                        <div className="mb-2">
                            <label className="text-sm text-gray-600">Lớp học</label>
                        </div>
                        <Select placeholder="Tất cả" className="w-full" size="large">
                            <Option value="">Tất cả</Option>
                            <Option value="gym">Gym</Option>
                            <Option value="yoga">Yoga</Option>
                            <Option value="zumba">Zumba</Option>
                        </Select>
                    </Col>

                    <Col xs={24} sm={8}>
                        <div className="mb-2">
                            <label className="text-sm text-gray-600">Email</label>
                        </div>
                        <Input placeholder="Tìm theo email" size="large" className="w-full" />
                    </Col>

                    <Col xs={24} sm={8}>
                        <div className="mb-2">
                            <label className="text-sm text-gray-600">Ngày</label>
                        </div>
                        <DatePicker placeholder="Chọn ngày" className="w-full" size="large" format="DD/MM/YYYY" />
                    </Col>
                </Row>
            </div>

            <div className="py-6">
                <Button type="primary" size="large" className="bg-blue-500 hover:bg-blue-600 mb-4">Thêm lịch mới</Button>
                <Table
                    columns={columns}
                    dataSource={tableData}
                    pagination={false}
                    locale={{
                        emptyText: <Empty description="Chưa có lịch tập của User nào!!" />,
                    }}
                />
                <Pagination align="center" current={currentPage} pageSize={perPage} total={bookingsQuantity} onChange={onPageChange} style={{ marginTop: "24px" }} />
            </div>
        </div>
    )
}
