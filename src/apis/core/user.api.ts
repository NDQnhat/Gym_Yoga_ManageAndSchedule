import axios from "axios";
import type { FormSignup } from "../../auth/Register";

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
};
