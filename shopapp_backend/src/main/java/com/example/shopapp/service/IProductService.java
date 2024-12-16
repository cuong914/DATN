package com.example.shopapp.service;

import com.example.shopapp.dtos.ProductDTO;
import com.example.shopapp.dtos.ProductImageDTO;
import com.example.shopapp.exception.DaTanotFoundException;
import com.example.shopapp.models.Product;
import com.example.shopapp.models.ProductImage;
import com.example.shopapp.response.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.util.List;


public interface IProductService {
    Product createProduct(ProductDTO productDTO) throws Exception;

    Product getProductById(long id) throws Exception;

    Page<ProductResponse> getAllProducts(String keyword,Long categoryId,PageRequest pageRequest);

    Product updateProduct(long id, ProductDTO productDTO) throws Exception;

    void deleteProduct(long id);

    boolean existsByName(String name);

    ProductImage createProductImage(Long productId, ProductImageDTO productImageDTO) throws Exception;
//
List<Product> findProductsByIds(List<Long> productIds);


    List<Product> getAllProductss();
}
