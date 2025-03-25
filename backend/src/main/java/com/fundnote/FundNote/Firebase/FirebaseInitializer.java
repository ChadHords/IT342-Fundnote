package com.fundnote.FundNote.Firebase;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;

@Component
public class FirebaseInitializer {
    FileInputStream serviceAccount;

    @PostConstruct
    public void initialization(){
        try {
            serviceAccount = new FileInputStream("src/main/resources/serviceAccountKey.json");


    FirebaseOptions options = new FirebaseOptions.Builder()
            .setCredentials(GoogleCredentials.fromStream(serviceAccount))
            .setDatabaseUrl("https://it-342-fundnote-default-rtdb.asia-southeast1.firebasedatabase.app")
            .build();

    FirebaseApp.initializeApp(options);


        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
