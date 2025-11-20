import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  acquisitionId: z.literal(true).optional(),
  productId: z.literal(true).optional(),
  variantId: z.literal(true).optional(),
  quantity: z.literal(true).optional(),
  unitCost: z.literal(true).optional(),
  currency: z.literal(true).optional(),
  notes: z.literal(true).optional(),
  sourceOrderItemId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  kind: z.literal(true).optional(),
  status: z.literal(true).optional(),
  description: z.literal(true).optional(),
  expectedReturnAt: z.literal(true).optional(),
  returnedAt: z.literal(true).optional(),
  vendorRmaNo: z.literal(true).optional(),
  warrantyMonths: z.literal(true).optional(),
  serviceRequestId: z.literal(true).optional(),
  capitalizeToProduct: z.literal(true).optional(),
  productType: z.literal(true).optional()
}).strict();
export const AcquisitionItemMaxAggregateInputObjectSchema: z.ZodType<Prisma.AcquisitionItemMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemMaxAggregateInputType>;
export const AcquisitionItemMaxAggregateInputObjectZodSchema = makeSchema();
