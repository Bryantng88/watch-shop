import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StrapInventoryMovementSelectObjectSchema as StrapInventoryMovementSelectObjectSchema } from './objects/StrapInventoryMovementSelect.schema';
import { StrapInventoryMovementIncludeObjectSchema as StrapInventoryMovementIncludeObjectSchema } from './objects/StrapInventoryMovementInclude.schema';
import { StrapInventoryMovementUpdateInputObjectSchema as StrapInventoryMovementUpdateInputObjectSchema } from './objects/StrapInventoryMovementUpdateInput.schema';
import { StrapInventoryMovementUncheckedUpdateInputObjectSchema as StrapInventoryMovementUncheckedUpdateInputObjectSchema } from './objects/StrapInventoryMovementUncheckedUpdateInput.schema';
import { StrapInventoryMovementWhereUniqueInputObjectSchema as StrapInventoryMovementWhereUniqueInputObjectSchema } from './objects/StrapInventoryMovementWhereUniqueInput.schema';

export const StrapInventoryMovementUpdateOneSchema: z.ZodType<Prisma.StrapInventoryMovementUpdateArgs> = z.object({ select: StrapInventoryMovementSelectObjectSchema.optional(), include: StrapInventoryMovementIncludeObjectSchema.optional(), data: z.union([StrapInventoryMovementUpdateInputObjectSchema, StrapInventoryMovementUncheckedUpdateInputObjectSchema]), where: StrapInventoryMovementWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.StrapInventoryMovementUpdateArgs>;

export const StrapInventoryMovementUpdateOneZodSchema = z.object({ select: StrapInventoryMovementSelectObjectSchema.optional(), include: StrapInventoryMovementIncludeObjectSchema.optional(), data: z.union([StrapInventoryMovementUpdateInputObjectSchema, StrapInventoryMovementUncheckedUpdateInputObjectSchema]), where: StrapInventoryMovementWhereUniqueInputObjectSchema }).strict();