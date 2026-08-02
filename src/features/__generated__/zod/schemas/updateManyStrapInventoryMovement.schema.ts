import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StrapInventoryMovementUpdateManyMutationInputObjectSchema as StrapInventoryMovementUpdateManyMutationInputObjectSchema } from './objects/StrapInventoryMovementUpdateManyMutationInput.schema';
import { StrapInventoryMovementWhereInputObjectSchema as StrapInventoryMovementWhereInputObjectSchema } from './objects/StrapInventoryMovementWhereInput.schema';

export const StrapInventoryMovementUpdateManySchema: z.ZodType<Prisma.StrapInventoryMovementUpdateManyArgs> = z.object({ data: StrapInventoryMovementUpdateManyMutationInputObjectSchema, where: StrapInventoryMovementWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.StrapInventoryMovementUpdateManyArgs>;

export const StrapInventoryMovementUpdateManyZodSchema = z.object({ data: StrapInventoryMovementUpdateManyMutationInputObjectSchema, where: StrapInventoryMovementWhereInputObjectSchema.optional() }).strict();