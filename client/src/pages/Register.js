import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Register = () => {

    const navigate = useNavigate();

    // state for form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    // update form data on input change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent default form submit
        try {
            const res = await axios.post('/api/user/register', formData);
            if (res.data.success) {
                toast.success('Registered Successfully');
                navigate('/login');
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
                    <h1 className="card-title">Register Page</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input type="text" className="form-control" id="name" name="name" placeholder="Enter your Name"
                                value={formData.name}
                                onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" className="form-control" id="email" name="email" placeholder="Enter your Email"
                                value={formData.email}
                                onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" className="form-control" id="password" name="password" placeholder="Enter your Password"
                                value={formData.password}
                                onChange={handleChange} required />
                        </div>
                        <button type="submit" className="btn btn-primary primary-button my-2">Register</button>
                        <Link to="/login" className="forlink">Click here to Login</Link>
                    </form>
                </div>
            </div>

        </>
    )
}

export default Register
