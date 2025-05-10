package com.fundnote.FundNote.Entity;

import com.google.cloud.firestore.annotation.DocumentId;
import com.google.cloud.firestore.annotation.ServerTimestamp;

import java.util.Date;

public class Accounts {

    @DocumentId
    private String id;
    private String userId;
    private String account;
    private double initialAmount;
    private double amount;
    @ServerTimestamp
    private Date createdAt;

    public Accounts() {
    }

    public Accounts(String userId, String account, double amount, double initialAmount) {
        this.userId = userId;
        this.account = account;
        this.amount = amount;
        this.initialAmount = initialAmount;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public double getInitialAmount() {
        return initialAmount;
    }

    public void setInitialAmount(double initialAmount) {
        this.initialAmount = initialAmount;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}

