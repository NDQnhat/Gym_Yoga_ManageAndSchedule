import { Button, Empty, Input, message, Modal, Space, Table } from 'antd';
import React, { useEffect, useState, type FormEvent } from 'react'
import type { Course } from '../../types/course.type';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../stores';
import { deleteCourse, getAllCourses, getCourses, makeNewCourses, updateCourse } from '../../stores/thunk/course.thunk';
import TextArea from 'antd/es/input/TextArea';
import { apis } from '../../apis';
import { validateCourseModal } from '../../utils/core/validate.course_modal';

export default function ServicesManagement() {
    const [allCourses, setAllCourses] = useState<Course[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"add" | "edit">("add");
    const [confirmToDel, setConfirmToDel] = useState(false);
    const [courseIdToDel, setCourseIdToDel] = useState("");
    const [currentDataToEdit, setCurrentDataEdit] = useState<{ description: string, imageUrl: string }>({ description: "", imageUrl: "" });
    const [dataToUpdate, setDataToUpdate] = useState<Course>({ type: "", description: "", imageUrl: "", name: "", price: 0 });

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
                <img src={text} alt="No image" className='w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400' />
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: '20%',
            render: (_: any, record: any) => (
                <Space size="small">
                    <Button type="link" className="p-0" onClick={() => {
                        setCurrentDataEdit({ description: record.description, imageUrl: record.imageUrl }); //de? set default value

                        setDataToUpdate({
                            id: record.id,
                            name: record.name,
                            description: record.description,
                            imageUrl: record.imageUrl,
                            price: record.price,
                            type: record.type,
                        });
                        setModalType("edit");
                        setIsModalOpen(true);
                    }}>Sửa</Button>
                    <Button type="link" onClick={() => {
                        setConfirmToDel(true);
                        setCourseIdToDel(record.id);
                    }} danger className="p-0">Xóa</Button>
                </Space>
            ),
        },
    ];

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = (type?: 'add/edit' | 'delete') => {
        if (type === 'add/edit') setIsModalOpen(false);
        if (type === 'delete') setConfirmToDel(false);
    };

    const checkExistance = async (courseName: string, description: string, imageUrl: string) => {
        let allCourses: Course[] = [];
        try {
            const res = await apis.courseApi.getAllCourse();
            allCourses = res;
        } catch (err) {
            message.error("Không thể kiểm tra trùng lặp dịch vụ!");
            return false;
        }

        const errors = validateCourseModal(
            { courseName, description, imageUrl },
            allCourses
        );
        if (errors.length > 0) {
            message.error(errors.map(e => e.message).join(' '));
            return false;
        }
        return true;
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const values = Object.fromEntries(formData.entries());
        // console.log(values);

        const { courseName, description, imageUrl } = values;
        const isValid = await checkExistance((courseName as string), (description as string), (imageUrl as string));
        if (!isValid) return;

        const newCourse: Course = {
            name: courseName as string,
            type: (courseName as string).trim().split(/\s+/)[0] || "",
            description: description as string,
            price: Math.floor(Math.random() * (200000 - 100000 + 1) + 100000),
            imageUrl: imageUrl as string,
        };

        try {
            const action = await dispatch(makeNewCourses(newCourse));
            if (makeNewCourses.fulfilled.match(action)) {
                message.success("Thêm dịch vụ mới thành công!");
                setIsModalOpen(false);

                const refreshed = await dispatch(getAllCourses());
                if (getAllCourses.fulfilled.match(refreshed)) {
                    setAllCourses(refreshed.payload);
                }
            }
        } catch (error) {
            message.error((error as any).message);
        }
        setIsModalOpen(false);
    }

    const handleEditSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const values = Object.fromEntries(formData.entries());
        const { description, imageUrl } = values;

        const updatedData = {
            ...dataToUpdate,
            description: description as string,
            imageUrl: imageUrl as string,
        };

        if (dataToUpdate.description === updatedData.description && dataToUpdate.imageUrl === updatedData.imageUrl) {
            message.warning("Nothing to change!!");
            setIsModalOpen(false);
            return;
        }
        // const isValid = await checkExistance("_", (description as string), (imageUrl as string));
        // if (!isValid) return;
        
        try {
            await dispatch(updateCourse({ id: updatedData.id as string, newData: updatedData }));
            message.success("Update successfully!");
            setIsModalOpen(false);

            const refreshed = await dispatch(getAllCourses());
            if (getAllCourses.fulfilled.match(refreshed)) {
                setAllCourses(refreshed.payload);
            }
        } catch (error) {
            message.error((error as any).message);
        }
    }

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
                <Button type="primary" size="large" className="bg-blue-500 hover:bg-blue-600" onClick={() => {
                    setModalType('add');
                    showModal();
                }}>Thêm dịch vụ mới</Button>

                <Modal
                    key={isModalOpen ? 'open' : 'closed'} // isModalOpen thay doi? -> key cua? modal thya doi? theo -> unmount va` reumount tu` dau`
                    title={modalType === "add" ? "Thêm khóa học mới" : "Chỉnh sửa khóa học"}
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
                                    <label htmlFor="courseName" className="block mb-1 font-medium text-gray-700">Tên dịch vụ</label>
                                    <Input name='courseName' size="large" className="w-full" />
                                </div>
                                <div className='my-3'>
                                    <label htmlFor="course" className="block mb-1 font-medium text-gray-700">Mô tả</label>
                                    <TextArea rows={4} name='description' className='w-full' />
                                </div>
                                <div className='my-3'>
                                    <label htmlFor="imageUrl" className="block mb-1 font-medium text-gray-700">URL Hình ảnh</label>
                                    <Input name='imageUrl' size="large" className="w-full" />
                                </div>
                            </form>

                            : <form id='modalFormEdit' onSubmit={(e) => { handleEditSubmit(e) }}>
                                <div className='my-3'>
                                    <label htmlFor="course" className="block mb-1 font-medium text-gray-700">Mô tả</label>
                                    <TextArea rows={4} name='description' defaultValue={currentDataToEdit.description} className='w-full' />
                                </div>
                                <div className='my-3'>
                                    <label htmlFor="imageUrl" className="block mb-1 font-medium text-gray-700">URL Hình ảnh</label>
                                    <Input name='imageUrl' size="large" defaultValue={currentDataToEdit.imageUrl} className="w-full" />
                                </div>
                            </form>
                    }

                </Modal>
            </div>
            <Table
                columns={columns}
                dataSource={allCourses}
                pagination={false}
                locale={{
                    emptyText: <Empty description="Bạn chưa có dịch vụ nào!!" />,
                }}
            />

            <Modal
                title="Bạn có xác nhận muốn xóa dịch vụ này???"
                open={confirmToDel}
                onOk={async () => {
                    if (courseIdToDel) {
                        console.log(courseIdToDel);
                        
                        try {
                            //cho vao` dispatch thi` bieu? do` se~ tu. update
                            await apis.bookingsApi.deleteManyBookings(courseIdToDel, ""); //xoa' nhung~ bookings cua? user cho khoa' hoc. nay`
                            await dispatch(deleteCourse(courseIdToDel));// bi. nguuuu di xoa' course roi` moi' xoa' bookings /(o0o)/
                            message.success("Delete successfully!");
                            setConfirmToDel(false);

                            const refreshed = await dispatch(getAllCourses());
                            if (getAllCourses.fulfilled.match(refreshed)) {
                                setAllCourses(refreshed.payload);
                            }
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
