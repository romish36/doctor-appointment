import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../layout.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorLayout = ({ children }) => {
    const [user, setUser] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.post(
                    'http://localhost:3000/api/user/get-user-info-by-id',
                    {},
                    {
                        headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('token'),
                        },
                    }
                );
                if (res.data.success) {
                    setUser(res.data.data);
                }
            } catch (error) {
                console.log('Error fetching doctor user info:', error);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchDoctorInfo = async () => {
            try {
                if (user?.isDoctor && !user?.doctorInfo) {
                    const res = await axios.post(
                        '/api/doctor/get-doctor-info-by-user-id',
                        { userId: user._id },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`,
                            },
                        }
                    );
                    if (res.data.success) {
                        setUser({ ...user, doctorInfo: res.data.data });
                    }
                }
            } catch (error) {
                console.error('Error fetching doctor info', error);
            }
        };

        fetchDoctorInfo();
    }, []);


    const handleLogout = () => {
        localStorage.removeItem('token');
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const doctorMenu = [
        { name: 'Home', path: '/doctor/home', icon: 'ri-home-4-line' },
        { name: 'Appointments', path: '/doctor/appointments', icon: 'ri-calendar-check-line' },
        { name: 'Profile', path: '/doctor/profile', icon: 'ri-user-settings-line' },
        { name: 'Logout', path: '/logout', icon: 'ri-logout-box-r-line' },
    ];

    const notificationCount = user?.unseenNotifications?.length || 0;

    return (
        <>
            <div className='main'>
                <div className='d-flex layout'>
                    <div className='sidebar'>
                        <div className='sidebar-header'>
                            <h1 className='logo'>
                                {user?.isAdmin
                                    ? 'Admin'
                                    : user?.isDoctor
                                        ? user?.doctorInfo
                                            ? `${user.doctorInfo.firstName} ${user.doctorInfo.lastName}`
                                            : 'Doctor'
                                        : user?.name}
                            </h1>
                            <span className='badge bg-info text-dark'>
                                {user?.isAdmin ? 'Admin' : user?.isDoctor ? 'Doctor' : 'User'}
                            </span>

                        </div>
                        <div className='menu'>
                            {doctorMenu.map((menu) => {
                                const isActive = location.pathname === menu.path;
                                return (
                                    <div
                                        key={menu.name}
                                        className={`menu-item d-flex ${isActive ? 'active-menu-item' : ''}`}
                                        onClick={menu.name === 'Logout' ? handleLogout : null}
                                    >
                                        <i className={menu.icon}></i>
                                        {menu.name === 'Logout' ? (
                                            <span className='text-white' style={{ cursor: 'pointer' }}>
                                                {menu.name}
                                            </span>
                                        ) : (
                                            <Link to={menu.path}>{menu.name}</Link>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className='contant'>
                        <div className='header'>
                            <i className='ri-user-heart-line header-action-icon'></i>
                            <div className='d-flex position-relative'>
                                <i
                                    className='ri-notification-line header-action-icon mt-2 fs-4'
                                    onClick={() => {
                                        navigate('/doctor/notifications');
                                    }}
                                ></i>
                                {notificationCount > 0 && (
                                    <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'>
                                        {notificationCount}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className='body'>{children}</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DoctorLayout
