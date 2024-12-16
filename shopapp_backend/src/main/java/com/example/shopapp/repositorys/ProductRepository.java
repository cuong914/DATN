package com.example.shopapp.repositorys;

import com.example.shopapp.models.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product ,Long> {
// sp voi ten do ton tai hay k

    boolean existsByName(String name);

    // phan tran san pham
    Page<Product> findAll(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE " +
            "(:categoryId IS NULL OR :categoryId = 0 OR p.category.id = :categoryId) " +
            "AND (:keyword IS NULL OR :keyword = '' OR p.name LIKE %:keyword% OR p.description LIKE %:keyword%) " +
            "AND p.active = true " )
//    Page<Product> searProduct(@Param("categoryId") Long categoryId,
//                              @Param("keyword") String keyword,
//                              Pageable pageable);
    Page<Product> searProduct
            (@Param("categoryId") Long categoryId,
             @Param("keyword") String keyword, Pageable pageable);



//    @Query("SELECT p, pi FROM Product p LEFT JOIN p.productImages pi WHERE p.id = :productId")
//    Optional<Object[]> getDetailProduct(@Param("productId") Long productId);
@Query("SELECT p FROM Product p LEFT JOIN FETCH p.productImages WHERE p.id = :productId")
Optional<Product> getDetailProduct(@Param("productId") Long productId);


    @Query("SELECT p FROM Product p WHERE p.id IN :productIds")
    List<Product> findProductsByIds(@Param("productIds") List<Long> productIds);

    @Query("SELECT p FROM Product p WHERE p.active = true")
    List<Product> findActiveProducts();


}
