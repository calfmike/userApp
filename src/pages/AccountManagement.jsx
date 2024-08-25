import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../api';

const AccountManagement = () => {
    const [accounts, setAccounts] = useState([]);
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await api.get(`/accounts/user/${userId}`);
                setAccounts(response.data);
            } catch (error) {
                console.error('Error fetching accounts:', error);
            }
        };

        fetchAccounts();
    }, [userId]);

    const handleViewDetails = (accountId) => {
        navigate(`/accounts/${accountId}`);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Manage Accounts
            </Typography>
            <Grid container spacing={3}>
                {accounts.length === 0 ? (
                    <Typography>No accounts found.</Typography>
                ) : (
                    accounts.map((account) => (
                        <Grid item xs={12} sm={6} md={4} key={account._id}>
                            <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    height: 200,
                                }}
                            >
                                <Typography variant="h6">
                                    Account Type: {account.accountType === 'savings' ? 'Savings' : 'Checking'}
                                </Typography>
                                <Typography>
                                    Account Number: {account.accountNumber}
                                </Typography>
                                <Typography>
                                    Balance: ${account.balance}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleViewDetails(account._id)}
                                >
                                    View Details
                                </Button>
                            </Paper>
                        </Grid>
                    ))
                )}
            </Grid>
        </Container>
    );
};

export default AccountManagement;
