package com.fundnote.FundNote.Service;

import com.fundnote.FundNote.Entity.Budget;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.FieldValue;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.logging.Logger;

@Service
public class BudgetService {

    private final Firestore firestore;
    private static final String BUDGETS_COLLECTION = "budgets";
    private static final Logger logger = Logger.getLogger(BudgetService.class.getName());

    public BudgetService(Firestore firestore) {
        this.firestore = firestore;
    }

    public List<Budget> getBudgetsByUserId(String userId) {
        List<Budget> budgets = new ArrayList<>();
        try {
            Iterable<QueryDocumentSnapshot> documents = firestore.collection(BUDGETS_COLLECTION)
                    .whereEqualTo("userId", userId)
                    .get()
                    .get()
                    .getDocuments();
            for (QueryDocumentSnapshot document : documents) {
                if (document != null && document.exists()) {
                    Budget budget = document.toObject(Budget.class);
                    if (budget != null) {
                        budget.setId(document.getId());
                        budgets.add(budget);
                    } else {
                        logger.warning("Document " + document.getId() + " could not be mapped to Budget class.");
                    }
                } else {
                    logger.warning("Document " + document.getId() + " does not exist.");
                }
            }
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            logger.severe("Error fetching budgets for user: " + userId + " - " + e.getMessage());
            throw new RuntimeException("Error fetching budgets for user: " + userId, e);
        }
        return budgets;
    }

    public void createBudget(String userId, Map<String, Object> budgetData) {
        Map<String, Object> data = new HashMap<>();
        data.put("userId", userId);
        data.put("category", budgetData.get("category"));
        data.put("limit", budgetData.get("limit"));
        data.put("timeFrame", budgetData.get("timeFrame"));
        data.put("createdAt", FieldValue.serverTimestamp());
        try {
            firestore.collection(BUDGETS_COLLECTION).add(data).get();
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            logger.severe("Error creating budget: " + e.getMessage());
            throw new RuntimeException("Error creating budget", e);
        }
    }

    public void updateBudget(String userId, String budgetId, Map<String, Object> updateData) {
        try {
            DocumentReference budgetRef = firestore.collection(BUDGETS_COLLECTION).document(budgetId);
            DocumentSnapshot snapshot = budgetRef.get().get();
            if (snapshot.exists() && userId.equals(snapshot.getData().get("userId"))) {
                budgetRef.update(updateData).get();
            } else {
                logger.warning("Budget not found or does not belong to user");
                throw new RuntimeException("Budget not found or does not belong to user");
            }
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            logger.severe("Error updating budget: " + e.getMessage());
            throw new RuntimeException("Error updating budget", e);
        }
    }

    public void deleteBudget(String userId, String budgetId) {
        try {
            DocumentReference budgetRef = firestore.collection(BUDGETS_COLLECTION).document(budgetId);
            DocumentSnapshot snapshot = budgetRef.get().get();
            if (snapshot.exists() && userId.equals(snapshot.getData().get("userId"))) {
                budgetRef.delete().get();
            } else {
                logger.warning("Budget not found or does not belong to user");
                throw new RuntimeException("Budget not found or does not belong to user");
            }
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            logger.severe("Error deleting budget: " + e.getMessage());
            throw new RuntimeException("Error deleting budget", e);
        }
    }
}