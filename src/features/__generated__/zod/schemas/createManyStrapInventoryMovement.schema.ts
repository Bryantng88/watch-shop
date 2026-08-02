import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StrapInventoryMovementCreateManyInputObjectSchema as StrapInventoryMovementCreateManyInputObjectSchema } from './objects/StrapInventoryMovementCreateManyInput.schema';

export const StrapInventoryMovementCreateManySchema: z.ZodType<Prisma.StrapInventoryMovementCreateManyArgs> = z.object({ data: z.union([ StrapInventoryMovementCreateManyInputObjectSchema, z.array(StrapInventoryMovementCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.StrapInventoryMovementCreateManyArgs>;

export const StrapInventoryMovementCreateManyZodSchema = z.object({ data: z.union([ StrapInventoryMovementCreateManyInputObjectSchema, z.array(StrapInventoryMovementCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();