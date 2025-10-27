import { Button, Empty, Space, Table } from 'antd';
import React from 'react'

export default function ServicesManagement() {
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
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            key: 'image',
            width: '20%',
            render: (text: string) => (
                <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                    {text || 'No image'}
                </div>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: '20%',
            render: () => (
                <Space size="small">
                    <Button type="link" className="text-blue-500" >Sửa</Button>
                    <Button type="link" danger>Xóa</Button>
                </Space>
            ),
        },
    ];

    const data: any = [];

    return (
        <div className="px-6 py-7">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-[28px] font-semibold text-gray-800">Quản lý Dịch vụ</h1>
                <Button type="primary" size="large" className="bg-blue-500 hover:bg-blue-600">Thêm dịch vụ mới</Button>
            </div>
            <Table
                columns={columns}
                dataSource={data}
                // pagination={{
                //     pageSize: 10,
                //     showSizeChanger: true,
                // }}
                locale={{
                    emptyText: <Empty description="Bạn chưa có dịch vụ nào!!" />,
                }}
            />
        </div>
    )
}
