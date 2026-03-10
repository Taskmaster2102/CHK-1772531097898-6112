-- Chakravyuh Artisan Marketplace Database Schema
-- MySQL Database: chakravyuh_db

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS Chakravyuh_db;
USE Chakravyuh_db;

-- ============================================
-- ADMIN TABLE
-- Stores admin login credentials and address
-- ============================================
CREATE TABLE IF NOT EXISTS admin (
    login_id VARCHAR(50) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- SELLER TABLE (Artisans)
-- Stores seller/artisan login credentials and address
-- ============================================
CREATE TABLE IF NOT EXISTS seller (
    seller_id VARCHAR(50) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    address TEXT,
    shop_name VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- BUYER TABLE
-- Stores buyer login credentials and address
-- ============================================
CREATE TABLE IF NOT EXISTS buyer (
    login_id VARCHAR(50) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- PRODUCTS TABLE
-- Stores pottery products/items
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    seller_id VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    shape ENUM('Classic', 'Tapered', 'Fluted') DEFAULT 'Classic',
    size ENUM('S', 'M', 'L') DEFAULT 'M',
    glaze_color VARCHAR(20),
    image_url VARCHAR(255),
    stock_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES seller(seller_id) ON DELETE CASCADE
);

-- ============================================
-- ORDERS TABLE
-- Stores order information
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_id VARCHAR(50) NOT NULL,
    product_id INT,
    order_date DATE NOT NULL,
    status ENUM('Pending', 'In Production', 'Shaping', 'Firing', 'Glazing', 'Ready', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    total_price DECIMAL(10, 2) NOT NULL,
    quantity INT DEFAULT 1,
    shipping_address TEXT,
    tracking_number VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES buyer(login_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE SET NULL
);

-- ============================================
-- CUSTOM DESIGNS TABLE
-- Stores custom design orders
-- ============================================
CREATE TABLE IF NOT EXISTS custom_designs (
    design_id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_id VARCHAR(50) NOT NULL,
    order_id INT,
    shape ENUM('Classic', 'Tapered', 'Fluted') NOT NULL,
    size ENUM('S', 'M', 'L') NOT NULL,
    glaze_color VARCHAR(20) NOT NULL,
    engraving VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL,
    status ENUM('In Production', 'Shaping', 'Firing', 'Glazing', 'Ready', 'Shipped') DEFAULT 'In Production',
    order_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES buyer(login_id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE SET NULL
);

-- ============================================
-- INSERT SAMPLE DATA
-- ============================================

-- Insert sample admin (password: admin123)
INSERT INTO admin (login_id, password, address) VALUES 
('admin', '$2a$10$xGJ9Q7K5X8M5Z9N3Y1R0EeLXmY1K2J3H4I5J6K7L8M9N0O1P2Q3R', '123 Admin Street, City, Country');

-- Insert sample sellers (password: seller123)
INSERT INTO seller (seller_id, password, address, shop_name, phone, email) VALUES 
('artisan01', '$2a$10$xGJ9Q7K5X8M5Z9N3Y1R0EeLXmY1K2J3H4I5J6K7L8M9N0O1P2Q3R', '456 Potter Lane, Jaipur, India', 'Earth & Clay Studio', '+91 98765 43210', 'artisan@chakravyuh.com'),
('artisan02', '$2a$10$xGJ9Q7K5X8M5Z9N3Y1R0EeLXmY1K2J3H4I5J6K7L8M9N0O1P2Q3R', '789 Artisan Road, Delhi, India', 'Heritage Pots', '+91 87654 32109', 'heritage@chakravyuh.com');

-- Insert sample buyers (password: buyer123)
INSERT INTO buyer (login_id, password, address, phone, email) VALUES 
('buyer01', '$2a$10$xGJ9Q7K5X8M5Z9N3Y1R0EeLXmY1K2J3H4I5J6K7L8M9N0O1P2Q3R', '101 Buyer Street, Mumbai, India', '+91 91234 56789', 'buyer@demo.com'),
('buyer02', '$2a$10$xGJ9Q7K5X8M5Z9N3Y1R0EeLXmY1K2J3H4I5J6K7L8M9N0O1P2Q3R', '202 Customer Ave, Bangalore, India', '+91 99887 76655', 'customer@demo.com');

-- Insert sample products
INSERT INTO products (seller_id, name, description, price, shape, size, glaze_color, stock_quantity) VALUES 
('artisan01', 'Classic Earthen Pot', 'Handcrafted traditional earthen pot', 450.00, 'Classic', 'M', '#E2725B', 10),
('artisan01', 'Tapered Ceramic Vase', 'Elegant tapered vase with sage glaze', 650.00, 'Tapered', 'L', '#87A878', 5),
('artisan02', 'Fluted Tea Set', 'Beautiful fluted tea pot with cups', 850.00, 'Fluted', 'M', '#4A7C94', 3);

-- Insert sample orders
INSERT INTO orders (buyer_id, product_id, order_date, status, total_price, quantity, shipping_address) VALUES 
('buyer01', 1, '2024-01-15', 'Firing', 1050.00, 1, '101 Buyer Street, Mumbai, India'),
('buyer01', 3, '2024-01-10', 'Ready', 950.00, 1, '101 Buyer Street, Mumbai, India'),
('buyer02', 2, '2024-01-18', 'In Production', 900.00, 1, '202 Customer Ave, Bangalore, India');

-- Insert sample custom designs (using string buyer_id matching buyer.login_id)
INSERT INTO custom_designs (buyer_id, order_id, shape, size, glaze_color, engraving, price, status, order_date, notes) VALUES 
('buyer01', 1, 'Classic', 'L', '#87A878', 'Om', 1050.00, 'Firing', '2024-01-15', 'Gift for anniversary'),
('buyer01', 2, 'Fluted', 'M', '#4A7C94', 'Shanti', 950.00, 'Glazing', '2024-01-10', 'Handle with care'),
('buyer02', 3, 'Tapered', 'S', '#E2725B', 'Namaste', 900.00, 'Shaping', '2024-01-18', 'First custom order');

-- ============================================
-- VIEWS FOR EASY QUERIES
-- ============================================

-- View for order details with buyer and product info
CREATE OR REPLACE VIEW order_details AS
SELECT 
    o.order_id,
    o.order_date,
    o.status,
    o.total_price,
    o.quantity,
    o.tracking_number,
    b.login_id AS buyer_login_id,
    b.email AS buyer_email,
    b.address AS buyer_address,
    p.name AS product_name,
    p.shape,
    p.size,
    cd.engraving,
    cd.glaze_color
FROM orders o
LEFT JOIN buyer b ON o.buyer_id = b.login_id
LEFT JOIN products p ON o.product_id = p.product_id
LEFT JOIN custom_designs cd ON o.order_id = cd.order_id;

-- View for seller dashboard
CREATE OR REPLACE VIEW seller_orders AS
SELECT 
    o.order_id,
    o.order_date,
    o.status,
    o.total_price,
    b.login_id AS buyer_id,
    b.email AS buyer_email,
    p.name AS product_name,
    p.shape,
    p.size,
    s.seller_id,
    s.shop_name
FROM orders o
JOIN products p ON o.product_id = p.product_id
JOIN seller s ON p.seller_id = s.seller_id
JOIN buyer b ON o.buyer_id = b.login_id;

-- ============================================
-- STORED PROCEDURES
-- ============================================

DELIMITER $$

-- Procedure to authenticate user
CREATE PROCEDURE IF NOT EXISTS authenticate_user(
    IN p_login_id VARCHAR(50),
    IN p_role ENUM('buyer', 'seller', 'admin'),
    OUT p_result BOOLEAN
)
BEGIN
    IF p_role = 'buyer' THEN
        SELECT COUNT(*) > 0 INTO p_result FROM buyer WHERE login_id = p_login_id;
    ELSEIF p_role = 'seller' THEN
        SELECT COUNT(*) > 0 INTO p_result FROM seller WHERE seller_id = p_login_id;
    ELSEIF p_role = 'admin' THEN
        SELECT COUNT(*) > 0 INTO p_result FROM admin WHERE login_id = p_login_id;
    END IF;
END $$

-- Procedure to get buyer orders
CREATE PROCEDURE IF NOT EXISTS get_buyer_orders(IN p_buyer_id VARCHAR(50))
BEGIN
    SELECT 
        o.order_id,
        o.order_date,
        o.status,
        o.total_price,
        o.quantity,
        p.name AS product_name,
        p.shape,
        p.size,
        cd.engraving,
        cd.glaze_color,
        cd.price AS custom_price
    FROM orders o
    LEFT JOIN products p ON o.product_id
    LEFT_id = p.product JOIN custom_designs cd ON o.order_id = cd.order_id
    WHERE o.buyer_id = p_buyer_id
    ORDER BY o.order_date DESC;
END $$

-- Procedure to get seller orders
CREATE PROCEDURE IF NOT EXISTS get_seller_orders(IN p_seller_id VARCHAR(50))
BEGIN
    SELECT 
        o.order_id,
        o.order_date,
        o.status,
        o.total_price,
        b.login_id AS customer_name,
        b.email AS customer_email,
        p.name AS product_name,
        p.shape,
        p.size,
        cd.engraving,
        cd.glaze_color,
        cd.price AS custom_price,
        cd.notes
    FROM orders o
    JOIN products p ON o.product_id = p.product_id
    JOIN seller s ON p.seller_id = s.seller_id
    JOIN buyer b ON o.buyer_id = b.login_id
    LEFT JOIN custom_designs cd ON o.order_id = cd.order_id
    WHERE s.seller_id = p_seller_id
    ORDER BY o.order_date DESC;
END $$

DELIMITER ;

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_custom_designs_buyer ON custom_designs(buyer_id);

