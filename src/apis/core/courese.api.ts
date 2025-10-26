import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:888';

export const CourseApi = {
  getAllCourse: async () => {
    try {
      let result = await axios.get(`${API_URL}/courses`);
      // console.log(result);
      return result.data;
    } catch (error) {
        throw {
            message: "Tải khóa học thất bại: " + (error as any).message,
        }
    }
  },

  getCourseName: async (id: string) => {
    try {
      let result = await axios.get(`${API_URL}/courses/${id}`);
      return result.data.name;
    } catch (error) {
      throw {
        message: "Fail to get course with id: " + id,
      }
    }
  }
};
