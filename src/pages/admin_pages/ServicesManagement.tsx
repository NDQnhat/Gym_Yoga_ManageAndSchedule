import { Button, Empty, message, Space, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import type { Course } from '../../types/course.type';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../stores';
import { getCourses } from '../../stores/thunk/course.thunk';

export default function ServicesManagement() {
    const [allCourses, setAllCourses] = useState<Course[]>([]);
    const dispatch = useDispatch<AppDispatch>();

    const columns = [
        {
            title: 'Tên dịch vụ',
            dataIndex: 'name',
            key: 'name',
            width: '15%',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            width: '45%',
            ellipsis: true, //dau' ...
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            width: '20%',
            render: (text: string) => (
                // <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                //     {text || 'No image'}
                // </div>
                <img src={text} alt="No image" className='w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400' />
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: '20%',
            render: () => (
                <Space size="small">
                    <Button type="link" className="p-0" onClick={() => {
                        // // console.log("record: ", record);
                        // setCurrentDataEdit({ bookingDate: record.bookingDate, bookingTime: record.bookingTime });
                        // setDataToUpdate({
                        //     id: record.bookingId,
                        //     userId: record.userId,
                        //     status: "confirmed",
                        //     courseId: record.courseId,
                        //     bookingTime: record.bookingTime,
                        //     bookingDate: record.bookingDate,
                        // });
                        // setDateChosen(record.bookingDate);
                        // setModalType("edit");
                        // setIsModalOpen(true);
                    }}>Sửa</Button>
                    <Button type="link" onClick={() => {
                        // setConfirmToDel(true);
                        // setBookingIdToDelete(record.bookingId);
                    }} danger className="p-0">Xóa</Button>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        const fetchCoursesData = async () => {
            try {
                const courseAction = await dispatch(getCourses());
                if (getCourses.fulfilled.match(courseAction)) {
                    setAllCourses(courseAction.payload);
                    return;
                }
                setAllCourses([]);
            } catch (error) {
                setAllCourses([]);
                message.error((error as any).message);
            }
        }
        fetchCoursesData();
    }, [dispatch]);

    return (
        <div className="px-6 py-7">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-[28px] font-semibold text-gray-800">Quản lý Dịch vụ</h1>
                <Button type="primary" size="large" className="bg-blue-500 hover:bg-blue-600">Thêm dịch vụ mới</Button>
            </div>
            <Table
                columns={columns}
                dataSource={allCourses}
                pagination={false}
                locale={{
                    emptyText: <Empty description="Bạn chưa có dịch vụ nào!!" />,
                }}
            />
        </div>
    )
}
