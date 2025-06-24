import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorProfile = () => {
    const [doctor, setDoctor] = useState(null);
    const [editMode, setEditMode] = useState(false);
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

    // Fetch doctor profile
    const getDoctorProfile = async () => {
        try {
            const res = await axios.post('/api/doctor/get-doctor-info-by-user-id', {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (res.data.success) {
                const data = res.data.data;
                setDoctor(data);
                setFormData({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phoneNumber: data.phoneNumber,
                    address: data.address,
                    website: data.website,
                    specialization: data.specialization,
                    experience: data.experience,
                    feesPerConsultation: data.feesPerConsultation,
                    timings: {
                        start: data.timings[0],
                        end: data.timings[1],
                    },
                });
            }
        } catch (err) {
            toast.error('Failed to load doctor profile');
        }
    };

    useEffect(() => {
        getDoctorProfile();
    }, []);

    // Handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'start' || name === 'end') {
            setFormData((prev) => ({
                ...prev,
                timings: { ...prev.timings, [name]: value },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    // Submit profile update
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                '/api/doctor/update-doctor-profile',
                {
                    ...formData,
                    timings: [formData.timings.start, formData.timings.end],
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (res.data.success) {
                toast.success('Profile updated successfully');
                setEditMode(false);
                getDoctorProfile(); // Refresh profile
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error('Error updating profile');
        }
    };

    return (
        <>
            <div className="container mt-4">
                {!editMode ? (
                    <>
                        <h2 className="mb-3">Doctor Profile</h2>
                        {doctor ? (
                            <div className="card p-3">
                                <p><strong>Name:</strong> {doctor.firstName} {doctor.lastName}</p>
                                <p><strong>Phone:</strong> {doctor.phoneNumber}</p>
                                <p><strong>Address:</strong> {doctor.address}</p>
                                <p><strong>Website:</strong> {doctor.website}</p>
                                <p><strong>Specialization:</strong> {doctor.specialization}</p>
                                <p><strong>Experience:</strong> {doctor.experience} years</p>
                                <p><strong>Fees:</strong> ₹{doctor.feesPerConsultation}</p>
                                <p><strong>Timings:</strong> {doctor.timings[0]} - {doctor.timings[1]}</p>
                                <button className="btn btn-primary mt-3" onClick={() => setEditMode(true)}>
                                    Update Profile
                                </button>
                            </div>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </>
                ) : (
                    <>
                        <h2 className="mb-3">Update Doctor Profile</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label>First Name</label>
                                    <input type="text" className="form-control" name="firstName" value={formData.firstName} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Last Name</label>
                                    <input type="text" className="form-control" name="lastName" value={formData.lastName} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Phone Number</label>
                                    <input type="text" className="form-control" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Website</label>
                                    <input type="text" className="form-control" name="website" value={formData.website} onChange={handleChange} />
                                </div>
                                <div className="col-md-12 mb-3">
                                    <label>Address</label>
                                    <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Specialization</label>
                                    <input type="text" className="form-control" name="specialization" value={formData.specialization} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Experience (years)</label>
                                    <input type="text" className="form-control" name="experience" value={formData.experience} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Fees (₹)</label>
                                    <input type="number" className="form-control" name="feesPerConsultation" value={formData.feesPerConsultation} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Timings</label>
                                    <div className="d-flex gap-2">
                                        <input type="time" className="form-control" name="start" value={formData.timings.start} onChange={handleChange} required />
                                        <input type="time" className="form-control" name="end" value={formData.timings.end} onChange={handleChange} required />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-success mt-3">Save Changes</button>
                            <button type="button" className="btn btn-secondary mt-3 ms-2" onClick={() => setEditMode(false)}>Cancel</button>
                        </form>
                    </>
                )}
            </div>
        </>
    )
}

export default DoctorProfile
