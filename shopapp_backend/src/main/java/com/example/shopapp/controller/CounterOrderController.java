package com.example.shopapp.controller;

import com.example.shopapp.models.Order;
import com.example.shopapp.request.OrderRequest;
import com.example.shopapp.service.CounterOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@RestController
@RequestMapping("${api.prefix}/counter-orders")
@RequiredArgsConstructor
public class CounterOrderController {
    private final CounterOrderService counterOrderService;

    @PostMapping("/create")
    @CrossOrigin
    public ResponseEntity<?> createCounterOrder(@RequestBody OrderRequest request) {
        try {
            // Nếu không truyền ngày đặt thì gán ngày hiện tại
            if (request.getOrderDate() == null) {
                request.setOrderDate(LocalDateTime.now());
            }

            Order order = counterOrderService.createCounterOrder(request.getTotalMoney(), request.getItems());
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi tạo hóa đơn tại quầy: " + e.getMessage());
        }
    }
}
