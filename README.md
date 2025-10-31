# 🏋️‍♀️ Gym & Yoga Class Booking Management Website

> A full-featured website for booking and managing Gym, Yoga, Zumba, and other fitness classes — including user authentication, scheduling, role-based permissions, and an admin dashboard.  
> Built with **React + TypeScript + Redux Toolkit + Tailwind CSS + React Hook Form**.

---

## 🚀 UI Demo

| Page | Preview |
|------|----------|
| 🏠 **Home Page** | ![Home Page](./assets/homepage.png) |
| 📅 **Booking Page (User)** | ![Booking Page](./assets/booking-page.png) |
| 👩‍💼 **Admin Dashboard** | ![Admin Dashboard](./assets/admin-dashboard.png) |
| 🧘 **Course List (Card Layout)** | ![Course List](./assets/course-list.png) |
| 📊 **Statistics Chart** | ![Statistics Chart](./assets/statistics-chart.png) |

---

## 🧩 Core Features

### 👤 User
- Register / Login using **React Hook Form + Redux Toolkit**.
- Email format, password length, and confirmation validation.
- Automatically save user data and roles in **localStorage**.
- Choose class, date, and time to book a session.
- Manage, edit, and delete personal bookings via **Modal UI**.
- Paginated booking list for better navigation.
- Protected routes: only logged-in users can access booking pages.

### 🧑‍💼 Admin
- Manage all users and bookings.
- Add, edit, or delete courses (Gym, Yoga, Zumba, etc.).
- Filter by Email, Course, or Date (with debounce).
- Role-based access: only Admin can access management pages.
- Show visual statistics (Pie/Bar Charts) of total bookings per course.
- Data handled via **createAsyncThunk** (`GET /bookings`).

### 💡 Additional Features
- Fetch class data from **GET /courses**, sorted alphabetically (A → Z).
- Modern and responsive design using **Tailwind CSS**.
- Dynamic Navbar & Sidebar depending on login state and role.
- Footer with contact and copyright.

---

## 🛠️ Tech Stack

| Technology | Description |
|-------------|--------------|
| **React 18 + TypeScript** | UI development with type safety |
| **Redux Toolkit + createAsyncThunk** | State management and async logic |
| **React Router DOM** | Page routing |
| **React Hook Form** | Form validation and handling |
| **Tailwind CSS** | Responsive UI design |
| **AntD/plots** | Data visualization charts |
| **JSON Server / Mock API** | Local backend simulation |

---

## 📂 Project Structure

├── .env
├── .gitignore
├── db.json
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── structure.txt
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
│
├── public/
│   └── vite.svg
│
└── src/
    ├── App.css
    ├── App.tsx
    ├── main.tsx
    ├── ProtectAdmin.tsx
    ├── RouterConfig.tsx
    │
    ├── apis/
    │   ├── index.ts
    │   └── core/
    │       ├── bookings.api.ts
    │       ├── courses.api.ts
    │       └── user.api.ts
    │
    ├── assets/
    │   ├── cardimg1.png
    │   ├── cardimg2.png
    │   ├── cardimg3.png
    │   ├── gym-bg.jpg
    │   ├── home-gym-bg-test.jpg
    │   └── react.svg
    │
    ├── auth/
    │   ├── Login.tsx
    │   └── Register.tsx
    │
    ├── components/
    │   ├── Card.tsx
    │   ├── Footer.tsx
    │   └── Header.tsx
    │
    ├── pages/
    │   ├── admin_pages/
    │   │   ├── AdminLayout.tsx
    │   │   ├── ServicesManagement.tsx
    │   │   ├── Statistical.tsx
    │   │   └── UserManagement.tsx
    │   │
    │   ├── home_pages/
    │   │   └── Home.tsx
    │   │
    │   └── user_pages/
    │       ├── BookingPage.tsx
    │       ├── ConvertBookings.tsx
    │       └── UserInfo.tsx
    │
    ├── stores/
    │   ├── index.ts
    │   ├── slices/
    │   │   └── user.slice.ts
    │   └── thunk/
    │       ├── bookings.thunk.ts
    │       ├── course.thunk.ts
    │       └── user.thunk.ts
    │
    ├── types/
    │   ├── bookings.type.ts
    │   ├── course.type.ts
    │   ├── user.type.ts
    │   └── user_bookings.type.ts
    │
    └── utils/
        ├── index.ts
        └── core/
            ├── validate.booking_modal.ts
            ├── validate.course_modal.ts
            └── validation.ts


## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/NDQnhat/Gym_Yoga_ManageAndSchedule.git

2. Navigate to the project directory:
    ```bash
    cd Gym_Yoga_ManageAndSchedule

3. Install dependencies:
    ```bash
   npm install

4. Create a .env file in the root directory:

    VITE_API_URL=http://localhost:888

5. Start the frontend:
    ```bash
    npm run dev

6. Run the JSON server:
    ```bash
    npm run server


## Usage

| Method          | Endpoint                | Description                                     | Role         |
| --------------- | ----------------------- | ----------------------------------------------- | ------------ |
| **GET**         | `/courses`              | Get all available courses (Gym, Yoga, Zumba...) | All          |
| **POST**        | `/users`                | Register a new user account                     | User         |
| **POST**        | `/signin`               | Login and receive user info                     | User / Admin |
| **GET**         | `/bookings?userId={id}` | Get bookings by user                            | User         |
| **POST**        | `/bookings`             | Add a new booking                               | User         |
| **PATCH / PUT** | `/bookings/:id`         | Update an existing booking                      | User         |
| **DELETE**      | `/bookings/:id`         | Delete a booking                                | User / Admin |
| **GET**         | `/bookings`             | Get all bookings (Admin panel)                  | Admin        |


## Roles & Route Protection

| User Type | Access                | Notes                                              |
| --------- | --------------------- | -------------------------------------------------- |
| **Guest** | Home, Login, Register | Cannot access `/booking` or `/admin`               |
| **User**  | Home, Booking         | Cannot access `/admin`                             |
| **Admin** | Home, Admin Dashboard | Full access (Users, Bookings, Courses, Statistics) |


## Key Logic & Hooks

| Component / Hook                     | Description                                       |
| ------------------------------------ | ------------------------------------------------- |
| **useAppSelector**                   | Get `auth` state (login + role)                   |
| **usePagination** *(Optional)*       | Manage paginated data logic                       |
| **createAsyncThunk**                 | Handle async API calls (users, courses, bookings) |
| **React Hook Form**                  | Form validation for registration and booking      |



## Admin Statistics

- Charts show the total number of bookings per course (Gym, Yoga, Zumba, etc.).
- Built with Ant Design Charts (Pie / Bar).
- Automatically updates after each add/edit/delete action.


## Contact

[GITHUB](https://github.com/NDQnhat)
