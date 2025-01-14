package com.example.shopapp.service;

import com.example.shopapp.repositorys.OrderDetailRepository;
import com.example.shopapp.repositorys.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StatisticsService {
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;

    public Map<String, Object> getOrderStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", orderRepository.calculateTotalRevenue());
        stats.put("deliveredOrders", orderRepository.countDeliveredOrders());
        stats.put("pendingOrders", orderRepository.countPendingOrders());
        stats.put("cancelledOrders", orderRepository.countCancelledOrders());
        return stats;
    }

    // Thống kê sản phẩm bán chạy (biểu đồ cột)
    public List<Map<String, Object>> getTopSellingProducts() {
        List<Object[]> result = orderDetailRepository.getTopSellingProducts();
        return result.stream().map(obj -> {
            Map<String, Object> map = new HashMap<>();
            map.put("productName", obj[0]);
            map.put("totalSold", obj[1]);
            return map;
        }).toList();
    }
}
