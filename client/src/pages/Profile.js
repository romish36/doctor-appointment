import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

const Profile = () => {
    const [user, setUser] = useState(null);

    const getUserData = async () => {
        try {
            const res = await axios.post(
                '/api/user/getUserData',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            if (res.data.success) {
                setUser(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

    return (

        <div className="p-4">
            <h3>My Profile</h3>
            {user ? (
                <div>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.isAdmin ? 'Admin' : user.isDoctor ? 'Doctor' : 'User'}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>

    );
};

export default Profile;
