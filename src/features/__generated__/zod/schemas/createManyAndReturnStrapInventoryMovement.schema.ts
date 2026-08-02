import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StrapInventoryMovementSelectObjectSchema as StrapInventoryMovementSelectObjectSchema } from './objects/StrapInventoryMovementSelect.schema';
import { StrapInventoryMovementCreateManyInputObjectSchema as StrapInventoryMovementCreateManyInputObjectSchema } from './objects/StrapInventoryMovementCreateManyInput.schema';

export const StrapInventoryMovementCreateManyAndReturnSchema: z.ZodType<Prisma.StrapInventoryMovementCreateManyAndReturnArgs> = z.object({ select: StrapInventoryMovementSelectObjectSchema.optional(), data: z.union([ StrapInventoryMovementCreateManyInputObjectSchema, z.array(StrapInventoryMovementCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.StrapInventoryMovementCreateManyAndReturnArgs>;

export const StrapInventoryMovementCreateManyAndReturnZodSchema = z.object({ select: StrapInventoryMovementSelectObjectSchema.optional(), data: z.union([ StrapInventoryMovementCreateManyInputObjectSchema, z.array(StrapInventoryMovementCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();