# API contract — moved

The API contract now lives in the **`kls-api` repo** at `docs/API_CONTRACT.md`.

The backend owns the contract, so keeping the authoritative copy there stops three
repos drifting apart. This file is a pointer, not a copy.

Quick reference for this app:

- Browser calls `/api/proxy/*` (Next route handler) → FastAPI `/api/v1/*`
- Auth calls go to `/api/auth/*`, which set httpOnly cookies
- `NEXT_PUBLIC_USE_MOCKS=false` + `API_BASE_URL` switches from mock data to the real API
- `GET /me/journey` is the aggregate the dashboard renders from; the backend owns `stage`

Run the backend locally:

```bash
cd ../kls-api
docker compose up
```

Then set `API_BASE_URL=http://localhost:8000/api/v1` in `.env.local`.
