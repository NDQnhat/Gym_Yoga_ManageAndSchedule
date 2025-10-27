import { Button, Card, Col, DatePicker, Empty, Input, Row, Select, Table } from 'antd'
import { Column } from '@ant-design/plots';
import React from 'react'
import { Option } from 'antd/es/mentions';

export default function Statistical() {
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

            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Bộ lọc</h3>

                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={8}>
                        <div className="mb-2">
                            <label className="text-sm text-gray-600">Lớp học</label>
                        </div>
                        <Select placeholder="Tất cả" className="w-full"  size="large">
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
                    // columns={columns}
                    // dataSource={data}
                    // pagination={{
                    //     pageSize: 10,
                    //     showSizeChanger: true,
                    // }}
                    locale={{
                        emptyText: <Empty description="Bạn chưa có lịch nào!!" />,
                    }}
                />
            </div>
        </div>
    )
}
