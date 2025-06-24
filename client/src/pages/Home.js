import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Home.css'

const Home = () => {
    const [doctors, setDoctors] = useState([]);
    const navigate = useNavigate();

    const getApprovedDoctors = async () => {
        try {
            const res = await axios.get('/api/doctor/get-all-approved-doctors', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (res.data.success) {
                setDoctors(res.data.data);
            }
        } catch (error) {
            console.log('Error fetching approved doctors:', error);
        }
    };

    useEffect(() => {
        getApprovedDoctors();
    }, []);

    return (
        <>
            <div className="body" style={{ maxHeight: '650px', overflowY: 'auto', paddingRight: '10px' }}>
                <h1 className="text-center text-primary fw-bold mb-4">All Doctors</h1>
                <div className="row row-cols-1 row-cols-md-2 g-4">
                    {doctors.map((doctor) => (
                        <div className="col" key={doctor._id}>
                            <div className="card h-100 shadow doctor-card">
                                <div className="card-body">
                                    <h5 className="card-title fw-bold" style={{ color: '#343a40' }}>
                                        Dr. {doctor.firstName} {doctor.lastName}
                                    </h5>
                                    <p className="card-text"><strong>Specialization:</strong> {doctor.specialization}</p>
                                    <p className="card-text"><strong>Experience:</strong> {doctor.experience} years</p>
                                    <p className="card-text"><strong>Phone:</strong> {doctor.phoneNumber}</p>
                                    <p className="card-text"><strong>Timings:</strong> {doctor.timings?.[0]} - {doctor.timings?.[1]}</p>
                                </div>
                                <div className="card-footer bg-transparent border-0 text-center">
                                    <button className="btn btn-outline-primary" onClick={() => navigate(`/user/book-appointment/${doctor._id}`)}>
                                        Book Appointment
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Home
