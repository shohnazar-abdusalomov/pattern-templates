package com.pattern.builder.order;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

/**
 * 2-HOLAT: E-Commerce Buyurtma (Order) Builder va Director.
 * 
 * Ushbu sinf murakkab biznes obyekti:
 * - Mahsulotlar ro'yxati (Items)
 * - Chegirmalar (Discounts / Promocode)
 * - Yetkazib berish narxlari (Shipping)
 * - Umumiy yakuniy narx hisob-kitobini o'z ichiga oladi.
 */
public final class Order {

    private final String orderId;
    private final String customerEmail;
    private final String deliveryAddress;
    private final ShippingMethod shippingMethod;
    private final List<OrderItem> items;
    private final double discountPercentage;
    private final String promoCode;
    private final boolean giftWrapped;
    private final String customerNotes;

    // Hisoblangan summalar
    private final double subtotal;
    private final double discountAmount;
    private final double shippingCost;
    private final double grandTotal;

    private Order(Builder builder) {
        this.orderId = builder.orderId;
        this.customerEmail = builder.customerEmail;
        this.deliveryAddress = builder.deliveryAddress;
        this.shippingMethod = builder.shippingMethod;
        this.items = Collections.unmodifiableList(new ArrayList<>(builder.items));
        this.discountPercentage = builder.discountPercentage;
        this.promoCode = builder.promoCode;
        this.giftWrapped = builder.giftWrapped;
        this.customerNotes = builder.customerNotes;

        // Moliyaviy hisob-kitoblar
        double sum = 0.0;
        for (OrderItem item : this.items) {
            sum += item.getTotal();
        }
        this.subtotal = sum;
        this.discountAmount = this.subtotal * (this.discountPercentage / 100.0);
        
        // Agar raqamli bo'lsa yoki summa 100$ dan oshsa standart bepul yetkazib berish
        if (builder.shippingMethod == ShippingMethod.STANDARD_DELIVERY && this.subtotal >= 100.0) {
            this.shippingCost = 0.0;
        } else {
            this.shippingCost = builder.shippingMethod.getBasePrice();
        }

        double wrapCost = this.giftWrapped ? 3.0 : 0.0;
        this.grandTotal = (this.subtotal - this.discountAmount) + this.shippingCost + wrapCost;
    }

    public String getOrderId() { return orderId; }
    public String getCustomerEmail() { return customerEmail; }
    public String getDeliveryAddress() { return deliveryAddress; }
    public ShippingMethod getShippingMethod() { return shippingMethod; }
    public List<OrderItem> getItems() { return items; }
    public double getSubtotal() { return subtotal; }
    public double getDiscountAmount() { return discountAmount; }
    public double getShippingCost() { return shippingCost; }
    public double getGrandTotal() { return grandTotal; }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("================ BUYURTMA KARTI ================\n");
        sb.append("ID: ").append(orderId).append("\n");
        sb.append("Mijoz: ").append(customerEmail).append("\n");
        sb.append("Manzil: ").append(deliveryAddress).append("\n");
        sb.append("Yetkazish: ").append(shippingMethod).append(" (").append(shippingCost).append("$)\n");
        if (giftWrapped) sb.append("Sovg'a o'rami: Ha (+3.0$)\n");
        if (promoCode != null) sb.append("Promokod: ").append(promoCode).append(" (-").append(discountPercentage).append("%)\n");
        sb.append("Mahsulotlar:\n");
        for (OrderItem item : items) {
            sb.append("  * ").append(item).append("\n");
        }
        sb.append("Oraliq summa (Subtotal): ").append(String.format("%.2f", subtotal)).append("$\n");
        sb.append("Chegirma (Discount): -").append(String.format("%.2f", discountAmount)).append("$\n");
        sb.append("Yakuniy to'lov (Grand Total): ").append(String.format("%.2f", grandTotal)).append("$\n");
        sb.append("================================================");
        return sb.toString();
    }

    public static Builder builder(String customerEmail) {
        return new Builder(customerEmail);
    }

    /**
     * Order Builder
     */
    public static class Builder {
        private String orderId = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        private final String customerEmail;
        private String deliveryAddress = "Noma'lum manzil";
        private ShippingMethod shippingMethod = ShippingMethod.STANDARD_DELIVERY;
        private final List<OrderItem> items = new ArrayList<>();
        private double discountPercentage = 0.0;
        private String promoCode = null;
        private boolean giftWrapped = false;
        private String customerNotes = "";

        public Builder(String customerEmail) {
            this.customerEmail = Objects.requireNonNull(customerEmail, "Mijoz emaili ko'rsatilishi shart!");
        }

        public Builder orderId(String orderId) {
            this.orderId = orderId;
            return this;
        }

        public Builder deliveryAddress(String deliveryAddress) {
            this.deliveryAddress = deliveryAddress;
            return this;
        }

        public Builder shippingMethod(ShippingMethod shippingMethod) {
            this.shippingMethod = shippingMethod;
            return this;
        }

        public Builder addItem(OrderItem item) {
            if (item != null) {
                this.items.add(item);
            }
            return this;
        }

        public Builder addItem(String sku, String title, double unitPrice, int quantity) {
            this.items.add(new OrderItem(sku, title, unitPrice, quantity));
            return this;
        }

        public Builder applyPromoCode(String promoCode, double discountPercentage) {
            this.promoCode = promoCode;
            this.discountPercentage = Math.min(100.0, Math.max(0.0, discountPercentage));
            return this;
        }

        public Builder giftWrapped(boolean giftWrapped) {
            this.giftWrapped = giftWrapped;
            return this;
        }

        public Builder customerNotes(String customerNotes) {
            this.customerNotes = customerNotes;
            return this;
        }

        public Order build() {
            if (items.isEmpty()) {
                throw new IllegalStateException("Buyurtmada kamida 1 ta mahsulot bo'lishi shart!");
            }
            if (shippingMethod != ShippingMethod.DIGITAL_DOWNLOAD && (deliveryAddress == null || deliveryAddress.isBlank())) {
                throw new IllegalStateException("Jismoniy yetkazib berish uchun manzil kiritilishi shart!");
            }
            return new Order(this);
        }
    }
}
