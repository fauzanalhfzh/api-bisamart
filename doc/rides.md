# RIDES API Spec

## New Rides

Endpoint POST /api/rides/new-rides

Request Body :

```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "driver_id": "550e8400-e29b-41d4-a716-446655440000",
  "coupon_id": "550e8400-e29b-41d4-a716-446655440000",
  "current_location_name": "Janoor Coffe",
  "destination_location_name": "Cilegon Center Mall",
  "distance": 1200,
  "rating": 4
}
```

Response Body (Success) :

```json
{
  "data": {
    "id": "7d905952-d3f2-4649-a2aa-acf5d3c976d2",
    "user_id": "822007fb-ffd8-4478-b0bc-538c66707743",
    "driver_id": "863b8c18-04a2-4159-805c-bd214bb75961",
    "coupon_id": null,
    "charge": 11000,
    "current_location_name": "Janoor Coffe",
    "destination_location_name": "Cilegon Center Mall",
    "distance": 4.3,
    "status": "PENDING",
    "rating": 5,
    "created_at": "2024-09-28T23:20:31.681Z",
    "updated_at": "2024-09-28T23:20:31.681Z"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Driver not found"
}
```

## Update Status Rides

Endpoint POST /api/rides/new-rides

Headers :

- Authorization : token

Request Body :

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "ACCEPTED"
}
```

Response Body (Success) :

```json
{
  "data": {
    "id": "7d905952-d3f2-4649-a2aa-acf5d3c976d2",
    "user_id": "822007fb-ffd8-4478-b0bc-538c66707743",
    "driver_id": "863b8c18-04a2-4159-805c-bd214bb75961",
    "coupon_id": null,
    "charge": 11000,
    "current_location_name": "Janoor Coffe",
    "destination_location_name": "Cilegon Center Mall",
    "distance": 4.3,
    "status": "ACCEPTED",
    "rating": 5,
    "created_at": "2024-09-28T23:20:31.681Z",
    "updated_at": "2024-09-28T23:20:31.681Z"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Ride with ID 7d905952-d3f2-4649-a2aa-acf5d3c972d2 not found"
}
```
