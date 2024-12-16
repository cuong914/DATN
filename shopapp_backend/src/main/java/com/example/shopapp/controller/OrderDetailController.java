package com.example.shopapp.controller;

import com.example.shopapp.dtos.OrderDetailDTO;
import com.example.shopapp.exception.DaTanotFoundException;
import com.example.shopapp.models.OrderDetail;
import com.example.shopapp.repositorys.OrderDetailRepository;
import com.example.shopapp.response.OrderDetailResponse;
import com.example.shopapp.service.OrderDetailService;
import com.example.shopapp.utils.LocallizationUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/order_details")
@RequiredArgsConstructor
public class OrderDetailController {
    private final OrderDetailService orderDetailService;
    private final LocallizationUtils locallizationUtils;
    // thêm mới order_detail
    @PostMapping
    public ResponseEntity<?> createOrderDetail(@Valid @RequestBody OrderDetailDTO orderDetailDTO) {
        try {
            OrderDetail newOrderDetail = orderDetailService.createOrderService(orderDetailDTO);
            return ResponseEntity.ok(OrderDetailResponse.fromOrderDetail(newOrderDetail));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderDetail(@Valid @PathVariable("id") Long id) throws DaTanotFoundException {
        OrderDetail orderDetail = orderDetailService.getOrderDetail(id);// trả về chi tiết
        return ResponseEntity.ok(OrderDetailResponse.fromOrderDetail(orderDetail));// trả về các trường mong muốn
        //return ResponseEntity.ok(orderDetail);// lấy ra orderdetail với id nào đó chi tiết
    }

    // lấy ra danh sách các order detajl của order nào đó
    @GetMapping("/order/{orderId}")
    public ResponseEntity<?> getorderDetails(@Valid @PathVariable("orderId") Long orderId) {
        List<OrderDetail> orderDetails = orderDetailService.findByOrderId(orderId);
        List<OrderDetailResponse> orderDetailResponses = orderDetails.stream()// ãnh xạ để hiện thị trường dl trong orderDetailResponse
                .map(OrderDetailResponse::fromOrderDetail)// thay biểu thưucs lamda bằng reference
                .toList();
        return ResponseEntity.ok(orderDetailResponses); //" getorderDetail with orderId" + orderId
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrderDetail(
            @Valid @PathVariable("id") Long id,
            @RequestBody OrderDetailDTO orderDetailDTO) {
        try {
            OrderDetail orderDetail = orderDetailService.updateOrderDetail(id, orderDetailDTO);
            return ResponseEntity.ok(orderDetail); //"updateorderDetail with id " + id + " new orderDeorderDetailDAta" + orderDetailDTO
        } catch (DaTanotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrderDetail(@Valid @PathVariable("id") Long id) {
        orderDetailService.deleteById(id);
        return ResponseEntity.ok("delete OrderDetail with id susscessfully" + id);

    }
}
