import React from 'react'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const useUserData = () => {
    const [user, setUser] = useState(null);

    const getUserData = async () => {
        try {
            const res = await axios.post(
                '/api/user/getUserData',
                {},
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                }
            );
            if (res.data.success) {
                setUser(res.data.data);
            } else {
                toast.error(res.data.message);
                localStorage.clear();
            }
        } catch (error) {
            toast.error('Something went wrong');
            localStorage.clear();
        }
    };

    useEffect(() => {
        if (localStorage.getItem('token')) {
            getUserData();
        }
        // eslint-disable-next-line
    }, []);
    return user;
}

export default useUserData
