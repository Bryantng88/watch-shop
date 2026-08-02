import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StrapInventoryMovementSelectObjectSchema as StrapInventoryMovementSelectObjectSchema } from './objects/StrapInventoryMovementSelect.schema';
import { StrapInventoryMovementUpdateManyMutationInputObjectSchema as StrapInventoryMovementUpdateManyMutationInputObjectSchema } from './objects/StrapInventoryMovementUpdateManyMutationInput.schema';
import { StrapInventoryMovementWhereInputObjectSchema as StrapInventoryMovementWhereInputObjectSchema } from './objects/StrapInventoryMovementWhereInput.schema';

export const StrapInventoryMovementUpdateManyAndReturnSchema: z.ZodType<Prisma.StrapInventoryMovementUpdateManyAndReturnArgs> = z.object({ select: StrapInventoryMovementSelectObjectSchema.optional(), data: StrapInventoryMovementUpdateManyMutationInputObjectSchema, where: StrapInventoryMovementWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.StrapInventoryMovementUpdateManyAndReturnArgs>;

export const StrapInventoryMovementUpdateManyAndReturnZodSchema = z.object({ select: StrapInventoryMovementSelectObjectSchema.optional(), data: StrapInventoryMovementUpdateManyMutationInputObjectSchema, where: StrapInventoryMovementWhereInputObjectSchema.optional() }).strict();