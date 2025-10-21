import type { FormSignin } from "../../auth/Login";
import type { ErrorType, FormSignup } from "../../auth/Register";

const API_URL = import.meta.env.VITE_API_URL;

export const validation = {
  signup: (data: FormSignup) => {
    const errors: ErrorType = {
      fullname: "",
      email: [],
      phoneNum: "",
      password: "",
      rePass: "",
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim()) {
      errors.email.push("Email required!");
    } else if (!emailRegex.test(data.email)) {
      errors.email.push("Invalid email format!");
    }

    if (data.fullname.length === 0) {
      errors.fullname = "Fullname required!";
    }

    if (data.phoneNum.length === 0) {
      errors.phoneNum = "Phone number required!!";
    }

    if (data.password.length < 8) {
      errors.password = "Password too short!!!";
    }

    if (data.password !== data.rePass) {
      errors.rePass = "Passwords not match!";
    }

    return errors;
  },

  signin: (data: FormSignin) => {
    const errors: FormSignin = {email: "", password: ""};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim()) {
      errors.email = "Email required!";
    } else if (!emailRegex.test(data.email)) {
      errors.email = "Invalid email format!";
    }

    if(data.password.length === 0) {
      errors.password = "Password required!!!";
    }
    
    return errors;
  }
};
