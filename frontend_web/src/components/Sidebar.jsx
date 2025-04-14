import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Box, Avatar, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Dashboard, AccountBalanceWallet, AttachMoney, Notifications, Settings, Logout, ListAlt } from '@mui/icons-material';

const drawerWidth = 240;

const Sidebar = () => {
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
            <Typography fontWeight={600}>John Doe</Typography>
            <Typography variant="body2" color="text.secondary">
                johndoe@example.com
            </Typography>
            </Box>

            <Box sx={{ px: 3 }}>
            <List>
                {menuItems.map((item) => (
                <ListItem button key={item.text} component={Link} to={item.path}>
                    <ListItemIcon sx={{ color: '#2f4f4f' }}>{item.icon}</ListItemIcon>
                    <ListItemText sx={{ color: '#2f4f4f' }} primary={item.text} />
                </ListItem>
                ))}
            </List>
            </Box>
        </Box>
        <Box sx={{ p: 2 }}>
            <Button fullWidth variant="outlined" startIcon={<Logout />}>
                Logout
            </Button>
        </Box>
    </Drawer>
  );
};

export default Sidebar;
