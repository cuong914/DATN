package com.example.shopapp.service;

import com.example.shopapp.configuration.VNPayConfig;
import com.example.shopapp.dtos.CartItemDTO;
import com.example.shopapp.dtos.OrderDTO;
import com.example.shopapp.exception.DaTanotFoundException;
import com.example.shopapp.models.Coupon;
import com.example.shopapp.models.Order;
import com.example.shopapp.models.OrderDetail;
import com.example.shopapp.models.OrderStatus;
import com.example.shopapp.models.Product;
import com.example.shopapp.models.User;
import com.example.shopapp.repositorys.CouponConditionRePo;
import com.example.shopapp.repositorys.CuponReponsitory;
import com.example.shopapp.repositorys.OrderDetailRepository;
import com.example.shopapp.repositorys.OrderRepository;
import com.example.shopapp.repositorys.ProductRepository;
import com.example.shopapp.repositorys.UserRepository;
import com.example.shopapp.request.OrderRequest;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TimeZone;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService implements IOrderService {
    @Autowired
    private CuponReponsitory cuponReponsitory;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private ProductRepository productRepository;
//    @Override
//    @Transactional
//    public Order createOrder(OrderDTO orderDTO) throws Exception {
//        // tim xem userId co ton taij  chưa để đặt hàng
//        User user = userRepository.findById(orderDTO.getUserId())
//                .orElseThrow(() -> new DaTanotFoundException("cannot find user wtih id " + orderDTO.getUserId()));
//        // conver orderDTO => Order
//        // sd thu vien Model Mapper
//        // tao 1 luong anh xa rieng de kiem soat viec anh xa
//        modelMapper.typeMap(OrderDTO.class, Order.class)// ánh xạ từ thàng orderDTO sang order
//                .addMappings(mapper -> mapper.skip(Order::setId));// bỏ qua trường id
//        // cập nhật các trường cua đơn hàng từ orderDTO
//        Order order = new Order();
//        modelMapper.map(orderDTO, order);// cập nhật từ orderDTO sang order
//        order.setUser(user);
//        order.setOrderDate(LocalDate.now());//lấy thời điểm hiện tại
//        order.setStatus(OrderStatus.PENDING);// mặc định đơn hàng tạo ra là ở trạng thái pending
//        order.setPayment_Method("false");
//        // kieemr tra shipping date phai > ngay hom nay
//        LocalDate shippingDate = orderDTO.getShippingDate() == null ? LocalDate.now() : orderDTO.getShippingDate();// nếu shippingdate null thì lấy ngày hiện tại khác null thì lấy giá trị của shippingdate
//        if (shippingDate.isBefore(LocalDate.now())) {
//            throw new DaTanotFoundException("date must be at least today ");
//        }
//        order.setShippingDate(shippingDate);
//        order.setActive(true);// nếu giá trị đơn hành active = false thì tức là xóa mềm đơn hàng         orderRepository.save(order);
//        orderRepository.save(order);
//
//        // Tạo danh sách các đối tượng OrderDetail từ cartItems
//        List<OrderDetail> orderDetails = new ArrayList<>();
//        for (CartItemDTO cartItemDTO : orderDTO.getCartItems()) {
//            // Tạo một đối tượng OrderDetail từ CartItemDTO
//            OrderDetail orderDetail = new OrderDetail();
//            orderDetail.setOrder(order);
//
//            // Lấy thông tin sản phẩm từ cartItemDTO
//            Long productId = cartItemDTO.getProductId();
//            int quantity = cartItemDTO.getQuantity();
//
//            // Tìm thông tin sản phẩm từ cơ sở dữ liệu (hoặc sử dụng cache nếu cần)
//            Product product = productRepository.findById(productId)
//                    .orElseThrow(() -> new DaTanotFoundException("Product not found with id: " + productId));
//
//            // Đặt thông tin cho OrderDetail
//            orderDetail.setProduct(product);
//            orderDetail.setNumberOfProducts(quantity);
//            // Các trường khác của OrderDetail nếu cần
//            orderDetail.setPrice(product.getPrice());
//
//            // Thêm OrderDetail vào danh sách
//            orderDetails.add(orderDetail);
//        }
//
//
//        // Lưu danh sách OrderDetail vào cơ sở dữ liệu
//        orderDetailRepository.saveAll(orderDetails);
//
//        return order;// sd modelmapper để ánh xạ tù order sang orderResponse  áp dụng trong khi có nhiều trường và nh trường giống nhau
//    }

    @Override
    @Transactional
    public Order createOrder(OrderDTO orderDTO) throws Exception {
        // Kiểm tra xem User có tồn tại để đặt hàng không
        User user = userRepository.findById(orderDTO.getUserId())
                .orElseThrow(() -> new DaTanotFoundException("Cannot find user with id " + orderDTO.getUserId()));

        // Chuyển đổi OrderDTO thành Order
        modelMapper.typeMap(OrderDTO.class, Order.class)
                .addMappings(mapper -> mapper.skip(Order::setId));

        Order order = modelMapper.map(orderDTO, Order.class);
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);
        order.setPayment_Method(orderDTO.getPaymentMethod());

        // Kiểm tra ngày giao hàng phải lớn hơn hoặc bằng ngày hiện tại
        LocalDate shippingDate = Optional.ofNullable(orderDTO.getShippingDate()).orElse(LocalDate.now());
        if (shippingDate.isBefore(LocalDate.now())) {
            throw new DaTanotFoundException("Shipping date must be at least today.");
        }
        order.setShippingDate(shippingDate);
        order.setActive(true);

        // Tạo danh sách các OrderDetail từ CartItemDTO
        List<OrderDetail> orderDetails = orderDTO.getCartItems().stream().map(cartItemDTO -> {
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrder(order);

            // Lấy thông tin sản phẩm và cập nhật vào OrderDetail
            Product product = null;
            try {
                product = productRepository.findById(cartItemDTO.getProductId())
                        .orElseThrow(() -> new DaTanotFoundException("Product not found with id: " + cartItemDTO.getProductId()));

                // Kiểm tra số lượng sản phẩm có đủ không
                if (product.getNumberProduct() < cartItemDTO.getQuantity()) {
                    throw new DaTanotFoundException("Not enough quantity for product with id: " + cartItemDTO.getProductId());
                }

                // Trừ số lượng sản phẩm
                product.setNumberProduct(product.getNumberProduct() - cartItemDTO.getQuantity());
                productRepository.save(product);

            } catch (DaTanotFoundException e) {
                // Log lỗi hoặc xử lý ngoại lệ
                e.printStackTrace();
                throw new RuntimeException("Failed to process product with id: " + cartItemDTO.getProductId(), e);
            }

            orderDetail.setProduct(product);
            orderDetail.setNumberOfProducts(cartItemDTO.getQuantity());
            orderDetail.setPrice(product.getPrice());

            return orderDetail;
        }).collect(Collectors.toList());

        orderDetailRepository.saveAll(orderDetails);

        String couponCode = orderDTO.getCouponCode();
        if (!couponCode.isEmpty()) {
            Coupon coupon = cuponReponsitory.findByCode(couponCode)
                    .orElseThrow(() -> new IllegalArgumentException("Coupon not found"));

            if (!coupon.isActive()) {
                throw new IllegalArgumentException("Coupon is not active");
            }

            order.setCoupon(coupon);
        } else {
            order.setCoupon(null);
        }

        // Tính tổng tiền đơn hàng
        double totalMoney = orderDetails.stream()
                .mapToDouble(detail -> detail.getPrice() * detail.getNumberOfProducts())
                .sum();
        order.setTotalMoney(totalMoney);

        orderRepository.save(order);

        return order;
    }



    @Override
    public Order getOrder(Long id) {
    Order orders = orderRepository.findById(id).orElse(null);
        return orders ;// nếu k tìm thấy thì trả về null
    }

    @Override
    @Transactional
    public Order updateOrder(Long id, OrderDTO orderDTO) throws DaTanotFoundException {
        Order order = orderRepository.findById(id).orElseThrow(() -> // chekc xem có tồn tại k
                new DaTanotFoundException("cannot find order with id " + id));
        User existingUser = userRepository.findById(orderDTO.getUserId()).orElseThrow(() ->// chekc xem có tồn tại k
                new DaTanotFoundException("cannot find user with id " + id));
        // tạo 1 luồng ánh xạ riêng để kiểm soát việc ánh xạ
        modelMapper.typeMap(OrderDTO.class, Order.class)
                .addMappings(mapper -> mapper.skip(Order::setId));
        // cập nhật các trường của đơn hàng tư orderDTO

        modelMapper.map(orderDTO, order);
        order.setUser(existingUser);
        return orderRepository.save(order);

    }

    @Override
    @Transactional // để bỏa toàn dữ liệu
    public void deleteOrder(Long id) {
        Order order = orderRepository.findById(id).orElse(null);
        // k xoa cung hãy xoas mềm
        if (order != null) {
            order.setActive(false);
            orderRepository.save(order);
        }
    }

    @Override
    public List<Order> findByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    public Page<Order> getOrdersByKeyword(String keyword, Pageable pageable) {
        Page<Order> orders = orderRepository.findByKeyword(keyword, pageable);
        return orders;
    }


    public static String createVNOrder(Order orders, String urlReturn) {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
//      Id Transaction
        String vnp_TxnRef = VNPayConfig.getRandomNumber(8);
        String vnp_IpAddr = "127.0.0.1";
        String vnp_TmnCode = VNPayConfig.vnp_TmnCode;
        String orderType = "order-type";


//        Put data in VNP
        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
//       Type PayVN
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
//       Value Amount
        vnp_Params.put("vnp_Amount", String.valueOf(orders.getTotalMoney()*100));
        vnp_Params.put("vnp_CurrCode", "VND");

        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        // customer information
        vnp_Params.put("vnp_OrderInfo", String.valueOf(orders.getId()));
//                + " " +orders.getFullName() + " " + orders.getAddress()

        vnp_Params.put("vnp_OrderType", orderType);

        String locate = "vn";
        vnp_Params.put("vnp_Locale", locate);
//---------------------------------------
        urlReturn += VNPayConfig.vnp_Returnurl;
        vnp_Params.put("vnp_ReturnUrl", urlReturn);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
//----------------------------------------


        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List fieldNames = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                //Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                try {
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    //Build query
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = VNPayConfig.hmacSHA512(VNPayConfig.vnp_HashSecret, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = VNPayConfig.vnp_PayUrl + "?" + queryUrl;

        return paymentUrl;
    }

    public int orderReturn(HttpServletRequest request) {


        Map fields = new HashMap();
        for (Enumeration params = request.getParameterNames(); params.hasMoreElements(); ) {
            String fieldName = null;
            String fieldValue = null;
            try {
                fieldName = URLEncoder.encode((String) params.nextElement(), StandardCharsets.US_ASCII.toString());
                fieldValue = URLEncoder.encode(request.getParameter(fieldName), StandardCharsets.US_ASCII.toString());
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                fields.put(fieldName, fieldValue);
            }
        }

        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
        if (fields.containsKey("vnp_SecureHashType")) {
            fields.remove("vnp_SecureHashType");
        }
        if (fields.containsKey("vnp_SecureHash")) {
            fields.remove("vnp_SecureHash");
        }
        String signValue = VNPayConfig.hashAllFields(fields);
//        if (signValue.equals(vnp_SecureHash)) {
//            if ("00".equals(request.getParameter("vnp_TransactionStatus"))) {
//                // Thanh toán thành công
//                // Chuyển hướng người dùng tới trang thanh toán thành công ở frontend
//                try {
//                    response.sendRedirect("http://localhost:4200/orders/vnpay-payment?status=success");
//                } catch (IOException e) {
//                    e.printStackTrace();
//                }
//                return 1; // Thanh toán thành công
//            } else {
//                // Thanh toán thất bại
//                try {
//                    response.sendRedirect("http://localhost:4200/orders/vnpay-payment?status=fail");
//                } catch (IOException e) {
//                    e.printStackTrace();
//                }
//                return 0; // Thanh toán thất bại
//            }
//        } else {
//            return -1; // Sai chữ ký
//        }
        if (signValue.equals(vnp_SecureHash)) {
            if ("00".equals(request.getParameter("vnp_TransactionStatus"))) {
                return 1;
            } else {
                return 0;
            }
        } else {
            return -1;
        }
    }


    public void updateTrackingNumber(Long orderInfo, String trackingNumber) {
        Optional<Order> optionalOrder = orderRepository.findById(orderInfo);
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            order.setTrackingNumber(trackingNumber);  // Cập nhật tracking_number
            orderRepository.save(order);  // Lưu thay đổi vào cơ sở dữ liệu
        } else {
            throw new IllegalArgumentException("Order not found with ID: " + orderInfo);
        }
    }

}
