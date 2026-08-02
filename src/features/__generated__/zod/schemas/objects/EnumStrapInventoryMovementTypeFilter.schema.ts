import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapInventoryMovementTypeSchema } from '../enums/StrapInventoryMovementType.schema';
import { NestedEnumStrapInventoryMovementTypeFilterObjectSchema as NestedEnumStrapInventoryMovementTypeFilterObjectSchema } from './NestedEnumStrapInventoryMovementTypeFilter.schema'

const makeSchema = () => z.object({
  equals: StrapInventoryMovementTypeSchema.optional(),
  in: StrapInventoryMovementTypeSchema.array().optional(),
  notIn: StrapInventoryMovementTypeSchema.array().optional(),
  not: z.union([StrapInventoryMovementTypeSchema, z.lazy(() => NestedEnumStrapInventoryMovementTypeFilterObjectSchema)]).optional()
}).strict();
export const EnumStrapInventoryMovementTypeFilterObjectSchema: z.ZodType<Prisma.EnumStrapInventoryMovementTypeFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumStrapInventoryMovementTypeFilter>;
export const EnumStrapInventoryMovementTypeFilterObjectZodSchema = makeSchema();
