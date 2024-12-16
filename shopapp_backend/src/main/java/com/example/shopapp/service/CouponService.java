package com.example.shopapp.service;

import com.example.shopapp.models.Coupon;
import com.example.shopapp.models.CouponCondition;
import com.example.shopapp.repositorys.CouponConditionRePo;
import com.example.shopapp.repositorys.CuponReponsitory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CouponService implements ICuponservice {
    private final CuponReponsitory couponRepository;
    private final CouponConditionRePo couponConditionRepository;

    @Override
    public double calculateCouponValue(String couponCode, double totalAmount) {


        Coupon coupon = couponRepository.findByCode(couponCode)
                .orElseThrow(() -> new IllegalArgumentException("Coupon not found"));
        if (!coupon.isActive()) {
            throw new IllegalArgumentException("Coupon is not active");
        }

        // Kiểm tra số lượng còn lại của coupon
        if (coupon.getQuantity() <= 0) {
            throw new IllegalArgumentException("Coupon has been fully used");
        }

        double discount = calculateDiscount(coupon, totalAmount);
        double finalAmount = totalAmount - discount;

        // Giảm số lượng coupon sau khi áp dụng
        coupon.setQuantity(coupon.getQuantity() - 1);
        couponRepository.save(coupon);

        return finalAmount;
    }

    private double calculateDiscount(Coupon coupon, double totalAmount) {
        List<CouponCondition> conditions = couponConditionRepository
                .findByCouponId(coupon.getId());
        double discount = 0.0;
        double updatedTotalAmount = totalAmount;
        for (CouponCondition condition : conditions) {
            //EAV(Entity - Attribute - Value) Model
            String attribute = condition.getAttribute();
            String operator = condition.getOperator();
            String value = condition.getValue();

            double percentDiscount = Double.valueOf(
                    String.valueOf(condition.getDiscountAmount()));

            if (attribute.equals("minimum_amount")) {
                if (operator.equals(">") && updatedTotalAmount > Double.parseDouble(value)) {
                    discount += updatedTotalAmount * percentDiscount / 100;
                }
            } else if (attribute.equals("applicable_date")) {
                LocalDate applicableDate = LocalDate.parse(value);
                LocalDate currentDate = LocalDate.now();
                if (operator.equalsIgnoreCase("BETWEEN")
                        && currentDate.isEqual(applicableDate)) {
                    discount += updatedTotalAmount * percentDiscount / 100;
                }
            }
            //còn nhiều nhiều điều kiện khác nữa
            updatedTotalAmount = updatedTotalAmount - discount;
        }
        return discount;
    }
}