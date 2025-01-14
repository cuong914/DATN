package com.example.shopapp.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
@Getter
@Setter
public class OrderRequest {
    private Long userId;
    private String fullname;
    private String phoneNumber;
    private String address;
    private Double totalMoney;   // Tổng tiền đơn hàng
    private Double amountGiven;  // Tiền khách đưa
    private LocalDateTime orderDate;
    private Double change;       // Tiền thừa
    private List<OrderItem> items;
@Getter
@Setter
    public static class OrderItem {
        private Long productId;
        private int quantity;
        private double price;
    }
}

