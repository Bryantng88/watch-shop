import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapInventoryMovementTypeSchema } from '../enums/StrapInventoryMovementType.schema';
import { NestedEnumStrapInventoryMovementTypeWithAggregatesFilterObjectSchema as NestedEnumStrapInventoryMovementTypeWithAggregatesFilterObjectSchema } from './NestedEnumStrapInventoryMovementTypeWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumStrapInventoryMovementTypeFilterObjectSchema as NestedEnumStrapInventoryMovementTypeFilterObjectSchema } from './NestedEnumStrapInventoryMovementTypeFilter.schema'

const makeSchema = () => z.object({
  equals: StrapInventoryMovementTypeSchema.optional(),
  in: StrapInventoryMovementTypeSchema.array().optional(),
  notIn: StrapInventoryMovementTypeSchema.array().optional(),
  not: z.union([StrapInventoryMovementTypeSchema, z.lazy(() => NestedEnumStrapInventoryMovementTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumStrapInventoryMovementTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumStrapInventoryMovementTypeFilterObjectSchema).optional()
}).strict();
export const EnumStrapInventoryMovementTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumStrapInventoryMovementTypeWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumStrapInventoryMovementTypeWithAggregatesFilter>;
export const EnumStrapInventoryMovementTypeWithAggregatesFilterObjectZodSchema = makeSchema();
