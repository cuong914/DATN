package com.example.shopapp.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data // bao gồm cả tostring
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductDTO {
    @NotEmpty(message = "name not null")
    @Size(min = 3, max = 200, message = "name ,must be between 3 and 200")
    // size là trường yêu cầu nhập số lương  ký tự  bắy buộc theo mong muốn
    private String name;
    @Min(value = 0, message = "price mút ben greater than or qual 100")
    @Max(value = 1000000, message = "price must be less than or equal to 10,000,000")
    private Float price;
    private String thumbnail;
    private String description;
    @JsonProperty("color_id")
    private Long colorId;
    private Boolean active;
    private Integer numberProduct;
    @JsonProperty("category_id")
    private Long categoryId;
    @JsonProperty("size_id")
    private Long sizeId;


    //private List <MultipartFile> files; thay bằng modelattribute("file")
}
