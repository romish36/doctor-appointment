import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Notifications = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('unseen');

    const getUserData = async () => {
        try {
            const res = await axios.post(
                '/api/user/get-user-info-by-id',
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
            console.log('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

    const handleMarkAllAsRead = async () => {
        try {
            const res = await axios.post(
                '/api/user/mark-all-notifications-as-read',
                {},
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                }
            );
            if (res.data.success) {
                toast.success('Marked all as read');
                setUser(res.data.data); // update state with updated notifications
            }
        } catch (error) {
            toast.error('Something went wrong');
            console.log(error);
        }
    };

    const handleDeleteAllSeen = async () => {
        try {
            const res = await axios.post(
                '/api/user/delete-all-seen-notifications',
                { userId: user._id },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                }
            );
            if (res.data.success) {
                toast.success('Deleted all seen notifications');
                setUser(res.data.data); // update with new data
            }
        } catch (error) {
            toast.error('Something went wrong while deleting');
            console.log(error);
        }
    };

    return (
        <>
            <div className="container mt-4">
                {/* Tab Headers */}
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'unseen' ? 'active' : ''}`}
                            onClick={() => setActiveTab('unseen')}
                        >
                            Unseen ({user?.unseenNotifications?.length || 0})
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'seen' ? 'active' : ''}`}
                            onClick={() => setActiveTab('seen')}
                        >
                            Seen ({user?.seenNotifications?.length || 0})
                        </button>
                    </li>
                </ul>

                {/* Tab Content */}
                <div className="tab-content mt-3">
                    {activeTab === 'unseen' && (
                        <div>
                            <h2>Unseen Notifications</h2>
                            <div className='d-flex justify-content-end'>
                                <button className="btn btn-sm btn-success p-1 mt-3 mb-3" style={{ fontSize: '15px' }} onClick={handleMarkAllAsRead}>Mark All as Read</button>
                            </div>
                            {user?.unseenNotifications?.length > 0 ? (
                                user.unseenNotifications.map((notif, index) => (
                                    <div
                                        key={index}
                                        className="card p-2 mb-2"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => navigate('/admin/doctors')}
                                    >
                                        <div className='card-text'>{notif.message}</div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted">No unseen notifications</p>
                            )}
                        </div>

                    )}

                    {activeTab === 'seen' && (
                        <div>
                            <h2>Seen Notifications</h2>
                            <div className='d-flex justify-content-end'>
                                <button
                                    className="btn btn-sm btn-success p-1 mt-3 mb-3"
                                    style={{ fontSize: '15px' }}
                                    onClick={handleDeleteAllSeen}
                                >
                                    Delete All
                                </button>
                            </div>
                            {user?.seenNotifications?.length > 0 ? (
                                user.seenNotifications.map((notif, index) => (
                                    <div key={index} className="alert alert-secondary">
                                        {notif.message}
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted">No seen notifications</p>
                            )}
                        </div>
                    )}

                </div>
            </div>

        </>
    )
}

export default Notifications