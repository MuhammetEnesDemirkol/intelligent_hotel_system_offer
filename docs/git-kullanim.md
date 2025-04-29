## 🐳 Akıllı Otel Yönetim Sistemi – Git Kullanım Rehberi

### 🌐 Genel Bilgi
Bu proje iki farklı bilgisayarda geliştirilecektir. Git versiyon kontrol sistemi kullanılarak dosyalar senkronize tutulur.

---

## 1⃣️ Başlangıç Kurulumu

### 1.1 Git Yüklemesi
- Git yüklü değilse [https://git-scm.com/](https://git-scm.com/) adresinden indirip kurulumu yap.

### 1.2 GitHub Repository Oluşturma
- GitHub hesabında yeni bir repository oluştur.
- Örneğin: `otel-yonetim-sistemi`

### 1.3 Projeyi Bağlama
```bash
# Yerel klasörü bağla
cd otel-yonetim-sistemi

# Git başlat
git init

# Remote repository ekle
git remote add origin https://github.com/kullaniciadi/otel-yonetim-sistemi.git

# İlk commit ve push
git add .
git commit -m "İlk commit"
git push -u origin master
```

---

## 2⃣️ Günlük Çalışma Akışı

### 2.1 Çalışmaya Başlarken
```bash
git pull
```
(Güncel değişiklikleri çek.)

### 2.2 Çalıştıktan Sonra
```bash
git add .
git commit -m "Yapılan değişiklik"
git push
```

### 2.3 Bilgisayar Değiştirirken
- Önce değişikliklerini push yap.
- Diğer bilgisayarda pull yap.

---

## 3⃣️ Dikkat Edilecekler
- Aynı anda iki bilgisayarda farklı branchlarda çalışmak yerine, ana branch (örn: `master`) üzerinde dikkatli ilerle.
- Değişiklik yapmadan ÖNCE mutlaka `git pull` yap.
- Merge conflict oluşursa dikkatlice çöz.

---

## 🔹 Yardımcı Komutlar
```bash
# Değişiklikleri görüntüle
git status

# Son commit mesajlarını görüntüle
git log

# Değişiklikleri geri al (ekstra dikkatli kullan)
git checkout -- dosyaadi
```

---

## 🔜 Not:
Tüm proje klasörü için `.gitignore` dosyası düzenlenmiştir. `node_modules/`, `.env` gibi klasörler otomatik ignore edilir.

