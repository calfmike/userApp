import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar, Divider, Box } from '@mui/material';
import { motion } from 'framer-motion';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import api from '../api';
import {jwtDecode} from 'jwt-decode';

const Dashboard = () => {
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get(`/accounts/user/${userId}`);
                setAccounts(response.data);

                // Fetch transactions for the first account as an example
                if (response.data.length > 0) {
                    const transactionsResponse = await api.get(`/transactions/account/${response.data[0]._id}`);
                    setTransactions(transactionsResponse.data);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [userId]);

    const getTransactionDetails = (transaction) => {
        let icon;
        let backgroundColor;
        let description;

        if (transaction.type === 'deposit') {
            icon = <ArrowUpwardIcon />;
            backgroundColor = 'green';
            description = `Deposit of $${transaction.amount}`;
        } else if (transaction.type === 'withdraw') {
            icon = <ArrowDownwardIcon />;
            backgroundColor = 'red';
            description = `Withdrawal of $${transaction.amount}`;
        } else if (transaction.type === 'transfer') {
            if (transaction.accountId === accounts[0]._id) { // Adjust to handle multiple accounts if necessary
                // Outgoing transfer
                icon = <SwapHorizIcon />;
                backgroundColor = 'orange';
                description = `Outgoing transfer of $${transaction.amount} to Account ${transaction.toAccountId}`;
            } else if (transaction.toAccountId === accounts[0]._id) {
                // Incoming transfer
                icon = <SwapHorizIcon />;
                backgroundColor = 'blue';
                description = `Incoming transfer of $${transaction.amount} from Account ${transaction.accountId}`;
            }
        }

        return { icon, backgroundColor, description };
    };

    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                {/* Card for General Balance */}
                <Grid item xs={12} md={8} lg={9}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 'auto',
                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                General Balance
                            </Typography>
                            <Typography variant="h4" color="primary">
                                ${totalBalance.toLocaleString()}
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                {accounts.map((account) => (
                                    <Typography key={account._id} variant="body1" sx={{ color: 'text.secondary' }}>
                                        {`Account ${account.accountNumber}: $${account.balance.toLocaleString()}`}
                                    </Typography>
                                ))}
                            </Box>
                            <Typography variant="h6" sx={{ mt: 2 }}>
                                Total: ${totalBalance.toLocaleString()}
                            </Typography>
                        </Paper>
                    </motion.div>
                </Grid>

                {/* Card for Recent Transactions */}
                <Grid item xs={12}>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                Recent Transactions
                            </Typography>
                            <List>
                                {transactions.length === 0 ? (
                                    <Typography>No transactions found.</Typography>
                                ) : (
                                    transactions.map((transaction) => {
                                        const { icon, backgroundColor, description } = getTransactionDetails(transaction);
                                        return (
                                            <React.Fragment key={transaction._id}>
                                                <ListItem sx={{
                                                    bgcolor: `${backgroundColor}.100`, // Light background color
                                                    borderRadius: 2,
                                                    mb: 1
                                                }}>
                                                    <Avatar sx={{
                                                        backgroundColor,
                                                        mr: 2
                                                    }}>
                                                        {icon}
                                                    </Avatar>
                                                    <ListItemText
                                                        primary={description}
                                                        secondary={new Date(transaction.createdAt).toLocaleString()}
                                                    />
                                                </ListItem>
                                                <Divider variant="inset" component="li" />
                                            </React.Fragment>
                                        );
                                    })
                                )}
                            </List>
                        </Paper>
                    </motion.div>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
