import { Button, Empty, message, Space, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react'
import type { User } from '../../types/user.type';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../stores';
import { fetchUsersData } from '../../stores/thunk/user.thunk';

export default function UserManagement() {
    const [allUsers, setAllUsers] = useState<User[]>([]);

    const dispatch = useDispatch<AppDispatch>();

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: "10%",
            ellipsis: true,
        },
        {
            title: "Họ và tên",
            dataIndex: "fullname",
            key: "fullname",
            with: "35%"
            // sorter: (a, b) => a.fullname.localeCompare(b.fullname),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            with: "35%"
        },
        {
            title: "Số điện thoại",
            key: "phone",
            render: (record: any) => record.phoneNum,
        },
        {
            title: "Vai trò",
            dataIndex: "role",
            key: "role",
            filters: [
                { text: "Admin", value: "admin" },
                { text: "Người dùng", value: "user" },
            ],
            onFilter: (value: any, record: any) => record.role === value,
            render: (role: any) =>
                role === "admin" ? (
                    <Tag color="volcano">Admin</Tag>
                ) : (
                    <Tag color="blue">User</Tag>
                ),
        },
        {
            title: "Thao tác",
            key: "action",
            render: (_: any, record: any) => (
                <Space>
                    <Button
                        type="link" onClick={() => console.log("Edit user:", record.id)}
                    >
                        Sửa
                    </Button>
                    <Button
                        type="link"
                        danger
                        onClick={() => console.log("Delete user:", record.id)}
                    >
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        const fetchCoursesData = async () => {
            try {
                const userAction = await dispatch(fetchUsersData());
                if (fetchUsersData.fulfilled.match(userAction)) {
                    setAllUsers(userAction.payload);
                    return;
                }
                setAllUsers([]);
            } catch (error) {
                setAllUsers([]);
                message.error((error as any).message);
            }
        }
        fetchCoursesData();
    }, [dispatch]);

    return (
        <div className="px-6 py-7">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-[28px] font-semibold text-gray-800">Quản lý Người dùng</h1>
                <Button type="primary" size="large" className="bg-blue-500 hover:bg-blue-600">Thêm người dùng mới</Button>
            </div>
            <Table
                columns={columns}
                dataSource={allUsers}
                pagination={false}
                locale={{
                    emptyText: <Empty description="Chưa có người dùng nào!!" />,
                }}
            />
        </div>
    )
}
