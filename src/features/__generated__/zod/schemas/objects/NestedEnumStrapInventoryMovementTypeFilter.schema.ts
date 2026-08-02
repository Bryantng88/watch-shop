import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapInventoryMovementTypeSchema } from '../enums/StrapInventoryMovementType.schema'

const nestedenumstrapinventorymovementtypefilterSchema = z.object({
  equals: StrapInventoryMovementTypeSchema.optional(),
  in: StrapInventoryMovementTypeSchema.array().optional(),
  notIn: StrapInventoryMovementTypeSchema.array().optional(),
  not: z.union([StrapInventoryMovementTypeSchema, z.lazy(() => NestedEnumStrapInventoryMovementTypeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumStrapInventoryMovementTypeFilterObjectSchema: z.ZodType<Prisma.NestedEnumStrapInventoryMovementTypeFilter> = nestedenumstrapinventorymovementtypefilterSchema as unknown as z.ZodType<Prisma.NestedEnumStrapInventoryMovementTypeFilter>;
export const NestedEnumStrapInventoryMovementTypeFilterObjectZodSchema = nestedenumstrapinventorymovementtypefilterSchema;
