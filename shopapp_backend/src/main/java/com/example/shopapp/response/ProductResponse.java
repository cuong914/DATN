package com.example.shopapp.response;

import com.example.shopapp.models.BaseEntity;
import com.example.shopapp.models.Product;
import com.example.shopapp.models.ProductImage;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;


@Getter
@Setter
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class ProductResponse extends BaseResponse {// productResponse là nơi để nhận dữ liệu trả về

    private Long id;
    private String name;
    private Float price;
    private String thumbnail;
    //    private String size;
    @JsonProperty("color_id")
    private String colorId;
    private String description;
    private int numberProduct;
    private String namecolor;
    private String namesize;
    private Boolean active;
    private int totalPages;
    @JsonProperty("product_images")
    private List<ProductImage> productImages = new ArrayList<>();

    @JsonProperty("category_id")
    private Long categoryId;
    @JsonProperty("size_id")
    private String sizeId;

    public static ProductResponse fromProduct(Product product) {
        ProductResponse productResponse = ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .thumbnail(product.getThumbnail())
                .numberProduct(product.getNumberProduct())
                .namecolor(product.getColor() != null ? product.getColor().getName() : null)
                .namesize(product.getSize() != null ? product.getSize().getName() : null)
                .colorId(product.getColor() != null ? product.getColor().getId().toString() : null)
                .sizeId(product.getSize() != null ? product.getSize().getId().toString() : null)
                .active(product.getActive())
                .description(product.getDescription())
                .categoryId(product.getCategory().getId())
                .productImages(product.getProductImages())
                .build();

        // Thiết lập ngày tạo và cập nhật
        productResponse.setCreateAt(product.getCreateAt());
        productResponse.setUpdatedAt(product.getUpdateAt());

        return productResponse;
    }

}
