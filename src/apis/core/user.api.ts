import axios from "axios";
import type { FormSignup } from "../../auth/Register";
import type { FormSignin } from "../../auth/Login";
import { message } from "antd";

// export interface UserDTO {
//   email: string;
//   password: string;
//   fullName: string;
//   phone: string;
//   role?: string;
// }

const API_URL = import.meta.env.VITE_API_URL;

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
      role: "user",
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

    console.log(user);
    // alert("stop");
    
    if (user.data.length === 0) {
      throw {
        message: "User not existed in Database!",
      };
    }

    return user.data.fullname;
  },

};
