package com.fundnote.FundNote.Controller;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private Firestore getFirestore() {
        return FirestoreClient.getFirestore();
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerAdditionalInfo(@RequestBody Map<String, String> userData) {
        String uid = userData.get("uid");
        String name = userData.get("name");
//        String username = userData.get("username");

        if (uid == null || name == null) {
            return new ResponseEntity<>("Missing required fields.", HttpStatus.BAD_REQUEST);
        }

        try {
            // Store data in Firestore
            // This is the Service btw xD
            Map<String, Object> userDetails = new HashMap<>();
            userDetails.put("name", name);
//            userDetails.put("username", username);

            getFirestore().collection("users").document(uid).set(userDetails).get(); // Use .get() to wait for completion

            return new ResponseEntity<>("User details saved to Firestore!", HttpStatus.CREATED);

        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error saving user details to Firestore.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/test-signup")
    public ResponseEntity<String> receiveSignupData(@RequestBody Map<String, String> userData) {
        String name = userData.get("name");
//        String username = userData.get("username");

        System.out.println("Received name: " + name);
//        System.out.println("Received username: " + username);

        return new ResponseEntity<>("Signup data received successfully by backend!", HttpStatus.OK);
    }
}