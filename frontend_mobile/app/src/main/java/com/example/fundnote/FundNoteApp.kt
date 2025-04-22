package com.example.fundnote

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.AddCircle
import androidx.compose.material.icons.filled.AttachMoney
import androidx.compose.material.icons.filled.BarChart
import androidx.compose.material.icons.filled.GridView
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.input.pointer.PointerIcon
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.fundnote.ui.theme.GreenFN
import com.example.fundnote.ui.theme.YellowFN

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FundNoteApp() {
    val navigationController = rememberNavController()
    val context = LocalContext.current.applicationContext
    val selected = remember {
        mutableStateOf(Icons.Default.Home)
    }

    val sheetState = rememberModalBottomSheetState()
    var showBottomSheet by remember {
        mutableStateOf(false)
    }

    Scaffold(
        bottomBar = {
            BottomAppBar(
                containerColor = GreenFN
            ) {
                IconButton(
                    onClick = {
                        selected.value = Icons.Default.Home
                        navigationController.navigate(Screens.Dashboard.screen) {
                            popUpTo(0)
                        }
                    },
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(Icons.Default.Home, null, modifier = Modifier.size(26.dp),
                         tint = if (selected.value == Icons.Default.Home) YellowFN else Color.White)
                }

                IconButton(
                    onClick = {
                        selected.value = Icons.Default.BarChart
                        navigationController.navigate(Screens.Analytics.screen) {
                            popUpTo(0)
                        }
                    },
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(Icons.Default.BarChart, null, modifier = Modifier.size(26.dp),
                        tint = if (selected.value == Icons.Default.BarChart) Color.White else Color.DarkGray)
                }

                Box(
                    modifier = Modifier
                        .weight(1f)
                        .padding(16.dp),
                        contentAlignment = Alignment.Center
                ) {
                    FloatingActionButton(
                        containerColor = Color.White,
                        shape = CircleShape,
                        onClick = { showBottomSheet = true }) {
                        Icon(Icons.Default.Add, null, tint = YellowFN)
                    }
                }

                IconButton(
                    onClick = {
                        selected.value = Icons.Default.AttachMoney
                        navigationController.navigate(Screens.Budgets.screen) {
                            popUpTo(0)
                        }
                    },
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(Icons.Default.AttachMoney, null, modifier = Modifier.size(26.dp),
                        tint = if (selected.value == Icons.Default.AttachMoney) Color.White else Color.DarkGray)
                }

                IconButton(
                    onClick = {
                        selected.value = Icons.Default.GridView
                        navigationController.navigate(Screens.More.screen) {
                            popUpTo(0)
                        }
                    },
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(Icons.Default.GridView, null, modifier = Modifier.size(26.dp),
                        tint = if (selected.value == Icons.Default.GridView) Color.White else Color.DarkGray)
                }
            }
        }
    ) { paddingValues ->
        NavHost(
            navController = navigationController,
            startDestination = Screens.Dashboard.screen,
            modifier = Modifier.padding(paddingValues)
        ) {
            composable(Screens.Dashboard.screen){ Dashboard() }
            composable(Screens.Analytics.screen){ Analytics() }
            composable(Screens.Budgets.screen){ Budgets() }
            composable(Screens.More.screen){ More() }
            composable(Screens.AddTransaction.screen){ AddTransaction() }
        }
//        Dashboard(modifier = Modifier.padding(innerPadding))
    }

    if(showBottomSheet) {
        ModalBottomSheet(onDismissRequest = { showBottomSheet = false },
            sheetState = sheetState
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
                                containerColor = if (selectedType == type) YellowFN else Color.LightGray
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
                            colors = ButtonDefaults.buttonColors(containerColor = GreenFN),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.width(190.dp)
                        ) {
                            Text(selectedAccount)
                        }

                        Button(
                            onClick = { showCategoryModal = true },
                            colors = ButtonDefaults.buttonColors(containerColor = GreenFN),
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
                            // Change the logic here for backend -Dione
                            Toast.makeText(context, "Transaction added", Toast.LENGTH_SHORT).show()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = GreenFN),
                        modifier = Modifier.align(Alignment.End)
                    ) {
                        Text("Confirm $selectedType")
                    }
                }
            }
//            Column(modifier = Modifier
//                .fillMaxWidth()
//                .padding(18.dp),
//                verticalArrangement = Arrangement.spacedBy(20.dp)
//            ) {
//                BottomSheetItem(Icons.Default.AddCircle, "Add Income/Expense/Transfer") {
////                    showBottomSheet = false
////                    navigationController.navigate(Screens.AddTransaction.screen) {
////                        popUpTo(0)
////                    }
//                }
//
//                BottomSheetItem(Icons.Default.Star, "Add Budget") {
//                    Toast.makeText(context, "Testing", Toast.LENGTH_SHORT).show()
//                }
//
//                BottomSheetItem(Icons.Default.Star, "Add Account") {
//                    Toast.makeText(context, "Testing", Toast.LENGTH_SHORT).show()
//                }
//            }
        }
    }
}

@Composable
fun BottomSheetItem(icon: ImageVector, title: String, onClick: () -> Unit) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        modifier = Modifier.clickable { onClick() }
    ) {
        Icon(icon, null, tint = GreenFN)
        Text(text = title, color = GreenFN, fontSize = 22.sp)
    }
}