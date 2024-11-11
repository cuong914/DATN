package com.example.be.core.admin.paymen.repository;


import com.example.be.entity.Payment;
import com.example.be.repository.PaymentRepository;


import java.util.List;

public interface PaymenExtendRepoditory extends PaymentRepository {
    Payment findByOrderId(Integer orderId);
}
