import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { discount_typeSchema } from '../enums/discount_type.schema'

const makeSchema = () => z.object({
  set: discount_typeSchema.optional()
}).strict();
export const NullableEnumdiscount_typeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumdiscount_typeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumdiscount_typeFieldUpdateOperationsInput>;
export const NullableEnumdiscount_typeFieldUpdateOperationsInputObjectZodSchema = makeSchema();
