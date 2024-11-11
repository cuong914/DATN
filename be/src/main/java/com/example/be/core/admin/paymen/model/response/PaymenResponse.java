package com.example.be.core.admin.paymen.model.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymenResponse {
    private Integer id;
    private Integer orderId;
    private String paymentMethod;
    private Double amount;
    private String status;
    private String note;
    private LocalDateTime createdAt;
}
