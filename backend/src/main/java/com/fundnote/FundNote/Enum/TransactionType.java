package com.fundnote.FundNote.Enum;

import com.fundnote.FundNote.Exception.InvalidTransactionException;

public enum TransactionType {
    INCOME,
    EXPENSE,
    TRANSFER;

    // Method to check if the type is valid with certain fields
    public void validate(double amount, String fromAccountId, String toAccountId, String category) {
        switch (this) {
            case INCOME:
                if (category == null) {
                    throw new InvalidTransactionException("INCOME category must be specified");
                }
//                if (amount <= 0) {
//                    throw new InvalidTransactionException("INCOME must have a positive amount");
//                }
                if (fromAccountId != null) {
                    throw new InvalidTransactionException("INCOME 'from' account must be null");
                }
                if (toAccountId == null) {
                    throw new InvalidTransactionException("INCOME must have a 'to' account specified");
                }
                break;
            case EXPENSE:
                if (category == null) {
                    throw new InvalidTransactionException("EXPENSE category must be specified");
                }
//                if (amount >= 0) {
//                    throw new InvalidTransactionException("EXPENSE must have a negative number");
//                }
                if (fromAccountId == null) {
                    throw new InvalidTransactionException("EXPENSE must have a 'from' account specified");
                }
                if (toAccountId != null) {
                    throw new InvalidTransactionException("EXPENSE 'to' account must be null");
                }
                break;
            case TRANSFER:
//                if (amount <= 0) {
//                    throw new InvalidTransactionException("TRANSFER amount must not be 0 or less");
//                }
                if (fromAccountId == null || toAccountId == null) {
                    throw new InvalidTransactionException("TRANSFER 'from' and 'to' accounts must be specified");
                }
                break;
        }
    }
}
