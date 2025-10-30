import { Button, Empty, Input, message, Modal, Space, Table, Tag } from 'antd';
import React, { useEffect, useState, type FormEvent } from 'react'
import type { User } from '../../types/user.type';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../stores';
import { deleteUser, fetchUsersData, postUser, updateUser } from '../../stores/thunk/user.thunk';

export default function UserManagement() {
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [currentAdminId, setCurrentAdminId] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"add" | "edit">("add");
    const [confirmToDel, setConfirmToDel] = useState(false);
    const [currentDataToEdit, setCurrentDataEdit] = useState<{ email: string, phoneNum: string, role: "" }>({ email: "", phoneNum: "", role: "" });
    const [dataToUpdate, setDataToUpdate] = useState<User>({ email: "", fullname: "", password: "", phone: "", role: "user" });
    const [userIdToDelete, setUserIdToDelete] = useState<string>("");

    const dispatch = useDispatch<AppDispatch>();

    const columns = [
        {
            title: "STT",
            key: "stt",
            width: "10%",
            render: (text: any, record: any, index: number) => index + 1,
        },
        {
            title: "Họ và tên",
            dataIndex: "fullname",
            key: "fullname",
            with: "35%",
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
            render: (_: any, record: any) => {
                const isCurrentAdmin = record.id === currentAdminId;

                return (
                    <Space>
                        <Button type="link" disabled={isCurrentAdmin} onClick={() => {
                            setCurrentDataEdit({ email: record.email, phoneNum: record.phoneNum, role: record.role }); //de? set default value

                            setDataToUpdate({
                                id: record.id,
                                email: record.email,
                                fullname: record.fullname,
                                password: record.password,
                                phone: record.phoneNum,
                                role: record.role,
                            });
                            setModalType("edit");
                            setIsModalOpen(true);
                        }}>Sửa</Button>
                        <Button type="link" disabled={isCurrentAdmin} danger onClick={() => {
                            setConfirmToDel(true);
                            setUserIdToDelete(record.id);
                        }} >Xóa</Button>
                    </Space>
                )
            },
        },
    ];

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = (type?: 'add/edit' | 'delete') => {
        if (type === 'add/edit') setIsModalOpen(false);
        if (type === 'delete') setConfirmToDel(false);
    };

    // const checkExistance = async () => {} goi. api dang ky' luon cho khoe?

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const values = Object.fromEntries(formData.entries());
        const { email, phoneNum } = values;
        const role = (e.target as any).role?.value || "";
        const fullname = `Người Dùng ${Date.now()}`

        const newUser: User = {
            email: email as string,
            fullname,
            password: "12345678",
            phone: phoneNum as string,
            role,
        };

        if (!email || !phoneNum || !role) {
            message.error("All fields required!!");
            return;
        }
        const response = await dispatch(postUser({ email: email as string, fullname, password: "12345678", rePass: "12345678", phoneNum: phoneNum as string, role, }));

        if (postUser.fulfilled.match(response)) {
            message.success("Thêm mới người dùng thành công!");
            setIsModalOpen(false);

            const refreshed = await dispatch(fetchUsersData());
            if (fetchUsersData.fulfilled.match(refreshed)) {
                setAllUsers(refreshed.payload);
                return;
            }
            setAllUsers([]);
        } else {
            message.error((response.error as any).message || "Thất bại thêm mới!!");
        }
    }

    const handleEditSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const values = Object.fromEntries(formData.entries());
        const { email, phoneNum } = values;
        const role = (e.target as any).role?.value || "";
        
        const updatedData = {
            ...dataToUpdate,
            email: email as string,
            phoneNum: phoneNum as string,
            role,
        };


        if (dataToUpdate.email === updatedData.email && dataToUpdate.phone === updatedData.phoneNum && dataToUpdate.role === updatedData.role) {
            message.warning("Nothing to change!!");
            setIsModalOpen(false);
            return;
        }

        const isDuplicate = allUsers.some(user => (user.email === updatedData.email && user.email !== dataToUpdate.email));
        if (isDuplicate) {
            message.error("Email đã tồn tại!!!");
            return;
        };

        try {
            await dispatch(updateUser({ id: updatedData.id as string, newData: updatedData }));
            message.success("Update successfully!");
            setIsModalOpen(false);

            const refreshed = await dispatch(fetchUsersData());
            if (fetchUsersData.fulfilled.match(refreshed)) {
                setAllUsers(refreshed.payload);
                return;
            }
            setAllUsers([]);
        } catch (error) {
            message.error((error as any).message);
        }
    }

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

    useEffect(() => {
        if (localStorage.getItem("currentRole") === "admin") {
            setCurrentAdminId(localStorage.getItem("currentUserId") as string);
        }
    }, []);

    return (
        <div className="px-6 py-7">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-[28px] font-semibold text-gray-800">Quản lý Người dùng</h1>
                <Button type="primary" size="large" className="bg-blue-500 hover:bg-blue-600" onClick={() => {
                    setModalType('add');
                    showModal();
                }}>Thêm người dùng mới</Button>

                <Modal
                    key={isModalOpen ? 'open' : 'closed'}
                    title={modalType === "add" ? "Thêm người dùng mới" : "Chỉnh sửa thông tin người dùng"}
                    open={isModalOpen}
                    onOk={() => {
                        if (modalType === "add") {
                            const form = document.getElementById("modalFormAdd") as HTMLFormElement;
                            form?.requestSubmit();
                            return;
                        }

                        if (modalType === "edit") {
                            const form = document.getElementById("modalFormEdit") as HTMLFormElement;
                            form?.requestSubmit();
                            return;
                        }
                    }}
                    okText="Lưu"
                    onCancel={() => handleCancel("add/edit")}
                    cancelText="Hủy"
                    cancelButtonProps={{ style: { background: "gray", color: "whitesmoke" } }}
                >
                    {
                        modalType === "add" ?
                            <form id='modalFormAdd' onSubmit={(e) => { handleSubmit(e) }}>
                                <div className='my-3'>
                                    <label htmlFor="email" className="block mb-1 font-medium text-gray-700">Email</label>
                                    <Input type='email' name='email' size="large" className="w-full" />
                                </div>
                                <div className='my-3'>
                                    <label htmlFor="phoneNum" className="block mb-1 font-medium text-gray-700">Số điện thoại</label>
                                    <Input name='phoneNum' size="large" className="w-full" />
                                </div>
                                <div className='my-3'>
                                    <label htmlFor="imageUrl" className="block mb-1 font-medium text-gray-700">Vai trò</label>
                                    <select name="role" className="w-full border rounded p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="user">Người dùng</option>
                                        <option value="admin">Quản trị viên</option>
                                    </select>
                                </div>
                            </form>

                            : <form id='modalFormEdit' onSubmit={(e) => { handleEditSubmit(e) }}>
                                <div className='my-3'>
                                    <label htmlFor="email" className="block mb-1 font-medium text-gray-700">Email</label>
                                    <Input type='email' name='email' defaultValue={currentDataToEdit.email} size="large" className="w-full" />
                                </div>
                                <div className='my-3'>
                                    <label htmlFor="phoneNum" className="block mb-1 font-medium text-gray-700">Số điện thoại</label>
                                    <Input name='phoneNum' size="large" defaultValue={currentDataToEdit.phoneNum} className="w-full" />
                                </div>
                                <div className='my-3'>
                                    <label htmlFor="imageUrl" className="block mb-1 font-medium text-gray-700">Vai trò</label>
                                    <select value={currentDataToEdit.role} onChange={(e) =>
                                        setCurrentDataEdit(prev => ({ ...prev, role: (e.target as any).value }))
                                    } name="role" className="w-full border rounded p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="user">Người dùng</option>
                                        <option value="admin">Quản trị viên</option>
                                    </select>
                                </div>
                            </form>
                    }

                </Modal>
            </div>
            <Table
                columns={columns}
                dataSource={allUsers}
                pagination={false}
                locale={{
                    emptyText: <Empty description="Chưa có người dùng nào!!" />,
                }}
            />

            <Modal
                title="Bạn có xác nhận muốn xóa lịch đặt này?"
                open={confirmToDel}
                onOk={async () => {
                    if (userIdToDelete) {
                        try {
                            await dispatch(deleteUser(userIdToDelete));
                            message.success("Delete successfully!");
                            setConfirmToDel(false);

                            const refreshed = await dispatch(fetchUsersData());
                            if (fetchUsersData.fulfilled.match(refreshed)) {
                                setAllUsers(refreshed.payload);
                                return;
                            }
                            setAllUsers([]);
                        } catch (error) {
                            message.error((error as any).message);
                        }
                    }
                }}
                okText="Xóa"
                okButtonProps={{ style: { background: "#f5222d", color: "whitesmoke" } }}
                onCancel={() => handleCancel("delete")}
                cancelText="Hủy"
                cancelButtonProps={{ style: { background: "gray", color: "whitesmoke" } }}
            ></Modal>
        </div>
    )
}
