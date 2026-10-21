package com.pattern.builder.banking;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Objects;
import java.util.UUID;

/**
 * 3-HOLAT: Bank Pul O'tkazmasi (Financial Transaction) - Step / Staged Builder.
 * 
 * Ushbu shablon Compile-time Type-Safety xususiyatiga ega:
 * Dasturchi bosqichma-bosqich:
 * 1. FromAccount (Kimdan)
 * 2. ToAccount (Kimga)
 * 3. Amount & Currency (Qancha va qaysi valyutada)
 * kiritmaguncha IDE .build() metodini ko'rsatmaydi!
 * 
 * Natijada to'liq bo'lmagan yoki xato tranzaksiyani yaratishning iloji yo'q.
 */
public final class TransferTransaction {

    private final String transactionId;
    private final String fromAccount;
    private final String toAccount;
    private final BigDecimal amount;
    private final Currency currency;
    private final BigDecimal commissionFee;
    private final String description;
    private final String otpCode;
    private final LocalDateTime createdAt;

    private TransferTransaction(Builder builder) {
        this.transactionId = "TXN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
        this.fromAccount = builder.fromAccount;
        this.toAccount = builder.toAccount;
        this.amount = builder.amount;
        this.currency = builder.currency;
        this.commissionFee = calculateCommission(builder.amount, builder.currency);
        this.description = builder.description;
        this.otpCode = builder.otpCode;
        this.createdAt = LocalDateTime.now();
    }

    private BigDecimal calculateCommission(BigDecimal amount, Currency currency) {
        // Misol uchun 0.5% komissiya
        return amount.multiply(BigDecimal.valueOf(0.005));
    }

    public String getTransactionId() { return transactionId; }
    public String getFromAccount() { return fromAccount; }
    public String getToAccount() { return toAccount; }
    public BigDecimal getAmount() { return amount; }
    public Currency getCurrency() { return currency; }
    public BigDecimal getCommissionFee() { return commissionFee; }
    public String getDescription() { return description; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    @Override
    public String toString() {
        return "Bank Tranzaksiyasi {\n" +
                "  Tranzaksiya ID: " + transactionId + "\n" +
                "  Yuboruvchi: " + fromAccount + "\n" +
                "  Qabul qiluvchi: " + toAccount + "\n" +
                "  Summa: " + amount + " " + currency + "\n" +
                "  Komissiya (0.5%): " + commissionFee + " " + currency + "\n" +
                "  Jami yechiladigan: " + amount.add(commissionFee) + " " + currency + "\n" +
                "  Izoh: " + (description == null ? "(ko'rsatilmagan)" : description) + "\n" +
                "  OTP Tasdiq: " + (otpCode != null ? "Tasdiqlangan (" + otpCode + ")" : "Kerak emas") + "\n" +
                "  Vaqt: " + createdAt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) + "\n" +
                "}";
    }

    // Builder zanjirini boshlovchi yagona statik kirish nuqtasi
    public static FromStep start() {
        return new Builder();
    }

    // 1-QADAM: Kimdan o'tkazilyapti
    public interface FromStep {
        ToStep fromAccount(String fromAccount);
    }

    // 2-QADAM: Kimga o'tkazilyapti
    public interface ToStep {
        AmountStep toAccount(String toAccount);
    }

    // 3-QADAM: Summa va valyuta
    public interface AmountStep {
        OptionalStep amount(BigDecimal amount, Currency currency);
        
        default OptionalStep amount(double amount, Currency currency) {
            return amount(BigDecimal.valueOf(amount), currency);
        }
    }

    // 4-QADAM: Ixtiyoriy parametrlar va build()
    public interface OptionalStep {
        OptionalStep withDescription(String description);
        OptionalStep withOtpConfirmation(String otpCode);
        TransferTransaction build();
    }

    /**
     * Barcha qadam interfeyslarini amalga oshiruvchi yopiq (private) Builder
     */
    private static class Builder implements FromStep, ToStep, AmountStep, OptionalStep {
        private String fromAccount;
        private String toAccount;
        private BigDecimal amount;
        private Currency currency;
        private String description;
        private String otpCode;

        @Override
        public ToStep fromAccount(String fromAccount) {
            this.fromAccount = Objects.requireNonNull(fromAccount, "Jo'natuvchi hisob raqami kiritilishi shart!");
            return this;
        }

        @Override
        public AmountStep toAccount(String toAccount) {
            this.toAccount = Objects.requireNonNull(toAccount, "Qabul qiluvchi hisob raqami kiritilishi shart!");
            if (this.toAccount.equals(this.fromAccount)) {
                throw new IllegalArgumentException("O'z hisobingizga o'tkazma uchun boshqa usuldan foydalaning!");
            }
            return this;
        }

        @Override
        public OptionalStep amount(BigDecimal amount, Currency currency) {
            Objects.requireNonNull(amount, "O'tkazma summasi kiritilishi shart!");
            Objects.requireNonNull(currency, "Valyuta kiritilishi shart!");
            if (amount.compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("O'tkazma summasi 0 dan katta bo'lishi kerak: " + amount);
            }
            this.amount = amount;
            this.currency = currency;
            return this;
        }

        @Override
        public OptionalStep withDescription(String description) {
            this.description = description;
            return this;
        }

        @Override
        public OptionalStep withOtpConfirmation(String otpCode) {
            this.otpCode = otpCode;
            return this;
        }

        @Override
        public TransferTransaction build() {
            // Agar summa katta bo'lsa (masalan 10,000 USD dan oshsa) OTP talab qilinadi
            if (currency == Currency.USD && amount.compareTo(BigDecimal.valueOf(10_000)) >= 0 && otpCode == null) {
                throw new IllegalStateException("10,000 USD dan yuqori tranzaksiyalar uchun OTP tasdiqlash kodi talab qilinadi!");
            }
            return new TransferTransaction(this);
        }
    }
}
