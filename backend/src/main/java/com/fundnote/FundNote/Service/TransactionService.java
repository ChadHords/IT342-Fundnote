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

import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
public class TransactionService {

    // Please keep the comments for learning purposes

    private static final String COLLECTION_NAME="transactions";

    public String saveTransaction(TransactionEntity transaction, HttpServletRequest request) throws ExecutionException, InterruptedException, FirebaseAuthException {

        Firestore db = FirestoreClient.getFirestore();

        transaction.setTransactionId(UUID.randomUUID().toString());
        transaction.setDateCreated(new Date());
        transaction.setUserId((String)request.getAttribute("uid"));

        DocumentReference docRef = db.collection(COLLECTION_NAME).document(transaction.getTransactionId());
        ApiFuture<WriteResult> collectionApiFuture = docRef.set(transaction);

        return "Transaction Record successfully created at: " + collectionApiFuture.get().getUpdateTime();
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

    // Not the best practice in this case, please use other one instead. Keeping this just as a reference
    // This method is best for admins.
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

    // Fetch currently logged-in user's transactions
    public List<TransactionEntity> getUserTransactions (HttpServletRequest request) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        String uid = (String) request.getAttribute("uid"); // Fetch currently logged-in user's id

        CollectionReference collection = db.collection(COLLECTION_NAME);
        Query query = collection.whereEqualTo("userId", uid);

        ApiFuture<QuerySnapshot> future = query.get(); // Step 1: Async request
        QuerySnapshot querySnapshot = future.get(); // Step 2: Block until result arrives

        List<QueryDocumentSnapshot> documents = querySnapshot.getDocuments();
        List<TransactionEntity> transactions = new ArrayList<>();

        for (DocumentSnapshot document : documents) {
            transactions.add(document.toObject(TransactionEntity.class));
        }

        return transactions;
    }

    public List<TransactionEntity> getUserTransactionsByMonth(int year, int month, HttpServletRequest request) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        String uid = (String) request.getAttribute("uid");

        // Calculate start and end of the month
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.YEAR, year);
        calendar.set(Calendar.MONTH, month - 1); // Month is 0-based in Java Calendar
        calendar.set(Calendar.DAY_OF_MONTH, 1);
        Date startDate = calendar.getTime();

        calendar.add(Calendar.MONTH, 1);
        Date endDate = calendar.getTime();

        // Query
        ApiFuture<QuerySnapshot> future = db.collection(COLLECTION_NAME)
                .whereEqualTo("userId", uid)
                .whereGreaterThanOrEqualTo("dateCreated", startDate)
                .whereLessThan("dateCreated", endDate)
                .get();

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
