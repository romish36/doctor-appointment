import React, { useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Navigate, useNavigate } from 'react-router-dom';

const ApplyDoctor = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        website: '',
        specialization: '',
        experience: '',
        feesPerConsultation: '',
        timings: {
            start: '',
            end: ''
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'start' || name === 'end') {
            setFormData(prev => ({
                ...prev,
                timings: { ...prev.timings, [name]: value }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                '/api/user/apply-doctor',
                {
                    ...formData,
                    timings: [formData.timings.start, formData.timings.end]
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            if (res.data.success) {
                toast.success(res.data.message);
                navigate('/user/home')
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
            console.error('Apply Doctor Error:', error.response || error);
        }
    };
    return (
        <>
            <div className="container">
                <h2 className="text-center my-4">Apply as Doctor</h2>
                <form onSubmit={handleSubmit}>
                    {/* Personal Information */}
                    <h4>Personal Information</h4>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label><span style={{ color: 'red' }}>*</span>First Name</label>
                            <input type="text" className="form-control" name="firstName" value={formData.firstName} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label><span style={{ color: 'red' }}>*</span>Last Name</label>
                            <input type="text" className="form-control" name="lastName" value={formData.lastName} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label><span style={{ color: 'red' }}>*</span>Phone Number</label>
                            <input type="text" className="form-control" name="phoneNumber" value={formData.phone} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label><span style={{ color: 'red' }}>*</span>Website</label>
                            <input type="text" className="form-control" name="website" value={formData.website} onChange={handleChange} required />
                        </div>
                        <div className="col-md-12 mb-3">
                            <label><span style={{ color: 'red' }}>*</span>Address</label>
                            <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} required />
                        </div>
                    </div>

                    {/* Professional Information */}
                    <h4 className="mt-4">Professional Information</h4>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label><span style={{ color: 'red' }}>*</span>Specialization</label>
                            <input type="text" className="form-control" name="specialization" value={formData.specialization} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label><span style={{ color: 'red' }}>*</span>Experience (in years)</label>
                            <input type="text" className="form-control" name="experience" value={formData.experience} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label><span style={{ color: 'red' }}>*</span>Fees Per Consultation (₹)</label>
                            <input type="number" className="form-control" name="feesPerConsultation" value={formData.feesPerConsultation} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label><span style={{ color: 'red' }}>*</span>Timings</label>
                            <div className="d-flex gap-2">
                                <input type="time" className="form-control" name="start" value={formData.timings.start} onChange={handleChange} required />
                                <input type="time" className="form-control" name="end" value={formData.timings.end} onChange={handleChange} required />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary mt-3">Submit Application</button>
                </form>
            </div>

        </>
    )
}

export default ApplyDoctor
