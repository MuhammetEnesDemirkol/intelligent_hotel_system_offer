-- admin_users
CREATE TABLE admin_users (
id SERIAL PRIMARY KEY,
username VARCHAR(100) NOT NULL,
password_hash VARCHAR(255) NOT NULL
);

-- users
CREATE TABLE users (
id SERIAL PRIMARY KEY,
full_name VARCHAR(100) NOT NULL,
email VARCHAR(100) NOT NULL,
password_hash VARCHAR(255) NOT NULL,
phone VARCHAR(20),
address TEXT,
identity_number VARCHAR(20),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- customers
CREATE TABLE customers (
id SERIAL PRIMARY KEY,
full_name VARCHAR(100) NOT NULL,
email VARCHAR(100) NOT NULL,
phone VARCHAR(20)
);

-- rooms
CREATE TABLE rooms (
id SERIAL PRIMARY KEY,
room_number VARCHAR(10) NOT NULL,
room_type VARCHAR(50),
capacity INTEGER,
price_per_night NUMERIC(10,2),
status VARCHAR(50),
image_url TEXT,
description TEXT,
bed_type TEXT,
has_ac BOOLEAN,
has_wifi BOOLEAN,
has_minibar BOOLEAN,
has_balcony BOOLEAN,
view TEXT
);

-- reservations
CREATE TABLE reservations (
id SERIAL PRIMARY KEY,
customer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
check_in DATE,
check_out DATE,
total_price NUMERIC(10,2),
status VARCHAR(50)
);

-- payments
CREATE TABLE payments (
id SERIAL PRIMARY KEY,
customer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
reservation_id INTEGER REFERENCES reservations(id) ON DELETE CASCADE,
amount NUMERIC(10,2),
payment_date DATE,
status VARCHAR(50),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
customer_name VARCHAR(100),
customer_email VARCHAR(100)
);

-- housekeeping
CREATE TABLE housekeeping (
id SERIAL PRIMARY KEY,
room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
status VARCHAR(50),
last_cleaned DATE
);

-- room_price_history
CREATE TABLE room_price_history (
id SERIAL PRIMARY KEY,
room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
old_price NUMERIC(10,2),
new_price NUMERIC(10,2),
change_type VARCHAR(50),
change_value NUMERIC(10,2),
changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
changed_by INTEGER REFERENCES admin_users(id) ON DELETE SET NULL
);

-- personnel
CREATE TABLE personnel (
id SERIAL PRIMARY KEY,
name VARCHAR(100) NOT NULL,
phone VARCHAR(20) NOT NULL,
role VARCHAR(100) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--


-- Personel Ekleme
INSERT INTO personnel (name, phone, role) VALUES
('Ayşe Demir', '05321234567', 'Temizlik'),
('Mehmet Yılmaz', '05329876543', 'Temizlik'),
('Fatma Kara', '05321112233', 'Temizlik'),
('Ahmet Çelik', '05320001122', 'Temizlik'),
('Elif Aydın', '05326667788', 'Temizlik'),
('Mert Koç', '05325553344', 'Resepsiyonist'),
('Zeynep Uslu', '05324445566', 'Kat Sorumlusu'),
('Burak Şahin', '05327778899', 'Gece Müdürü'),
('Gamze Yıldız', '05328889900', 'Mutfak Sorumlusu'),
('Onur Arslan', '05323334455', 'Teknik Servis');


-- Oda Ekleme
INSERT INTO rooms (room_number, room_type, capacity, price_per_night, status, image_url, description, bed_type, has_ac, has_wifi, has_minibar, has_balcony, view) VALUES
('101', 'Single', 1, 750.00, 'available', 'https://example.com/room101.jpg', 'Şehir manzaralı tek kişilik oda', 'Single', true, true, false, false, 'City'),
('102', 'Double', 2, 1000.00, 'available', 'https://example.com/room102.jpg', 'Geniş çift kişilik oda', 'Double', true, true, true, false, 'Garden'),
('201', 'Twin', 2, 950.00, 'maintenance', 'https://example.com/room201.jpg', 'İki ayrı yataklı konforlu oda', 'Twin', true, true, false, true, 'Pool'),
('202', 'Suite', 4, 1800.00, 'reserved', 'https://example.com/room202.jpg', 'Lüks suit oda', 'King', true, true, true, true, 'Sea'),
('301', 'Family', 4, 1500.00, 'available', 'https://example.com/room301.jpg', 'Çocuklu aileler için ideal', 'Queen', true, true, true, true, 'Mountain'),
('302', 'Deluxe', 2, 1300.00, 'available', 'https://example.com/room302.jpg', 'Konforlu ve ferah oda', 'Double', true, true, true, false, 'City');
