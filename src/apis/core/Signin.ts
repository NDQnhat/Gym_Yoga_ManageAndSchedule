import axios from "axios";

export interface SigninDTO {
	email: string;
	password: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export const Signin = {
	login: async (signinData: SigninDTO) => {
		try {
			const response = await axios.get(`${API_URL}/users`, {
				params: { email: signinData.email }
			});
			const user = response.data.find((u: any) => u.email === signinData.email && u.password === signinData.password);
			if (user) {
				// Có thể loại bỏ password trước khi trả về
				const { password, ...userWithoutPassword } = user;
				return userWithoutPassword;
			} else {
				return null;
			}
		} catch (error) {
			console.error("Lỗi khi đăng nhập:", error);
			throw error;
		}
	},
};
