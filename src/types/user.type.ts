export interface User {
    id: string;
    email: string;
    password: string;
    fullName: string;
    role: 'admin' | 'user';
    phone: string;
}