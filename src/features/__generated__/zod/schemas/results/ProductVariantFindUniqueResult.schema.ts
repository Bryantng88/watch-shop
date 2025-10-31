import * as z from 'zod';
export const ProductVariantFindUniqueResultSchema = z.nullable(z.object({
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
  AcquisitionItem: z.array(z.unknown()),
  InvoiceItem: z.array(z.unknown()),
  MaintenancePart: z.array(z.unknown()),
  MaintenanceRecord: z.array(z.unknown()),
  partSpec: z.unknown().optional(),
  product: z.unknown(),
  ServiceRequest: z.array(z.unknown()),
  strapSpec: z.unknown().optional()
}));