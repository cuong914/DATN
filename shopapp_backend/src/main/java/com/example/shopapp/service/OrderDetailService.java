package com.example.shopapp.service;

import com.example.shopapp.dtos.OrderDTO;
import com.example.shopapp.dtos.OrderDetailDTO;
import com.example.shopapp.exception.DaTanotFoundException;
import com.example.shopapp.models.Order;
import com.example.shopapp.models.OrderDetail;
import com.example.shopapp.models.Product;
import com.example.shopapp.repositorys.OrderDetailRepository;
import com.example.shopapp.repositorys.OrderRepository;
import com.example.shopapp.repositorys.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderDetailService implements IOrderDetailService {
    private final OrderDetailRepository orderDetailRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    @Transactional
    @Override
    public OrderDetail createOrderService(OrderDetailDTO orderDetailDTO) throws Exception {
        Order order = orderRepository.findById(orderDetailDTO.getOrderId())
                .orElseThrow(() -> new DaTanotFoundException("cannot find order wwith id: " + orderDetailDTO.getOrderId()));
        Product product = productRepository.findById(orderDetailDTO.getProductId())
                .orElseThrow(() -> new DaTanotFoundException("cannot find product wwith id: " + orderDetailDTO.getProductId()));
        OrderDetail orderDetail = OrderDetail.builder()
                .order(order)
                .product(product)
                .price(orderDetailDTO.getPrice())
                .numberOfProducts(orderDetailDTO.getNumberOfProduct())
                .totalMoney(orderDetailDTO.getTotalMoney())
                .color(orderDetailDTO.getColor())
                .build();
        // luuw vao csdl
        return orderDetailRepository.save(orderDetail);


    }

//    @Override
//    public OrderDetail createOrderService(OrderDetailDTO orderDetailDTO) throws Exception {
//        // Tìm Order dựa trên orderId
//        Order order = orderRepository.findById(orderDetailDTO.getOrderId())
//                .orElseThrow(() -> new DaTanotFoundException("cannot find order with id: " + orderDetailDTO.getOrderId()));
//
//        // Tìm Product dựa trên productId
//        Product product = productRepository.findById(orderDetailDTO.getProductId())
//                .orElseThrow(() -> new DaTanotFoundException("cannot find product with id: " + orderDetailDTO.getProductId()));
//
//        // Kiểm tra xem số lượng trong product có đủ để giảm không
//        if (product.getNumberProduct() < orderDetailDTO.getNumberOfProduct()) {
//            throw new Exception("Not enough products in stock");
//        }
//
//        // Tạo OrderDetail từ DTO
//        OrderDetail orderDetail = OrderDetail.builder()
//                .order(order)
//                .product(product)
//                .price(orderDetailDTO.getPrice())
//                .numberOfProducts(orderDetailDTO.getNumberOfProduct())
//                .totalMoney(orderDetailDTO.getTotalMoney())
//                .color(orderDetailDTO.getColor())
//                .build();
//
//        // Lưu OrderDetail vào database
//        OrderDetail savedOrderDetail = orderDetailRepository.save(orderDetail);
//
//        // Cập nhật số lượng sản phẩm trong bảng Product
//        int newNumberProduct = product.getNumberProduct() - orderDetailDTO.getNumberOfProduct();
//        product.setNumberProduct(newNumberProduct);
//        productRepository.save(product);
//
//        // Trả về OrderDetail đã lưu
//        return savedOrderDetail;
//    }


    @Override
    public OrderDetail getOrderDetail(Long id) throws DaTanotFoundException {
        return orderDetailRepository.findById(id).orElseThrow(
                () -> new DaTanotFoundException("cannot find ordertail with  id " + id));

    }

    @Override
    public OrderDetail updateOrderDetail(Long id, OrderDetailDTO orderDetailDTO) throws DaTanotFoundException {
        // tìm xem order detail có tồn tại hay  k
        OrderDetail existingOrderDetail = orderDetailRepository.findById(id)
                .orElseThrow(() -> new DaTanotFoundException("cannot fibd orderDetial with id" + id));
        // tìm xem orderid  có thuộc về order nào đó k
        Order existingOrder = orderRepository.findById(orderDetailDTO.getOrderId())
                .orElseThrow(() -> new DaTanotFoundException("cannot find order with id" + orderDetailDTO.getOrderId()));
        Product existingProduct = productRepository.findById(orderDetailDTO.getProductId())
                .orElseThrow(() -> new DaTanotFoundException("cannot find product  with id" + orderDetailDTO.getProductId()));
        existingOrderDetail.setPrice(orderDetailDTO.getPrice());
        existingOrderDetail.setNumberOfProducts(orderDetailDTO.getNumberOfProduct());
        existingOrderDetail.setTotalMoney(orderDetailDTO.getTotalMoney());
        existingOrderDetail.setColor(orderDetailDTO.getColor());
        existingOrderDetail.setOrder(existingOrder); // tránh lấy order của cái này sang order của cái khác      existingOrderDetail.setProduct(existingProduct);

        return orderDetailRepository.save(existingOrderDetail);
    }

    @Override
    public void deleteById(Long id) {
        orderDetailRepository.deleteById(id);
    }

    @Override
    public List<OrderDetail> findByOrderId(Long orderI) {
        return orderDetailRepository.findByOrderId(orderI);
    }
}
