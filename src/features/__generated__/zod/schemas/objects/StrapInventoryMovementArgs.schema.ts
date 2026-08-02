import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapInventoryMovementSelectObjectSchema as StrapInventoryMovementSelectObjectSchema } from './StrapInventoryMovementSelect.schema';
import { StrapInventoryMovementIncludeObjectSchema as StrapInventoryMovementIncludeObjectSchema } from './StrapInventoryMovementInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => StrapInventoryMovementSelectObjectSchema).optional(),
  include: z.lazy(() => StrapInventoryMovementIncludeObjectSchema).optional()
}).strict();
export const StrapInventoryMovementArgsObjectSchema = makeSchema();
export const StrapInventoryMovementArgsObjectZodSchema = makeSchema();
