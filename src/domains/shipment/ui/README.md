# Shipment client/UI patch

Copy these files into `src/domains/shipment`. The `page.tsx` file should go to your admin app route for `/admin/shipments`.

This UI assumes the server/API patch already exists:
- `GET /api/admin/shipments`
- `PATCH /api/admin/shipments/[id]`
- `POST /api/admin/shipments/[id]/fee`
- `POST /api/admin/shipments/[id]/deliver`
- `POST /api/admin/shipments/[id]/return`
