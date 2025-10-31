import axios from "axios";
import type { FormSignup } from "../../auth/Register";
import type { FormSignin } from "../../auth/Login";
import type { User } from "../../types/user.type";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:888';

export const UserApi = {
  registerUser: async (data: FormSignup) => {
    const emailCheck = await axios.get(`${API_URL}/users?email=${data.email}`);
    if (emailCheck.data.length > 0) {
      throw {
        message: "Email existed!",
      };
    }

    const res = await axios.post(`${API_URL}/users`, {
      fullname: data.fullname,
      email: data.email,
      phoneNum: data.phoneNum,
      password: data.password,
      role: data.role || "user",
      avatarUrl: "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
    });

    return res.data;
  },

  loginUser: async (data: FormSignin) => {
    const emailCheck = await axios.get(`${API_URL}/users?email=${data.email}`);
    if (emailCheck.data.length === 0) {
      throw {
        message: "Email not Existed in Database!!",
      };
    }
    // console.log(emailCheck.data); => [] neu' khong co' hoac. neu' co' la` [{...},...]

    if (data.password !== emailCheck.data[0].password) {
      throw {
        message: "Password Incorrect!!!",
      };
    }

    return emailCheck.data;
  },

  findNameById: async (id: string) => {
    const user = await axios.get(`${API_URL}/users/${id}`);

    // console.log(user);
    // alert("stop");

    if (user.data.length === 0) {
      throw {
        message: "User not existed in Database!",
      };
    }

    return user.data.fullname;
  },

  getUserData: async (id: string) => {
    try {
      const res = await axios.get(`${API_URL}/users/${id}`);
      return res.data;
    } catch (error) {
      throw {
        message: "Fail to get user data!!", error,
      }
    }
  },

  findEmailById: async (id: string) => {
    try {
      const user = await axios.get(`${API_URL}/users/${id}`);
      return user.data.email;
    } catch (error) {
      throw {
        message: "Fail to get email of user!!",
      };
    }
  },
  getAllUsers: async () => {
    try {
      const res = await axios.get(`${API_URL}/users`);
      return res.data;
    } catch (error) {
      throw {
        message: "Fall to fetch all users data!!",
      }
    }
  },

  removeUser: async (id: string) => {
    try {
      await axios.delete(`${API_URL}/users/${id}`);
    } catch (error) {
      throw {
        message: "Fail to delete user!!", error,
      };
    }
  },

  updateUser: async (id: string, newData: User) => {
    try {
      let res = await axios.patch(`${API_URL}/users/${id}`, newData);
    } catch (error) {
      throw {
        message: "Fail to update User!!", error,
      };
    }
  },
};
