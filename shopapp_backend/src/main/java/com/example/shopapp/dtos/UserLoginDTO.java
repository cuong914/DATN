package com.example.shopapp.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// bao gồm cả tostring
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserLoginDTO {
    @JsonProperty("phone_number")
    @NotBlank(message = "phone number is required")
    private String phoneNumber;


    @NotBlank(message = "pasword cannot be banl")
    private String password;

//    @Min(value = 1, message = "You must enter role's Id")
//    @JsonProperty("role_id")
//    private Long roleId;
}
