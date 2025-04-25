package com.fundnote.FundNote.Entity;

import com.google.cloud.firestore.annotation.DocumentId;
import com.google.cloud.firestore.annotation.ServerTimestamp;
import java.util.Date; // Using Lombok for brevity

public class Budget {

    @DocumentId
    private String id;
    private String userId;
    private String category;
    private double limit;
    private String timeFrame;
    private double spent;
    @ServerTimestamp
    private Date createdAt;

    public Budget() {
    }

    public Budget(String userId, String category, double limit, String timeFrame, double spent) {
        this.userId = userId;
        this.category = category;
        this.limit = limit;
        this.timeFrame = timeFrame;
        this.spent = spent;
    }

    public String getId() {
        return id;
    }

    public Budget setId(String id) {
        this.id = id;
        return null;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public double getLimit() {
        return limit;
    }

    public void setLimit(double limit) {
        this.limit = limit;
    }

    public String getTimeFrame() {
        return timeFrame;
    }

    public void setTimeFrame(String timeFrame) {
        this.timeFrame = timeFrame;
    }

    public double getSpent() {
        return spent;
    }

    public void setSpent(double spent) {
        this.spent = spent;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}