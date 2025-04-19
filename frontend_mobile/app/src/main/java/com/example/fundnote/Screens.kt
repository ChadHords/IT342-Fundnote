package com.example.fundnote

sealed class Screens(val screen: String) {
    data object Dashboard: Screens("Dashboard")
    data object Analytics: Screens("Analytics")
    data object Budgets: Screens("Budgets")
    data object More: Screens("More")
    data object AddTransaction: Screens("AddTransaction")
}