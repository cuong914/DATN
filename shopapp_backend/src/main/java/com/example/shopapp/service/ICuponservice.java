package com.example.shopapp.service;

public interface ICuponservice {
    double calculateCouponValue(String couponCode, double totalAmount);
}
