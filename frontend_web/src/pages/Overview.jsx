import React from "react";
import { Grid, Paper, Box, Typography, CircularProgress, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, Tooltip, LabelList } from "recharts";

const Overview = () => {
  // Tangtanga nya ni after
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

  // Kani sad
  const pieData = [
    { name: "Website", value: 374.82 },
    { name: "Mobile App", value: 241.60 },
    { name: "Other", value: 213.42 },
  ];

  // Ug kani
  const budgetData = [
    { id: 1, title: 'Rent', recentlyUpdated: '03/25/2025', availableBudget: 10000, totalBudget: 10000 },
    { id: 2, title: 'Groceries', recentlyUpdated: '03/25/2025', availableBudget: 3120, totalBudget: 8000 },
    { id: 3, title: 'Vacation', recentlyUpdated: '01/01/2025', availableBudget: 500, totalBudget: 5000 },
  ];

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

  const available = 18000;
  const current = 10800;
  const date = "17 December";
  const percentage = (current / available) * 100;

  return (
    <Box p={3} backgroundColor="#F5F5F5" borderRadius={3}>
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
                Available this Month
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                ${available.toLocaleString()}
              </Typography>
            </Box>

            {/* Circular Progress Bar */}
            <Box sx={{ position: "relative", display: "inline-flex", alignSelf: "center" }}>
              <CircularProgress variant="determinate" value={percentage} size={150} thickness={5} sx={{ color: "white", backgroundColor: "#EED47E", borderRadius: "50%", }} />
              <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", }} >
                <Typography variant="h6" component="div" color="white">
                  ${current.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="white">
                  {date}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
          
        {/* Budget */}
        <Grid item size={{ xs: 12, sm: 9 }}>
          <Paper elevation={3} sx={{ p: 3, height: 240, borderRadius: 3 }}>
            <Box color="text.secondary">
              <Typography variant="h5" color="#37513D" fontWeight="bold">Budgets</Typography>
            </Box>
            <TableContainer sx={{ pt: 1}}>
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
                  {budgetData.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell>{row.title}</TableCell>
                      <TableCell>{row.recentlyUpdated}</TableCell>
                      <TableCell>{row.availableBudget} / {row.totalBudget}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            width: 40,
                            height: 20,
                            borderRadius: '50%',
                            backgroundColor: '#e0e0e0',
                          }}
                        />
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
