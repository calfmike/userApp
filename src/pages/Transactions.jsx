import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { toast } from 'react-toastify';

const Transactions = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [targetAccount, setTargetAccount] = useState("");
  const [transactionType, setTransactionType] = useState("deposit");
  const [transferType, setTransferType] = useState("own");
  const [thirdPartyAccount, setThirdPartyAccount] = useState("");
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await api.get(`/accounts/user/${userId}`);
        setAccounts(response.data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, [userId]);

  const handleTransaction = async (e) => {
    e.preventDefault();
    try {
        const transactionData = {
            amount: parseFloat(amount),
            fromAccountId: accounts.find(
                (account) => account._id === selectedAccount
            )?.accountNumber,
            ...(transactionType === "transfer" &&
                transferType === "own" && {
                    toAccountId: accounts.find(
                        (account) => account._id === targetAccount
                    )?.accountNumber,
                }),
            ...(transactionType === "transfer" &&
                transferType === "third-party" && { toAccountId: thirdPartyAccount }),
        };

        let endpoint;
        if (transactionType === "deposit") {
            endpoint = "/transactions/deposit";
        } else if (transactionType === "withdraw") {
            endpoint = "/transactions/withdraw";
        } else {
            endpoint = "/transactions/transfer";
        }

        await api.post(endpoint, transactionData);
        toast.success("Transaction successful!");
        navigate("/transaction-success"); // Redirect to success screen or update UI
    } catch (error) {
        toast.error("Error performing transaction. Please try again.");
        console.error("Error performing transaction:", error);
    }
};
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Perform a Transaction
            </Typography>
            <form onSubmit={handleTransaction}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Select Account</InputLabel>
                <Select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  label="Select Account"
                >
                  <MenuItem value="">
                    <em>Select an account</em>
                  </MenuItem>
                  {accounts.map((account) => (
                    <MenuItem key={account._id} value={account._id}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        width="100%"
                      >
                        <span>
                          {account.accountType === "savings"
                            ? "Savings"
                            : "Checking"}{" "}
                          - {account.accountNumber}
                        </span>
                        <span style={{ color: "gray", fontWeight: "bold" }}>
                          ${account.balance.toLocaleString()}
                        </span>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Transaction Type</InputLabel>
                <Select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                  label="Transaction Type"
                >
                  <MenuItem value="deposit">Deposit</MenuItem>
                  <MenuItem value="withdraw">Withdraw</MenuItem>
                  <MenuItem value="transfer">Transfer</MenuItem>
                </Select>
              </FormControl>

              {transactionType === "transfer" && (
                <>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Transfer Type</InputLabel>
                    <Select
                      value={transferType}
                      onChange={(e) => setTransferType(e.target.value)}
                      label="Transfer Type"
                    >
                      <MenuItem value="own">To Own Account</MenuItem>
                      <MenuItem value="third-party">
                        To Third-Party Account
                      </MenuItem>
                    </Select>
                  </FormControl>

                  {transferType === "own" && (
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Target Account</InputLabel>
                      <Select
                        value={targetAccount}
                        onChange={(e) => setTargetAccount(e.target.value)}
                        label="Target Account"
                      >
                        <MenuItem value="">
                          <em>Select an account to transfer to</em>
                        </MenuItem>
                        {accounts
                          .filter((account) => account._id !== selectedAccount)
                          .map((account) => (
                            <MenuItem key={account._id} value={account._id}>
                              <Box
                                display="flex"
                                justifyContent="space-between"
                                width="100%"
                              >
                                <span>
                                  {account.accountType === "savings"
                                    ? "Savings"
                                    : "Checking"}{" "}
                                  - {account.accountNumber}
                                </span>
                                <span
                                  style={{ color: "gray", fontWeight: "bold" }}
                                >
                                  ${account.balance.toLocaleString()}
                                </span>
                              </Box>
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  )}

                  {transferType === "third-party" && (
                    <TextField
                      label="Third-Party Account Number"
                      fullWidth
                      margin="normal"
                      value={thirdPartyAccount}
                      onChange={(e) => setThirdPartyAccount(e.target.value)}
                    />
                  )}
                </>
              )}

              <TextField
                label="Amount"
                type="number"
                fullWidth
                margin="normal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Submit
              </Button>
            </form>
          </Paper>
        </Grid>
        {/* Recent Transactions or other elements */}
      </Grid>
    </Container>
  );
};

export default Transactions;
