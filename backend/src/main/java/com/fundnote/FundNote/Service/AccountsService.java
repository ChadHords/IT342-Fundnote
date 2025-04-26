package com.fundnote.FundNote.Service;

import com.fundnote.FundNote.Entity.Accounts;
import com.google.cloud.firestore.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.logging.Logger;

@Service
public class AccountsService {

    private final Firestore firestore;
    private static final String ACCOUNTS_COLLECTION = "accounts";
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

    public void createAccount(String userId, Map<String, Object> accountData) {
        Map<String, Object> data = new HashMap<>();
        data.put("userId", userId);
        data.put("account", accountData.get("account"));

        Object amount = accountData.get("amount");
        data.put("amount", amount != null ? amount : 0.0);

        data.put("createdAt", FieldValue.serverTimestamp());
        try {
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
}
