import React, { useState } from "react";
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
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useEffect } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Transactions = () => {
  const [loading, setLoading] = useState(false);

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

  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    category: "",
    date: "",
    amount: "",
    type: "",
    toAccountId: "",
    fromAccountId: "",
  });

  // const handleInputChange = (e) => {
  //   setNewTransaction({ ...newTransaction, [e.target.name]: e.target.value });
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
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

  // const handleAddTransaction = async () => {
  //   if (
  //     newTransaction.category &&
  //     newTransaction.date &&
  //     newTransaction.amount &&
  //     newTransaction.type &&
  //     newTransaction.toAccountId
  //   ) {
  //     try {
  //       const user = getAuth().currentUser;
  //       const token = await user.getIdToken();
  //       await axios.post("http://localhost:8080/api/transactions", newTransaction, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       setNewTransaction({ category: "", date: "", amount: "", type: "" });
  //       setOpenModal(false);
  //       fetchTransactions(); // refresh list after adding
  //       console.log("Add Transaction Successful");
  //     } catch (error) {
  //       console.error("Error adding transaction:", error);
  //       alert("Error adding transaction");
  //     }
  //   } else {
  //     alert("Please fill out all fields");
  //   }
  // };

  const handleAddTransaction = async () => {
    const { type, category, date, amount, toAccountId, fromAccountId } = newTransaction;

    if (!category || !date || !amount || !type || (!toAccountId && !fromAccountId)) {
      alert("Please fill out all fields");
      return;
    }

    // if (type == "INCOME" && amount <= 0) {
    //   alert("Amount must be greater than 0 for 'Income' Transactions");
    //   return;
    // }
    // if (type == "EXPENSE" && amount >= 0) {
    //   alert("Amount must be less than 0 for 'Expense' transactions");
    //   return;
    // }

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
      };

      await axios.post("https://it342-fundnote.onrender.com/api/transactions", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNewTransaction({
        category: "",
        date: "",
        amount: "",
        type: "",
        toAccountId: "",
        fromAccountId: "",
      });
      setOpenModal(false);
      fetchTransactions();
      console.log("Transaction record successfully added");
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("Error adding transaction");
    }
  };

  // GET TRANSACTIONS
  const fetchTransactions = async () => {
    setLoading(true);
    const user = getAuth().currentUser;
    if (user) {
      try {
        const token = await user.getIdToken();
        const response = await axios.get("https://it342-fundnote.onrender.com/api/transactions", {
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
        const response = await axios.get("https://it342-fundnote.onrender.com/api/accounts", {
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
          {" "}
          Add Transaction{" "}
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        elevation={1}
        sx={{ borderRadius: 2, maxHeight: "100vh", overflow: "auto", mt: 2 }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold", color: "#2f4f4f" }}>Category</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#2f4f4f" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#2f4f4f" }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#2f4f4f" }}>Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>{row.category}</TableCell>
                <TableCell>{new Date(row.date).toLocaleDateString("en-CA")}</TableCell>
                {/* <TableCell>${parseFloat(row.amount).toFixed(2)}</TableCell> */}
                <TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ADD TRANSACTION MODAL NOT FINISHED YET AND NO CRUD */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
        fullWidth
        disableEnforceFocus // ✅ Try adding this
        disableAutoFocus
      >
        <DialogTitle>Add New Transaction</DialogTitle>
        <DialogContent dividers>
          <FormControl fullWidth margin="normal">
            <InputLabel id="type-label">Type</InputLabel>
            <Select
              labelId="type-label"
              name="type"
              value={newTransaction.type}
              onChange={handleInputChange}
              label="Type"
            >
              <MenuItem value="INCOME">Income</MenuItem>
              <MenuItem value="EXPENSE">Expense</MenuItem>
            </Select>
          </FormControl>
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
            <InputLabel id="account-label">
              {newTransaction.type === "INCOME" ? "To Account" : "From Account"}
            </InputLabel>
            <Select
              labelId="account-label"
              name={newTransaction.type === "INCOME" ? "toAccountId" : "fromAccountId"}
              value={
                newTransaction.type === "INCOME"
                  ? newTransaction.toAccountId
                  : newTransaction.fromAccountId || ""
              }
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddTransaction}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default Transactions;
