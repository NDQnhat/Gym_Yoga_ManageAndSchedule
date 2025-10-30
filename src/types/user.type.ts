export interface User {
    id?: string;
    email: string;
    password: string;
    fullname: string;
    role: 'admin' | 'user';
    phone: string;
}