import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AccountManagement from "./pages/AccountManagement";
import Transactions from "./pages/Transactions";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import { CssBaseline, Box } from "@mui/material";
import AccountDetail from "./pages/AccountDetail";
import SuccessScreen from "./pages/SuccessScreen";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Sidebar />
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/accounts/:accountId"
              element={
                <PrivateRoute>
                  <AccountDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/accounts"
              element={
                <PrivateRoute>
                  <AccountManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <PrivateRoute>
                  <Transactions />
                </PrivateRoute>
              }
            />
            <Route
              path="/transaction-success"
              element={
                <PrivateRoute>
                  <SuccessScreen />
                </PrivateRoute>
              }
            /> 
          </Routes>
          <ToastContainer />
        </Box>
      </Box>
    </Router>
  );
}

export default App;
