package com.fundnote.FundNote.Service;

import com.fundnote.FundNote.Entity.SampleProductEntity;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;

@Service
public class SampleProductService {

    private static final String COLLECTION_NAME="products";

    public String saveProduct(SampleProductEntity product) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();

        ApiFuture<WriteResult> collectionApiFuture =
                dbFirestore.collection(COLLECTION_NAME).document(product.getName()).set(product);

        return collectionApiFuture.get().getUpdateTime().toString();
    }

}
