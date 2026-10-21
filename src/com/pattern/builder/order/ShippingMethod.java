package com.pattern.builder.order;

/**
 * Yetkazib berish usullari
 */
public enum ShippingMethod {
    STANDARD_DELIVERY(5.0),
    EXPRESS_COURIER(15.0),
    SAME_DAY(25.0),
    DIGITAL_DOWNLOAD(0.0);

    private final double basePrice;

    ShippingMethod(double basePrice) {
        this.basePrice = basePrice;
    }

    public double getBasePrice() {
        return basePrice;
    }
}
