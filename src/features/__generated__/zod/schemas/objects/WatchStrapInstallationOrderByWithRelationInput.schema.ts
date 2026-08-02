import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { WatchOrderByWithRelationInputObjectSchema as WatchOrderByWithRelationInputObjectSchema } from './WatchOrderByWithRelationInput.schema';
import { ProductVariantOrderByWithRelationInputObjectSchema as ProductVariantOrderByWithRelationInputObjectSchema } from './ProductVariantOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  watchId: SortOrderSchema.optional(),
  strapVariantId: SortOrderSchema.optional(),
  ownershipMode: SortOrderSchema.optional(),
  installedFullLinks: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  installedHalfLinks: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  spareFullLinks: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  spareHalfLinks: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  endLinkCount: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  wristSizeMM: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  installedAt: SortOrderSchema.optional(),
  removedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  installedByUserId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  removedByUserId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sourceOrderId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  serviceRequestId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  watch: z.lazy(() => WatchOrderByWithRelationInputObjectSchema).optional(),
  strapVariant: z.lazy(() => ProductVariantOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const WatchStrapInstallationOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.WatchStrapInstallationOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchStrapInstallationOrderByWithRelationInput>;
export const WatchStrapInstallationOrderByWithRelationInputObjectZodSchema = makeSchema();
