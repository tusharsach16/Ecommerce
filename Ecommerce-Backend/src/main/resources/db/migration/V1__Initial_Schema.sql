CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    brand VARCHAR(255),
    price DECIMAL(19, 2),
    category VARCHAR(255),
    release_date DATE,
    product_available BOOLEAN,
    stock_quantity INTEGER
);

-- Initial Data (migrated from data1.sql)
INSERT INTO product (name, description, brand, price, category, release_date, product_available, stock_quantity) VALUES
('MacBook Pro M3', 'Apple M3 chip, 14-inch Liquid Retina XDR display, 16GB RAM, 512GB SSD.', 'Apple', 169900.00, 'Laptop', '2023-10-30', true, 25),
('Sony WH-1000XM5', 'Industry-leading noise canceling headphones with exceptional sound quality.', 'Sony', 29900.00, 'Headphone', '2023-05-20', true, 100),
('iPhone 15 Pro', 'Titanium design, A17 Pro chip, advanced camera system, and more.', 'Apple', 134900.00, 'Mobile', '2023-09-22', true, 50),
('Samsung 75-inch 4K TV', 'Crystal Processor 4K, Smart TV with Alexa Built-in, sleek design.', 'Samsung', 85000.00, 'Electronics', '2023-03-15', true, 15),
('LEGO Star Wars Falcon', 'The Ultimate Collector Series Millennium Falcon with 7541 pieces.', 'LEGO', 79999.00, 'Toys', '2022-09-01', true, 10),
('Nike Air Jordan 1', 'The iconic high-top basketball shoe in classic Chicago colors.', 'Nike', 15000.00, 'Fashion', '2023-01-10', true, 40);
