import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
    const navigate = useNavigate();

    // state for form fields
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    // update input values
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/user/login', formData);
            if (res.data.success) {
                toast.success('Login Successful');
                localStorage.setItem('token', res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user));
                const userRes = await axios.post('/api/user/getUserData', {}, {
                    headers: {
                        Authorization: `Bearer ${res.data.token}`,
                    },
                });

                if (userRes.data.success) {
                    const user = userRes.data.data;
                    if (user.isAdmin) {
                        navigate('/admin/home');
                    } else if (user.isDoctor) {
                        navigate('/doctor/home')
                    } else {
                        navigate('/user/home');
                    }
                } else {
                    toast.error('Failed to fetch user details');
                }
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong');
        }
    };

    return (
        <>
            <div className="authentication">
                <div className="authentication-form card p-3">
                    <h1 className="card-title">Login Page</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" className="form-control" id="email" name="email" placeholder="Enter your Email" value={formData.email}
                                onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" className="form-control" id="password" name="password" placeholder="Enter your Password" value={formData.password}
                                onChange={handleChange} required />
                        </div>
                        <button type="submit" className="btn btn-primary primary-button my-2">Login</button>
                        <Link to="/register" className="forlink">Click here to Register</Link>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;
