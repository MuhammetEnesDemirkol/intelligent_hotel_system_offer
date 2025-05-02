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
