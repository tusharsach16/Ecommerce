CREATE TABLE customer_orders (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    total_amount DOUBLE PRECISION NOT NULL,
    order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    CONSTRAINT fk_item_order FOREIGN KEY (order_id) REFERENCES customer_orders(id),
    CONSTRAINT fk_item_product FOREIGN KEY (product_id) REFERENCES product(id)
);
