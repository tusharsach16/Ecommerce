package com.auramarket.api.config;

import com.auramarket.api.model.Product;
import com.auramarket.api.repo.ProductRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(ProductRepo repository) {
        return args -> {
            if (repository.count() == 0) {
                System.out.println("No products found. Initializing sample data...");
                repository.saveAll(List.of(
                    new Product(0, "MacBook Pro M3", "Apple M3 chip, 14-inch, 16GB RAM", "Apple", new BigDecimal("169900.00"), "Laptop", new Date(), true, 25),
                    new Product(0, "Sony WH-1000XM5", "Noise canceling headphones", "Sony", new BigDecimal("29900.00"), "Headphone", new Date(), true, 100),
                    new Product(0, "iPhone 15 Pro", "Titanium design, A17 Pro chip", "Apple", new BigDecimal("134900.00"), "Mobile", new Date(), true, 50),
                    new Product(0, "Samsung 75-inch 4K TV", "Smart TV with Alexa Built-in", "Samsung", new BigDecimal("85000.00"), "Electronics", new Date(), true, 15),
                    new Product(0, "LEGO Star Wars Falcon", "Millennium Falcon with 7541 pieces", "LEGO", new BigDecimal("79999.00"), "Toys", new Date(), true, 10),
                    new Product(0, "Nike Air Jordan 1", "Iconic basketball shoe", "Nike", new BigDecimal("15000.00"), "Nike", new Date(), true, 40)
                ));
            }
        };
    }
}
