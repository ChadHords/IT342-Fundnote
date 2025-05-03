import React, { useEffect, useState } from "react";
import { Grid, Paper, Box, Typography, CircularProgress, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, Tooltip, LabelList } from "recharts";
import axios from "axios";
import { getAuth } from "firebase/auth";

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

  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBudgets = async () => {
    setLoading(true);
    const user = getAuth().currentUser;
    if (user) {
      try {
        const token = await user.getIdToken();
        const response = await axios.get('https://it342-fundnote.onrender.com/api/budgets', { 
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        setBudgets(response.data);
      } catch (error) {
        console.error('Error fetching budgets:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setBudgets([]);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const totalBudget = budgets.reduce((acc, curr) => acc + (curr.limit || 0), 0);
  const totalSpent = budgets.reduce((acc, curr) => acc + (curr.spent || 0), 0);
  const remaining = totalBudget - totalSpent;

  const date = "30 April"; // Replace with the actual functional current date -Dione

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3} backgroundColor="#F5F5F5">
      <Grid container spacing={3}>
        {/* Analytics */}
        <Grid item size={{ xs: 12, sm: 8 }}>
          <Paper elevation={3} sx={{ p: 3, height: 300, borderRadius: 3, backgroundColor: "#37513D" }}>
            <Box sx={{ fontWeight: "bold", fontSize: "24px", color: "white", mb: 3 }} >
              <Typography variant="h5" color="white" fontWeight="bold">Analytics</Typography>
              <Typography variant="subtitle2" color="white" sx={{ opacity: 0.8 }}>Optimize your expense</Typography>
            </Box>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={salesData}>
                <XAxis dataKey="month" stroke="white" axisLine={false} tickLine={false} tick={{ fill: "white", fontSize: 14, fontFamily: "roboto" }} />
                {/* <YAxis /> */}
                {/* <Tooltip /> */}
                <Bar dataKey="total" radius={[10, 10, 10, 10]}>
                  {salesData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.month === "Apr" ? "#EDC951" : "#566B5B"}
                    />
                  ))}
                  <LabelList dataKey="total" position="top" fill="white" fontSize={14} fontFamily="roboto" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Transaction */}
        <Grid item size={{ xs: 12, sm: 4 }}>
          <Paper elevation={3} sx={{ p: 3, height: 300, borderRadius: 3 }}>
            <Box sx={{ fontSize: "24px", color: "white", mb: 3 }} >
              <Typography variant="h5" color="#37513D" fontWeight="bold">Transaction</Typography>
              <Typography variant="body2" color="#37513D">Recent</Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Remaining Budget */}
        <Grid item size={{ xs: 12, sm: 3 }}>
          <Paper elevation={3} sx={{ backgroundColor: "#EDC951", borderRadius: 4, p: 3, color: "white", height: 240, display: "flex", flexDirection: "column", justifyContent: "space-between", }}>
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                Remaining Budget
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                ${remaining.toLocaleString()}
              </Typography>
            </Box>

            {/* Circular Progress Bar */}
            <Box sx={{ position: "relative", display: "inline-flex", alignSelf: "center" }}>
              <CircularProgress variant="determinate" value={(totalSpent / totalBudget) * 100} size={150} thickness={5} sx={{ color: "white", backgroundColor: "#EED47E", borderRadius: "50%", }} />
              <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", }} >
                <Typography variant="h6" component="div" color="white">
                  ${totalSpent.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="white">spent on</Typography>
                <Typography variant="caption" color="white"> {date} </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
          
        {/* Budget */}
        <Grid item size={{ xs: 12, sm: 9 }}>
          <Paper elevation={3} sx={{ pl: 3, pr: 3, pb: 5, pt: 1, height: 240, borderRadius: 3 }}>
            {/* <Box color="text.secondary">
              <Typography variant="h5" color="#37513D" fontWeight="bold">Budgets</Typography>
            </Box> */}
            <TableContainer>
              <Table sx={{ minWidth: 350 }} aria-label="budget table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ color: '#808080' }}>#</TableCell>
                    <TableCell style={{ color: '#808080' }}>Title</TableCell>
                    <TableCell style={{ color: '#808080' }}>Recently Updated</TableCell>
                    <TableCell style={{ color: '#808080' }}>Available Budget</TableCell>
                    <TableCell style={{ color: '#808080' }}>Percent</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {budgets.slice(0, 3).map((budget, index) => (
                    <TableRow
                      key={budget.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell>{budget.category}</TableCell>
                      {/* <TableCell>{budget.recentUpdated}</TableCell> */} <TableCell>-</TableCell>
                      <TableCell>{budget.spent} / {budget.limit}</TableCell>
                      <TableCell>
                        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                          <CircularProgress variant="determinate" value={(budget.spent / budget.limit) * 100} size={35} thickness={5} sx={{ color: "#37513D", borderRadius: "50%" }} />
                          <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', }} >
                            <Typography variant="caption" component="div" color="text.secondary">
                              {`${Math.round((budget.spent / budget.limit) * 100)}%`}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
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