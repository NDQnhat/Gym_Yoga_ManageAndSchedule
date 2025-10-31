import { Button, Form, Input, Modal, Upload, message } from 'antd';
import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import type { User } from '../../types/user.type';
import { apis } from '../../apis';
import Header from '../../components/Header';
import { uploadToCloudinary } from '../../utils/core/upload_image.cloudinary';
import Icon from '@ant-design/icons';
import Dragger from 'antd/es/upload/Dragger';

export interface UserEditForm {
    email: string;
    phoneNum: string;
    avatar: File | string | null;
}

export interface PasswordChangeForm {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export default function UserInfo() {
    const navigate = useNavigate();

    // States
    const [userData, setUserData] = useState<User>({ avatarUrl: "", fullname: "", email: "", phoneNum: "", password: "", role: "user" });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [editForm, setEditForm] = useState<UserEditForm>({ email: "", phoneNum: "", avatar: null });
    const [passwordForm, setPasswordForm] = useState<PasswordChangeForm>({ oldPassword: "", newPassword: "", confirmPassword: "" });

    const handleEditSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const userId = localStorage.getItem("currentUserId");
            if (!userId) {
                message.error("Please login first!");
                navigate("/signin");
                return;
            }

            // Lấy trực tiếp từ state để tránh trường hợp FormData trả về giá trị rỗng
            const email = (editForm.email || "").trim();
            const phoneNum = (editForm.phoneNum || "").trim();
            const avatarFile = (editForm.avatar instanceof File) ? editForm.avatar : null;

            if (!email || !phoneNum) {
                message.error("Email và SĐT không được để trống!");
                return;
            }

            let nextAvatarUrl = userData.avatarUrl;

            if (avatarFile && avatarFile.size > 0) {
                const hide = message.loading({ content: "Đang upload avatar...", duration: 0 });
                try {
                    const uploadedUrl = await uploadToCloudinary(avatarFile as File);
                    if (uploadedUrl) {
                        nextAvatarUrl = uploadedUrl;
                    }
                } catch (err) {
                    message.error((err as any)?.message || "Upload ảnh thất bại!!");
                    hide();
                    return;
                }
                hide();
            }

            const nothingChanged = (
                email === userData.email &&
                phoneNum === userData.phoneNum &&
                nextAvatarUrl === userData.avatarUrl
            );
            if (nothingChanged) {
                message.warning("Không có thay đổi nào!");
                setIsEditModalOpen(false);
                return;
            }

            const updatedData: User = {
                ...userData,
                email,
                phoneNum,
                avatarUrl: nextAvatarUrl,
            };

            await apis.userApi.updateUser(userId, updatedData);
            setUserData(updatedData);
            setEditForm({ email: updatedData.email, phoneNum: updatedData.phoneNum, avatar: updatedData.avatarUrl });
            setIsEditModalOpen(false);
            message.success("Cập nhật hồ sơ thành công!");
        } catch (error) {
            message.error((error as any)?.message || "Failed to update profile");
        }
    };

    const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            message.error("Mật khẩu mới không trùng khớp!");
            return;
        }

        if ((passwordForm.newPassword || '').length < 8) {
            message.error("Mật khẩu phải có ít nhất 8 ký tự!");
            return;
        }

        if (passwordForm.oldPassword !== userData.password) {
            message.error("Mật khẩu cũ không đúng!");
            return;
        }

        try {
            const userId = localStorage.getItem("currentUserId");
            if (!userId) {
                message.error("Please login first!");
                navigate("/signin");
                return;
            }

            const updatedData: User = { ...userData, password: passwordForm.newPassword };
            await apis.userApi.updateUser(userId, updatedData);

            setUserData(updatedData);
            setIsPasswordModalOpen(false);
            message.success("Đổi mật khẩu thành công!");

            setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            message.error((error as any)?.message || "Failed to update password");
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setEditForm(prev => ({ ...prev, avatar: file }));
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            console.log(import.meta.env);

            try {
                const userId = localStorage.getItem("currentUserId");
                if (!userId) {
                    message.error("Please login first!");
                    navigate("/signin");
                    return;
                }

                const user = await apis.userApi.getUserData(userId);
                console.log(user);

                if (user) {
                    setUserData(user);

                    setEditForm({
                        email: user.email,
                        phoneNum: user.phoneNum,
                        avatar: user.avatarUrl
                    });
                }
            } catch (error) {
                message.error("Failed to load user data");
            }
        };
        fetchUserData();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />

            <main className="max-w-4xl mx-auto mt-8 p-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center space-x-4 mb-6">
                        <img
                            src={userData.avatarUrl}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover"
                        />
                        <div>
                            <h2 className="text-2xl font-bold">{userData.fullname}</h2>
                            <p className="text-gray-600">{userData.email}</p>
                            <p className="text-gray-600">{userData.phoneNum}</p>
                        </div>
                    </div>

                    <div className="space-x-4">
                        <Button type="primary" onClick={() => setIsEditModalOpen(true)}>
                            Edit Profile
                        </Button>
                        <Button onClick={() => setIsPasswordModalOpen(true)}>
                            Change Password
                        </Button>
                    </div>
                </div>
            </main>

            {/* Edit Profile Modal */}
            <Modal
                title="Edit Profile"
                open={isEditModalOpen}
                onOk={() => {
                    const form = document.getElementById("modalFormEdit") as HTMLFormElement;
                    form?.requestSubmit();
                }}
                onCancel={() => setIsEditModalOpen(false)}
                okText="Save"
                cancelText="Cancel"
            >
                <form id="modalFormEdit" onSubmit={handleEditSubmit}>
                    <Form layout="vertical">
                        <Form.Item label="Email">
                            <Input
                                name="email"
                                value={editForm.email}
                                onChange={e => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                            />
                        </Form.Item>
                        <Form.Item label="Phone">
                            <Input
                                name="phoneNum"
                                value={editForm.phoneNum}
                                onChange={e => setEditForm(prev => ({ ...prev, phoneNum: e.target.value }))}
                            />
                        </Form.Item>
                        <Form.Item label="Avatar">
                            <input name="avatar" type="file" accept="image/*" onChange={handleAvatarChange}
                                className="w-full cursor-pointer border px-2 rounded bg-gray-500 text-white" />
                        </Form.Item>
                    </Form>
                </form>
            </Modal>

            {/* Change Password Modal */}
            <Modal
                title="Change Password"
                open={isPasswordModalOpen}
                onOk={() => {
                    const form = document.getElementById("modalPasswordForm") as HTMLFormElement;
                    form?.requestSubmit();
                }}
                onCancel={() => setIsPasswordModalOpen(false)}
                okText="Update Password"
                cancelText="Cancel"
            >
                <form id="modalPasswordForm" onSubmit={handlePasswordSubmit}>
                    <Form layout="vertical">
                        <Form.Item label="Old Password">
                            <Input.Password
                                value={passwordForm.oldPassword}
                                onChange={e => setPasswordForm(prev => ({ ...prev, oldPassword: e.target.value }))}
                            />
                        </Form.Item>
                        <Form.Item label="New Password">
                            <Input.Password
                                value={passwordForm.newPassword}
                                onChange={e => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                            />
                        </Form.Item>
                        <Form.Item label="Confirm New Password">
                            <Input.Password
                                value={passwordForm.confirmPassword}
                                onChange={e => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            />
                        </Form.Item>
                    </Form>
                </form>
            </Modal>
        </div>
    );
}