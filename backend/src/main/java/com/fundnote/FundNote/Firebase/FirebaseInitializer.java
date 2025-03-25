package com.fundnote.FundNote.Firebase;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.InputStream;

@Component
public class FirebaseInitializer {
    FileInputStream serviceAccount;

    @PostConstruct
    public void initialization(){
        try {
//            serviceAccount = new FileInputStream("src/main/resources/serviceAccountKey.json");
            InputStream serviceAccount = new ClassPathResource("serviceAccountKey.json").getInputStream();

//            FirebaseOptions options = new FirebaseOptions.Builder()
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .setDatabaseUrl("https://it-342-fundnote-default-rtdb.asia-southeast1.firebasedatabase.app")
                    .build();

            FirebaseApp.initializeApp(options);

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                System.out.println("🔥 Firebase Initialized Successfully!");
            } else {
                System.out.println("✅ Firebase is already initialized.");
            }

            System.out.println("🔍 Firebase Config Path: " + new ClassPathResource("serviceAccountKey.json").getURL());

        } catch (Exception e) {
            throw new RuntimeException("Firebase Initialization Failed!", e);
        }
    }
}
