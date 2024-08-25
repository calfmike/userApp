import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Paper, Typography, List, ListItem, ListItemText, Divider, Avatar, Box, Card, CardContent } from '@mui/material';
import { toast } from 'react-toastify';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import api from '../api';

const AccountDetail = () => {
    const { accountId } = useParams(); // Get the account ID from the URL parameters
    const [transactions, setTransactions] = useState([]);
    const [account, setAccount] = useState(null); // Store account details

    useEffect(() => {
        const fetchAccountAndTransactions = async () => {
            try {
                // Fetch account details
                const accountResponse = await api.get(`/accounts/${accountId}`);
                setAccount(accountResponse.data);

                // Fetch transactions for the specific account
                const transactionsResponse = await api.get(`/transactions/account/${accountId}`);
                setTransactions(transactionsResponse.data);
            } catch (error) {
                toast.error('Error fetching account details or transactions.');
                console.error('Error fetching account details or transactions:', error);
            }
        };

        fetchAccountAndTransactions();
    }, [accountId]);

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
            if (transaction.accountId === accountId) {
                // Outgoing transfer
                icon = <SwapHorizIcon />;
                backgroundColor = 'orange';
                description = `Outgoing transfer of $${transaction.amount} to Account ${transaction.toAccountId}`;
            } else if (transaction.toAccountId === accountId) {
                // Incoming transfer
                icon = <SwapHorizIcon />;
                backgroundColor = 'blue';
                description = `Incoming transfer of $${transaction.amount} from Account ${transaction.accountId}`;
            }
        }

        return { icon, backgroundColor, description };
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            {account && (
                <Card sx={{ mb: 4 }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, backgroundColor: 'primary.main' }}>
                            <AccountBalanceWalletIcon />
                        </Avatar>
                        <Box>
                            <Typography variant="h5" component="div">
                                Account Number: {account.accountNumber}
                            </Typography>
                            <Typography variant="h6" component="div" sx={{ color: 'text.secondary' }}>
                                Balance: ${account.balance.toLocaleString()}
                            </Typography>
                            <Typography variant="h6" component="div" sx={{ color: 'text.secondary' }}>
                                Account Type: {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            )}

            <Paper sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Account Transactions
                </Typography>
                
                <List>
                    {transactions.length === 0 ? (
                        <Typography>No transactions found for this account.</Typography>
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
                                    <Divider />
                                </React.Fragment>
                            );
                        })
                    )}
                </List>
            </Paper>
        </Container>
    );
};

export default AccountDetail;
