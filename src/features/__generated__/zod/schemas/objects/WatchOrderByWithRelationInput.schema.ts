import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ProductOrderByWithRelationInputObjectSchema as ProductOrderByWithRelationInputObjectSchema } from './ProductOrderByWithRelationInput.schema';
import { WatchContentOrderByWithRelationInputObjectSchema as WatchContentOrderByWithRelationInputObjectSchema } from './WatchContentOrderByWithRelationInput.schema';
import { WatchPriceOrderByWithRelationInputObjectSchema as WatchPriceOrderByWithRelationInputObjectSchema } from './WatchPriceOrderByWithRelationInput.schema';
import { WatchSpecV2OrderByWithRelationInputObjectSchema as WatchSpecV2OrderByWithRelationInputObjectSchema } from './WatchSpecV2OrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  legacyVariantId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  acquisitionId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  stockState: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  saleState: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  serviceState: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  siteChannel: SortOrderSchema.optional(),
  gender: SortOrderSchema.optional(),
  conditionGrade: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  movementType: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  movementCalibre: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  serialNumber: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  yearText: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  style: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  hasBox: SortOrderSchema.optional(),
  hasPapers: SortOrderSchema.optional(),
  specStatus: SortOrderSchema.optional(),
  notes: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  product: z.lazy(() => ProductOrderByWithRelationInputObjectSchema).optional(),
  watchContent: z.lazy(() => WatchContentOrderByWithRelationInputObjectSchema).optional(),
  watchPrice: z.lazy(() => WatchPriceOrderByWithRelationInputObjectSchema).optional(),
  watchSpecV2: z.lazy(() => WatchSpecV2OrderByWithRelationInputObjectSchema).optional()
}).strict();
export const WatchOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.WatchOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchOrderByWithRelationInput>;
export const WatchOrderByWithRelationInputObjectZodSchema = makeSchema();
