import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);

    const fetchAppointments = async () => {
        try {
            const res = await axios.get('/api/appointment/doctor-appointments', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setAppointments(res.data.data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch appointments');
        }
    };

    const handleStatusChange = async (appointmentId, status) => {
        try {
            const res = await axios.post(
                '/api/appointment/update-appointment-status',
                { appointmentId, status },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            toast.success(res.data.message);
            fetchAppointments(); // refresh
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    return (
        <>
            <div className="container mt-4">
                <h2 className="mb-4 text-primary">Your Appointments</h2>
                {appointments.length === 0 ? (
                    <p>No appointments</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((apt) => (
                                    <tr key={apt._id}>
                                        <td>{apt.userId?.name}</td>
                                        <td>{apt.userId?.email}</td>
                                        <td>{apt.date}</td>
                                        <td>{apt.time}</td>
                                        <td>
                                            <span className={`badge bg-${apt.status === 'pending' ? 'warning' : apt.status === 'approved' ? 'success' : 'danger'}`}>
                                                {apt.status}
                                            </span>
                                        </td>
                                        <td>
                                            {apt.status === 'pending' && (
                                                <>
                                                    <button
                                                        className="btn btn-success btn-sm me-2"
                                                        onClick={() => handleStatusChange(apt._id, 'approved')}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleStatusChange(apt._id, 'rejected')}
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div >
        </>
    )
}

export default Appointments
