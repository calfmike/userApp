import React from 'react';
import { Navigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" />;
    }

    return (
        <>
            <Header />
            <Sidebar />
            <div className="main-content">
                {children}
            </div>
        </>
    );
};

export default PrivateRoute;
