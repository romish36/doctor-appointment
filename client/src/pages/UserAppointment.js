import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserAppointment = () => {
    const [appointments, setAppointments] = useState([]);

    const getAppointments = async () => {
        try {
            const res = await axios.get('/api/appointment/user-appointments', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setAppointments(res.data.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch appointments');
        }
    };

    useEffect(() => {
        getAppointments();
    }, []);

    return (
        <>
            <div className="container mt-4">
                <h2 className="mb-4 text-primary">My Appointments</h2>
                {appointments.length === 0 ? (
                    <p>No appointments found.</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Doctor</th>
                                    <th>Specialization</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((apt) => (
                                    <tr key={apt._id}>
                                        <td>
                                            Dr. {apt.doctorId?.firstName} {apt.doctorId?.lastName}
                                        </td>
                                        <td>{apt.doctorId?.specialization}</td>
                                        <td>{apt.date}</td>
                                        <td>{apt.time}</td>
                                        <td>
                                            <span className={`badge bg-${apt.status === 'pending' ? 'warning' : apt.status === 'approved' ? 'success' : 'danger'}`}>
                                                {apt.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    )
}

export default UserAppointment
