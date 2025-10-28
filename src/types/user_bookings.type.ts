export interface UserBookings {
    course: string,
    bookingDate: string,
    bookingTime: string,
    fullname: string,
    email: string,
    bookingId: string,  //khong co' no' la` khong xoa' duoc. nen phai? bo? sung them
    courseId: string, // bo? sung them de? tim` khoa' hoc. khi reconvert
    userId: string,
}