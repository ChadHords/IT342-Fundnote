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
fun SectionBudgetCard(title: String, height: Int, content: @Composable () -> Unit) {
    Column(
        modifier = Modifier
            .width(190.dp)
            .clip(RoundedCornerShape(12.dp))
            .background(Color.White)
            .padding(16.dp)
            .height(height.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(title, fontSize = 16.sp, fontWeight = FontWeight.Bold)
            Text("See All", fontSize = 14.sp, color = Color.Gray)
        }
        Spacer(modifier = Modifier.height(8.dp))
        content()
    }
}