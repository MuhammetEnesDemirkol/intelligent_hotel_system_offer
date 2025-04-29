## 🏢 Admin Panel Yapısı ve Fonksiyonlar

### 🔖 Admin Login
- URL: `/admin`
- Kullanıcı bilgileri:
  - Kullanıcı Adı: `admin`
  - Şifre: `admin123`
- JWT token alınır ve localStorage'da saklanır.

---

### 🏢 Admin Dashboard
- URL: `/admin/dashboard`
- Hızlı geçiş butonları:
  - Oda Yönetimi
  - Müşteri Yönetimi
  - Rezervasyon Yönetimi

---

### 🏨 Oda Yönetimi
- URL: `/admin/rooms`
- Fonksiyonlar:
  - Tüm odaları listele.
  - Oda silme.

---

### 👥 Müşteri Yönetimi
- URL: `/admin/customers`
- Fonksiyonlar:
  - Tüm müşterileri listele.
  - Müşteri silme.

---

### 🏨 Rezervasyon Yönetimi
- URL: `/admin/reservations`
- Fonksiyonlar:
  - Tüm rezervasyonları listele.
  - Rezervasyon silme.

---

### 📊 Teknik Bilgiler
- Koruma: Token doğrulaması frontend tarafında localStorage ile yapılmaktadır.
- Backend endpointleri JWT ile koruma ileride entegre edilebilir.

---

### 🔹 Not:
- Görüntüler Bootstrap ile responsive tasarlanmıştır.
- Bütün işlemler Axios aracılığı ile API uç noktalarına yapılmaktadır.

