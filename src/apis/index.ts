import { BookingsApi } from "./core/bookings.api";
import { CourseApi } from "./core/courses.api";
import { UserApi } from "./core/user.api";

export const apis = {
    userApi: UserApi,
    courseApi: CourseApi,
    bookingsApi: BookingsApi,
}