package com.fundnote.FundNote.Utils;

import com.google.firebase.cloud.FirestoreClient;
import jakarta.servlet.http.HttpServletRequest;
import com.google.cloud.firestore.*;

import java.util.concurrent.ExecutionException;

public class UserAuthUtil {

    public static void verifyOwnership(String collectionName, String documentId, HttpServletRequest request) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        DocumentReference docRef = db.collection(collectionName).document(documentId);
        DocumentSnapshot snapshot = docRef.get().get();

        if (!snapshot.exists()) {
            throw new RuntimeException("Document not found.");
        }

        String currentUserId = (String) request.getAttribute("uid");
        String documentUserId = snapshot.getString("userId");

        if (!currentUserId.equals(documentUserId)) {
            throw new RuntimeException("Unauthorized: You do not own this document.");
        }
    }
}
