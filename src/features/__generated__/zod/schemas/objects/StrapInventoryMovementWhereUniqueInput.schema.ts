import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const StrapInventoryMovementWhereUniqueInputObjectSchema: z.ZodType<Prisma.StrapInventoryMovementWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapInventoryMovementWhereUniqueInput>;
export const StrapInventoryMovementWhereUniqueInputObjectZodSchema = makeSchema();
