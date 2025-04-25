package com.fundnote.FundNote.Controller;

import com.fundnote.FundNote.Entity.TransactionEntity;
import com.fundnote.FundNote.Service.TransactionService;
import com.google.firebase.auth.FirebaseAuthException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/transaction")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping("/create")
    public TransactionEntity saveTransaction(@RequestBody TransactionEntity transaction, HttpServletRequest request) throws ExecutionException, InterruptedException, FirebaseAuthException {

        return transactionService.saveTransaction(transaction, request);
    }

    @GetMapping("/read/{transactionId}")
    public TransactionEntity getTransaction(@PathVariable String transactionId, HttpServletRequest request) throws ExecutionException, InterruptedException {

        return transactionService.getTransaction(transactionId, request);
    }

    @GetMapping("/getAllByUserId/{userId}")
    public List<TransactionEntity> getTransactionsByUserId(@PathVariable String userId) throws ExecutionException, InterruptedException {

        return transactionService.getTransactionsByUserId(userId);
    }

    @PutMapping("/update/{transactionId}")
    public TransactionEntity updateTransaction(@PathVariable String transactionId, @RequestBody TransactionEntity updatedTransaction, HttpServletRequest request) throws ExecutionException, InterruptedException {

        return transactionService.updateTransaction(transactionId, updatedTransaction, request);
    }

    @DeleteMapping("/delete/{transactionId}")
    public String deleteTransaction(@PathVariable String transactionId, HttpServletRequest request) throws ExecutionException, InterruptedException {

        return transactionService.deleteTransaction(transactionId, request);
    }
}
