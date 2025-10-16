import type { FormSignup } from "../../auth/Register";

export interface ValidationSignupResult {
  isValid: boolean;
  errors: string[];
}

export function ValidateRegister(data: FormSignup): ValidationSignupResult {
  const errors: string[] = [];

  for (const [key, value] of Object.entries(data)) {
    if (value.trim() === "") {
      errors.push(`"${key}" không được để trống!!`);
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    errors.push("Email không hợp lệ!!");
  }

  if (data.password.length < 8) {
    errors.push("Mật khẩu phải quá ngắn!!!");
  }

  if (data.password !== data.confirmPassword) {
    errors.push("Mật khẩu xác nhận không khớp!");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
