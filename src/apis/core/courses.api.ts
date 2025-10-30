import axios from "axios";
import type { Course } from "../../types/course.type";

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
  },

  postNewCourses: async (data: Course) => {
    try {
      const res = await axios.post(`${API_URL}/courses`, data);
      return res.data;
    } catch (error) {
      throw {
        message: "Fail to make new Courses: " + error,
      };
    }
  },

  removeCourse: async (id: string) => {
    try {
      await axios.delete(`${API_URL}/courses/${id}`);
    } catch (error) {
      throw {
        message: "Fail to delete course!!", error,
      };
    }
  },

  updateCourse: async (id: string, newData: Course) => {
    try {
      let res = await axios.patch(`${API_URL}/courses/${id}`, newData);
    } catch (error) {
      throw {
        message: "Fail to update booking!!", error,
      };
    }
  },
};
