package com.example.shopapp.repositorys;

import com.example.shopapp.models.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order,Long> {
// timf don hang user naof do


    List<Order> findByUserId(Long userId);



    @Query("SELECT o FROM Order o WHERE (o.active = true OR o.active IS NULL) AND " +
            "(:keyword IS NULL OR :keyword = '' OR " +
            "o.fullName LIKE %:keyword% " +
            "OR o.address LIKE %:keyword% " +
            "OR o.note LIKE %:keyword% " +
            "OR o.email LIKE %:keyword%) " +
            "ORDER BY o.orderDate DESC")  // Sắp xếp theo ngày đặt giảm dần
    Page<Order> findByKeyword(@Param("keyword") String keyword, Pageable pageable);


    @Query("SELECT SUM(o.totalMoney) FROM Order o WHERE o.status = 'delivered'")
    Long calculateTotalRevenue1();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = 'delivered'")
    Long countDeliveredOrders1();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = 'pending'")
    Long countPendingOrders1();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = 'cancelled'")
    Long countCancelledOrders1();

    @Query("SELECT SUM(o.totalMoney) FROM Order o WHERE o.status = 'delivered' AND o.orderDate BETWEEN :startDate AND :endDate")
    Long calculateTotalRevenue(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = 'delivered' AND o.orderDate BETWEEN :startDate AND :endDate")
    Long countDeliveredOrders(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = 'pending' AND o.orderDate BETWEEN :startDate AND :endDate")
    Long countPendingOrders(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = 'cancelled' AND o.orderDate BETWEEN :startDate AND :endDate")
    Long countCancelledOrders(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

}
