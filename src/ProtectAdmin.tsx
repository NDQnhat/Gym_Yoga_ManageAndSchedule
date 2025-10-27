import { message } from 'antd';
import React, { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router'

interface PropsType {
    children: React.ReactNode,
}

export default function ProtectAdmin({ children }: PropsType) {
    const navigate = useNavigate();

    const currentRole = localStorage.getItem("currentRole") || "";

    if (currentRole !== "admin") {
        if (currentRole === "user") {
            message.error("Must be ADMIN to access!!!");
            return <Navigate to="/" />
        }

        if (currentRole === "") {
            message.error("Login required!!");
            return <Navigate to="/signin" />
        }
    }

    return (
        <div>{children}</div>
    )
}
