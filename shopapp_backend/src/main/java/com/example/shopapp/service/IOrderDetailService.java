package com.example.shopapp.service;

import com.example.shopapp.dtos.OrderDetailDTO;
import com.example.shopapp.exception.DaTanotFoundException;
import com.example.shopapp.models.OrderDetail;

import java.util.List;

public interface IOrderDetailService {
    OrderDetail createOrderService(OrderDetailDTO orderDetailDTO) throws Exception;

    OrderDetail getOrderDetail(Long id) throws DaTanotFoundException;

    OrderDetail updateOrderDetail(Long id, OrderDetailDTO newOrderDetailDTO) throws DaTanotFoundException;

    void deleteById(Long id);

    List<OrderDetail> findByOrderId(Long orderId);
}
