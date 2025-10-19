// import axios from "axios";

// export interface UserDTO {
//     email: string;
//     password: string;
//     fullName: string;
//     phone: string;
//     role?: string;
// }

// const API_URL = import.meta.env.VITE_API_URL;

// export const Signup = {
//   getAllUsers: async () => {
//     try {
//       const response = await axios.get(`${API_URL}/users`);
//       return response.data;
//     } catch (error) {
//       console.log(error);
//       return false;
//     }
//   },

//   checkEmailExist: async (email: string): Promise<boolean> => {
//     try {
//       const users = await Signup.getAllUsers();
//       return users.some((user: any) => user.email === email);
//     } catch (error) {
//       console.error("Lỗi khi kiểm tra email:", error);
//       return false;
//     }
//   },

//   registNew: async (newUser: UserDTO) => {
//     try {
//       const response = await axios.post(`${API_URL}/users`, {
//         ...newUser,
//         role: newUser.role || "user",
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Loi khi đăng ký người dùng:", error);
//       throw error;
//     }
//   },
// };
