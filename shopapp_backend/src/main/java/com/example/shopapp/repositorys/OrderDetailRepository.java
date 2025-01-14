package com.example.shopapp.repositorys;

import com.example.shopapp.models.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {

   List<OrderDetail> findByOrderId(Long orderId);

   @Query("SELECT p.name AS productName, SUM(od.numberOfProducts) AS totalSold " +
           "FROM OrderDetail od JOIN Product p ON od.product.id = p.id " +
           "GROUP BY p.name " +
           "ORDER BY totalSold DESC")
   List<Object[]> getTopSellingProducts();

   @Query("SELECT p.name AS productName, SUM(od.numberOfProducts) AS totalSold " +
           "FROM OrderDetail od JOIN Product p ON od.product.id = p.id " +
           "WHERE od.order.orderDate BETWEEN :startDate AND :endDate " +
           "GROUP BY p.name " +
           "ORDER BY totalSold DESC")
   List<Object[]> getTopSellingProductsByDate(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

}
