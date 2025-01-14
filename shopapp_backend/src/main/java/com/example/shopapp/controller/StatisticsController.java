package com.example.shopapp.controller;

import com.example.shopapp.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${api.prefix}/statistics")
@RequiredArgsConstructor
public class StatisticsController {
    private final StatisticsService statisticsService;
    @GetMapping("/orders")
    public ResponseEntity<?> getOrderStatistics() {
        return ResponseEntity.ok(statisticsService.getOrderStatistics());
    }

    @GetMapping("/top-products")
    public ResponseEntity<?> getTopSellingProducts() {
        return ResponseEntity.ok(statisticsService.getTopSellingProducts());
    }
}
