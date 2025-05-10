import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Chip,
  Grid,
  IconButton,
  Stack,
} from "@mui/material";
import {
  Close as CloseIcon,
  Category as CategoryIcon,
  CalendarToday as CalendarTodayIcon,
  AccountBalance as AccountBalanceIcon,
  Notes as NotesIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccessTime as AccessTimeIcon,
  FilterAlt as FilterAltIcon,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Transactions = () => {
  // Automatically fetch the user's transactions after they log in, and to clear them if they log out
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchTransactions();
        await fetchAccounts();
      } else {
        setTransactions([]);
        setAccounts([]);
      }
    });

    return () => unsubscribe(); // cleanup listener
  }, []);

  const predefinedCategories = ["Groceries", "Transport", "Utilities", "Entertainment", "Health", "Savings"];

  const defaultTransaction = {
    category: "",
    date: new Date(),
    amount: "",
    type: "",
    toAccountId: "",
    fromAccountId: "",
    notes: "",
  };

  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [isEditMode, setIsEditMode] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [newTransaction, setNewTransaction] = useState(defaultTransaction);

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setViewDialogOpen(true);
  };

  const handleOpenEditTransaction = (transaction) => {
    setNewTransaction({
      ...transaction,
      date: new Date(transaction.date), // Convert string to Date object
    });
    setIsEditMode(true);
    setOpenModal(true);
  };

  const handleCloseTransactionForm = () => {
    setOpenModal(false);
    setIsEditMode(false);
    setNewTransaction(defaultTransaction);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "amount" && parseFloat(value) < 0) return;
    setNewTransaction((prev) => {
      if (name === "type") {
        return {
          ...prev,
          type: value,
          toAccountId: "",
          fromAccountId: "",
        };
      }
      return { ...prev, [name]: value };
    });
  };

  // ADD TRANSACTION
  const handleAddTransaction = async () => {
    const { type, category, date, amount, toAccountId, fromAccountId, notes } = newTransaction;

    if (!category || !date || !amount || !type || (!toAccountId && !fromAccountId)) {
      alert("Please fill out all fields");
      return;
    }

    if (amount <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    try {
      const user = getAuth().currentUser;
      const token = await user.getIdToken();

      // Clean the payload based on type
      const payload = {
        category,
        date,
        amount,
        type,
        toAccountId: type === "INCOME" ? toAccountId : null,
        fromAccountId: type === "EXPENSE" ? fromAccountId : null,
        notes,
      };

      await axios.post("http://localhost:8080/api/transactions", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNewTransaction(defaultTransaction);
      setOpenModal(false);
      fetchTransactions();
      console.log("Transaction record successfully updated");
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("Error updating transaction");
    }
  };

  const isTransactionEqual = (t1, t2) => {
    const keysToCompare = ["category", "date", "amount", "type", "toAccountId", "fromAccountId", "notes"];

    return keysToCompare.every((key) => {
      const val1 = key === "date" ? new Date(t1[key]).toISOString() : t1[key];
      const val2 = key === "date" ? new Date(t2[key]).toISOString() : t2[key];
      return val1 === val2;
    });
  };

  // UPDATE TRANSACTION
  const handleUpdateTransaction = async () => {
    if (isTransactionEqual(newTransaction, selectedTransaction)) {
      console.log("No changes detected.");
      handleCloseTransactionForm();
      return;
    }

    const { transactionId, type, category, date, amount, toAccountId, fromAccountId, notes } = newTransaction;

    if (!category || !date || !amount || !type || (!toAccountId && !fromAccountId)) {
      alert("Please fill out all fields");
      return;
    }

    if (amount <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    try {
      const user = getAuth().currentUser;
      const token = await user.getIdToken();

      // Clean the payload based on type
      const payload = {
        transactionId,
        category,
        date,
        amount,
        type,
        toAccountId: type === "INCOME" ? toAccountId : null,
        fromAccountId: type === "EXPENSE" ? fromAccountId : null,
        notes,
      };

      await axios.put(`http://localhost:8080/api/transactions`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      handleCloseTransactionForm();
      fetchTransactions();
      console.log("Transaction record successfully updated");
    } catch (error) {
      console.error("Error updating transaction:", error);
      alert("Error updating transaction");
    }
  };

  // DELETE TRANSACTION
  const handleDeleteTransaction = async () => {
    if (!selectedTransaction) {
      alert("No transaction selected.");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this transaction?");
    if (!confirmDelete) return;

    try {
      const user = getAuth().currentUser;
      const token = await user.getIdToken();

      await axios.delete(`http://localhost:8080/api/transactions/${selectedTransaction.transactionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      handleCloseTransactionForm();
      fetchTransactions();
      console.log("Transaction successfully deleted");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert("Error deleting transaction");
    }
  };

  // GET TRANSACTIONS
  const fetchTransactions = async () => {
    setLoading(true);
    const user = getAuth().currentUser;
    if (user) {
      try {
        const token = await user.getIdToken();
        const response = await axios.get("http://localhost:8080/api/transactions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setTransactions([]);
    }
  };

  // FETCH ACCOUNTS
  const fetchAccounts = async () => {
    const user = getAuth().currentUser;
    if (user) {
      try {
        const token = await user.getIdToken();
        const response = await axios.get("http://localhost:8080/api/accounts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAccounts(response.data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="main" sx={{ bgcolor: "background.default", p: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="#2f4f4f">
          Transactions
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            mt: 4,
          }}
        >
          <Box display="flex" alignItems="center">
            <FilterAltIcon sx={{ color: "#2f4f4f", mr: 1 }} />
            <Typography variant="subtitle1" sx={{ color: "#2f4f4f" }}>
              Advance Filter
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() => {
              setOpenModal(true);
            }}
            sx={{
              backgroundColor: "#2f4f4f",
              textTransform: "none",
              borderRadius: "12px",
              "&:hover": { backgroundColor: "#1e3a3a" },
            }}
          >
            Add Transaction
          </Button>
        </Box>

        <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2, maxHeight: "100vh", overflow: "auto", mt: 2 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold", color: "#2f4f4f" }}>Category</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#2f4f4f" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#2f4f4f" }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#2f4f4f" }}>Type</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#2f4f4f" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions
                .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date in descending order
                .map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{new Date(row.date).toLocaleDateString("en-CA")}</TableCell>
                    {/* <TableCell>${parseFloat(row.amount).toFixed(2)}</TableCell> */}
                    <TableCell>
                      {/* Math Abs is unnecessary if amount is changed to always be a positive number */}
                      {row.type === "EXPENSE"
                        ? `- $${Math.abs(parseFloat(row.amount)).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`
                        : `$${parseFloat(row.amount).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`}
                    </TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        color="#37513D"
                        sx={{
                          color: "#37513D",
                          "&:hover": { backgroundColor: "#1e3a3a", color: "#ffffff" },
                          textTransform: "none",
                        }}
                        onClick={() => handleViewDetails(row)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ======================================= MODAAAAAAAAAAAAAALLLLSSSS ============================================ */}

        {/* ADD TRANSACTION MODAL */}
        <Dialog open={openModal} onClose={() => handleCloseTransactionForm()} maxWidth="sm" fullWidth disableEnforceFocus disableAutoFocus>
          <DialogTitle>{isEditMode ? "Edit Transaction" : "Add New Transaction"}</DialogTitle>
          <DialogContent dividers>
            <FormControl fullWidth margin="normal">
              <InputLabel id="type-label">Type</InputLabel>
              <Select labelId="type-label" name="type" value={newTransaction.type} onChange={handleInputChange} label="Type">
                <MenuItem value="INCOME">Income</MenuItem>
                <MenuItem value="EXPENSE">Expense</MenuItem>
              </Select>
            </FormControl>
            {/* <TextField
            fullWidth
            margin="normal"
            label="Category"
            name="category"
            value={newTransaction.category}
            onChange={handleInputChange}
          /> */}
            <FormControl fullWidth margin="normal">
              <InputLabel id="category-label">Category</InputLabel>
              <Select labelId="category-label" name="category" value={newTransaction.category} onChange={handleInputChange} label="Category">
                {predefinedCategories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <DateTimePicker
              label="Date"
              value={newTransaction.date}
              onChange={(value) => handleInputChange({ target: { name: "date", value } })}
              slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
            />
            <TextField fullWidth margin="normal" label="Amount" name="amount" type="number" value={newTransaction.amount} onChange={handleInputChange} inputProps={{ min: 0 }} />
            <FormControl fullWidth margin="normal">
              <InputLabel id="account-label">Account</InputLabel>
              <Select
                labelId="account-label"
                name={newTransaction.type === "INCOME" ? "toAccountId" : "fromAccountId"}
                value={newTransaction.type === "INCOME" ? newTransaction.toAccountId : newTransaction.fromAccountId || ""}
                onChange={handleInputChange}
                label="Account"
              >
                {accounts.map((acc) => (
                  <MenuItem key={acc.id} value={acc.id}>
                    {acc.account}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              margin="normal"
              label="Notes (Optional)"
              name="notes"
              multiline
              rows={3}
              value={newTransaction.notes || ""}
              onChange={handleInputChange}
              inputProps={{ maxLength: 255 }}
              helperText={`${(newTransaction.notes || "").length}/255`}
              FormHelperTextProps={{ sx: { textAlign: "right", m: 0 } }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleCloseTransactionForm()}>Cancel</Button>
            <Button variant="contained" onClick={isEditMode ? handleUpdateTransaction : handleAddTransaction}>
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* VIEW TRANSACTION MODAL */}
        <Dialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            },
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #eaeaea",
              pb: 2,
            }}
          >
            <Typography variant="h6" component="div" fontWeight="bold">
              Transaction Details
            </Typography>
          </DialogTitle>

          <DialogContent sx={{ py: 0 }}>
            {selectedTransaction && (
              <>
                <Box
                  sx={{
                    my: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Chip
                    variant="outlined"
                    label={selectedTransaction.type}
                    color={selectedTransaction.type === "EXPENSE" ? "error" : "success"}
                    sx={{ fontWeight: "bold", fontSize: "0.9rem", px: 1 }}
                  />
                  <Typography variant="h5" color={selectedTransaction.type === "EXPENSE" ? "error.main" : "success.main"} fontWeight="bold">
                    {selectedTransaction.type === "EXPENSE"
                      ? `- $${parseFloat(selectedTransaction.amount).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      : `$${parseFloat(selectedTransaction.amount).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`}
                  </Typography>
                </Box>

                <Paper elevation={0} sx={{ bgcolor: "grey.50", p: 2, borderRadius: 2, mb: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      {/* Account */}
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <AccountBalanceIcon sx={{ color: "#37513D", mr: 1.5 }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Account
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {selectedTransaction.type === "INCOME"
                              ? selectedTransaction.toAccount?.account ||
                                accounts.find((acc) => acc.id === selectedTransaction.toAccountId)?.account ||
                                selectedTransaction.toAccountId
                              : selectedTransaction.fromAccount?.account ||
                                accounts.find((acc) => acc.id === selectedTransaction.fromAccountId)?.account ||
                                selectedTransaction.fromAccountId}
                          </Typography>
                        </Box>
                      </Box>
                      {/* Category */}
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <CategoryIcon sx={{ color: "#37513D", mr: 1.5 }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Category
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {selectedTransaction.category}
                          </Typography>
                        </Box>
                      </Box>
                      {/* Date */}
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <CalendarTodayIcon sx={{ color: "#37513D", mr: 1.5 }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Date
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {new Date(selectedTransaction.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                      {/* Time */}
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <AccessTimeIcon sx={{ color: "#37513D", mr: 1.5 }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Time
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {new Date(selectedTransaction.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    {/* Notes */}
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ height: "100%" }}>
                        <Box sx={{ display: "flex", alignItems: "flex-start", height: "100%" }}>
                          <NotesIcon sx={{ color: "#37513D", mr: 1.5, mt: 0.5 }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Notes
                            </Typography>
                            <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                              {selectedTransaction.notes ? selectedTransaction.notes : "None"}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                    {/*  */}
                  </Grid>
                </Paper>
              </>
            )}
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3, justifyContent: "space-between" }}>
            <Stack direction="row" spacing={1}>
              <Button
                startIcon={<EditIcon />}
                variant="contained"
                sx={{
                  backgroundColor: "#37513D",
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#1e3a3a" },
                }}
                onClick={() => {
                  setViewDialogOpen(false);
                  handleOpenEditTransaction(selectedTransaction);
                }}
              >
                Edit
              </Button>
              <Button
                startIcon={<DeleteIcon />}
                variant="contained"
                color="error"
                sx={{
                  textTransform: "none",
                }}
                onClick={() => {
                  setViewDialogOpen(false);
                  handleDeleteTransaction();
                }}
              >
                Delete
              </Button>
            </Stack>
            <Button onClick={() => setViewDialogOpen(false)} sx={{ color: "#37513D" }}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};
export default Transactions;
