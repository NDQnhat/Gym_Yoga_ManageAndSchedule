export interface User {
    id: number;
    email: string;
    password: string;
    fullName: string;
    role?: 'admin' | 'user';
    phone: string;
}