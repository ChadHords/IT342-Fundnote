package com.fundnote.FundNote.Service;

import com.fundnote.FundNote.Entity.Accounts;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.logging.Logger;

@Service
public class AccountsService {

    private final Firestore firestore;
    private static final String ACCOUNTS_COLLECTION = "accounts";
    private static final String TRANSACTIONS_COLLECTION = "transactions";
    private static final Logger logger = Logger.getLogger(AccountsService.class.getName());

    public AccountsService(Firestore firestore) {
        this.firestore = firestore;
    }

    public List<Accounts> getAccountsByUserId(String userId) {
        List<Accounts> accounts = new ArrayList<>();
        try {
            Iterable<QueryDocumentSnapshot> documents = firestore.collection(ACCOUNTS_COLLECTION)
                    .whereEqualTo("userId", userId)
                    .get()
                    .get()
                    .getDocuments();
            for (QueryDocumentSnapshot document : documents) {
                if (document != null && document.exists()) {
                    Accounts account = document.toObject(Accounts.class);
                    if (account != null) {
                        account.setId(document.getId());
                        accounts.add(account);
                    } else {
                        logger.warning("Document " + document.getId() + " could not be mapped to Accounts class.");
                    }
                } else {
                    logger.warning("Document " + document.getId() + " does not exist.");
                }
            }
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            logger.severe("Error fetching accounts for user: " + userId + " - " + e.getMessage());
            throw new RuntimeException("Error fetching accounts for user: " + userId, e);
        }
        return accounts;
    }

//    public void createAccount(String userId, Map<String, Object> accountData) {
//        Map<String, Object> data = new HashMap<>();
//        data.put("userId", userId);
//        data.put("account", accountData.get("account"));
//
//        Object amount = accountData.get("amount");
//        data.put("amount", amount != null ? amount : 0.0);
//
//        data.put("createdAt", FieldValue.serverTimestamp());
//        try {
//            firestore.collection(ACCOUNTS_COLLECTION).add(data).get();
//        } catch (InterruptedException | ExecutionException e) {
//            Thread.currentThread().interrupt();
//            logger.severe("Error creating account: " + e.getMessage());
//            throw new RuntimeException("Error creating account", e);
//        }
//    }

    public void createAccount(String userId, Map<String, Object> accountData) {
        String accountName = (String) accountData.get("account");

        if (accountName == null || accountName.trim().isEmpty()) {
            throw new IllegalArgumentException("Account name must be provided");
        }

        try {
            // Fetch all accounts for the user
            ApiFuture<QuerySnapshot> future = firestore.collection(ACCOUNTS_COLLECTION)
                    .whereEqualTo("userId", userId)
                    .get();

            List<QueryDocumentSnapshot> existingAccounts = future.get().getDocuments();

            // Case-insensitive check
            for (QueryDocumentSnapshot doc : existingAccounts) {
                String existingName = doc.getString("account");
                if (existingName != null && existingName.equalsIgnoreCase(accountName)) {
                    throw new IllegalArgumentException("Account with name '" + accountName + "' already exists.");
                }
            }

            // Proceed to create account
            Map<String, Object> data = new HashMap<>();
            data.put("userId", userId);
            data.put("account", accountName); // Optional: store as lowercase
            Object amount = accountData.get("amount");
            data.put("amount", amount != null ? amount : 0.0);
            data.put("createdAt", FieldValue.serverTimestamp());

            firestore.collection(ACCOUNTS_COLLECTION).add(data).get();

        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            logger.severe("Error creating account: " + e.getMessage());
            throw new RuntimeException("Error creating account", e);
        }
    }

    public void updateAccount(String userId, String accountId, Map<String, Object> updateAccount) {
        try {
            DocumentReference accountRef = firestore.collection(ACCOUNTS_COLLECTION).document(accountId);
            DocumentSnapshot snapshot = accountRef.get().get();
            if (snapshot.exists() && userId.equals(snapshot.getData().get("userId"))) {
                accountRef.update(updateAccount).get();
            } else {
                logger.warning("Account not found or does not belong to user");
                throw new RuntimeException("Account not found or does not belong to user");
            }
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            logger.severe("Error updating account: " + e.getMessage());
            throw new RuntimeException("Error updating account", e);
        }
    }

    public void deleteAccount(String userId, String accountId) {
        try {
            DocumentReference accountRef = firestore.collection(ACCOUNTS_COLLECTION).document(accountId);
            DocumentSnapshot snapshot = accountRef.get().get();
            if (snapshot.exists() && userId.equals(snapshot.getData().get("userId"))) {
                // Step 1: Delete related transactions
                deleteTransactionsForAccount(accountId, userId);
                // Step 2: Delete the account
                accountRef.delete().get();
            } else {
                logger.warning("Account not found or does not belong to user");
                throw new RuntimeException("Account not found or does not belong to user");
            }
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            logger.severe("Error deleting account: " + e.getMessage());
            throw new RuntimeException("Error deleting account", e);
        }
    }

    private void deleteTransactionsForAccount(String accountId, String userId) {
        try {
            // First query for transactions where fromAccountId matches
            Query fromAccountQuery = firestore.collection(TRANSACTIONS_COLLECTION)
                    .whereEqualTo("fromAccountId", accountId)
                    .whereEqualTo("userId", userId);
            ApiFuture<QuerySnapshot> fromAccountSnapshot = fromAccountQuery.get();

            // Second query for transactions where toAccountId matches
            Query toAccountQuery = firestore.collection(TRANSACTIONS_COLLECTION)
                    .whereEqualTo("toAccountId", accountId)
                    .whereEqualTo("userId", userId);
            ApiFuture<QuerySnapshot> toAccountSnapshot = toAccountQuery.get();

            // Wait for both queries to complete
            List<QueryDocumentSnapshot> fromAccountTransactions = fromAccountSnapshot.get().getDocuments();
            List<QueryDocumentSnapshot> toAccountTransactions = toAccountSnapshot.get().getDocuments();

            // Create a new list to combine both transaction lists
            List<QueryDocumentSnapshot> allTransactions = new ArrayList<>();
            allTransactions.addAll(fromAccountTransactions);
            allTransactions.addAll(toAccountTransactions);

            // Delete each transaction
            for (DocumentSnapshot transaction : allTransactions) {
                DocumentReference transactionRef = transaction.getReference();
                transactionRef.delete().get();  // Deleting the transaction
            }
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            logger.severe("Error deleting transactions: " + e.getMessage());
            throw new RuntimeException("Error deleting transactions", e);
        }
    }

    public String deleteAllUserAccounts(HttpServletRequest request) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        String uid = (String) request.getAttribute("uid");

        // Query all accounts where userId matches
        ApiFuture<QuerySnapshot> future = db.collection(ACCOUNTS_COLLECTION)
                .whereEqualTo("userId", uid)
                .get();

        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        WriteBatch batch = db.batch();

        for (QueryDocumentSnapshot doc : documents) {
            batch.delete(doc.getReference());
        }

        if (documents.isEmpty()) {
            return "No accounts found for user.";
        }

        // Commit the batch delete
        ApiFuture<List<WriteResult>> commitFuture = batch.commit();
        commitFuture.get(); // Wait for completion

        return "Successfully deleted " + documents.size() + " account(s) for the user.";
    }

}
