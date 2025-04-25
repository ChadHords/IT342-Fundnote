package com.fundnote.FundNote.Service;

import com.fundnote.FundNote.Entity.TransactionEntity;
import com.fundnote.FundNote.Enum.TransactionType;
import com.fundnote.FundNote.Utils.UserAuthUtil;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.cloud.FirestoreClient;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

@Service
public class TransactionService {

    private static final String COLLECTION_NAME="transactions";

    public TransactionEntity saveTransaction(TransactionEntity transaction, HttpServletRequest request) throws ExecutionException, InterruptedException, FirebaseAuthException {

        Firestore db = FirestoreClient.getFirestore();

//        // Extract token from Authorization header
//        String authHeader = request.getHeader("Authorization");
//        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//            throw new RuntimeException("Missing or invalid Authorization header.");
//        }
//
//        // Verify the token and extract the uid from the token
//        String idToken = authHeader.substring(7);
//        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
//        String uid = decodedToken.getUid();
//
//        // Validate Transaction before saving
//        TransactionType type = TransactionType.valueOf(transaction.getType().toString());
//        type.validate(transaction.getAmount(), transaction.getFromAccountId(), transaction.getToAccountId(), transaction.getCategory());

        transaction.setTransactionId(UUID.randomUUID().toString());
        transaction.setDateCreated(new Date());
//        transaction.setUserId(uid);
        transaction.setUserId((String)request.getAttribute("uid"));

        DocumentReference docRef = db.collection(COLLECTION_NAME).document(transaction.getTransactionId());
        ApiFuture<WriteResult> collectionApiFuture = docRef.set(transaction);

//        return "Transaction Record successfully create at: " + collectionApiFuture.get().getUpdateTime();
        return transaction;
    }

    public TransactionEntity getTransaction (String transactionId, HttpServletRequest request) throws ExecutionException, InterruptedException {
        UserAuthUtil.verifyOwnership(COLLECTION_NAME, transactionId, request);
        Firestore db = FirestoreClient.getFirestore();

        DocumentReference docRef = db.collection(COLLECTION_NAME).document(transactionId);
        ApiFuture<DocumentSnapshot> future = docRef.get();

        DocumentSnapshot document = future.get();

        if(document.exists()) {
            return document.toObject(TransactionEntity.class);
        } else {
            throw new RuntimeException("Transaction not found with ID: " + transactionId);
        }
    }

    public List<TransactionEntity> getTransactionsByUserId (String userId) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        ApiFuture<QuerySnapshot> future = db.collection(COLLECTION_NAME).whereEqualTo("userId", userId).get();

        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        List<TransactionEntity> transactions = new ArrayList<>();
        for (DocumentSnapshot document : documents) {
            transactions.add(document.toObject(TransactionEntity.class));
        }

        return transactions;
    }

    public TransactionEntity updateTransaction (String transactionId,TransactionEntity updatedTransaction, HttpServletRequest request) throws ExecutionException, InterruptedException {

        Firestore db = FirestoreClient.getFirestore();
        DocumentReference docRef = db.collection(COLLECTION_NAME).document(transactionId);
        ApiFuture<DocumentSnapshot> future = docRef.get(); // Step 1: Get the future (asynchronous result)
        DocumentSnapshot document = future.get(); // Step 2: Block and wait for the actual data
        // It's like saying "Give me the ApiFuture for the document snapshot" → then → "Wait for that future to complete and give me the actual document."

        if(!document.exists()) {
            throw new RuntimeException("Transaction not found.");
        }

        UserAuthUtil.verifyOwnership(COLLECTION_NAME, transactionId, request);

        // Set non-editable fields
        updatedTransaction.setTransactionId(transactionId);
        updatedTransaction.setUserId((String) request.getAttribute("uid"));
        updatedTransaction.setDateCreated(document.getDate("dateCreated"));

        // Validate the updated transaction
        TransactionType type = TransactionType.valueOf(updatedTransaction.getType().toString());
        type.validate(updatedTransaction.getAmount(), updatedTransaction.getFromAccountId(), updatedTransaction.getToAccountId(), updatedTransaction.getCategory());

        ApiFuture<WriteResult> writeResult = docRef.set(updatedTransaction);

        return updatedTransaction;
    }

    public String deleteTransaction (String transactionId, HttpServletRequest request) throws ExecutionException, InterruptedException {
        UserAuthUtil.verifyOwnership(COLLECTION_NAME, transactionId, request);

        Firestore db = FirestoreClient.getFirestore();
        DocumentReference docRef = db.collection(COLLECTION_NAME).document(transactionId);

        DocumentSnapshot docSnapshot = docRef.get().get();
        if(!docSnapshot.exists()){
            throw new RuntimeException("Transaction not found.");
        }

        ApiFuture<WriteResult> writeResult = docRef.delete();
        return "Transaction successfully deleted at: " + writeResult.get().getUpdateTime();
    }
}
