package com.example.be.core.admin.paymen.controller;


import com.example.be.core.admin.paymen.model.request.PaymenRequest;
import com.example.be.core.admin.paymen.model.response.PaymenResponse;
import com.example.be.core.admin.paymen.repository.PaymenExtendRepoditory;
import com.example.be.core.admin.paymen.service.PaymenService;
import com.example.be.entity.Payment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@CrossOrigin(origins = "http://localhost:8000")
@RestController
@RequestMapping("api/payment")
public class PaymenController {
    @Autowired
    private PaymenService paymentService;
    @Autowired
    private PaymenExtendRepoditory paymenExtendRepoditory;

    // Tạo thanh toán mới
    @PostMapping
    public PaymenResponse createPayment(@RequestBody PaymenRequest request) {
        return paymentService.createPayment(request);
    }

    // Cập nhật trạng thái thanh toán
    @PutMapping("/{paymentId}/status")
    public PaymenResponse updatePaymentStatus(
            @PathVariable Integer paymentId,
            @RequestParam String status) {
        Payment updatedPayment = paymentService.updatePaymentStatus(paymentId, status);
        return paymentService.mapToResponse(updatedPayment);
    }

    // Lấy thông tin thanh toán theo orderId
    @GetMapping("/order/{orderId}")
    public PaymenResponse getPaymentByOrderId(@PathVariable Integer orderId) {
        Payment payment = paymentService.getPaymentByOrderId(orderId);
        return paymentService.mapToResponse(payment);
    }
}
