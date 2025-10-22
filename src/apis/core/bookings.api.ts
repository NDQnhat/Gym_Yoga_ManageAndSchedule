import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL;

export const BookingsApi = {
    getUserBookings: async (id: string) => {
        try {
            let result = await axios.get(`${API_URL}/bookings?userId=${id}`);
            return result.data;
        } catch (error) {
            throw {
                message: "Tải lịch tập thất bại: " + error,
            }
        }
    }
}