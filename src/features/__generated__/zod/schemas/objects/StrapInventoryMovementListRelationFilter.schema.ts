import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapInventoryMovementWhereInputObjectSchema as StrapInventoryMovementWhereInputObjectSchema } from './StrapInventoryMovementWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => StrapInventoryMovementWhereInputObjectSchema).optional(),
  some: z.lazy(() => StrapInventoryMovementWhereInputObjectSchema).optional(),
  none: z.lazy(() => StrapInventoryMovementWhereInputObjectSchema).optional()
}).strict();
export const StrapInventoryMovementListRelationFilterObjectSchema: z.ZodType<Prisma.StrapInventoryMovementListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.StrapInventoryMovementListRelationFilter>;
export const StrapInventoryMovementListRelationFilterObjectZodSchema = makeSchema();
