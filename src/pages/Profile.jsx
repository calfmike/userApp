import React, { useEffect, useState } from 'react';
import { Container, TextField, Button, Typography, Paper } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import api from '../api';

const Profile = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const decodedToken = jwtDecode(token);
                const response = await api.get('/users/profile'); // Adjust the endpoint if necessary
                const userData = response.data;

                setUsername(userData.username);
                setEmail(userData.email);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put('/users/profile', { username, email });
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage('Failed to update profile. Please try again.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Profile
                </Typography>
                <form onSubmit={handleUpdateProfile}>
                    <TextField
                        label="Username"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        label="Email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Update Profile
                    </Button>
                </form>
                {message && (
                    <Typography variant="body1" color="success.main" mt={2}>
                        {message}
                    </Typography>
                )}
            </Paper>
        </Container>
    );
};

export default Profile;
