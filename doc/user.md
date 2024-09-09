# User API Spec

## Register User

Endpoint POST /api/users

Request Body :

```json
{
  "name": "Zen ALhaifzh",
  "phone_number": "0812345",
  "email": "test@example.com",
  "password": "test123"
}
```

Response Body (Success) :

```json
{
  "data": {
    "name": "Zen ALhaifzh",
    "phone_number": "0812345",
    "email": "test@example.com"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Phone number already registered"
}
```

## Login User

Endpoint : POST /api/users/login

Request Body :

```json
{
  "email": "test@example.com",
  "password": "test123"
}
```

Response Body (Success) :

```json
{
  "data": {
    "email": "test@example.com",
    "phone_number": "0812345",
    "name": "Zen Alhafizh",
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

## Get User

Endpoint : GET /api/users/current

Headers :

- Authorization: token

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "email": "test@example.com",
    "phone_number": "0812345",
    "name": "Zen Alhafizh",
    "ratings": 5,
    "total_rides": 2,
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

## Update User

Endpoint : Patch /api/users/current

Request Body :

```json
{
  "name": "Fauzan Alhafizh", // optional, if want to change name
  "password": "rahasia" // optional, if want to change password
}
```

Response Body (Success) :

```json
{
  "data": {
    "name": "Fauzan Alhafizh", // optional, if want to change name
    "password": "rahasia" // optional, if want to change password
  }
}
```
