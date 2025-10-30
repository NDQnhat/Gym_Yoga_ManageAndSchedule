import type { Course } from "../../types/course.type";

export interface CourseModal {
	courseName: string,
    description: string,
    imageUrl: string,
}

export function validateCourseModal(
    form: CourseModal,
    existingCourses: Course[]
): { field: string; message: string }[] {
    const errors: { field: string; message: string }[] = [];

    if (!form.courseName && form.courseName !== "_") { //khi update thi` khong can` ten nen quy dinh. khi name la` _ thi` la` update
        errors.push({ field: 'courseName', message: 'Thiếu tên dịch vụ.' });
    }
    if (!form.description) {
        errors.push({ field: 'description', message: 'Vui lòng điền mô tả.' });
    }
    if (!form.imageUrl) {
        errors.push({ field: 'imageUrl', message: 'Thiếu hình ảnh dịch vụ.' });
    }

    // Check duplicate: same user, course, date, time
    const isDuplicate = existingCourses.some((course) =>course.name === form.courseName);
    if (isDuplicate) {
        errors.push({
            field: 'duplicate',
            message: 'Khóa học này đã tồn tại!!',
        });
    }

    return errors;
}