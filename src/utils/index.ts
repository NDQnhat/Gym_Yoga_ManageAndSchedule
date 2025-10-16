import ValidateLogin from "./core/ValidateLogin";
import {ValidateRegister} from "./core/ValidateRegister";

export const validate = {
    signup: ValidateRegister,
    signin: ValidateLogin,
}