package com.pattern.builder;

import com.pattern.builder.banking.Currency;
import com.pattern.builder.banking.TransferTransaction;
import com.pattern.builder.http.HttpMethod;
import com.pattern.builder.http.HttpRequest;
import com.pattern.builder.order.Order;
import com.pattern.builder.order.OrderDirector;
import com.pattern.builder.order.OrderItem;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

/**
 * ASOSIY ISHGA TUSHIRUVCHI SINF (Main Application).
 * 
 * Bu yerda 3 ta butunlay turli xil real loyiha senariylari
 * va Builder shablonining eng yaxshi amaliyotlari (Best Practices)
 * namoyish etiladi.
 */
public class App {

    public static void main(String[] args) {
        printHeader("1-SENARIY: HTTP So'rov Builder (Effective Java Fluent Builder)");
        demonstrateHttpRequestBuilder();

        printHeader("2-SENARIY: E-Commerce Buyurtma Tizimi (GoF Builder + Director)");
        demonstrateOrderBuilderWithDirector();

        printHeader("3-SENARIY: Bank Pul O'tkazmasi (Type-Safe Step / Staged Builder)");
        demonstrateBankingStepBuilder();

        printHeader("VALIDATSIYA VA XATOLIKLARNING OLDINI OLISH NAMOZISHI");
        demonstrateValidation();
    }

    private static void demonstrateHttpRequestBuilder() {
        // 1. POST so'rovi (Token, Headers, Query params va Body bilan)
        HttpRequest postRequest = HttpRequest.builder("https://api.fintech.uz/v2/payments", HttpMethod.POST)
                .bearerToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIn0")
                .contentTypeJson()
                .queryParam("client_type", "mobile")
                .queryParam("version", "3.4.1")
                .timeoutMillis(8000)
                .body("{\"card_id\": \"8600123456789012\", \"amount\": 250000}")
                .build();

        System.out.println("Tuzilgan POST so'rovi:");
        System.out.println(postRequest);

        // 2. Oddiy GET so'rovi
        HttpRequest getRequest = HttpRequest.get("https://api.fintech.uz/v2/rates")
                .queryParam("base", "USD")
                .timeoutMillis(3000)
                .build();

        System.out.println("\nTuzilgan GET so'rovi:");
        System.out.println(getRequest);
    }

    private static void demonstrateOrderBuilderWithDirector() {
        OrderDirector director = new OrderDirector();

        // 1. VIP Buyurtma (Director retsepti orqali avtomatik yig'iladi)
        List<OrderItem> vipCart = Arrays.asList(
                new OrderItem("MAC-M3-MAX", "MacBook Pro 16 M3 Max", 3499.0, 1),
                new OrderItem("AP-MAX-BLK", "AirPods Max Space Gray", 549.0, 1)
        );

        Order vipOrder = director.createVipExpressOrder(
                "ceo@apple-fan.uz",
                "Toshkent shahri, Amir Temur ko'chasi 15-uy",
                vipCart
        );
        System.out.println(vipOrder);

        // 2. Raqamli mahsulot buyurtmasi (Yetkazib berish manzili talab qilinmaydi)
        Order digitalOrder = director.createDigitalDownloadOrder(
                "developer@it-park.uz",
                "IDEA-ULT-1Y",
                "IntelliJ IDEA Ultimate 1-Year License",
                499.0
        );
        System.out.println("\n" + digitalOrder);
    }

    private static void demonstrateBankingStepBuilder() {
        // Step Builder: Bosqichma-bosqich majburiy qadamlarni kiritmasdan
        // .build() metodini chaqirishning iloji yo'q!
        
        // 1. Oddiy o'tkazma
        TransferTransaction standardTxn = TransferTransaction.start()
                .fromAccount("UZB20208000987654321001")
                .toAccount("UZB20208000123456789002")
                .amount(1_500_000, Currency.UZS)
                .withDescription("Xizmat ko'rsatish shartnomasi bo'yicha to'lov")
                .build();

        System.out.println(standardTxn);

        // 2. Katta miqdordagi xalqaro o'tkazma (OTP bilan)
        TransferTransaction highValueTxn = TransferTransaction.start()
                .fromAccount("USD84000112233445566778")
                .toAccount("USD84000998877665544332")
                .amount(BigDecimal.valueOf(25_000.0), Currency.USD)
                .withDescription("Uskunalar xaridi uchun avans")
                .withOtpConfirmation("849201") // Katta summa bo'lgani uchun majburiy
                .build();

        System.out.println("\n" + highValueTxn);
    }

    private static void demonstrateValidation() {
        // Noto'g'ri URL uchun tekshiruv
        try {
            HttpRequest.get("ftp://invalid-server.com/data").build();
        } catch (IllegalArgumentException e) {
            System.out.println("[Validatsiya muvaffaqiyatli ushlandi]: " + e.getMessage());
        }

        // Bir xil hisoblar o'rtasida o'tkazma qilinishini tekshirish
        try {
            TransferTransaction.start()
                    .fromAccount("ACC-1111")
                    .toAccount("ACC-1111") // O'ziga o'zi o'tkazish
                    .amount(100, Currency.USD)
                    .build();
        } catch (IllegalArgumentException e) {
            System.out.println("[Validatsiya muvaffaqiyatli ushlandi]: " + e.getMessage());
        }

        // Bo'sh buyurtma yaratishga urinish
        try {
            Order.builder("user@mail.com").build();
        } catch (IllegalStateException e) {
            System.out.println("[Validatsiya muvaffaqiyatli ushlandi]: " + e.getMessage());
        }
    }

    private static void printHeader(String title) {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("  " + title);
        System.out.println("=".repeat(60));
    }
}
