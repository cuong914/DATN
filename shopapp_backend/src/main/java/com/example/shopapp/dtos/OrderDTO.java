package com.example.shopapp.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Data // bao gồm cả tostring
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDTO {

    @JsonProperty("user_id")
    @Min(value = 1, message = "user id must be >0")
    private Long userId;

    @JsonProperty("fullname")
    private String fullName;

    private String email;

    @JsonProperty("phone_number")
    @Size(min = 5, message = "phone number must be at least 5 characters")
    @NotBlank(message = "phone number is required")
    private String phoneNumber;

    private String address;

    private String note;

    private  String status;

    @JsonProperty("total_money")
    @Min(value = 0, message = "total money must be >= 0 ")
    private Float totalMoney;


    @Column(name = "order_date")
    private LocalDate orderDate;


    @JsonProperty("shipping_method")
    private String shippingMethod;

    @JsonProperty("shipping_address")
    private String shippingAddress;

    @JsonProperty("shipping_date")
    private LocalDate shippingDate;

    @JsonProperty("payment_method")
    private String paymentMethod;

    @JsonProperty("tracking_number")
    private String trackingNumber;

    @JsonProperty("coupon_code")
    private String couponCode;

    @JsonProperty("cart_items")
    private List<CartItemDTO> cartItems;
}
