package com.example.shopapp.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data // bao gồm cả tostring
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDetailDTO {
    @JsonProperty("order_id")
    @Min(value = 1, message = "order_id must be >0")
    private Long orderId;

    @JsonProperty("product_id")
    @Min(value = 1, message = "Product_id must be >0")
    private Long productId;

    @Min(value = 0, message = "price  must be >=0")
    private Float price;

    @JsonProperty("number_of_products")
    @Min(value = 1, message = "number_of_product must be >=1")
    private Integer numberOfProduct;

    @JsonProperty("total_money")
    @Min(value = 0, message = " must be totalmoney>=0")
    private Float totalMoney;

    private String color;
}
