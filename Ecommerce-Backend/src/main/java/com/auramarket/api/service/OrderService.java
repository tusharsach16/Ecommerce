package com.auramarket.api.service;

import com.auramarket.api.dto.OrderRequest;
import com.auramarket.api.model.Order;
import com.auramarket.api.model.OrderItem;
import com.auramarket.api.model.Product;
import com.auramarket.api.model.User;
import com.auramarket.api.repo.OrderRepository;
import com.auramarket.api.repo.ProductRepo;
import com.auramarket.api.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepo productRepo;

    @Transactional
    public Order placeOrder(OrderRequest orderRequest) {
        if (orderRequest == null || orderRequest.getUserId() == null) {
            throw new IllegalArgumentException("User ID is required");
        }

        User user = userRepository.findById(orderRequest.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + orderRequest.getUserId()));

        if (orderRequest.getItems() == null || orderRequest.getItems().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item");
        }

        Order order = new Order();
        order.setUser(user);
        order.setTotalAmount(orderRequest.getTotalAmount() != null ? orderRequest.getTotalAmount() : 0.0);
        order.setStatus("PROCESSING");

        List<OrderItem> items = new ArrayList<>();
        for (OrderRequest.OrderItemRequest itemReq : orderRequest.getItems()) {
            if (itemReq.getProductId() == null) continue;

            Product product = productRepo.findById(itemReq.getProductId().intValue())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + itemReq.getProductId()));

            int quantity = itemReq.getQuantity() != null ? itemReq.getQuantity() : 0;
            if (quantity <= 0) continue;

            // Decrement stock
            int newStock = product.getStockQuantity() - quantity;
            if (newStock < 0) {
                throw new IllegalArgumentException("Insufficient stock for: " + product.getName() + " (Requested: " + quantity + ", Available: " + product.getStockQuantity() + ")");
            }
            product.setStockQuantity(newStock);
            productRepo.save(product);

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(quantity);
            item.setPrice(itemReq.getPrice() != null ? itemReq.getPrice() : product.getPrice().doubleValue());
            items.add(item);
        }

        if (items.isEmpty()) {
            throw new IllegalArgumentException("No valid items found in order");
        }

        order.setItems(items);
        return orderRepository.save(order);
    }
}
