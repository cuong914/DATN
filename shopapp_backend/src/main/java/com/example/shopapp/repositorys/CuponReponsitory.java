package com.example.shopapp.repositorys;

import com.example.shopapp.models.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CuponReponsitory extends JpaRepository<Coupon,Long> {
    Optional<Coupon> findByCode(String couponCode);
}
