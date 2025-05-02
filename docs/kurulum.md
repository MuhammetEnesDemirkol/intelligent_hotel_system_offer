## 🏗️ Akıllı Otel Yönetim Sistemi – Kurulum Rehberi

### 📁 Proje Yapısı
```
otel-yonetim-sistemi/
│
├── backend/
├── frontend/
├── database/
├── docs/
├── README.md
├── .gitignore
```

---

### ⚙️ Gereksinimler
- Node.js (v16+ önerilir)
- PostgreSQL (PgAdmin kurulmuş olmalı)
- Git (versiyon kontrol için)

---

## 1⃣️ Veritabanı Kurulumu

### 1. PostgreSQL veritabanını oluştur:
PgAdmin üzerinden yeni bir veritabanı oluştur:
- **İsim:** `intelligent_hotel_system`
- **Kullanıcı:** `postgres`
- **Şifre:** `1723`

### 2. Veritabanı tablolarını oluştur:
- PgAdmin'de `intelligent_hotel_system` veritabanını seç.
- `database/schema.sql` dosyasındaki içeriği çalıştır.

---

## 2⃣️ Backend (API) Kurulumu

### 1. Dizine gir:
```bash
cd backend
```

### 2. Gerekli paketleri kur:
```bash
npm install express pg dotenv cors jsonwebtoken bcryptjs
```

### 3. `.env` dosyasını oluştur:
`backend/.env` dosyasına şunu yaz:

```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=intelligent_hotel_system
DB_PASSWORD=1723
DB_PORT=5432
JWT_SECRET=otelsecretkey
```

### 4. Sunucuyu başlat:
```bash
node src/app.js
```

Eğer her şey doğruysa:
`http://localhost:5000/` adresinde zaman bilgisi döner.

---

## 3⃣️ Admin Girişi

node -e "require('bcrypt').hash('admin123', 10).then(console.log)"

INSERT INTO admin_users (username, password_hash)
VALUES ('admin', '$2b$10$KmC4Tl0R.a6QdpHEv6Iyj.vTjhNYei7k1MGlzYyfPWoybLftzNXsu');



Test kullanıcı bilgileri:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

Login için:
- URL: `http://localhost:5000/api/admin/login`
- Yöntem: `POST`
- Gövde (Body):
```json
{
  "username": "admin",
  "password": "admin123"
}
```

Başarılı olursa, bir JWT token döner:
```json
{
  "token": "..."
}
```

---

## 🔜 Devam Eden Bölümler
- Frontend kurulumu ve bileşenler
- Chatbot sistemi
- Admin panel arayüzü

