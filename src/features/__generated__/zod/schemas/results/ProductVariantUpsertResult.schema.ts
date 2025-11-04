import * as z from 'zod';
export const ProductVariantUpsertResultSchema = z.object({
  id: z.string(),
  productId: z.string(),
  sku: z.string().optional(),
  name: z.string().optional(),
  price: z.number().optional(),
  stockQty: z.number().int(),
  isStockManaged: z.boolean().optional(),
  maxQtyPerOrder: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  availabilityStatus: z.unknown(),
  acquisitionItem: z.array(z.unknown()),
  invoiceItem: z.array(z.unknown()),
  maintenancePart: z.array(z.unknown()),
  maintenanceRecord: z.array(z.unknown()),
  partSpec: z.unknown().optional(),
  product: z.unknown(),
  serviceRequest: z.array(z.unknown()),
  strapSpec: z.unknown().optional()
});