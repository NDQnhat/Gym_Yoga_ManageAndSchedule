import React from 'react'
import { apis } from '../../apis';
import type { UserBookings } from '../../types/user_bookings.type';
import type { Bookings } from '../../types/bookings.type';

export default async function ConvertBookings(bookings: Bookings[]): Promise<UserBookings[]> {
    const transformed = await Promise.all(
        bookings.map(async (booking): Promise<UserBookings> => {
            const [fullname, email, course] = await Promise.all([
                apis.userApi.findNameById(booking.userId),
                apis.userApi.findEmailById(booking.userId),
                apis.courseApi.getCourseName(booking.courseId),
            ]);

            return {
                course,
                bookingDate: booking.bookingDate,
                bookingTime: booking.bookingTime,
                fullname,
                email,
            };
        })
    );

    return transformed;
};
