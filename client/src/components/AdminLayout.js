import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import '../layout.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const AdminLayout = ({ children }) => {
    const [user, setUser] = useState(null);
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
                console.log('Error fetching user:', error);
            }
        };

        fetchUser();
    }, []);
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        localStorage.removeItem('token')
        toast.success('Logged out successfully')
        navigate('/login')
    }

    const adminMenu = [
        { name: 'Home', path: '/admin/home', icon: 'ri-home-4-line' },
        { name: 'Users', path: '/admin/users', icon: 'ri-user-line' },
        { name: 'Doctors', path: '/admin/doctors', icon: 'ri-stethoscope-line' },
        { name: 'Profile', path: '/admin/profile', icon: 'ri-user-settings-line' },
        { name: 'Logout', path: '/logout', icon: 'ri-logout-box-r-line' }
    ]
    const notificationCount = user?.unseenNotifications?.length || 0;
    return (
        <div className='main'>
            <div className='d-flex layout'>
                <div className='sidebar'>
                    <div className='sidebar-header'>
                        <h1 className='logo'>
                            {user?.isAdmin
                                ? 'Admin'
                                : user?.isDoctor
                                    ? user.doctorInfo?.firstName + ' ' + user.doctorInfo?.lastName
                                    : user?.name}
                        </h1>
                        <span className='badge bg-info text-dark'>
                            {user?.isAdmin ? 'Admin' : user?.isDoctor ? 'Doctor' : 'User'}
                        </span>
                    </div>
                    <div className='menu'>
                        {adminMenu.map((menu) => {
                            const isActive = location.pathname === menu.path
                            return (
                                <div
                                    key={menu.name}
                                    className={`menu-item d-flex ${isActive ? 'active-menu-item' : ''}`}
                                    onClick={menu.name === 'Logout' ? handleLogout : null}
                                >
                                    <i className={menu.icon}></i>
                                    {menu.name === 'Logout'
                                        ? <span className='text-white' style={{ cursor: 'pointer' }}>{menu.name}</span>
                                        : <Link to={menu.path}>{menu.name}</Link>}
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className='contant'>
                    <div className='header'>
                        <i className="ri-admin-line header-action-icon"></i>
                        <div className="d-flex position-relative">
                            <i className="ri-notification-line header-action-icon mt-2 fs-4" onClick={() => { navigate('/admin/notifications') }}></i>
                            {notificationCount > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {notificationCount}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className='body'>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminLayout
