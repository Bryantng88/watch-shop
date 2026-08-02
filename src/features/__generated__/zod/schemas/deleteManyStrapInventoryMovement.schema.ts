import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StrapInventoryMovementWhereInputObjectSchema as StrapInventoryMovementWhereInputObjectSchema } from './objects/StrapInventoryMovementWhereInput.schema';

export const StrapInventoryMovementDeleteManySchema: z.ZodType<Prisma.StrapInventoryMovementDeleteManyArgs> = z.object({ where: StrapInventoryMovementWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.StrapInventoryMovementDeleteManyArgs>;

export const StrapInventoryMovementDeleteManyZodSchema = z.object({ where: StrapInventoryMovementWhereInputObjectSchema.optional() }).strict();