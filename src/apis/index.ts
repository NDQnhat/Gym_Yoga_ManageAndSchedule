import { BookingsApi } from "./core/bookings.api";
import { CourseApi } from "./core/courese.api";
import { UserApi } from "./core/user.api";

export const apis = {
    userApi: UserApi,
    courseApi: CourseApi,
    bookingsApi: BookingsApi,
}