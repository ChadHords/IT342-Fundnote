import React, { useState } from 'react';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const Transactions = () => {
  // TEMPORARY DATA FOR TRANSACTIONS
    const [rows, setRows] = useState([
      { category: 'Groceries', date: '2025-04-10', amount: 45.99, type: 'Expense' },
      { category: 'Salary', date: '2025-04-01', amount: 1500.00, type: 'Income' },
      { category: 'Transport', date: '2025-04-08', amount: 15.00, type: 'Expense' },
    ]);
  
    const [openModal, setOpenModal] = useState(false);
    const [newTransaction, setNewTransaction] = useState({
      category: '',
      date: '',
      amount: '',
      type: '',
    });
  
    const handleInputChange = (e) => {
      setNewTransaction({ ...newTransaction, [e.target.name]: e.target.value });
    };
  
    const handleAddTransaction = () => {
      if (
        newTransaction.category &&
        newTransaction.date &&
        newTransaction.amount &&
        newTransaction.type
      ) {
        setRows([...rows, newTransaction]);
        setNewTransaction({ category: '', date: '', amount: '', type: '' });
        setOpenModal(false);
      }
    };
  
    return (
      <Box component="main" sx={{ bgcolor: 'background.default', p: 3 }} >
        <Typography variant="h4" fontWeight="bold" color="#2f4f4f">Transactions</Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mt: 4, }} >
          <Box display="flex" alignItems="center">
            <FilterAltIcon sx={{ color: '#2f4f4f', mr: 1 }} />
            <Typography variant="subtitle1" sx={{ color: '#2f4f4f' }}>
              Advance Filter
            </Typography>
          </Box>

          <Button variant="contained" onClick={() => setOpenModal(true)} sx={{ backgroundColor: '#2f4f4f', textTransform: 'none', borderRadius: '12px', '&:hover': { backgroundColor: '#1e3a3a', }, }} > Add Transaction </Button>
        </Box>

        <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2, maxHeight: '100vh', overflow: 'auto', mt: 2, }} >
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold', color: '#2f4f4f' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2f4f4f' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2f4f4f' }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2f4f4f' }}>Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>${parseFloat(row.amount).toFixed(2)}</TableCell>
                  <TableCell>{row.type}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ADD TRANSACTION MODAL NOT FINISHED YET AND NO CRUD */}
        <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add New Transaction</DialogTitle>
          <DialogContent dividers>
            <TextField
              fullWidth
              margin="normal"
              label="Category"
              name="category"
              value={newTransaction.category}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Date"
              name="date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={newTransaction.date}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Amount"
              name="amount"
              type="number"
              value={newTransaction.amount}
              onChange={handleInputChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="type-label">Type</InputLabel>
              <Select
                labelId="type-label"
                name="type"
                value={newTransaction.type}
                onChange={handleInputChange}
                label="Type"
              >
                <MenuItem value="Income">Income</MenuItem>
                <MenuItem value="Expense">Expense</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleAddTransaction}>Save</Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }
  
  export default Transactions;