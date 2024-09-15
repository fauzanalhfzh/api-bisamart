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
    "email": "test@example.com",
    "ratings": 0,
    "total_rides": 0,
    "created_at": "2024-09-15T05:54:26.710Z",
    "updated_at": "2024-09-15T05:54:33.496Z"
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
    "ratings": 0,
    "total_rides": 0,
    "created_at": "2024-09-15T05:54:26.710Z",
    "updated_at": "2024-09-15T05:54:33.496Z"
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

- Authorization : token

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "email": "test@example.com",
    "phone_number": "0812345",
    "name": "Zen Alhafizh",
    "ratings": 0,
    "total_rides": 0,
    "created_at": "2024-09-15T05:54:26.710Z",
    "updated_at": "2024-09-15T05:54:33.496Z"
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
    "id": 1,
    "email": "test@example.com",
    "phone_number": "0812345",
    "name": "Fauzan Alhafizh",
    "ratings": 0,
    "total_rides": 0,
    "created_at": "2024-09-15T05:54:26.710Z",
    "updated_at": "2024-09-15T05:54:33.496Z",
    "updated_at": "2024-09-15T05:54:33.496Z"
  }
}
```

## Logout Users

Endpoint: DELETE /api/users/current

Headers :

- Authorization: token

Response Body (Success) :

```json
{
  "data": true
}
```
