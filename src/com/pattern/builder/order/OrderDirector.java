package com.pattern.builder.order;

import java.util.List;

/**
 * GoF Director: Oldindan sozlangan biznes shablonlari (Presets) bo'yicha
 * buyurtmalarni avtomatlashtirilgan tarzda yig'ib beruvchi sinf.
 */
public class OrderDirector {

    /**
     * VIP mijoz uchun Express yetkazib berish va sovg'a o'rami bilan buyurtma
     */
    public Order createVipExpressOrder(String customerEmail, String address, List<OrderItem> items) {
        Order.Builder builder = Order.builder(customerEmail)
                .deliveryAddress(address)
                .shippingMethod(ShippingMethod.EXPRESS_COURIER)
                .applyPromoCode("VIP_PREMIUM_15", 15.0)
                .giftWrapped(true)
                .customerNotes("VIP mijoz - tezkor yetkazib berilsin!");

        for (OrderItem item : items) {
            builder.addItem(item);
        }

        return builder.build();
    }

    /**
     * Raqamli mahsulot (Software / E-book) xaridi uchun buyurtma
     */
    public Order createDigitalDownloadOrder(String customerEmail, String productCode, String title, double price) {
        return Order.builder(customerEmail)
                .shippingMethod(ShippingMethod.DIGITAL_DOWNLOAD)
                .addItem(productCode, title, price, 1)
                .customerNotes("Elektron pochta orqali litsenziya kaliti yuborilsin")
                .build();
    }

    /**
     * Oddiy standart buyurtma
     */
    public Order createStandardOrder(String customerEmail, String address, List<OrderItem> items) {
        Order.Builder builder = Order.builder(customerEmail)
                .deliveryAddress(address)
                .shippingMethod(ShippingMethod.STANDARD_DELIVERY);

        for (OrderItem item : items) {
            builder.addItem(item);
        }

        return builder.build();
    }
}
