package com.example.shopapp.repositorys;

import com.example.shopapp.models.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductImageReponsitory extends JpaRepository<ProductImage,Long> {
List<ProductImage> findByProductId(Long productId);

    @Query("SELECT pi.imageUrl FROM ProductImage pi WHERE pi.product.id = :productId ORDER BY pi.id ASC")
    String findFirstImageByProductId(@Param("productId") Long productId);
}
