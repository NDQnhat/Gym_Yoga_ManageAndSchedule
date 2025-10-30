import type { Bookings } from "../../types/bookings.type";

export interface BookingModalForm {
	userId: string;
	courseId: string;
	bookingDate: string;
	bookingTime: string;
}

export function validateBookingModal(
	form: BookingModalForm,
	existingBookings: Bookings[]
): { field: string; message: string }[] {
	const errors: { field: string; message: string }[] = [];

	if (!form.userId) {
		errors.push({ field: 'userId', message: 'Thiếu thông tin người dùng.' });
	}
	if (!form.courseId) {
		errors.push({ field: 'courseId', message: 'Vui lòng chọn lớp học.' });
	}
	if (!form.bookingDate) {
		errors.push({ field: 'bookingDate', message: 'Vui lòng chọn ngày tập.' });
	}
	if (!form.bookingTime) {
		errors.push({ field: 'bookingTime', message: 'Vui lòng chọn khung giờ.' });
	}

	// Check duplicate: same user, course, date, time
	const isDuplicate = existingBookings.some(
		(b) =>
			b.userId === form.userId &&
			b.courseId === form.courseId &&
			b.bookingDate === form.bookingDate &&
			b.bookingTime === form.bookingTime
	);
	if (isDuplicate) {
		errors.push({
			field: 'duplicate',
			message: 'Bạn đã đặt lịch cho lớp này vào ngày và giờ này!!',
		});
	}

	return errors;
}
