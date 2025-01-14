package com.example.shopapp.response;

import com.example.shopapp.models.Order;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class OrderBHResponse {
    private Long id;
    private String fullname;
    private String phoneNumber;
    private Double totalMoney;
    private String status;
    private Double amountGiven;
    private Double changeAmount;
    private LocalDateTime orderDate;

    public static OrderBHResponse fromOrder(Order order, Double amountGiven) {
        OrderBHResponse response = new OrderBHResponse();
        response.setId(order.getId());
        response.setFullname(order.getFullName());
        response.setPhoneNumber(order.getPhoneNumber());
        response.setTotalMoney(order.getTotalMoney());
        response.setStatus(order.getStatus());
        response.setOrderDate(order.getOrderDate());

        // Tính toán tiền thừa tại đây
        response.setAmountGiven(amountGiven);
        response.setChangeAmount(amountGiven - order.getTotalMoney());

        return response;
    }
}
