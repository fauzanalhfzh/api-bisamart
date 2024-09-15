# Driver API Spec

## Register Driver

Endpoint POST /api/drivers

Request Body :

```json
{
  "name": "Zen",
  "phone_number": "0812345",
  "email": "zen@example.com",
  "password": "test123",
  "country": "Indonesia",
  "ktp": "367232145643",
  "address_ktp": "Jl. Pasti ketemu",
  "ktp_img": "public/drivers/ktp/SID33423123.png",
  "vehicle_type": "MOTOR",
  "sim": "765498743214",
  "sim_img": "public/drivers/sim/SIM33423123.png",
  "selfie_with_sim": "SEIM3606762101234.png",
  "vehicle_brand": "Honda Beat",
  "vehicle_color": "Biru Putih",
  "license_plate": "DM 1243 AR",
  "registration_number": "4546221234822",
  "profil_img": "public/drivers/profile/PIM33423123.png"
}
```

Response Body (Success) :

```json
{
  "data" {
    "name": "Zen",
    "phone_number": "0812345",
    "email": "test@example.com",
    "password": "test123",
    "country": "Indonesia",
    "ktp": "367232145643",
    "address_ktp": "Jl. Pasti ketemu",
    "ktp_img": "public/drivers/ktp/SID33423123.png",
    "vehicle_type": "MOTOR",
    "sim": "765498743214",
    "sim_img": "public/drivers/sim/SIM33423123.png",
    "selfie_with_sim": "SEIM3606762101234.png",
    "vehicle_brand": "Honda Beat",
    "vehicle_color": "Biru Putih",
    "license_plate": "DM 1243 AR",
    "registration_number": "4546221234822",
    "profil_img": "public/drivers/profile/PIM33423123.png"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "KTP already registered"
}
```

## Login User

Endpoint : POST /api/drivers/login

Request Body :

```json
{
  "email": "test@example.com",
  "password": "test123"
}
```

Response Body (Success):

```json
{
  "data": {
    "name": "Zen",
    "phone_number": "0812345",
    "email": "test@example.com",
    "country": "Indonesia",
    "ktp": "367232145643",
    "address_ktp": "Jl. Pasti ketemu",
    "ktp_img": "public/drivers/ktp/SID33423123.png",
    "vehicle_type": "MOTOR",
    "sim": "765498743214",
    "sim_img": "public/drivers/sim/SIM33423123.png",
    "selfie_with_sim": "SEIM3606762101234.png",
    "vehicle_brand": "Honda Beat",
    "vehicle_color": "Biru Putih",
    "license_plate": "DM 1243 AR",
    "registration_number": "4546221234822",
    "profil_img": "public/drivers/profile/PIM33423123.png",
    "token": "session_id_generated"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Username or password is wrong"
}
```

## Get Drivers

Endpoint : GET /api/users/current

Headers :

- Authorization : token

Response Body (Success):

```json
{
  "data": {
    "name": "Zen",
    "phone_number": "0812345",
    "email": "test@example.com",
    "country": "Indonesia",
    "ktp": "367232145643",
    "address_ktp": "Jl. Pasti ketemu",
    "ktp_img": "public/drivers/ktp/SID33423123.png",
    "vehicle_type": "MOTOR",
    "sim": "765498743214",
    "sim_img": "public/drivers/sim/SIM33423123.png",
    "selfie_with_sim": "SEIM3606762101234.png",
    "vehicle_brand": "Honda Beat",
    "vehicle_color": "Biru Putih",
    "license_plate": "DM 1243 AR",
    "registration_number": "4546221234822",
    "profil_img": "public/drivers/profile/PIM33423123.png",
    "ratings": 0,
    "total_earning": 0,
    "total_rides": 0,
    "pending_rides": 0,
    "cancel_rides": 0,
    "status": "INACTIVE",
    "created_at": "22-09-2024",
    "updated_at": "22-09-2024",
    "token": "session_id_generated"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized"
}
```

## Logout Drivers

Endpoint: DELETE /api/drivers/current

Headers :

- Authorization: token

Response Body (Success) :

```json
{
  "data": true
}
```
