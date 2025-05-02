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
  const [accountAmount, setAccountAmount] = useState('');
  const [accounts, setAccounts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editAccountName, setEditAccountName] = useState('');
  const [editAmount, setEditAmount] = useState('');

  const [editingId, setEditingId] = useState(null);

  // POST ACCOUNTS
  const handleSave = async () => {
    const user = getAuth().currentUser;
    if (accounts && user) {
      try {
        const token = await user.getIdToken();
        await axios.post('http://localhost:8080/api/accounts', {
          account: accountName,
          amount: parseFloat(accountAmount),
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        await fetchAccounts();
        setOpenModal(false);
        setAccountAmount("");
        setAccountName("");
      } catch (error) {
        console.error('Error adding account:', error);
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
    setEditAmount(account.amount);
    setEditModalOpen(true);
  };

  // UPDATE BUDGETS
  const handleUpdate = async () => {
    const user = getAuth().currentUser;
    if (!editingId || !editAmount || !user) return;
    try {
      const token = await user.getIdToken();
      await axios.put(`http://localhost:8080/api/accounts/${editingId}`, {
        account: editAccountName,
        amount: parseFloat(editAmount),
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

  // DELETE BUDGETS
  const handleDelete = async (accountId) => {
    const user = getAuth().currentUser;
    if (!accountId || !user) return;
    try {
      const token = await user.getIdToken();
      await axios.delete(`http://localhost:8080/api/accounts/${accountId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      await fetchAccounts();
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  // CALCULATING TOTAL ASSETS, LIABILITIES, AND NET WORTH
  const totalAssets = accounts.reduce((acc, curr) => {
    return curr.amount > 0 ? acc + curr.amount : acc;
  }, 0);

  const totalLiabilities = accounts.reduce((acc, curr) => {
    return curr.amount < 0 ? acc + curr.amount : acc;
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
        {accounts.map((account) => (
          <Grid item size={{ xs: 12, sm: 4 }} key={account.id}>
            <AccountCard name={account.account} balance={account.amount} isNegative={account.amount < 0} onEdit={() => handleEditClick(account)} onDelete={() => handleDelete(account.id)} />
          </Grid>
        ))}
      </Grid>

      {/* ======================================= MODAAAAAAAAAAAAAALLLLSSSS ============================================ */}

      {/* MODAL OF ADDING NEW ACCOUNTS */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth >
        <DialogTitle>Add Account</DialogTitle>
        <DialogContent dividers>
          <TextField fullWidth margin="normal" label="Account Name" name="accountName" type="text" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
          <TextField fullWidth margin="normal" label="Amount" name="amount" type="number" value={accountAmount} onChange={(e) => setAccountAmount(e.target.value)} />
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
          <TextField fullWidth margin="normal" label="New Account Name" type="text" value={editAccountName} onChange={(e) => setEditAccountName(e.target.value)} />
          <TextField fullWidth margin="normal" label="New Amount" type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} />
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