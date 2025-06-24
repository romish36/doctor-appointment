import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UsersList = () => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const res = await axios.post('http://localhost:3000/api/admin/getAllUsers', {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.data.success) {
                setUsers(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <>
            <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#343a40', marginBottom: '10px' }}>
                    Manage Users
                </h2>
                <table
                    style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                        marginTop: '20px',
                    }}
                >
                    <thead>
                        <tr>
                            {['Name', 'Email', 'Doctor', 'Actions'].map((heading) => (
                                <th
                                    key={heading}
                                    style={{
                                        border: '1px solid #ddd',
                                        padding: '12px 16px',
                                        backgroundColor: '#f8f9fa',
                                        color: '#333',
                                        fontSize: '16px',
                                        textAlign: 'center',
                                    }}
                                >
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr
                                key={user._id}
                                style={{
                                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f2f2f2',
                                    transition: 'background-color 0.3s',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e6f7ff')}
                                onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                    index % 2 === 0 ? '#ffffff' : '#f2f2f2')
                                }
                            >
                                <td style={{ border: '1px solid #ddd', padding: '12px 16px', textAlign: 'center' }}>
                                    {user.name}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '12px 16px', textAlign: 'center' }}>
                                    {user.email}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '12px 16px', textAlign: 'center' }}>
                                    {user.isDoctor ? 'Yes' : 'No'}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '12px 16px', textAlign: 'center' }}>
                                    <button
                                        style={{
                                            backgroundColor: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 14px',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                        }}
                                        onMouseEnter={(e) => (e.target.style.backgroundColor = '#b52a37')}
                                        onMouseLeave={(e) => (e.target.style.backgroundColor = '#dc3545')}
                                    >
                                        Block
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default UsersList
