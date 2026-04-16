package com.auramarket.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequest {
    private Long userId;
    private Double totalAmount;
    private List<OrderItemRequest> items;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OrderItemRequest {
        private Long productId;
        private Integer quantity;
        private Double price;
    }
}
