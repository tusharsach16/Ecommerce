package com.auramarket.api.controller;

import com.auramarket.api.dto.OrderRequest;
import com.auramarket.api.model.Order;
import com.auramarket.api.model.User;
import com.auramarket.api.repo.OrderRepository;
import com.auramarket.api.repo.UserRepository;
import com.auramarket.api.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody OrderRequest orderRequest) {
        try {
            Order savedOrder = orderService.placeOrder(orderRequest);
            return ResponseEntity.ok(savedOrder);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.err.println("Unexpected error during checkout:");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().build();
        }
        List<Order> orders = orderRepository.findByUserOrderByOrderDateDesc(user);
        return ResponseEntity.ok(orders);
    }
}
