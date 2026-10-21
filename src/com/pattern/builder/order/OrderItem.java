package com.pattern.builder.order;

/**
 * Buyurtmadagi alohida mahsulot (Item)
 */
public class OrderItem {
    private final String sku;
    private final String title;
    private final double unitPrice;
    private final int quantity;

    public OrderItem(String sku, String title, double unitPrice, int quantity) {
        if (unitPrice < 0) throw new IllegalArgumentException("Mahsulot narxi manfiy bo'lishi mumkin emas!");
        if (quantity <= 0) throw new IllegalArgumentException("Miqdor 1 yoki undan ko'p bo'lishi kerak!");
        this.sku = sku;
        this.title = title;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
    }

    public String getSku() { return sku; }
    public String getTitle() { return title; }
    public double getUnitPrice() { return unitPrice; }
    public int getQuantity() { return quantity; }
    public double getTotal() { return unitPrice * quantity; }

    @Override
    public String toString() {
        return title + " (" + sku + ") x" + quantity + " @ " + unitPrice + "$ = " + getTotal() + "$";
    }
}
