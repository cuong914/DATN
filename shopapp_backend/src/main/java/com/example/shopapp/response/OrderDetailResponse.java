package com.example.shopapp.response;


import com.example.shopapp.models.OrderDetail;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class OrderDetailResponse {

    private Long id;

    @JsonProperty("order_id")
    private Long orderId;

    @JsonProperty("product_id")
    private Long productId;


    private double price;

    @JsonProperty("number_of_products")
    private Integer numberOfProduct;

    @JsonProperty("total_money")
    private Float totalMoney;

    private String color;

    // trả về dữ liệu tùy ý muốn trả về cái j thì thêm ở dưới

    ///còn gọi là hàm chuyển đổi hay conert từ orderdetaul sang orderdetailresponse

    public static OrderDetailResponse fromOrderDetail(OrderDetail orderDetail) {
        return OrderDetailResponse
                .builder()
                .id(orderDetail.getId())
                .orderId(orderDetail.getOrder().getId())
                .productId(orderDetail.getProduct().getId())
                .price(orderDetail.getPrice())
                .totalMoney(orderDetail.getTotalMoney())
                .numberOfProduct(orderDetail.getNumberOfProducts())
                .color(orderDetail.getColor())
                .build();

    }
}
