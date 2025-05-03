package com.fundnote.FundNote.Controller;

import com.fundnote.FundNote.Entity.Budget;
import com.fundnote.FundNote.Service.BudgetService;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin(origins = "fundnotedev.netlify.app")
public class BudgetController {

    private final FirebaseAuth firebaseAuth;
    private final BudgetService budgetService;
    private static final Logger logger = Logger.getLogger(BudgetController.class.getName());

    public BudgetController(FirebaseAuth firebaseAuth, BudgetService budgetService) {
        this.firebaseAuth = firebaseAuth;
        this.budgetService = budgetService;
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
    public ResponseEntity<List<Budget>> getBudgets(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            String uid = getUidFromToken(authorizationHeader);
            List<Budget> budgets = budgetService.getBudgetsByUserId(uid);
            return ResponseEntity.ok(budgets);
        } catch (Exception e) {
            logger.severe("Error getting budgets: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping
    public ResponseEntity<String> createBudget(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody Map<String, Object> budgetData) {
        try {
            String uid = getUidFromToken(authorizationHeader);
            budgetService.createBudget(uid, budgetData);
            return ResponseEntity.status(HttpStatus.CREATED).body("Budget created successfully");
        } catch (Exception e) {
            logger.severe("Error creating budget: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PutMapping("/{budgetId}")
    public ResponseEntity<String> updateBudget(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable String budgetId,
            @RequestBody Map<String, Object> updateData) {
        try {
            String uid = getUidFromToken(authorizationHeader);
            budgetService.updateBudget(uid, budgetId, updateData);
            return ResponseEntity.ok("Budget updated successfully");
        } catch (Exception e) {
            logger.severe("Error updating budget: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @DeleteMapping("/{budgetId}")
    public ResponseEntity<String> deleteBudget(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable String budgetId) {
        try {
            String uid = getUidFromToken(authorizationHeader);
            budgetService.deleteBudget(uid, budgetId);
            return ResponseEntity.ok("Budget deleted successfully");
        } catch (Exception e) {
            logger.severe("Error deleting budget: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}