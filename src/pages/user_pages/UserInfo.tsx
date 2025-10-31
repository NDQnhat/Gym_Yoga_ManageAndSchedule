import React, { useEffect, useState } from 'react';
import { Modal, Input, Upload, Button, message } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined, UploadOutlined, UserOutlined, MailOutlined, PhoneOutlined, LockOutlined } from '@ant-design/icons';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import type { User } from '../../types/user.type';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../stores';
import { } from '../../stores/thunk/user.thunk';
import { apis } from '../../apis';
import { Cloudinary } from '@cloudinary/url-gen/index';

const UserProfile = () => {
    const [userData, setUserData] = useState<User>({ avatarUrl: "", fullname: "", email: "", phone: "", password: "", role: "user", });
    const [showPassword, setShowPassword] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const cld = new Cloudinary({
        cloud: {
            cloudName: 'demo'
        }
    });

    const [editForm, setEditForm] = useState({
        email: userData.email,
        phoneNum: userData.phone,
        avatar: null
    });

    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleEditSubmit = () => {
        if (!editForm.email || !editForm.phoneNum) {
            message.error('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        setUserData({
            ...userData,
            email: editForm.email,
            phone: editForm.phoneNum,
            avatarUrl: editForm.avatar || userData.avatarUrl,
        });

        message.success('Cập nhật thông tin thành công!');
        setIsEditModalOpen(false);
    };

    const handlePasswordSubmit = () => {
        if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            message.error('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            message.error('Mật khẩu mới không khớp!');
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            message.error('Mật khẩu mới phải có ít nhất 6 ký tự!');
            return;
        }

        message.success('Đổi mật khẩu thành công!');
        setIsPasswordModalOpen(false);
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    };

    const uploadProps = {
        beforeUpload: (file: File) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error('Chỉ được tải lên file ảnh!');
                return false;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                setEditForm({ ...editForm, avatar: e.target.result });
            };
            reader.readAsDataURL(file);
            return false;
        },
        maxCount: 1
    };

    useEffect(() => {
        const userId = localStorage.getItem("currentUserId");
        const fetchUser = async () => {
            try {
                const data = await apis.userApi.getUserData(userId as string);
                setUserData(data);
            } catch (error) {
                message.error((error as any).message);
            }
        }
    }, []);

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-8">Thông Tin Cá Nhân</h1>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <img
                                src={userData.avatarUrl}
                                alt="Avatar"
                                className="w-40 h-40 rounded-full object-cover border-4 border-indigo-200 shadow-lg"
                            />
                        </div>

                        {/* User Info Grid */}
                        <div className="flex-grow">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-1 md:col-span-2">
                                    <label className="flex items-center text-sm font-semibold text-gray-600 mb-2">
                                        <UserOutlined className="mr-2 text-indigo-500" />
                                        Họ và tên
                                    </label>
                                    <div className="text-lg font-medium text-gray-800 bg-gray-50 px-4 py-3 rounded-lg">
                                        {userData.fullname}
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-semibold text-gray-600 mb-2">
                                        <MailOutlined className="mr-2 text-indigo-500" />
                                        Email
                                    </label>
                                    <div className="text-lg font-medium text-gray-800 bg-gray-50 px-4 py-3 rounded-lg break-all">
                                        {userData.email}
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-semibold text-gray-600 mb-2">
                                        <PhoneOutlined className="mr-2 text-indigo-500" />
                                        Số điện thoại
                                    </label>
                                    <div className="text-lg font-medium text-gray-800 bg-gray-50 px-4 py-3 rounded-lg">
                                        {userData.phone}
                                    </div>
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <label className="flex items-center text-sm font-semibold text-gray-600 mb-2">
                                        <LockOutlined className="mr-2 text-indigo-500" />
                                        Mật khẩu
                                    </label>
                                    <div className="flex items-center bg-gray-50 px-4 py-3 rounded-lg">
                                        <span className="text-lg font-medium text-gray-800 flex-grow">
                                            {showPassword ? 'Abc@123456' : userData.password}
                                        </span>
                                        <button
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="ml-2 text-indigo-500 hover:text-indigo-700 transition"
                                        >
                                            {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 mt-8">
                                <button
                                    onClick={() => {
                                        setEditForm({
                                            email: userData.email,
                                            phoneNum: userData.phone,
                                            avatar: null
                                        });
                                        setIsEditModalOpen(true);
                                    }}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition shadow-md hover:shadow-lg"
                                >
                                    Đổi Thông Tin
                                </button>
                                <button
                                    onClick={() => setIsPasswordModalOpen(true)}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition shadow-md hover:shadow-lg"
                                >
                                    Đổi Mật Khẩu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Info Modal */}
                <Modal
                    title={<span className="text-xl font-bold">Chỉnh Sửa Thông Tin</span>}
                    open={isEditModalOpen}
                    onOk={handleEditSubmit}
                    onCancel={() => setIsEditModalOpen(false)}
                    okText="Lưu"
                    cancelText="Hủy"
                    width={500}
                    okButtonProps={{ className: 'bg-indigo-600 hover:bg-indigo-700' }}
                >
                    <div className="space-y-4 mt-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                            <Input
                                prefix={<MailOutlined />}
                                value={editForm.email}
                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                placeholder="Nhập email"
                                size="large"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại</label>
                            <Input
                                prefix={<PhoneOutlined />}
                                value={editForm.phoneNum}
                                onChange={(e) => setEditForm({ ...editForm, phoneNum: e.target.value })}
                                placeholder="Nhập số điện thoại"
                                size="large"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Avatar</label>
                            <Upload {...uploadProps}>
                                <Button icon={<UploadOutlined />} size="large" className="w-full">
                                    Tải lên ảnh đại diện
                                </Button>
                            </Upload>
                            {editForm.avatar && (
                                <div className="mt-3">
                                    <img src={editForm.avatar} alt="Preview" className="w-24 h-24 rounded-full object-cover border-2 border-indigo-200" />
                                </div>
                            )}
                        </div>
                    </div>
                </Modal>

                {/* Change Password Modal */}
                <Modal
                    title={<span className="text-xl font-bold">Đổi Mật Khẩu</span>}
                    open={isPasswordModalOpen}
                    onOk={handlePasswordSubmit}
                    onCancel={() => {
                        setIsPasswordModalOpen(false);
                        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
                    }}
                    okText="Đổi Mật Khẩu"
                    cancelText="Hủy"
                    width={500}
                    okButtonProps={{ className: 'bg-emerald-600 hover:bg-emerald-700' }}
                >
                    <div className="space-y-4 mt-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu cũ</label>
                            <Input.Password
                                prefix={<LockOutlined />}
                                value={passwordForm.oldPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                                placeholder="Nhập mật khẩu cũ"
                                size="large"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu mới</label>
                            <Input.Password
                                prefix={<LockOutlined />}
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                placeholder="Nhập mật khẩu mới"
                                size="large"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
                            <Input.Password
                                prefix={<LockOutlined />}
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                placeholder="Nhập lại mật khẩu mới"
                                size="large"
                            />
                        </div>
                    </div>
                </Modal>
            </div>
            <Footer />
        </>
    );
};

export default UserProfile;