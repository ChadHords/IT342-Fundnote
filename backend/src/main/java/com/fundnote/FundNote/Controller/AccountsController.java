package com.fundnote.FundNote.Controller;

import com.fundnote.FundNote.Entity.Accounts;
import com.fundnote.FundNote.Service.AccountsService;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@Controller
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "fundnotedev.netlify.app")
public class AccountsController {

    private final FirebaseAuth firebaseAuth;
    private final AccountsService accountsService;
    private static final Logger logger = Logger.getLogger(AccountsService.class.getName());

    public AccountsController(FirebaseAuth firebaseAuth, AccountsService accountsService) {
        this.firebaseAuth = firebaseAuth;
        this.accountsService = accountsService;
    }

    private String getUidFromToken(String authorizationHeader) throws Exception {
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            FirebaseToken decodedToken = firebaseAuth.verifyIdTokenAsync(token).get();
            return decodedToken.getUid();
        }
        throw new Exception("Unauthorized");
    }

    @GetMapping
    public ResponseEntity<List<Accounts>> getAccounts(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            String uid = getUidFromToken(authorizationHeader);
            List<Accounts> accounts = accountsService.getAccountsByUserId(uid);
            return ResponseEntity.ok(accounts);
        } catch (Exception e) {
            logger.severe("Error getting accounts: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping
    public ResponseEntity<String> createAccount(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody Map<String, Object> accountData) {
        try {
            String uid = getUidFromToken(authorizationHeader);
            accountsService.createAccount(uid, accountData);
            return ResponseEntity.status(HttpStatus.CREATED).body("Account created successfully");
        } catch (Exception e) {
            logger.severe("Error creating account: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PutMapping("/{accountId}")
    public ResponseEntity<String> updateAccount(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable String accountId,
            @RequestBody Map<String, Object> updateData) {
        try {
            String uid = getUidFromToken(authorizationHeader);
            accountsService.updateAccount(uid, accountId, updateData);
            return ResponseEntity.ok("Account updated successfully");
        } catch (Exception e) {
            logger.severe("Error updating account: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @DeleteMapping("/{accountId}")
    public ResponseEntity<String> deleteAccount(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable String accountId) {
        try {
            String uid = getUidFromToken(authorizationHeader);
            accountsService.deleteAccount(uid, accountId);
            return ResponseEntity.ok("Account deleted successfully");
        } catch (Exception e) {
            logger.severe("Error deleting account: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
