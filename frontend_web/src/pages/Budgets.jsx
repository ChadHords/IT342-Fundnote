import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Grid, Divider, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import { getAuth } from "firebase/auth";
import CategoryCard from "../components/CategoryCard";
import BudgetCard from "../components/BudgetCard";
import axios from 'axios';

const Budgets = () => {
    const predefinedCategories = ['Groceries', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Savings'];
    const timeFrame = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedTimeFrame, setSelectedTimeFrame] = useState('Monthly');
    const [budgetLimit, setBudgetLimit] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editLimit, setEditLimit] = useState('');

    const [editingId, setEditingId] = useState(null);

    // GET BUDGETS
    const fetchBudgets = async () => {
        setLoading(true);
        const user = getAuth().currentUser;
        if (user) {
            try {
                const token = await user.getIdToken();
                const response = await axios.get('http://localhost:8080/api/budgets', { 
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching budgets:', error);
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
            setCategories([]);
        }
    };

    useEffect(() => {
        fetchBudgets();
    }, []);

    // POST BUDGETS
    const handleSave = async () => {
        const user = getAuth().currentUser;
        if (selectedCategory && budgetLimit && user) {
            try {
                const token = await user.getIdToken();
                await axios.post('http://localhost:8080/api/budgets', {
                    category: selectedCategory,
                    limit: parseFloat(budgetLimit),
                    timeFrame: selectedTimeFrame,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                await fetchBudgets();
                setOpenModal(false);
                setBudgetLimit("");
                setSelectedCategory("");
            } catch (error) {
                console.error('Error adding budget:', error);
            }
        }
    };

    const handleEditClick = (category) => {
        setEditingId(category.id);
        setEditLimit(category.limit);
        setEditModalOpen(true);
    };

    // UPDATE BUDGETS
    const handleUpdate = async () => {
        const user = getAuth().currentUser;
        if (!editingId || !editLimit || !user) return;
        try {
            const token = await user.getIdToken();
            await axios.put(`http://localhost:8080/api/budgets/${editingId}`, {
                limit: parseFloat(editLimit),
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            await fetchBudgets();
            setEditModalOpen(false);
        } catch (error) {
            console.error('Error updating budget:', error);
        }
    };

    // DELETE BUDGETS
    const handleDelete = async (categoryId) => {
        const user = getAuth().currentUser;
        if (!categoryId || !user) return;
        try {
            const token = await user.getIdToken();
            await axios.delete(`http://localhost:8080/api/budgets/${categoryId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            await fetchBudgets();
        } catch (error) {
            console.error('Error deleting budget:', error);
        }
    };

    // CALCULATE TOTAL BUDGETS
    const totalBudget = categories.reduce((acc, curr) => acc + (curr.limit || 0), 0);
    const totalSpent = categories.reduce((acc, curr) => acc + (curr.spent || 0), 0);
    const remaining = totalBudget - totalSpent;

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Box mb={2}>
                <Typography variant="h4" fontWeight="bold" color="#37513D">Budgets</Typography>
            </Box>
            <Box display="flex" justifyContent="flex-end" mb={2} mt={4}>
                <Button variant="contained" onClick={() => setOpenModal(true)} sx={{ backgroundColor: '#37513D', textTransform: 'none', borderRadius: '8px', '&:hover': { backgroundColor: '#1e3a3a' }, }} >
                    Add Budget
                </Button>
            </Box>

            <Grid container spacing={2}>
                <Grid item size={{ xs: 12, sm: 4 }}>
                    <BudgetCard title="Total Budget" amount={totalBudget} subtitle="Across all categories" />
                </Grid>
                <Grid item size={{ xs: 12, sm: 4 }}>
                    <BudgetCard title="Total Spent" amount={totalSpent} subtitle={`${(totalSpent / totalBudget * 100).toFixed(2)}% of total budget`} />
                </Grid>
                <Grid item size={{ xs: 12, sm: 4 }}>
                    <BudgetCard title="Remaining" amount={remaining} subtitle={`${(remaining / totalBudget * 100).toFixed(2)}% of total budget`} />
                </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Grid container spacing={2}>
                {categories.map(category => (
                    <Grid item size={{ xs: 12, sm: 4 }} key={category.id}>
                        <CategoryCard categoryName={category.category} total={category.limit} spent={category.spent || 0} timeFrame={category.timeFrame} onEdit={() => handleEditClick(category)} onDelete={() => handleDelete(category.id)} />
                    </Grid>
                ))}
            </Grid>

            {/* ======================================= MODALS NANI NGA PART ============================================ */}

            {/* MODAL FOR EDIT LIMITE */}
            <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle fontWeight="bold" color='#37513D'>Edit Limit</DialogTitle>
                <DialogContent dividers>
                    <TextField fullWidth margin="normal" label="New Limit" type="number" value={editLimit} onChange={(e) => setEditLimit(e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button sx={{ color: "#37513D" }} onClick={() => setEditModalOpen(false)}>Cancel</Button>
                    <Button variant="contained" sx={{ backgroundColor: "#37513D" }} onClick={handleUpdate}>Update</Button>
                </DialogActions>
            </Dialog>

            {/* MODAL FOR ADDING BUDGET */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Set Budget</DialogTitle>
                <DialogContent dividers>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Category</InputLabel>
                        <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} label="Category" >
                            {predefinedCategories.map((cat) => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Time Frame</InputLabel>
                        <Select value={selectedTimeFrame} onChange={(e) => setSelectedTimeFrame(e.target.value)} label="Time Frame" >
                            {timeFrame.map((time) => (
                                <MenuItem key={time} value={time}>{time}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField fullWidth margin="normal" label="Limit" name="limit" type="number" value={budgetLimit} onChange={(e) => setBudgetLimit(e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button sx={{ color: "#37513D" }} onClick={() => setOpenModal(false)}>Cancel</Button>
                    <Button sx={{ backgroundColor: "#37513D" }} variant="contained" onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Budgets;