# sensors-backend

## Routes
POST /api/sensors
```
    sensorId: integer,
    temp1: double precision NULL
    temp2: double precision NULL,
    temp3: double precision NULL,
    temp4: double precision NULL,
    temp5: double precision NULL,
    hum1: double precision NULL,
    hum2: double precision NULL,
    rain: integer NULL,
    batLevel: double precision NULL,
    createdAt: timestamptz,
    updateAt: timestamptz
```

GET /api/sensors