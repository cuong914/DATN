package com.example.shopapp.repositorys;

import com.example.shopapp.models.CouponCondition;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CouponConditionRePo extends JpaRepository<CouponCondition,Long> {
    List<CouponCondition> findByCouponId(long couponId);

}
