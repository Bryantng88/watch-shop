import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapInventoryMovementTypeSchema } from '../enums/StrapInventoryMovementType.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumStrapInventoryMovementTypeFilterObjectSchema as NestedEnumStrapInventoryMovementTypeFilterObjectSchema } from './NestedEnumStrapInventoryMovementTypeFilter.schema'

const nestedenumstrapinventorymovementtypewithaggregatesfilterSchema = z.object({
  equals: StrapInventoryMovementTypeSchema.optional(),
  in: StrapInventoryMovementTypeSchema.array().optional(),
  notIn: StrapInventoryMovementTypeSchema.array().optional(),
  not: z.union([StrapInventoryMovementTypeSchema, z.lazy(() => NestedEnumStrapInventoryMovementTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumStrapInventoryMovementTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumStrapInventoryMovementTypeFilterObjectSchema).optional()
}).strict();
export const NestedEnumStrapInventoryMovementTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumStrapInventoryMovementTypeWithAggregatesFilter> = nestedenumstrapinventorymovementtypewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumStrapInventoryMovementTypeWithAggregatesFilter>;
export const NestedEnumStrapInventoryMovementTypeWithAggregatesFilterObjectZodSchema = nestedenumstrapinventorymovementtypewithaggregatesfilterSchema;
