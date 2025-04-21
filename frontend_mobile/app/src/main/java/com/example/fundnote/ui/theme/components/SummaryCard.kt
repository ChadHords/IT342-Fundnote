package com.example.fundnote.ui.theme.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun SummaryCard(title: String, amount: String, bgColor: Color) {
    Column(
        modifier = Modifier
            .width(190.dp)
            .height(109.dp)
            .clip(RoundedCornerShape(12.dp))
            .background(bgColor)
            .padding(16.dp)
    ) {
        Text(title, color = Color.White, fontSize = 15.sp)
        Spacer(modifier = Modifier.height(8.dp))
        Text(amount, color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
    }
}