import React from 'react';
import { Card, Typography } from '@mui/material';

const BudgetCard = ({ title, amount, subtitle }) => (
    <Card sx={{ p: 2 }}>
        <Typography variant="subtitle2" fontWeight="medium" color="#37513D">{title}</Typography>
        <Typography variant="h5" fontWeight="bold">${amount.toLocaleString()}</Typography>
        <Typography variant="body2" color="textSecondary">{subtitle}</Typography>
    </Card>
);

export default BudgetCard;