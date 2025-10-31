export interface User {
    id?: string;
    avatarUrl: string;
    email: string;
    password: string;
    fullname: string;
    role: 'admin' | 'user';
    phoneNum: string;
}