import React from 'react';
import { Box, Card, Typography, IconButton } from '@mui/material';

const StatCard = ({ title, amount, subtitle, isNegative }) => (
  <Card sx={{ p: 2 }}>
    <Typography variant="subtitle2" color="textSecondary">{title}</Typography>
    <Typography variant="h5" fontWeight="bold" color={isNegative ? 'error' : 'textPrimary'} sx={{ mt: 1 }} >
          {isNegative ? '-$' : '$'}{Math.abs(amount).toLocaleString()}
        </Typography>
    <Typography variant="body2" color="textSecondary">{subtitle}</Typography>
  </Card>
);

export default StatCard;