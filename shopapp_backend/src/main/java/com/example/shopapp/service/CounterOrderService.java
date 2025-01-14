package com.example.shopapp.service;

import com.example.shopapp.models.Order;
import com.example.shopapp.models.OrderDetail;
import com.example.shopapp.models.Product;
import com.example.shopapp.models.User;
import com.example.shopapp.repositorys.OrderDetailRepository;
import com.example.shopapp.repositorys.OrderRepository;
import com.example.shopapp.repositorys.ProductRepository;
import com.example.shopapp.repositorys.UserRepository;
import com.example.shopapp.request.OrderRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CounterOrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final UserRepository userRepository;

    @Transactional
    public Order createCounterOrder(double totalMoney, List<OrderRequest.OrderItem> items) {
        System.out.println("Bắt đầu tạo hóa đơn tại quầy...");
        System.out.println("Tổng tiền: " + totalMoney);
        System.out.println("Số lượng sản phẩm: " + items.size());

        Order order = new Order();
        User defaultUser = userRepository.findById(10L)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user với ID 10"));
        order.setUser(defaultUser);
        order.setFullName("Khách hàng tại quầy");
        order.setPhoneNumber("Không xác định");
        order.setAddress("Tại quầy");
        order.setTotalMoney(totalMoney);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("delivered");

        Order savedOrder = orderRepository.save(order);
        System.out.println("Hóa đơn đã lưu với ID: " + savedOrder.getId());

        for (OrderRequest.OrderItem item : items) {
            System.out.println("Đang xử lý sản phẩm: " + item.getProductId() + ", Số lượng: " + item.getQuantity());

            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + item.getProductId()));

            if (product.getNumberProduct() < item.getQuantity()) {
                throw new RuntimeException("Không đủ số lượng tồn kho cho sản phẩm: " + product.getName());
            }

            OrderDetail detail = new OrderDetail();
            detail.setOrder(order);
            detail.setProduct(product);
            detail.setNumberOfProducts(item.getQuantity());
            detail.setPrice(item.getPrice());

            orderDetailRepository.save(detail);
            System.out.println("Đã lưu chi tiết hóa đơn cho sản phẩm: " + product.getName());

            // Cập nhật tồn kho
            product.setNumberProduct(product.getNumberProduct() - item.getQuantity());
            productRepository.save(product);
            System.out.println("Đã cập nhật tồn kho cho sản phẩm: " + product.getName() + ", Số lượng mới: " + product.getNumberProduct());
        }
        System.out.println("Hóa đơn và chi tiết sản phẩm đã được lưu thành công.");
        return order;
    }

}
