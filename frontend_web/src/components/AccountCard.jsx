import React, { useState } from 'react';
import { Box, Card, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EditIcon from '@mui/icons-material/Edit';

const AccountCard = ({ name, balance, isNegative, onEdit, onDelete }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);
    
    return (
        <Card sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={1}>
                    <AccountBalanceWalletIcon fontSize="small" color="#2f4f4f" />
                    <Typography variant="subtitle1" fontWeight="bold">{name}</Typography>
                </Box>
                <IconButton onClick={handleMenuClick} size="small"><EditIcon fontSize="small" /></IconButton>
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                    <MenuItem onClick={() => { onEdit(); handleClose(); }}>Edit</MenuItem>
                    <MenuItem onClick={() => { onDelete(); handleClose(); }}>Delete</MenuItem>
                </Menu>
            </Box>

            <Typography variant="h5" fontWeight="bold" color={isNegative ? 'error' : 'textPrimary'} sx={{ mt: 1 }} >
                {isNegative ? '-$' : '$'}{Math.abs(balance).toLocaleString()}
            </Typography>

            {/* <Typography variant="body2" color="primary" sx={{ mt: 1, cursor: 'pointer' }} >
                View transactions
            </Typography> */}
        </Card>
    );
};

export default AccountCard;