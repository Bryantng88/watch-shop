import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  variantId: z.literal(true).optional(),
  color: z.literal(true).optional(),
  material: z.literal(true).optional(),
  quickRelease: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  lugWidthMM: z.literal(true).optional(),
  buckleWidthMM: z.literal(true).optional(),
  originType: z.literal(true).optional(),
  brandName: z.literal(true).optional(),
  leatherType: z.literal(true).optional(),
  surface: z.literal(true).optional(),
  inventoryPolicy: z.literal(true).optional(),
  claspType: z.literal(true).optional(),
  claspWidthMM: z.literal(true).optional(),
  claspOriginType: z.literal(true).optional(),
  finish: z.literal(true).optional(),
  lengthClass: z.literal(true).optional(),
  minStockQty: z.literal(true).optional(),
  targetStockQty: z.literal(true).optional(),
  braceletReference: z.literal(true).optional(),
  defaultFullLinks: z.literal(true).optional(),
  defaultHalfLinks: z.literal(true).optional(),
  defaultEndLinks: z.literal(true).optional()
}).strict();
export const StrapVariantSpecMaxAggregateInputObjectSchema: z.ZodType<Prisma.StrapVariantSpecMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.StrapVariantSpecMaxAggregateInputType>;
export const StrapVariantSpecMaxAggregateInputObjectZodSchema = makeSchema();
