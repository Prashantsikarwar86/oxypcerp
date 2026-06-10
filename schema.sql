-- Create Database
CREATE DATABASE oxypc_erp;

-- Connect to the database
\c oxypc_erp;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    product_type VARCHAR(100) NOT NULL,
    product_category VARCHAR(100),
    product_sub_category VARCHAR(100),
    make VARCHAR(100),
    model VARCHAR(100),
    mrp DECIMAL(10,2),
    selling_price DECIMAL(10,2),
    cost_price DECIMAL(10,2),
    warehouse VARCHAR(100),
    opening_stock INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PO (Purchase Order) Table
CREATE TABLE IF NOT EXISTS pos (
    id SERIAL PRIMARY KEY,
    po_number VARCHAR(100) UNIQUE NOT NULL,
    po_date DATE NOT NULL,
    vendor_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PO Items Table
CREATE TABLE IF NOT EXISTS po_items (
    id SERIAL PRIMARY KEY,
    po_id INT REFERENCES pos(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    sub_category VARCHAR(100),
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- GRN (Goods Receipt Note) Table
CREATE TABLE IF NOT EXISTS grns (
    id SERIAL PRIMARY KEY,
    grn_number VARCHAR(100) UNIQUE NOT NULL,
    grn_type VARCHAR(50) NOT NULL,
    po_id INT REFERENCES pos(id),
    po_date DATE,
    date_of_material_received DATE,
    vendor_name_po VARCHAR(255),
    invoice_number VARCHAR(100),
    invoice_date DATE,
    invoice_image TEXT,
    eway_bill_number VARCHAR(100),
    eway_bill_date DATE,
    eway_bill_image TEXT,
    vehicle_number VARCHAR(100),
    vehicle_seal_image TEXT,
    vehicle_image TEXT,
    sgst DECIMAL(10,2) DEFAULT 0,
    cgst DECIMAL(10,2) DEFAULT 0,
    igst DECIMAL(10,2) DEFAULT 0,
    taxable_amount DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    invoice_value DECIMAL(10,2) DEFAULT 0,
    total_po_quantity INT DEFAULT 0,
    total_invoice_quantity INT DEFAULT 0,
    total_physical_quantity INT DEFAULT 0,
    variance INT DEFAULT 0,
    taxable_amount_invoice DECIMAL(10,2) DEFAULT 0,
    total_invoice_value DECIMAL(10,2) DEFAULT 0,
    sgst_invoice DECIMAL(10,2) DEFAULT 0,
    cgst_invoice DECIMAL(10,2) DEFAULT 0,
    igst_invoice DECIMAL(10,2) DEFAULT 0,
    final_check BOOLEAN DEFAULT FALSE,
    assign_to_head_engineer VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- GRN Items Table
CREATE TABLE IF NOT EXISTS grn_items (
    id SERIAL PRIMARY KEY,
    grn_id INT REFERENCES grns(id) ON DELETE CASCADE,
    lot_number VARCHAR(100),
    item_name VARCHAR(255),
    category VARCHAR(100),
    sub_category VARCHAR(100),
    make VARCHAR(100),
    model VARCHAR(100),
    spare_part VARCHAR(100),
    po_quantity INT DEFAULT 0,
    invoice_quantity INT DEFAULT 0,
    physical_quantity INT DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0,
    product_description TEXT,
    tax_percentage DECIMAL(5,2) DEFAULT 0,
    total_item_price DECIMAL(10,2) DEFAULT 0,
    part_number VARCHAR(100),
    warranty_period VARCHAR(100),
    remark TEXT,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    location VARCHAR(100),
    main_category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Devices (Inventory) Table
CREATE TABLE IF NOT EXISTS devices (
    id SERIAL PRIMARY KEY,
    tag_number VARCHAR(100) UNIQUE NOT NULL,
    serial_number VARCHAR(100),
    make VARCHAR(100),
    model VARCHAR(100),
    cpu VARCHAR(100),
    generation VARCHAR(100),
    ram VARCHAR(100),
    hdd VARCHAR(100),
    ssd_capacity VARCHAR(100),
    screen_size VARCHAR(100),
    product_stage VARCHAR(100),
    product_status VARCHAR(100),
    product_category VARCHAR(100),
    product_sub_category VARCHAR(100),
    master_category VARCHAR(100),
    warehouse VARCHAR(100),
    location VARCHAR(100),
    lot_number VARCHAR(100),
    purchase_price DECIMAL(10,2),
    unit_price_with_tax DECIMAL(10,2),
    status VARCHAR(50),
    owner VARCHAR(50),
    assigned_to VARCHAR(100),
    grn_id INT REFERENCES grns(id),
    inventory_id VARCHAR(100) UNIQUE,
    inventory_added_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_name VARCHAR(100),
    po_number VARCHAR(100),
    grn_number VARCHAR(100),
    grn_date DATE,
    invoice_number VARCHAR(100),
    customer_name VARCHAR(255),
    physical_quantity INT DEFAULT 0,
    vendor_name VARCHAR(255),
    item_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Spare Part Inventory Table
CREATE TABLE IF NOT EXISTS spare_part_inventory (
    id SERIAL PRIMARY KEY,
    inventory_id VARCHAR(100) UNIQUE NOT NULL,
    inventory_added_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_name VARCHAR(100),
    po_number VARCHAR(100),
    grn_number VARCHAR(100),
    grn_date_and_time TIMESTAMP,
    vendor_name VARCHAR(255),
    invoice_number VARCHAR(100),
    lot_number VARCHAR(100),
    product_description TEXT,
    item_name VARCHAR(255),
    crate_tag_number VARCHAR(100),
    make VARCHAR(100),
    model VARCHAR(100),
    spare_part VARCHAR(100),
    invoice_quantity INT DEFAULT 0,
    physical_quantity INT DEFAULT 0,
    price DECIMAL(10,2),
    location VARCHAR(100),
    master_category VARCHAR(100),
    category VARCHAR(100),
    sub_category VARCHAR(100),
    vehicle_number VARCHAR(100),
    total_invoice_value DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Spare Requests Table
CREATE TABLE IF NOT EXISTS spare_requests (
    id SERIAL PRIMARY KEY,
    request_id VARCHAR(100) UNIQUE NOT NULL,
    requested_by VARCHAR(100) NOT NULL,
    requested_by_level VARCHAR(50),
    item_name VARCHAR(255),
    quantity INT NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    approved_by VARCHAR(100),
    issued_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (username, email, role) VALUES
('admin', 'admin@oxypc.com', 'Admin'),
('head_engineer', 'head@oxypc.com', 'HeadEngineer'),
('l1_engineer', 'l1@oxypc.com', 'L1L2'),
('store_manager', 'store@oxypc.com', 'StoreManager');
