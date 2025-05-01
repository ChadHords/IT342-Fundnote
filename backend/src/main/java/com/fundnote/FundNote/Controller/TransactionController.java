package com.fundnote.FundNote.Controller;

import com.fundnote.FundNote.Entity.TransactionEntity;
import com.fundnote.FundNote.Service.TransactionService;
import com.google.api.Http;
import com.google.firebase.auth.FirebaseAuthException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping
    public String saveTransaction(@RequestBody TransactionEntity transaction, HttpServletRequest request) throws ExecutionException, InterruptedException, FirebaseAuthException {
        return transactionService.saveTransaction(transaction, request);
    }

    @GetMapping("/{transactionId}")
    public TransactionEntity getTransaction(@PathVariable String transactionId, HttpServletRequest request) throws ExecutionException, InterruptedException {
        return transactionService.getTransaction(transactionId, request);
    }

    // Not the best practice in this case, please use other one instead. Keeping this just as a reference
    // This method is best for admins since userId parameter is used to fetch a specific user's transaction record.
    // Why? Impractical endpoint naming, asks for userId from frontend when the currently logged-in user's uid is already stored in firebase
    @GetMapping("/getAllByUserId/{userId}")
    public List<TransactionEntity> getTransactionsByUserId(@PathVariable String userId) throws ExecutionException, InterruptedException {
        return transactionService.getTransactionsByUserId(userId);
    }

    @GetMapping
    public List<TransactionEntity> getUserTransactions(HttpServletRequest request) throws ExecutionException, InterruptedException {
        return transactionService.getUserTransactions(request);
    }

    @GetMapping("/{month}")
    public List<TransactionEntity> getTransactionsByMonth(int year, int month, HttpServletRequest request) throws ExecutionException, InterruptedException {
        return transactionService.getUserTransactionsByMonth(year, month, request);
    }

    @PutMapping("/{transactionId}")
    public TransactionEntity updateTransaction(@PathVariable String transactionId, @RequestBody TransactionEntity updatedTransaction, HttpServletRequest request) throws ExecutionException, InterruptedException {
        return transactionService.updateTransaction(transactionId, updatedTransaction, request);
    }

    @DeleteMapping("/{transactionId}")
    public String deleteTransaction(@PathVariable String transactionId, HttpServletRequest request) throws ExecutionException, InterruptedException {
        return transactionService.deleteTransaction(transactionId, request);
    }

    @DeleteMapping("/deleteAllUserTransactions")
    public String deleteAllUserTransactions(HttpServletRequest request) throws ExecutionException, InterruptedException {
        return transactionService.deleteAllUserTransactions(request);
    }

}
