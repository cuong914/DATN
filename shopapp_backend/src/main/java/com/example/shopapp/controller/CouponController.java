package com.example.shopapp.controller;

import com.example.shopapp.response.CouponCalculationResponse;
import com.example.shopapp.response.ResponseObject;
import com.example.shopapp.service.CouponService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${api.prefix}/coupons")
@RequiredArgsConstructor
public class CouponController {
    private final CouponService couponService;

    @GetMapping("/calculate")
    public ResponseEntity<ResponseObject> calculateCouponValue(
            @RequestParam("couponCode") String couponCode,
            @RequestParam("totalAmount") double totalAmount) {
        double finalAmount = couponService.calculateCouponValue(couponCode, totalAmount);

        CouponCalculationResponse couponCalculationResponse = CouponCalculationResponse.builder()
                .result(finalAmount)
                .build();
        return ResponseEntity.ok(new ResponseObject(
                "Calculate coupon successfully",
                HttpStatus.OK,
                couponCalculationResponse
        ));
    }

}
