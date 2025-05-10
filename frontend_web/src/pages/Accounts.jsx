import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Divider, Grid, Dialog, DialogTitle, DialogContent, TextField, DialogActions, CircularProgress } from '@mui/material';
import StatCard from '../components/StatCard';
import AccountCard from '../components/AccountCard';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from 'axios';

const Accounts = () => {
  const predefinedAccounts = ['Cash', 'Wallet', 'Debit Card', 'Credit Card'];

  const [openModal, setOpenModal] = useState(false);
  const [accountName, setAccountName] = useState('');
  const [accountInitialAmount, setAccountInitialAmount] = useState('');
  const [accounts, setAccounts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editAccountName, setEditAccountName] = useState('');
  const [editInitialAmount, setEditInitialAmount] = useState('');

  const [editingId, setEditingId] = useState(null);

  // POST ACCOUNTS
  const handleSave = async () => {
    const user = getAuth().currentUser;
    if (accounts && user) {
      try {
        const token = await user.getIdToken();
        await axios.post('http://localhost:8080/api/accounts', {
          account: accountName,
          // amount: parseFloat(accountAmount),
          initialAmount: parseFloat(accountInitialAmount),
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        await fetchAccounts();
        setOpenModal(false);
        setAccountInitialAmount("");
        setAccountName("");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message || error.response?.data || 'An unexpected error occurred';
          console.error('Error adding account:', message);
          alert(message); // Or showToast(message) / setErrorMessage(message)
        } else {
          console.error('Unknown error:', error);
          alert('Something went wrong');
        }
      }
    }
  };

  useEffect(() => {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          await fetchAccounts();
        } else {
          setAccounts([]);
        }
      });
  
      return () => unsubscribe(); // cleanup listener
    }, []);

  // GET ACCOUNTS
  const fetchAccounts = async () => {
    setLoading(true);
    const user = getAuth().currentUser;
    if (user) {
      try {
        const token = await user.getIdToken();
        const response = await axios.get('http://localhost:8080/api/accounts', { 
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setAccounts(response.data);
      } catch (error) {
        console.error('Error fetching account:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setAccounts([]);
    }
  };

  const handleEditClick = (account) => {
    setEditingId(account.id);
    setEditAccountName(account.account);
    setEditInitialAmount(account.initialAmount);
    setEditModalOpen(true);
  };

  // UPDATE ACCOUNTS
  const handleUpdate = async () => {
    const user = getAuth().currentUser;
    if (!editingId || !editInitialAmount || !user) return;
    try {
      const token = await user.getIdToken();
      await axios.put(`http://localhost:8080/api/accounts/${editingId}`, {
        account: editAccountName,
        initialAmount: parseFloat(editInitialAmount),
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      await fetchAccounts();
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating account:', error);
    }
  };

  // DELETE ACCOUNTS
  const handleDelete = async (accountId) => {
  const user = getAuth().currentUser;
  if (!accountId || !user) return;

  // Show a confirmation dialog
  const confirmDelete = window.confirm('Are you sure you want to delete this account? This will also delete all transactions related to this account.');

  if (confirmDelete) {
    try {
      const token = await user.getIdToken();
      const response = await axios.delete(`http://localhost:8080/api/accounts/${accountId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log(response.data);
      await fetchAccounts();
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('There was an error deleting the account. Please try again.');
    }
  } else {
    console.log('Account deletion cancelled');
  }
};


  // CALCULATING TOTAL ASSETS, LIABILITIES, AND NET WORTH
  const totalAssets = accounts.reduce((acc, curr) => {
    return (curr.initialAmount + curr.amount) > 0 ? acc + (curr.initialAmount + curr.amount) : acc;
  }, 0);

  const totalLiabilities = accounts.reduce((acc, curr) => {
    return (curr.initialAmount + curr.amount) < 0 ? acc + (curr.initialAmount + curr.amount) : acc;
  }, 0);

  const netWorth = totalAssets + totalLiabilities;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box mb={2}>
        <Typography variant="h4" fontWeight="bold" color="#2f4f4f">
          Accounts
        </Typography>
      </Box>
      <Box display="flex" justifyContent="flex-end" mb={2} mt={4}>
        <Button variant="contained" onClick={() => setOpenModal(true)} sx={{ backgroundColor: "#37513D", textTransform: "none", borderRadius: "8px", "&:hover": { backgroundColor: "#1e3a3a" }, }} >
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
          <StatCard title="Total Liabilities" amount={totalLiabilities} subtitle="Sum of all negative balances" isNegative={totalLiabilities} />
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Grid container spacing={2}>
        {accounts.map((account) => {
          const balance = account.initialAmount + account.amount;
          return (
          <Grid item size={{ xs: 12, sm: 4 }} key={account.id}>
            <AccountCard name={account.account} balance={balance} isNegative={balance < 0} onEdit={() => handleEditClick(account)} onDelete={() => handleDelete(account.id)} />
          </Grid>
        )})}
      </Grid>

      {/* ======================================= MODAAAAAAAAAAAAAALLLLSSSS ============================================ */}

      {/* MODAL OF ADDING NEW ACCOUNTS */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth >
        <DialogTitle>Add Account</DialogTitle>
        <DialogContent dividers>
          <TextField fullWidth margin="normal" label="Account Name" name="accountName" type="text" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
          <TextField fullWidth margin="normal" label="Initial Amount" name="amount" type="number" value={accountInitialAmount} onChange={(e) => setAccountInitialAmount(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: "#37513D" }} onClick={() => setOpenModal(false)}> Cancel </Button>
          <Button sx={{ backgroundColor: "#37513D" }} variant="contained" onClick={handleSave}> Save </Button>
        </DialogActions>
      </Dialog>

      {/* MODAL FOR EDIT ACCOUNT */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="xs" fullWidth >
        <DialogTitle fontWeight="bold" color="#37513D">
          Edit Account
        </DialogTitle>
        <DialogContent dividers>
          <TextField fullWidth margin="normal" label="Account Name" type="text" value={editAccountName} onChange={(e) => setEditAccountName(e.target.value)} />
          <TextField fullWidth margin="normal" label="Initial Amount" type="number" value={editInitialAmount.toString()} onChange={(e) => setEditInitialAmount(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: "#37513D" }} onClick={() => setEditModalOpen(false)} >
            Cancel
          </Button>
          <Button variant="contained" sx={{ backgroundColor: "#37513D" }} onClick={handleUpdate} >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Accounts;