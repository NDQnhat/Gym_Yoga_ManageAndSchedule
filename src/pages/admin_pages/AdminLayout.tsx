import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  PieChartOutlined,
  PoweroffOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router'

const { Sider, Content } = Layout;

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { key: 'bookings', icon: <PieChartOutlined />, label: 'Quản lý lịch' },
    { key: 'services', icon: <ScheduleOutlined />, label: 'Quản lý dịch vụ' },
    { key: 'home', icon: <HomeOutlined />, label: 'Trang chủ' },
    { key: 'logout', icon: <PoweroffOutlined />, label: 'Đăng xuất', danger: true },
  ];

  const handleDashboardClick = (info: any) => {
    const { key } = info;

    switch (key) {
      case "services":
        navigate("/admin/services");
        break;
      case "bookings":
        navigate("/admin");
        break;
      case "home":
        navigate("/");
        break;
      case "logout": {
        navigate("/signin");
        localStorage.clear();
        break;
      }
      default:
        break;
    }
  }

  return (
    <Layout className="h-full">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        className="bg-[#1e293b] !fixed left-0 top-0 h-screen"
        theme="dark"
      >
        <div className="h-16 flex items-center justify-center text-white font-bold text-lg border-b border-slate-700">
          {!collapsed ? 'Admin Dashboard' : 'AD'}
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={['bookings']}
          mode="inline"
          items={menuItems}
          onClick={handleDashboardClick}
          className="bg-[#1e293b] border-r-0"
        />
      </Sider>
      <Layout style={{
        marginLeft: collapsed ? 80 : 200,
        transition: 'margin-left 0.2s ease',
        minHeight: '100vh',
      }}>
        <Layout.Content className="bg-gray-100">
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>

  )
}
