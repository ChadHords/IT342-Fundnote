package com.example.fundnote.ui.theme.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

@Composable
fun BudgetItem(name: String, percent: String, amount: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 6.dp),
//        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(percent)
        Text("$name \n$amount", fontWeight = FontWeight.Bold)
    }
}