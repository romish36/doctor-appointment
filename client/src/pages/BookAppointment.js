import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const BookAppointment = () => {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch doctor info
    useEffect(() => {
        (async () => {
            try {
                const res = await axios.post(
                    '/api/doctor/getDoctorInfoById',
                    { doctorId },
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );
                setDoctor(res.data.data);
            } catch (err) {
                toast.error('Failed to load doctor info');
            }
        })();
    }, [doctorId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!date || !time) return toast.warn('Please select date and time');

        const selected = new Date(`${date}T${time}`);
        const from = new Date(`${date}T${doctor.timings[0]}`);
        const to = new Date(`${date}T${doctor.timings[1]}`);

        if (selected < from || selected >= to) {
            return toast.warn(`Please select a time between ${doctor.timings[0]} and ${doctor.timings[1]}`);
        }

        try {
            setLoading(true);
            const res = await axios.post(
                '/api/appointment/book-appointment',
                { doctorId, date, time },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setLoading(false);
            toast.success(res.data.message);
            navigate('/user/home');
        } catch (err) {
            setLoading(false);
            toast.error(err.response?.data?.message || 'Booking failed');
        }
    };

    if (!doctor) return <p className="text-center mt-4">Loading doctor info...</p>;

    return (
        <>
            <div className="container mt-4">
                <h2 className="mb-4 text-primary">
                    Book Appointment with Dr. {doctor.firstName} {doctor.lastName}
                </h2>

                <form onSubmit={handleSubmit} className="col-md-6">
                    <div className="mb-3">
                        <label className="form-label">Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Time</label>
                        <input
                            type="time"
                            className="form-control"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                        />
                    </div>

                    <button disabled={loading} className="btn btn-primary">
                        {loading ? 'Booking...' : 'Book Appointment'}
                    </button>
                </form>
            </div>
        </>
    )
}

export default BookAppointment
