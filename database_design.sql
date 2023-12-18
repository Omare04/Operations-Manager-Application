USE Stock_AOM;
CREATE TABLE Suppliers (
    Supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    medivac BOOLEAN,
    maintenance BOOLEAN,
    name VARCHAR(50),
    email VARCHAR(50),
    address VARCHAR(100),
    phone SMALLINT(20),
    contact_name VARCHAR(40)
);
CREATE TABLE Med_stock (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    part_number INT,
    product_name VARCHAR(50),
    product_type VARCHAR(50),
    location_flightnum VARCHAR(50),
    date_of_inspection DATE,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE planes (j
    plane_id INT AUTO_INCREMENT PRIMARY KEY,
    company VARCHAR(50),
    model_name VARCHAR(50),
    call_sign VARCHAR(5),
    year VARCHAR(4)
);
CREATE TABLE Maintenance_stock (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    part_number INT,
    product_name VARCHAR(50),
    product_type VARCHAR(50),
    shelf_location VARCHAR(10),
    In_stock BOOLEAN,
    date_of_inspection DATE,
    call_sign VARCHAR(60),
    FOREIGN KEY (call_sign) REFERENCES planes(call_sign)
);
CREATE TABLE MaintenanceOrders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    PO VARCHAR(30),
    quantity INT,
    uid INT(11),
    FOREIGN KEY (uid) REFERENCES users(id),
    product_id INT(11),
    FOREIGN KEY (product_id) REFERENCES Maintenance_stock(product_id),
    Supplier_id INT(11),
    FOREIGN KEY (Supplier_id) REFERENCES Suppliers(Supplier_id),
    pn VARCHAR(100),
    call_sign VARCHAR(20),
    price VARCHAR(1000),
    DateOrdered DATE,
    active VARCHAR(20)
);
CREATE TABLE DrugOrders (
    id VARCHAR(30),
    PO VARCHAR(30),
    quantity INT,
    uid INT(11),
    FOREIGN KEY (uid) REFERENCES users(id),
    product_id INT(11),
    FOREIGN KEY (product_id) REFERENCES Drug_stock(product_id),
    DateOrdered DATE
);
CREATE TABLE ExitEntryPartHistory(
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    FOREIGN KEY (product_id) REFERENCES Maintenance_stock(product_id),
    uid INT(11),
    FOREIGN KEY (uid) REFERENCES users(id),
    type VARCHAR(20),
    added_at TIMESTAMP
) CREATE TABLE MedicalEquipmentStock (
    product_id INT(11) AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(50),
    quantity INT,
    date_of_expiration DATE
)
CREATE TABLE ExitEntryMedEquipment(
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    FOREIGN KEY (product_id) REFERENCES MedicalEquipmentStock(product_id),
    uid INT(11),
    FOREIGN KEY (uid) REFERENCES users(id),
    type VARCHAR(20),
    quantity INT(100),
    added_at TIMESTAMP
)