package com.example.fundnote.ui.theme.components

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.*
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.*
import androidx.compose.ui.graphics.vector.*
import androidx.compose.ui.text.font.*
import androidx.compose.ui.unit.*
import kotlinx.coroutines.*

@Composable
fun BottomNav(onCenterClick: () -> Unit) {
    Box(

    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFF2C4B3F))
                .padding(vertical = 8.dp),
//            modifier = Modifier.align(Alignment.Center),
            horizontalArrangement = Arrangement.SpaceEvenly,
            verticalAlignment = Alignment.CenterVertically
        ) {
            BottomNavItem(Icons.Default.Dashboard, "Overview")
            BottomNavItem(Icons.Default.ShowChart, "Statistics")

            // Center button
            Box(
                modifier = Modifier
                    .size(56.dp)
                    .clip(CircleShape)
                    .background(Color(0xFFE4B721))
                    .clickable { onCenterClick() },
                contentAlignment = Alignment.Center
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add", tint = Color.White)
            }

            BottomNavItem(Icons.Default.AttachMoney, "Budgets")
            BottomNavItem(Icons.Default.GridView, "More")
        }
    }
}

@Composable
fun BottomNavItem(icon: ImageVector, label: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Icon(icon, contentDescription = label, tint = Color.White)
        Text(label, color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
    }
}


