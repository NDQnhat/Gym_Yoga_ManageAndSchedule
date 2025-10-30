import { Button, Card, Col, DatePicker, Empty, Input, message, Pagination, Row, Select, Spin, Table, type DatePickerProps } from 'antd'
import { Column } from '@ant-design/plots';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../stores';
import { getAllUsersBookingsPaginate } from '../../stores/thunk/bookings.thunk';
import { apis } from '../../apis';
import { getCourses } from '../../stores/thunk/course.thunk';
import type { Course } from '../../types/course.type';
import type { Bookings } from '../../types/bookings.type';
import ConvertBookings from '../user_pages/ConvertBookings';
import type { UserBookings } from '../../types/user_bookings.type';
import { LoadingOutlined } from '@ant-design/icons';

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
    const [tableData, setTableData] = useState<UserBookings[]>([]);
    const [dateFilterChosen, setDateFilterChosen] = useState("");
    const [emailFilter, setEmailFilter] = useState("");
    const [courseFilter, setCourseFilter] = useState<SelectOptionType>({ children: "", key: "", value: "" });
    const [statsData, setStatsData] = useState<{ type: string, quantity: number, color: string }[]>([]);
    const [config, setConfig] = useState({});
    const [chartLoading, setChartLoading] = useState(false);

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

    useEffect(() => {
        const loadCourses = async () => {
            try {
                const courseAction = await dispatch(getCourses());
                if (getCourses.fulfilled.match(courseAction)) {
                    setAllCourses(courseAction.payload);
                    return;
                }
                setAllCourses([]);
            } catch (error) {
                setAllCourses([]);
            }
        }
        loadCourses();
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
                allCourses.map((course) => apis.bookingsApi.getCourseBookingQuantity(course.id))
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
    }, [perPage, currentPage, courseFilter, emailFilter, dateFilterChosen]);

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
                <Button type="primary" size="large" className="bg-blue-500 hover:bg-blue-600 mb-4">Thêm lịch mới</Button>
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
            </div>
        </div>
    )
}
