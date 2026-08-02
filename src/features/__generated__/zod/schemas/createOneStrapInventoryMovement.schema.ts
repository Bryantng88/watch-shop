import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StrapInventoryMovementSelectObjectSchema as StrapInventoryMovementSelectObjectSchema } from './objects/StrapInventoryMovementSelect.schema';
import { StrapInventoryMovementIncludeObjectSchema as StrapInventoryMovementIncludeObjectSchema } from './objects/StrapInventoryMovementInclude.schema';
import { StrapInventoryMovementCreateInputObjectSchema as StrapInventoryMovementCreateInputObjectSchema } from './objects/StrapInventoryMovementCreateInput.schema';
import { StrapInventoryMovementUncheckedCreateInputObjectSchema as StrapInventoryMovementUncheckedCreateInputObjectSchema } from './objects/StrapInventoryMovementUncheckedCreateInput.schema';

export const StrapInventoryMovementCreateOneSchema: z.ZodType<Prisma.StrapInventoryMovementCreateArgs> = z.object({ select: StrapInventoryMovementSelectObjectSchema.optional(), include: StrapInventoryMovementIncludeObjectSchema.optional(), data: z.union([StrapInventoryMovementCreateInputObjectSchema, StrapInventoryMovementUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.StrapInventoryMovementCreateArgs>;

export const StrapInventoryMovementCreateOneZodSchema = z.object({ select: StrapInventoryMovementSelectObjectSchema.optional(), include: StrapInventoryMovementIncludeObjectSchema.optional(), data: z.union([StrapInventoryMovementCreateInputObjectSchema, StrapInventoryMovementUncheckedCreateInputObjectSchema]) }).strict();