package com.example.shopapp.service;

import com.example.shopapp.repositorys.OrderDetailRepository;
import com.example.shopapp.repositorys.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class StatisticsService {
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;

    public Map<String, Object> getAllOrderStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", orderRepository.calculateTotalRevenue1());
        stats.put("deliveredOrders", orderRepository.countDeliveredOrders1());
        stats.put("pendingOrders", orderRepository.countPendingOrders1());
        stats.put("cancelledOrders", orderRepository.countCancelledOrders1());
        return stats;
    }

    public Map<String, Object> getOrderStatistics(LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", orderRepository.calculateTotalRevenue(startDate, endDate));
        stats.put("deliveredOrders", orderRepository.countDeliveredOrders(startDate, endDate));
        stats.put("pendingOrders", orderRepository.countPendingOrders(startDate, endDate));
        stats.put("cancelledOrders", orderRepository.countCancelledOrders(startDate, endDate));

        // Lấy dữ liệu top sản phẩm bán chạy trong khoảng thời gian
        List<Object[]> topProducts = orderDetailRepository.getTopSellingProductsByDate(startDate, endDate);
        List<Map<String, Object>> topProductsList = topProducts.stream().map(obj -> {
            Map<String, Object> map = new HashMap<>();
            map.put("productName", obj[0]);
            map.put("totalSold", obj[1]);
            return map;
        }).toList();
        stats.put("topProductsData", topProductsList);

        return stats;
    }

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
