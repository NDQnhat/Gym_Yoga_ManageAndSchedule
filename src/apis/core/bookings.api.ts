import axios from "axios";
import type { Bookings } from "../../types/bookings.type";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:888';

export const BookingsApi = {
  getUserBookings: async (id: string, currentPage: number, perPage: number) => {
    try {
      const result = await axios.get(`${API_URL}/bookings?userId=${id}&_page=${currentPage}&_per_page=${perPage}`);
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
  removeBookings: async (id: string) => {
    try {
      await axios.delete(`${API_URL}/bookings/${id}`);
      // console.log(result); result.data la` object chua' du~ lieu. vua` xoa'
    } catch (error) {
      throw {
        message: "Fail to delete booking!!", error,
      }
    }
  },
  updateBookings: async(id: string, newData: Bookings) => {
    try {
      await axios.patch(`${API_URL}/${id}`, newData);
    } catch (error) {
      throw {
        message: "Fail to update booking!!", error,
      }
    }
  }
};
