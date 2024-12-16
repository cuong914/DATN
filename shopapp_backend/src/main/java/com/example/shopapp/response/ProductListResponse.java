package com.example.shopapp.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class ProductListResponse {
    private List<ProductResponse> products;

    private int totalPage;

}
