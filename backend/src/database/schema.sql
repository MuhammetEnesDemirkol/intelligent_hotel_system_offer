-- Oda fiyat geçmişi tablosu
CREATE TABLE IF NOT EXISTS room_price_history (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES rooms(id),
    old_price DECIMAL(10,2) NOT NULL,
    new_price DECIMAL(10,2) NOT NULL,
    change_type VARCHAR(20) NOT NULL, -- 'percentage' veya 'fixed'
    change_value DECIMAL(10,2) NOT NULL, -- yüzde veya sabit değer
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by INTEGER REFERENCES users(id)
); 