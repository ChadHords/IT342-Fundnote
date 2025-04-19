package com.example.fundnote.ui.theme

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.fundnote.Dashboard
import com.example.fundnote.ui.theme.components.BottomNav
import kotlinx.coroutines.launch



@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FundNoteAppCopy() {
    val sheetState = rememberModalBottomSheetState()
    val coroutineScope = rememberCoroutineScope()
    var showBottomSheet by remember { mutableStateOf(false) }

    if (showBottomSheet) {
        ModalBottomSheet(
            onDismissRequest = { showBottomSheet = false },
            sheetState = sheetState,
            containerColor = Color.White,
            shape = RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp)
        ) {
            var selectedType by remember { mutableStateOf<String?>(null) }
            var amount by remember { mutableStateOf("") }

            Column(modifier = Modifier.padding(16.dp)) {
                Text("Add a Transaction", fontWeight = FontWeight.Bold, fontSize = 18.sp)

                Spacer(modifier = Modifier.height(12.dp))

                // Transaction Type Buttons
                Row(horizontalArrangement = Arrangement.SpaceEvenly, modifier = Modifier.fillMaxWidth()) {
                    listOf("Income", "Expense", "Transfer").forEach { type ->
                        Button(
                            onClick = { selectedType = type },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (selectedType == type) Color(0xFFE4B721) else Color.LightGray
                            )
                        ) {
                            Text(type)
                        }
                    }
                }

                if (selectedType != null) {
                    Spacer(modifier = Modifier.height(16.dp))

                    // Inside your ModalBottomSheet content

                    val accountOptions = listOf("Card", "Cash", "Savings")
                    val categoryOptions = listOf("Home", "Food", "Health")

                    var selectedAccount by remember { mutableStateOf("Account") }
                    var selectedCategory by remember { mutableStateOf("Category") }

                    var showAccountModal by remember { mutableStateOf(false) }
                    var showCategoryModal by remember { mutableStateOf(false) }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceEvenly
                    ) {
                        Button(
                            onClick = { showAccountModal = true },
                            colors = ButtonDefaults.buttonColors(containerColor = Color.LightGray),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.width(190.dp)
                        ) {
                            Text(selectedAccount)
                        }

                        Button(
                            onClick = { showCategoryModal = true },
                            colors = ButtonDefaults.buttonColors(containerColor = Color.LightGray),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.width(190.dp)
                        ) {
                            Text(selectedCategory)
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // Account Selection Modal
                    if (showAccountModal) {
                        AlertDialog(
                            onDismissRequest = { showAccountModal = false },
                            confirmButton = {},
                            title = { Text("Select Account") },
                            text = {
                                Column {
                                    accountOptions.forEach { account ->
                                        Text(
                                            text = account,
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .clickable {
                                                    selectedAccount = account
                                                    showAccountModal = false
                                                }
                                                .padding(8.dp)
                                        )
                                    }
                                }
                            }
                        )
                    }

                    // Category Selection Modal
                    if (showCategoryModal) {
                        AlertDialog(
                            onDismissRequest = { showCategoryModal = false },
                            confirmButton = {},
                            title = { Text("Select Category") },
                            text = {
                                Column {
                                    categoryOptions.forEach { category ->
                                        Text(
                                            text = category,
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .clickable {
                                                    selectedCategory = category
                                                    showCategoryModal = false
                                                }
                                                .padding(8.dp)
                                        )
                                    }
                                }
                            }
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // Amount Input
                    OutlinedTextField(
                        value = amount,
                        onValueChange = { amount = it },
                        label = { Text("Amount") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    Button(
                        onClick = {
                            // Submit logic here
                        },
                        modifier = Modifier.align(Alignment.End)
                    ) {
                        Text("Confirm $selectedType")
                    }
                }
            }

        }
    }

    Scaffold(
        bottomBar = {
            BottomNav(onCenterClick = {
                showBottomSheet = true
                coroutineScope.launch { sheetState.show() }
            })

        }
    ) { innerPadding ->
        Dashboard(modifier = Modifier.padding(innerPadding))
    }
}