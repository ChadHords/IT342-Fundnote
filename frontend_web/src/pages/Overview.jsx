import React, { useEffect, useState } from "react";
import { Grid, Paper, Box, Typography, CircularProgress, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, Tooltip, LabelList } from "recharts";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";

const Overview = () => {
  // Tangtanga nya ni after sa analytics nga part
  const salesData = [
    { month: "Jan", total: 500 },
    { month: "Feb", total: 230 },
    { month: "Mar", total: 540 },
    { month: "Apr", total: 1000 },
    { month: "May", total: 1300 },
    { month: "Jun", total: 890 },
    { month: "Jul", total: 460 },
    { month: "Aug", total: 420 },
    { month: "Sep", total: 69 },
    { month: "Oct", total: 1234 },
    { month: "Nov", total: 1200 },
    { month: "Dec", total: 600 },
  ];

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMonthlyExpenses = (year) => {
    const monthlyTotals = Array(12).fill(0); // [Jan-Dec]

    transactions.forEach((tx) => {
      if (tx.type === "EXPENSE") {
        const date = new Date(tx.date);
        if (date.getFullYear() === year) {
          const monthIndex = date.getMonth(); // 0 = Jan, 11 = Dec
          monthlyTotals[monthIndex] += parseFloat(tx.amount) || 0;
        }
      }
    });

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.map((month, index) => ({
      month,
      total: monthlyTotals[index],
    }));
  };

  const years = Array.from(new Set(transactions.map((tx) => new Date(tx.date).getFullYear()))).sort((a, b) => a - b);
  const monthlyExpensesData = getMonthlyExpenses(selectedYear);

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

  const fetchBudgets = async () => {
    setLoading(true);
    const user = getAuth().currentUser;
    if (user) {
      try {
        const token = await user.getIdToken();
        const response = await axios.get("http://localhost:8080/api/budgets", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBudgets(response.data);
      } catch (error) {
        console.error("Error fetching budgets:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setBudgets([]);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchBudgets();
        await fetchTransactions();
      } else {
        setCategories([]);
        setTransactions([]);
      }
    });

    return () => unsubscribe(); // cleanup listener
  }, []);

  const totalBudget = budgets.reduce((sum, b) => sum + (b.limit || 0), 0);
  const totalSpent = transactions.filter((tx) => tx.type === "EXPENSE").reduce((sum, tx) => sum + (parseFloat(tx.amount) || 0), 0);
  const remaining = totalBudget - totalSpent;

  const today = new Date();
  const todayString = today.toISOString().split("T")[0]; // e.g. "2025-05-10"
  const todayDateString = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  const spentToday = transactions
    .filter((tx) => {
      const txDate = new Date(tx.date);
      const txDateString = txDate.toISOString().split("T")[0]; // Normalize to same format
      return tx.type === "EXPENSE" && txDateString === todayString;
    })
    .reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

  return (
    <Box p={3} backgroundColor="#F5F5F5">
      <Grid container spacing={3}>
        {/* Analytics */}
        <Grid size={{ xs: 12, sm: 8 }}>
          <Paper elevation={3} sx={{ p: 3, height: 300, borderRadius: 3, backgroundColor: "#37513D" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box>
                <Typography variant="h5" color="white" fontWeight="bold">
                  Analytics
                </Typography>
                <Typography variant="subtitle2" color="white" sx={{ opacity: 0.8 }}>
                  Optimize your expense
                </Typography>
              </Box>
              {years.length > 0 && (
                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <InputLabel sx={{ color: "white" }}>Year</InputLabel>
                  <Select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    label="Year"
                    sx={{
                      color: "white",
                      borderColor: "white",
                      ".MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                      svg: { color: "white" },
                    }}
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={monthlyExpensesData}>
                <XAxis dataKey="month" stroke="white" axisLine={false} tickLine={false} tick={{ fill: "white", fontSize: 14, fontFamily: "roboto" }} />
                {/* <YAxis /> */}
                {/* <Tooltip /> */}
                <Bar dataKey="total" radius={[10, 10, 10, 10]}>
                  {monthlyExpensesData.map((entry, index) => {
                    const currentMonth = new Date().toLocaleString("default", { month: "short" });
                    return <Cell key={`cell-${index}`} fill={entry.month === currentMonth ? "#EDC951" : "#566B5B"} />;
                  })}
                  <LabelList dataKey="total" position="top" fill="white" fontSize={14} fontFamily="roboto" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Transaction */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper elevation={3} sx={{ p: 3, height: 300, borderRadius: 3 }}>
            {/* <Box sx={{ fontSize: "24px", color: "white", mb: 3 }}>
              <Typography variant="h5" color="#37513D" fontWeight="bold">
                Transaction
              </Typography>
              <Typography variant="body2" color="#37513D">
                Recent
              </Typography>
            </Box> */}
            <Box sx={{ fontSize: "24px", color: "white", mb: 3 }}>
              <Typography variant="h5" color="#37513D" fontWeight="bold">
                Transaction
              </Typography>
              <Typography variant="body2" color="#37513D">
                Recent
              </Typography>
            </Box>

            <Box>
              {transactions
                .slice()
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 4)
                .map((tx, index) => (
                  <Box key={index} display="flex" justifyContent="space-between" alignItems="center" borderBottom="1px solid #eee" py={1}>
                    <Box>
                      <Typography variant="body2" fontWeight="bold" color="#37513D">
                        {tx.category}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(tx.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="bold" color={tx.type === "EXPENSE" ? "error.main" : "success.main"}>
                      {`${tx.type === "EXPENSE" ? "-" : " "}$${parseFloat(tx.amount).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`}
                    </Typography>
                  </Box>
                ))}
            </Box>
          </Paper>
        </Grid>

        {/* Remaining Budget */}
        <Grid size={{ xs: 12, sm: 3 }}>
          <Paper
            elevation={3}
            sx={{ backgroundColor: "#EDC951", borderRadius: 4, p: 3, color: "white", height: 240, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
          >
            {/* <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                Remaining Budget
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                ${remaining.toLocaleString()}
              </Typography>
            </Box> */}
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                Remaining Budget
              </Typography>
              <Typography variant="h4" fontWeight="bold" color={remaining < 0 ? "error.main" : "#ffffff"}>
                {remaining < 0
                  ? `-$${Math.abs(remaining).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                  : `$${remaining.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              </Typography>
            </Box>

            {/* Circular Progress Bar */}
            <Box sx={{ position: "relative", display: "inline-flex", alignSelf: "center" }}>
              <CircularProgress
                variant="determinate"
                value={(totalSpent / totalBudget) * 100}
                size={150}
                thickness={5}
                sx={{ color: "white", backgroundColor: "#EED47E", borderRadius: "50%" }}
              />
              <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <Typography variant="h6" component="div" color="white">
                  {spentToday.toLocaleString(undefined, { style: "currency", currency: "USD" })}
                </Typography>
                <Typography variant="caption" color="white">
                  Spent today
                </Typography>
                <Typography variant="caption" color="white">
                  {todayDateString}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Budget */}
        <Grid size={{ xs: 12, sm: 9 }}>
          <Paper elevation={3} sx={{ pl: 3, pr: 3, pb: 5, pt: 1, height: 240, borderRadius: 3 }}>
            {/* <Box color="text.secondary">
              <Typography variant="h5" color="#37513D" fontWeight="bold">Budgets</Typography>
            </Box> */}
            <TableContainer>
              <Table sx={{ minWidth: 350 }} aria-label="budget table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ color: "#808080" }}>#</TableCell>
                    <TableCell style={{ color: "#808080" }}>Budget</TableCell>
                    <TableCell style={{ color: "#808080" }}>Recently Updated</TableCell>
                    <TableCell style={{ color: "#808080" }}>Spent</TableCell>
                    <TableCell style={{ color: "#808080" }}>Limit</TableCell>
                    <TableCell style={{ color: "#808080" }}>Remaining</TableCell>
                    <TableCell style={{ color: "#808080" }}>Percent</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...budgets]
                    .map((budget) => {
                      const expenseTxs = transactions.filter((tx) => tx.category === budget.category && tx.type === "EXPENSE");
                      const recentDate = expenseTxs.length > 0 ? new Date(expenseTxs.sort((a, b) => new Date(b.date) - new Date(a.date))[0].date) : new Date(budget.createdAt);

                      return { ...budget, recentDate, expenseTxs };
                    })
                    .sort((a, b) => b.recentDate - a.recentDate) // sort by most recent
                    .slice(0, 3)
                    .map((budget, index) => {
                      const totalSpent = budget.expenseTxs.reduce((sum, tx) => sum + (parseFloat(tx.amount) || 0), 0);
                      const remaining = (budget.limit || 0) - totalSpent;
                      const percent = (totalSpent / (budget.limit || 1)) * 100;

                      return (
                        <TableRow key={budget.id || index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{budget.category}</TableCell>
                          <TableCell>{budget.recentDate.toLocaleDateString()}</TableCell>
                          <TableCell>${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                          <TableCell sx={{ color: totalSpent > budget.limit ? "error.main" : "inherit" }}>
                            ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </TableCell>

                          <TableCell sx={{ color: remaining < 0 ? "error.main" : "inherit" }}>
                            {remaining < 0
                              ? `-$${Math.abs(remaining).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                              : `$${remaining.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ position: "relative", display: "inline-flex" }}>
                              <CircularProgress
                                variant="determinate"
                                value={Math.min(percent, 100)}
                                size={40}
                                thickness={5}
                                sx={{ color: percent > 100 ? "error.main" : "#37513D", borderRadius: "50%" }}
                              />
                              <Box
                                sx={{
                                  top: 0,
                                  left: 0,
                                  bottom: 0,
                                  right: 0,
                                  position: "absolute",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Typography variant="caption" component="div" color="text.secondary">
                                  {`${Math.round(percent)}%`}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Overview;
