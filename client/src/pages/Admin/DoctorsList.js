import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorsList = () => {
    const [doctors, setDoctors] = useState([]);

    const fetchDoctors = async () => {
        try {
            const res = await axios.post(
                'http://localhost:3000/api/admin/getAllDoctors',
                {},
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                }
            );
            if (res.data.success) {
                setDoctors(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleStatusUpdate = async (doctorId, status) => {
        try {
            const res = await axios.post('/api/admin/update-doctor-status', { doctorId, status }, {
                headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
            });
            if (res.data.success) {
                toast.success(res.data.message);
                // Reload doctor list
                fetchDoctors();
            }
        } catch (error) {
            toast.error('Something went wrong');
            console.log(error);
        }
    };

    return (
        <>
            <div style={{ padding: '20px' }}>
                <h2>Manage Doctors</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f2f2f2' }}>
                        <tr>
                            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Name</th>
                            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Specialization</th>
                            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Phone</th>
                            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Status</th>
                            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doctors.map((doc) => (
                            <tr key={doc._id}>
                                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{doc.firstName} {doc.lastName}</td>
                                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{doc.specialization}</td>
                                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{doc.phoneNumber}</td>
                                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{doc.status}</td>
                                <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                                    {doc.status === 'pending' ? (
                                        <>
                                            <button
                                                style={{
                                                    backgroundColor: 'green',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '5px 10px',
                                                    marginRight: '10px',
                                                    cursor: 'pointer',
                                                    borderRadius: '4px',
                                                }}
                                                onClick={() => handleStatusUpdate(doc._id, 'approved')}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                style={{
                                                    backgroundColor: 'red',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '5px 10px',
                                                    cursor: 'pointer',
                                                    borderRadius: '4px',
                                                }}
                                            >
                                                Reject
                                            </button>
                                        </>
                                    ) : doc.status === 'approved' ? (
                                        <button
                                            style={{
                                                backgroundColor: 'darkred',
                                                color: 'white',
                                                border: 'none',
                                                padding: '5px 10px',
                                                cursor: 'pointer',
                                                borderRadius: '4px',
                                            }}
                                        >
                                            Remove
                                        </button>
                                    ) : (
                                        '-' // If rejected or unknown status
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default DoctorsList
