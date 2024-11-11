package com.example.be.core.admin.paymen.service;

import com.example.be.core.admin.paymen.model.request.PaymenRequest;
import com.example.be.core.admin.paymen.model.response.PaymenResponse;
import com.example.be.core.admin.paymen.repository.PaymenExtendRepoditory;
import com.example.be.entity.Order;
import com.example.be.entity.Payment;
import com.example.be.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PaymenService {
    @Autowired
    private PaymenExtendRepoditory paymentRepository;

    @Autowired
    private OrderRepository orderRepository;

    // Tạo thanh toán mới
    public PaymenResponse createPayment(PaymenRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setAmount(request.getAmount());
        payment.setStatus("Pending");
        payment.setNote(request.getNote());
        payment.setCreatedAt(LocalDateTime.now());

        payment = paymentRepository.save(payment);
        return mapToResponse(payment);
    }

    public PaymenResponse mapToResponse(Payment payment) {
        PaymenResponse response = new PaymenResponse();
        response.setId(payment.getId());
        response.setOrderId(payment.getOrder().getId());
        response.setPaymentMethod(payment.getPaymentMethod());
        response.setAmount(payment.getAmount());
        response.setStatus(payment.getStatus());
        response.setNote(payment.getNote());
        response.setCreatedAt(payment.getCreatedAt());
        return response;
    }

    public Payment updatePaymentStatus(Integer paymentId, String status) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        payment.setStatus(status);
        return paymentRepository.save(payment);
    }

    public Payment getPaymentByOrderId(Integer orderId) {
        return paymentRepository.findByOrderId(orderId);
    }
}
