package com.example.be.core.admin.paymen.model.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymenRequest {
    private Integer orderId;
    private String paymentMethod;
    private Double amount;
    private String note;
}
