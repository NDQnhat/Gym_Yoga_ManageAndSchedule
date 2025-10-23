export interface Bookings {
    id?:string,
    userId: string,
    courseId: string,
    bookingDate: string,
    bookingTime: string,
    status: "confirmed" | "canceled" | "pending" | "completed",
}