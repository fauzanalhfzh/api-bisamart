# User API Spec

## Sending OTP

Endpoint POST /api/users/phone-otp-request

Request Body :

```json
{
  "phone_number": "0812345"
}
```

Response Body (Success) :

```json
{
  "data": {
    "phone_number": "0812345"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Phone number already registered"
}
```

## Verify OTP

Endpoint : POST /api/users/verify-otp

Request Body :

```json
{
  "phone_number": "0812345",
  "otp": "12345"
}
```

Response Body (Success) :

```json
{
  "data": "Phone number verification successfully"
}
```

Response Body (Failed) :

```json
{
  "errors": "OTP is wrong"
}
```

## Sending Email OTP

Endpoint : POST /api/users/email-otp-request

Request Body :

```json
{
  "name": "Zen Alhafizh",
  "email": "test@example.com",
  "user_id": "_id1234143"
}
```

Response Body (Success) :

```json
{
  "data": {
    "email": "test@example.com",
    "name": "Zen Alhafizh"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Email OTP is wrong"
}
```

## Verify Email OTP

Endpoint : PUT /api/users/email-otp-verify

Request Body :

```json
{
  "otp": "12345",
  "token": "token"
}
```

Response Body (Success) :

```json
{
  "data": "Email verification successfully"
}
```

Response Body (Failed) :

```json
{
  "errors": "Activation code expired"
}
```

## Get Logged In User Data

Endpoint : GET /api/users/current

Headers :

- Authorization : jwtToken

Response Body (Success) :

```json
{
  "data": {
    "name": "Zen Alhafizh",
    "phone_number": "0812345",
    "email": "test@example.com"
  }
}
```

Request Error (Failed) :

```json
{
  "errors": "Unauthorized"
}
```

## Get Orders

