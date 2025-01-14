package com.example.shopapp.service;

import com.example.shopapp.models.Order;
import com.example.shopapp.request.OrderRequest;

import java.util.List;

public interface ICounterOrderService {
    Order createCounterOrder(double totalMoney, List<OrderRequest.OrderItem> items);
}
