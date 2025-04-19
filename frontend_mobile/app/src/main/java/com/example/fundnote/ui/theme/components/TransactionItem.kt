package com.example.fundnote.ui.theme.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun TransactionItem(title: String, transactionType: String, amount: String, date: String) {
    Column(modifier = Modifier.padding(8.dp)) {
        Row(
            horizontalArrangement = Arrangement.SpaceBetween,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(title, fontWeight = FontWeight.Bold)
            Text(amount, color = Color(0xFF2C4B3F), fontWeight = FontWeight.Bold)
        }
        Row(
            horizontalArrangement = Arrangement.SpaceBetween,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(transactionType, color = Color(0xFF2C4B3F), fontWeight = FontWeight.Light)
            Text(date, fontSize = 12.sp, color = Color.Gray)
        }
    }
}