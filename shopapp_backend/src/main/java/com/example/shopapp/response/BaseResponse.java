package com.example.shopapp.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BaseResponse {
    @JsonProperty("created_at")
    private LocalDateTime createAt;

    @JsonProperty("updated_at")
    private LocalDateTime updatedAt;
}
