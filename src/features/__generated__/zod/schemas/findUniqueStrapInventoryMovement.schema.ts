import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StrapInventoryMovementSelectObjectSchema as StrapInventoryMovementSelectObjectSchema } from './objects/StrapInventoryMovementSelect.schema';
import { StrapInventoryMovementIncludeObjectSchema as StrapInventoryMovementIncludeObjectSchema } from './objects/StrapInventoryMovementInclude.schema';
import { StrapInventoryMovementWhereUniqueInputObjectSchema as StrapInventoryMovementWhereUniqueInputObjectSchema } from './objects/StrapInventoryMovementWhereUniqueInput.schema';

export const StrapInventoryMovementFindUniqueSchema: z.ZodType<Prisma.StrapInventoryMovementFindUniqueArgs> = z.object({ select: StrapInventoryMovementSelectObjectSchema.optional(), include: StrapInventoryMovementIncludeObjectSchema.optional(), where: StrapInventoryMovementWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.StrapInventoryMovementFindUniqueArgs>;

export const StrapInventoryMovementFindUniqueZodSchema = z.object({ select: StrapInventoryMovementSelectObjectSchema.optional(), include: StrapInventoryMovementIncludeObjectSchema.optional(), where: StrapInventoryMovementWhereUniqueInputObjectSchema }).strict();