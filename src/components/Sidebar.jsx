import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Divider, Button, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LogoutIcon from '@mui/icons-material/Logout';

const Sidebar = () => {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';

    // No mostrar el Sidebar en la página de login
    if (isLoginPage) return null;

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login'; // Redirigir al login
    };

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 240,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
            }}
        >
            <Toolbar />
            <Divider />
            <List>
                <ListItem button component={Link} to="/">
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem button component={Link} to="/profile">
                    <ListItemIcon>
                        <AccountCircleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                </ListItem>
                <ListItem button component={Link} to="/accounts">
                    <ListItemIcon>
                        <AccountBalanceIcon />
                    </ListItemIcon>
                    <ListItemText primary="Accounts" />
                </ListItem>
                <ListItem button component={Link} to="/transactions">
                    <ListItemIcon>
                        <ListAltIcon />
                    </ListItemIcon>
                    <ListItemText primary="Transfer" />
                </ListItem>
            </List>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ p: 2 }}>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<LogoutIcon />}
                    fullWidth
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
