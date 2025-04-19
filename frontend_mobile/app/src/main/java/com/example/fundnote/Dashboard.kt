package com.example.fundnote

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.fundnote.ui.theme.components.*

@Composable
fun Dashboard(modifier: Modifier = Modifier) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF2F2F2))
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        // HEADER PART IDK HOW TO ADD THE USER ICON AND NOTIFICATION ICON
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Text("This is the header part")
        }

        // SUMMARY PART MISSING ICONS
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            SummaryCard(title = "Total \nExpense", amount = "$250,000.00", bgColor = Color(0xFF37513D))
            SummaryCard(title = "Total \nIncome", amount = "$93,310.00", bgColor = Color(0xFFEDC951))
        }

        Spacer(modifier = Modifier.height(16.dp))

        SectionCard(title = "Transaction History", height = 210) {
            TransactionItem(title = "Salary", transactionType = "Income", amount = "+ $2,000.00", date = "15/4/25 5:26 AM")
        }

        Spacer(modifier = Modifier.height(16.dp))

        // COLLABORATED WITH
        SectionCard(title = "Collaboration", height = 80) {

        }

        Spacer(modifier = Modifier.height(16.dp))

        // REMAINING BUDGETS
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text("Remaining Budgets", fontSize = 16.sp, fontWeight = FontWeight.Bold)
            Text("See All", fontSize = 14.sp, color = Color.Gray)
        }

        Spacer(modifier = Modifier.height(16.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            SectionBudgetCard(title = "Apr'15", height = 170) {
                Column {
                    CircularBudgetProgress(label = "55%", title = "Remaining Budgets", percent = 0.55f)
                    Spacer(modifier = Modifier.height(8.dp))
                }
            }
            Column {
                SectionSubBudgetCard(height = 60) {
                    Column {
                        BudgetItem("Groceries", "69%", "$1,536.56")
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                SectionSubBudgetCard(height = 60) {
                    Column {
                        BudgetItem("League Skins", "99%", "$3,500.00")
                    }
                }
            }

        }
//        Spacer(modifier = Modifier.weight(1f))
//        BottomNav()
    }
}