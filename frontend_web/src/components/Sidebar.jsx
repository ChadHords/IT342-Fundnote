import React, { useEffect, useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Box, Avatar, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Dashboard, AccountBalanceWallet, AttachMoney, Notifications, Settings, Logout, ListAlt } from '@mui/icons-material';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

const drawerWidth = 240;

const Sidebar = () => {
    const auth = getAuth();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        });
        return () => unsubscribe(); // clean up on unmount
    }, [auth]);

    const menuItems = [
        { text: 'Overview', icon: <Dashboard />, path: '/overview' },
        { text: 'Transactions', icon: <ListAlt />, path: '/transactions' },
        { text: 'Budgets', icon: <AttachMoney />, path: '/budgets' },
        { text: 'Accounts', icon: <AccountBalanceWallet />, path: '/accounts' },
        { text: 'Notifications', icon: <Notifications />, path: '/notifications' },  
        { text: 'Settings', icon: <Settings />, path: '/settings' },
    ];

    return (
        <Drawer variant="permanent" anchor="left" sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' } }} >
            <Box>
                <Typography variant="h5" sx={{ p: 2, color: '#2f4f4f' }}>
                    FundNote
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
                <Avatar sx={{ width: 64, height: 64, mb: 1 }} />
                <Typography fontWeight={600}>
                    {user?.displayName || 'No User'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {user?.email || 'No Email'}
                </Typography>
                </Box>

                <Box sx={{ px: 3 }}>
                <List>
                    {menuItems.map((item) => (
                    <ListItem button key={item.text} component={Link} to={item.path}>
                        <ListItemIcon sx={{ color: '#37513D' }}>{item.icon}</ListItemIcon>
                        <ListItemText sx={{ color: '#37513D' }} primary={item.text} />
                    </ListItem>
                    ))}
                </List>
                </Box>
            </Box>
            <Box sx={{ p: 2 }}>
                <Button
                sx={{ color: '#37513D', borderColor: '#37513D', borderRadius: '10px', textTransform: 'none', '&:hover': { backgroundColor: '#37513D', color: '#ffffff' } }}
                fullWidth
                variant="outlined"
                startIcon={<Logout />}
                onClick={() => {
                    const auth = getAuth();
                    signOut(auth)
                    .then(() => {
                        console.log('User signed out');
                        // Optional: redirect to login page
                        window.location.href = '/login';
                    })
                    .catch((error) => {
                        console.error('Sign out error:', error);
                    });
                }}
                >
                Logout
                </Button>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
