package com.example.shopapp.controller;

import com.example.shopapp.configuration.VNPayConfig;
import com.example.shopapp.dtos.OrderDTO;
import com.example.shopapp.models.Order;
import com.example.shopapp.response.OrderListResponse;
import com.example.shopapp.response.OrderResponse;
import com.example.shopapp.service.OrderService;
import com.example.shopapp.service.UserService;
import com.example.shopapp.utils.LocallizationUtils;
import com.example.shopapp.utils.MessageKeys;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/orders")
public class OrderController {
    private final OrderService orderService;
    private final UserService userService;
    private final ModelMapper modelMapper;
    private final LocallizationUtils locallizationUtils;

//    @PostMapping("")
//    public ResponseEntity<?> createOrder(
//            @Valid @RequestBody OrderDTO orderDTO,
//            BindingResult result,
//            HttpServletRequest request
//    ) {
//        try {
//            if (result.hasErrors()) {
//                List<String> errorMessages = result.getFieldErrors()
//                        .stream()
//                        .map(fieldError -> fieldError.getDefaultMessage())
//                        .toList();
//                return ResponseEntity.badRequest().body(errorMessages);
//            }
//            Order order = orderService.createOrder(orderDTO);
//            return ResponseEntity.ok(order);
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }

//    @PostMapping("")
//    public ResponseEntity<?> createOrder(
//            @Valid @RequestBody OrderDTO orderDTO,
//            BindingResult result,
//            HttpServletRequest request
//    ) {
//        try {
//            if (result.hasErrors()) {
//                List<String> errorMessages = result.getFieldErrors()
//                        .stream()
//                        .map(fieldError -> fieldError.getDefaultMessage())
//                        .toList();
//                return ResponseEntity.badRequest().body(errorMessages);
//            }
//
//            // Tạo đối tượng Order và lưu trữ nó
//            Order order = orderService.createOrder(orderDTO);
//
//            // Gọi phương thức createOrder để tạo URL thanh toán VNPay
//            String urlReturn = request.getRequestURL().toString(); // URL callback của bạn
//            String vnpayUrl = orderService.createVNOrder(order, urlReturn);
//
//            // Trả về URL thanh toán VNPay cho phía frontend
//            return ResponseEntity.ok(Map.of("paymentUrl", vnpayUrl));
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }


    @PostMapping("")
    public ResponseEntity<?> createOrder(
            @Valid @RequestBody OrderDTO orderDTO,
            BindingResult result,
            HttpServletRequest request
    ) {
        try {
            if (result.hasErrors()) {
                List<String> errorMessages = result.getFieldErrors()
                        .stream()
                        .map(fieldError -> fieldError.getDefaultMessage())
                        .toList();
                return ResponseEntity.badRequest().body(errorMessages);
            }

            // Tạo đối tượng Order và lưu trữ nó
            Order order = orderService.createOrder(orderDTO);

            // Kiểm tra nếu payment_method là 'thanh toán khác' thì mới thực hiện tạo URL VNPay
            if ("other".equals(orderDTO.getPaymentMethod())) {
                // Gọi phương thức createOrder để tạo URL thanh toán VNPay
                String urlReturn = request.getRequestURL().toString(); // URL callback của bạn
                String vnpayUrl = orderService.createVNOrder(order, urlReturn);

                // Trả về URL thanh toán VNPay cho phía frontend
                return ResponseEntity.ok(Map.of("paymentUrl", vnpayUrl));
            }

            // Trường hợp không phải 'thanh toán khác'
            return ResponseEntity.ok(Map.of("message", "Không cần tạo URL thanh toán VNPay cho phương thức thanh toán này."));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }



    //    @PreAuthorize("hasRole('ROLE_USER')")
    @CrossOrigin(origins = "http://localhost:4200")
    @GetMapping("/vnpay-payment")
    public ResponseEntity< Map<String,String>>getVnpayPaymentData(HttpServletRequest request) {

        int paymentStatus = orderService.orderReturn(request);

        // Lấy thông tin từ request
        String orderInfo = request.getParameter("vnp_OrderInfo");
        String paymentTime = request.getParameter("vnp_PayDate");
        String transactionId = request.getParameter("vnp_TransactionNo");
        String totalPrice = request.getParameter("vnp_Amount");

        // Tạo response
        Map<String, String> response = new HashMap<>();
        response.put("orderId", orderInfo);
        response.put("totalPrice", totalPrice);
        response.put("paymentTime", paymentTime);
        response.put("transactionId", transactionId);
        response.put("status", paymentStatus == 1 ? "success" : "fail");

        // Kiểm tra nếu status là "success" thì cập nhật tracking_number
        if ("success".equals(response.get("status"))) {
            // Không cần chuyển đổi orderInfo, trực tiếp sử dụng orderInfo làm orderId
            orderService.updateTrackingNumber(Long.parseLong(orderInfo), "1");
        }else{
            orderService.updateTrackingNumber(Long.parseLong(orderInfo), "0");
        }

        // Trả về response
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{user_id}")// theem biến đường dẫn user_id
//http://localhost:8080/api/v1/order/user/4
    public ResponseEntity<?> getOrders(@Valid @PathVariable("user_id") Long userId) {
        try {
            List<Order> orders = orderService.findByUserId(userId);
            return ResponseEntity.ok(orders);//" lay ra danh sach order tu user_id"
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")// lây ra 1 user
//http://localhost:8080/api/v1/order/4
    public ResponseEntity<?> getOrder(@Valid @PathVariable("id") Long orderId) {
        try {
            // từ order id lấy ra chi tiết 1 order
            Order existingOrder = orderService.getOrder(orderId);
            OrderResponse orderResponse = OrderResponse.fromOrder(existingOrder);
            return ResponseEntity.ok(orderResponse);//" lay ra chi tiết  order tu order_id"
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrder(
            @Valid @PathVariable long id,
            @Valid @RequestBody OrderDTO orderDTO
    ) {
        // phần order thường cập nhật trạng thái hoặc tổng tiền , địa chỉ (chủ yếu , do admin làm)
        try {
            Order order = orderService.updateOrder(id, orderDTO);
            return ResponseEntity.ok(order);//"cập nhât thông tin 1 order thành công"
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> DeleteOrder(
            @Valid @PathVariable long id
    ) {

        // thường là xóa mềm ( là cập nhật trường active = false) đề về sau khi muốn xem lại đơn hàng cũ
        //xóa mềm => cập nhật trường active = false
        orderService.deleteOrder(id);
        String result = locallizationUtils.getLocallizeMessage(
                MessageKeys.DELETE_ORDER_SUCCESSFULLY, id);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/get-orders-by-keyword")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<OrderListResponse> getOrdersByKeyword(
            @RequestParam(defaultValue = "", required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit
    ) {
        // Tạo Pageable từ thông tin trang và giới hạn
        PageRequest pageRequest = PageRequest.of(
                page, limit,
                //Sort.by("createdAt").descending()
                Sort.by("id").ascending()
        );
        Page<OrderResponse> orderPage = orderService
                .getOrdersByKeyword(keyword, pageRequest)
                .map(OrderResponse::fromOrder);
        // Lấy tổng số trang
        int totalPages = orderPage.getTotalPages();
        List<OrderResponse> orderResponses = orderPage.getContent();
        return ResponseEntity.ok(OrderListResponse
                .builder()
                .orders(orderResponses)
                .totalPages(totalPages)
                .build());
    }
}
