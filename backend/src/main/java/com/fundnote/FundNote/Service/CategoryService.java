package com.fundnote.FundNote.Service;

import com.fundnote.FundNote.Entity.CategoryEntity;
import com.google.api.core.ApiFuture;
import com.google.firebase.cloud.FirestoreClient;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import com.google.cloud.firestore.*;

import java.util.Date;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

@Service
public class CategoryService {

    private static final String COLLECTION_NAME="categories";

    public String saveCategory(CategoryEntity category, HttpServletRequest request) throws ExecutionException, InterruptedException {

        // Validate inputs
        if (category.getCategoryName() == null || category.getCategoryName().trim().isEmpty()) {
            throw new IllegalArgumentException("Category name must not be null or empty.");
        }

        if (category.getType() == null) {
            throw new IllegalArgumentException("Category type must not be null.");
        }

        Firestore db = FirestoreClient.getFirestore();
        String uid = (String) request.getAttribute("uid");
        String newCategoryName = category.getCategoryName().trim();

        // Query all categories of the user
        ApiFuture<QuerySnapshot> future = db.collection(COLLECTION_NAME)
                .whereEqualTo("userId", uid)
                .whereEqualTo("type", category.getType().toString())  // Enums stored as strings
                .get();

        // Check for case-insensitive name match + type match
        for (DocumentSnapshot doc : future.get().getDocuments()) {
            String existingName = doc.getString("categoryName");
            if (existingName != null && existingName.trim().equalsIgnoreCase(newCategoryName)) {
                throw new IllegalArgumentException("A category with the same name and type already exists.");
            }
        }

        // Set other fields
        category.setCategoryId(UUID.randomUUID().toString());
        category.setDateCreated(new Date());
        category.setUserId(uid);
        category.setCategoryName(newCategoryName); // Use trimmed name

        DocumentReference docRef = db.collection(COLLECTION_NAME).document(category.getCategoryId());
        ApiFuture<WriteResult> collectionApiFuture = docRef.set(category);

        return "Category Record successfully created at: " + collectionApiFuture.get().getUpdateTime();
    }

}
