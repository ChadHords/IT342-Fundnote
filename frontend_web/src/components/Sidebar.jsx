import React, { useEffect, useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Box, Avatar, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Dashboard, AccountBalanceWallet, AttachMoney, Notifications, Settings, Logout, ListAlt } from '@mui/icons-material';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import profileGif from '../assets/profile.gif';

const drawerWidth = 260;

const Sidebar = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [userAuthInfo, setUserAuthInfo] = useState(null);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap && docSnap.exists()) {
          setUserProfile(docSnap.data());
          console.log("User Profile from Firestore:", docSnap.data());
        } else {
          console.log("No user profile found in Firestore or docSnap is null.");
          setUserProfile({ name: auth.currentUser?.displayName || '', email: auth.currentUser?.email || '' });
        }
        setUserAuthInfo(auth.currentUser);
      } else {
        setUserProfile(null);
        setUserAuthInfo(null);
      }
    };

    fetchUserProfile();

    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser && !userProfile?.name) {
        fetchUserProfile();
      } else if (authUser) {
        setUserAuthInfo(authUser);
      } else {
        setUserProfile(null);
        setUserAuthInfo(null);
      }
    });

    return () => unsubscribe();
  }, [auth, db, userProfile?.name]);

  const menuItems = [
    { text: 'Overview', icon: <Dashboard />, path: '/overview' },
    { text: 'Transactions', icon: <ListAlt />, path: '/transactions' },
    { text: 'Budgets', icon: <AttachMoney />, path: '/budgets' },
    { text: 'Accounts', icon: <AccountBalanceWallet />, path: '/accounts' },
    { text: 'Notifications', icon: <Notifications />, path: '/notifications' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
  ];

  return (
    <Drawer variant="permanent" anchor="left" sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', }, }}>
      <Box>
        <Typography variant="h5" sx={{ p: 2, color: '#2f4f4f' }}>
          FundNote
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
          <Avatar src={profileGif} sx={{ width: 80, height: 80, mb: 1 }} />
          {/* <Typography fontWeight={600}>
            {userProfile?.name || userAuthInfo?.displayName || 'No User'}
          </Typography> */}
          <Typography variant="body2" color="text.secondary">
            {userAuthInfo?.email || 'No Email'}
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
          sx={{
            color: '#37513D',
            borderColor: '#37513D',
            borderRadius: '10px',
            textTransform: 'none',
            '&:hover': { backgroundColor: '#37513D', color: '#ffffff' },
          }}
          fullWidth
          variant="outlined"
          startIcon={<Logout />}
          onClick={() => {
            signOut(auth)
              .then(() => {
                console.log('User signed out');
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