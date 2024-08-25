import React from 'react';
import { Container, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SuccessScreen = () => {
    const navigate = useNavigate();

    const handleReturnToTransactions = () => {
        navigate('/transactions');
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Transaction Successful!
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Your transaction has been completed successfully.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleReturnToTransactions}
                    sx={{ mt: 2 }}
                >
                    Return to Transactions
                </Button>
            </Paper>
        </Container>
    );
};

export default SuccessScreen;
