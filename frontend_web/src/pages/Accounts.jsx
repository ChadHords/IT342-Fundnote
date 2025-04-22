import React from 'react';
import { Box, Typography, Button, Card, CardContent, IconButton, Divider, Grid } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const StatCard = ({ title, amount, subtitle }) => (
  <Card sx={{ p: 2 }}>
    <Typography variant="subtitle2" color="textSecondary">{title}</Typography>
    <Typography variant="h5" fontWeight="bold">
      ${amount.toLocaleString()}
    </Typography>
    <Typography variant="body2" color="textSecondary">{subtitle}</Typography>
  </Card>
);

const AccountCard = ({ name, balance, isNegative }) => (
  <Card sx={{ p: 2 }}>
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box display="flex" alignItems="center" gap={1}>
        <AccountBalanceWalletIcon fontSize="small" color="#2f4f4f" />
        <Typography variant="subtitle1" fontWeight="bold">{name}</Typography>
      </Box>
      <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
    </Box>

    <Typography variant="h6" fontWeight="bold" color={isNegative ? 'error' : 'textPrimary'} sx={{ mt: 1 }} >
      {isNegative ? '-$' : '$'}{Math.abs(balance).toLocaleString()}
    </Typography>

    <Typography variant="body2" color="primary" sx={{ mt: 1, cursor: 'pointer' }} >
      View transactions
    </Typography>
  </Card>
);

const Accounts = () => {
  // TEMPORARY DATA FOR ACCOUNTS
  const netWorth = 150340;
  const totalAssets = 150835;
  const totalLiabilities = 495;

  const accounts = [
    { name: 'Wallet', balance: 90204 },
    { name: 'Debit Card', balance: 60136 },
    { name: 'Credit Card', balance: -495 },
  ];

  return (
    <Box p={3}>
      <Box mb={2}>
        <Typography variant="h4" fontWeight="bold" color="#2f4f4f">Accounts</Typography>
      </Box>

      <Box display="flex" justifyContent="flex-end" mb={2} mt={4}>
        <Button variant="contained" sx={{ backgroundColor: '#2f4f4f', borderRadius: '12px', textTransform: 'none', '&:hover': { backgroundColor: '#244040', }, }} >
          Add Account
        </Button>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard title="Net Worth" amount={netWorth} subtitle="Total assets minus liabilities" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard title="Total Assets" amount={totalAssets} subtitle="Sum of all positive balances" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard title="Total Liabilities" amount={totalLiabilities} subtitle="Sum of all negative balances" />
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Grid container spacing={2}>
        {accounts.map((account, index) => (
          <Grid size={{ xs: 12, sm: 4 }} key={index}>
            <AccountCard {...account} isNegative={account.balance < 0} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Accounts;
