import axios from "axios";
import type { Bookings } from "../../types/bookings.type";
import { apis } from "..";
import type { User } from "../../types/user.type";
import type { Course } from "../../types/course.type";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:888";

interface PaginatedResult {
  data: Bookings[];
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
  pages: number;
  items: number;
}

export const BookingsApi = {
  getUserBookings: async (id: string, currentPage: number, perPage: number) => {
    try {
      const result = await axios.get(
        `${API_URL}/bookings?userId=${id}&_page=${currentPage}&_per_page=${perPage}`
      );
      if (Array.isArray(result.data)) {
        return result.data;
      } else if (result.data && Array.isArray(result.data.data)) {
        return result.data.data;
      } else {
        return [];
      }
    } catch (error) {
      throw {
        message: "Tải lịch tập thất bại: " + error,
      };
    }
  },

  postNewBookings: async (data: Bookings) => {
    try {
      const res = await axios.post(`${API_URL}/bookings`, data);
      return res.data;
    } catch (error) {
      throw {
        message: "Fail to make new Bookings: " + error,
      };
    }
  },

  getUserBookingsQuantity: async (id: string) => {
    try {
      let result = await axios.get(`${API_URL}/bookings?userId=${id}`);
      return result.data.length;
    } catch (error) {
      throw {
        message: "Lấy số lượng thất bại: " + error,
      };
    }
  },

  getAll: async (id: string) => {
    try {
      // let result = await axios.get(`${API_URL}/bookings?userId=${id}`);
      // return result.data;
      let result = await axios.get(`${API_URL}/bookings?userId=${id}`);
      return result.data;
    } catch (error) {
      throw {
        message: "Lỗi: " + error,
      };
    }
  },

  getAllBookings: async () => {
    try {
      let result = await axios.get(`${API_URL}/bookings`);
      return result.data;
    } catch (error) {
      throw {
        message: "Lỗi: " + error,
      };
    }
  },

  removeBookings: async (id: string) => {
    try {
      await axios.delete(`${API_URL}/bookings/${id}`);
      // console.log(result); result.data la` object chua' du~ lieu. vua` xoa'
    } catch (error) {
      throw {
        message: "Fail to delete booking!!",
        error,
      };
    }
  },
  updateBookings: async (id: string, newData: Bookings) => {
    try {
      await axios.patch(`${API_URL}/bookings/${id}`, newData);
    } catch (error) {
      throw {
        message: "Fail to update booking!!",
        error,
      };
    }
  },

  getAllWithFilterPagination: async (currentPage: number, perPage: number, email: string, course: string, date: string): Promise<PaginatedResult> => {
    try {
      // Bước 1: Fetch bookings với date filter (nếu có)
      let bookingsUrl = `${API_URL}/bookings`;
      if (date !== "") {
        bookingsUrl += `?bookingDate=${date}`;
      }
      
      const bookingsResponse = await axios.get<Bookings[]>(bookingsUrl);
      let bookings = bookingsResponse.data;

      // Bước 2: Nếu có email hoặc course filter, cần fetch users và courses
      if (email !== "" || course !== "") {
        const [usersResponse, coursesResponse] = await Promise.all([
          email !== "" ? axios.get<User[]>(`${API_URL}/users`) : Promise.resolve({ data: [] }),
          course !== "" ? axios.get<Course[]>(`${API_URL}/courses`) : Promise.resolve({ data: [] })
        ]);

        const users = usersResponse.data;
        const courses = coursesResponse.data;

        // Bước 3: Filter bookings theo email và course
        bookings = bookings.filter((booking) => {
          // Filter theo email
          if (email !== "") {
            const user = users.find((u) => u.id === booking.userId);
            if (!user || !user.email.toLowerCase().includes(email.toLowerCase())) {
              return false;
            }
          }

          // Filter theo course name
          if (course !== "") {
            const courseData = courses.find((c) => c.id === booking.courseId);
            if (!courseData || courseData.name !== course) {
              return false;
            }
          }

          return true;
        });
      }

      // Bước 4: Phân trang kết quả
      const totalItems = bookings.length;
      const totalPages = Math.ceil(totalItems / perPage);
      const startIndex = (currentPage - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedData = bookings.slice(startIndex, endIndex);

      // Bước 5: Tạo result giống json-server format
      const result: PaginatedResult = {
        data: paginatedData,
        first: 1,
        prev: currentPage > 1 ? currentPage - 1 : null,
        next: currentPage < totalPages ? currentPage + 1 : null,
        last: totalPages || 1,
        pages: totalPages || 1,
        items: totalItems,
      };

      return result;
      
    } catch (error) {
      throw {
        message: "Fail to load all Users Bookings: " + error,
      };
    }
  },

  getAllUsersBookingsQuantity: async () => {
    try {
      let result = await axios.get(`${API_URL}/bookings`);
      return result.data.length;
    } catch (error) {
      throw {
        message: "Lỗi khi lấy số lượng: " + error,
      };
    }
  },

  getCourseBookingQuantity: async (c_id: string) => {
    try {
      let result = await axios.get(`${API_URL}/bookings?courseId=${c_id}`);
      return result.data.length;
    } catch (error) {
      throw {
        message: "Lỗi lấy tổng số lượt đặt",
      }
    }
  },

  deleteManyBookings: async (courseId: string, userId: string) => {
    let allBookings = await apis.bookingsApi.getAllBookings();
    try {
      if(userId === "") {
        const bookingsToDel = allBookings.filter((bookings: Bookings) => {
          return bookings.courseId === courseId
        });

        await Promise.all(bookingsToDel.map((b: Bookings) => {
          return axios.delete(`${API_URL}/bookings/${b.id}`);
        }));
        return;
      }

      if(courseId === "") {
        const bookingsToDel = allBookings.filter((bookings: Bookings) => bookings.userId === userId);

        await Promise.all(bookingsToDel.map((b: Bookings) => {
          return axios.delete(`${API_URL}/bookings/${b.id}`);
        }));
      }
    } catch (error) {
      throw {
        message: "fail to delete bookings with course deleted!!", error,
      }
    }
  }
};
