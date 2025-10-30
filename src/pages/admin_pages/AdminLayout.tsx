import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  PieChartOutlined,
  PoweroffOutlined,
  ScheduleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router'

const { Sider, Content } = Layout;

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: 'bookings', icon: <PieChartOutlined />, label: 'Quản lý lịch' },
    { key: 'courses', icon: <ScheduleOutlined />, label: 'Quản lý khóa học' },
    { key: 'users', icon: <UserOutlined />, label: 'Quản lý người dùng' },
    { key: 'home', icon: <HomeOutlined />, label: 'Trang chủ' },
    { key: 'logout', icon: <PoweroffOutlined />, label: 'Đăng xuất', danger: true },
  ];

  const handleDashboardClick = (info: any) => {
    const { key } = info;

    switch (key) {
      case "courses":
        navigate("/admin/services");
        break;
      case "bookings":
        navigate("/admin");
        break;
      case "users":
        navigate("/admin/manage-users");
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

  const getMenuKeyByPath = (pathname: string) => {
    if (pathname === '/admin' || pathname === '/admin/') return 'bookings';
    if (pathname.includes('/admin/services')) return 'courses';
    if (pathname.includes('/admin/manage-users')) return 'users';
    return '';
  };
  const selectedKey = getMenuKeyByPath(location.pathname);

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
          // defaultSelectedKeys={['bookings']}
          selectedKeys={[selectedKey]}
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
