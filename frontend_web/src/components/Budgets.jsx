import React from 'react';
import { Box, Button, Card, CardContent, Typography, Grid, LinearProgress, IconButton, Divider, } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

// BUDGET CARD COMPONENT transfer to components folder
const BudgetCard = ({ title, amount, subtitle }) => (
  <Card sx={{ p: 2 }}>
    <Typography variant="subtitle2" color="textSecondary">{title}</Typography>
    <Typography variant="h5" fontWeight="bold">${amount.toLocaleString()}</Typography>
    <Typography variant="body2" color="textSecondary">{subtitle}</Typography>
  </Card>
);

// CATEGORY CARD COMPONENT transfer to components folder
const CategoryCard = () => {
    // TEMPORARY DATA CARD ILISDI LNG NI LATER
    const spent = 1245;
    const total = 10000;
    const remaining = total - spent;
    const percentage = (spent / total) * 100;

    return (
        <Card sx={{ p: 2, mt: 2 }}>
            <Box display="flex" justifyContent="space-between">
                <Typography variant="h6" fontWeight="bold">Groceries</Typography>
                <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
            </Box>
            <Typography variant="body2" color="textSecondary">Monthly</Typography>
            <Box mt={1}>
                <Typography variant="body2" color="textSecondary">
                    ${spent.toLocaleString()} of ${total.toLocaleString()}
                </Typography>
                <LinearProgress variant="determinate" value={percentage} sx={{ height: 8, borderRadius: 4, my: 1, backgroundColor: "#FFAB90", '& .MuiLinearProgress-bar': { backgroundColor: '#FF6635' } }} />
                <Typography variant="body2" fontWeight="bold">${remaining.toLocaleString()} Left</Typography>
            </Box>
            <Typography variant="body2" color="primary" mt={1} sx={{ cursor: 'pointer' }}>
                View transactions
            </Typography>
        </Card>
    );
};

const Budgets = () => {
    // TEMPORARY DATA FOR BUDGETS
    const totalBudget = 10000;
    const totalSpent = 1235;
    const remaining = totalBudget - totalSpent;

    return (
        <Box p={3}>
            <Box mb={2}>
                <Typography variant="h4" fontWeight="bold" color="#2f4f4f">Budgets</Typography>
            </Box>
            <Box display="flex" justifyContent="flex-end" mb={2} mt={4}>
                <Button variant="contained" sx={{ backgroundColor: '#2f4f4f', borderRadius: '12px', textTransform: 'none', '&:hover': { backgroundColor: '#244040', }, }} > Add Budget </Button>
            </Box>



            <Grid container spacing={2}>
                <Grid item size={{ xs: 12, sm: 4 }}>
                    <BudgetCard title="Total Budget" amount={totalBudget} subtitle="Across all categories" />
                </Grid>
                <Grid item size={{ xs: 12, sm: 4 }}>
                    <BudgetCard title="Total Spent" amount={totalSpent} subtitle={`${(totalSpent / totalBudget * 100).toFixed(2)}% of total budget`} />
                </Grid>
                <Grid item size={{ xs: 12, sm: 4 }}>
                <   BudgetCard title="Remaining" amount={remaining} subtitle={`${(remaining / totalBudget * 100).toFixed(2)}% of total budget`} />
                </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Grid container spacing={2}>
                <Grid item size={{ xs: 12, sm: 4 }}>
                <CategoryCard />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Budgets;
