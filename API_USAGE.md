# Panduan Penggunaan API untuk Tim Frontend (Bisamart)

Dokumen ini menjelaskan alur penggunaan API utama untuk aplikasi Bisamart, mulai dari autentikasi hingga proses checkout.

**Base URL:** `http://localhost:3000/docs/v1` (sesuaikan dengan environment)

## 1. Autentikasi (Authentication)

Setiap pengguna (Customer, Merchant, Courier) harus melalui proses ini.

### A. Register (Pendaftaran)
Endpoint untuk mendaftarkan pengguna baru sebagai Customer.
- **URL**: `/users/auth/register`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `name`: String
  - `email`: String (Unique)
  - `phone_number`: String (Unique)
  - `password`: String
  - `file`: File (Optional - Foto Profil)

### B. Login (Masuk)
Endpoint untuk mendapatkan token akses.
- **URL**: `/users/auth/login`
- **Method**: `POST`
- **Body**:
  - `email`: String
  - `password`: String
- **Response**:
  - `data.token`: Simpan token ini! Gunakan di header `Authorization` untuk request selanjutnya.

### C. Get Current User (Cek Profil)
Gunakan untuk mengecek siapa yang sedang login.
- **URL**: `/users/current`
- **Method**: `GET`
- **Headers**: `Authorization: <token-dari-login>`

---

## 2. Produk (Products)

### A. Lihat Semua Produk (Browse)
Endpoint ini mendukung pagination dan pencarian.
- **URL**: `/merchant/product`
- **Method**: `GET`
- **Query Params**:
  - `page`: (default: 1)
  - `take`: (default: 10)
  - `search`: String (Optional - nama produk)
- **Contoh**: `/merchant/product?page=1&take=20&search=nasi`

### B. Filter Berdasarkan Metode Pengiriman
- **Pickup Only**: `/merchant/product/method-pickup`
- **Delivery Only**: `/merchant/product/method-delivery`
- **Both**: `/merchant/product/method-both`

### C. Detail Produk
- **URL**: `/merchant/product/:id` (ganti `:id` dengan ID produk)
- **Method**: `GET`

---

## 3. Keranjang Belanja (Cart)

Untuk menggunakan fitur ini, user harus Login.

### A. Tambah ke Keranjang
- **URL**: `/users/cart/add`
- **Method**: `POST`
- **Headers**: `Authorization: <token>`
- **Body**:
  - `product_id`: Number (ID Produk)
  - `quantity`: Number
  - `note`: String (Optional)

### B. Hapus dari Keranjang
- **URL**: `/users/cart/delete`
- **Method**: `DELETE`
- **Headers**: `Authorization: <token>`
- **Body**:
  - `cart_id`: Number (ID Item di keranjang, bukan product_id)

---

## 4. Checkout & Order

### A. Checkout
Proses ini akan mengubah semua item di keranjang menjadi pesanan.
- **URL**: `/orders/checkout`
- **Method**: `POST`
- **Headers**: `Authorization: <token>`
- **Body**:
  - `address_id`: Number (ID Alamat pengiriman pengguna)
- **Response**:
  - `snap_token`: Token untuk diproses oleh Midtrans Snap (Frontend SDK).
  - `snap_redirect_url`: URL redirect pembayaran (jika tidak pakai popup).

### B. Alur Pembayaran (Frontend)
1. Dapatkan `snap_token` dari response checkout.
2. Panggil fitur `window.snap.pay(snap_token)` (menggunakan Midtrans JS SDK).
3. Setelah sukses bayar, Midtrans akan mengirim notifikasi ke backend (`/orders/notification`).

---

## 5. Fitur Lain

### Forgot Password
1. **Request Reset**: `POST /users/forgot-password` (Body: `email`) -> Kirim link ke email.
2. **Halaman Reset**: `GET /users/reset-password?token=...&email=...` (Render HTML form).
3. **Submit Reset**: `POST /users/reset-password` (Body: `token`, `email`, `new_password`, `confirm_password`).

### Profile Update
- **URL**: `/users/current`
- **Method**: `PATCH`
- **Headers**: `Authorization: <token>`
- **Body**: `name`, `password`, dll.
