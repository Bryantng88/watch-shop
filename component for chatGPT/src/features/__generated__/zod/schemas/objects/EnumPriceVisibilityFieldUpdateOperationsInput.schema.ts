import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PriceVisibilitySchema } from '../enums/PriceVisibility.schema'

const makeSchema = () => z.object({
  set: PriceVisibilitySchema.optional()
}).strict();
export const EnumPriceVisibilityFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumPriceVisibilityFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumPriceVisibilityFieldUpdateOperationsInput>;
export const EnumPriceVisibilityFieldUpdateOperationsInputObjectZodSchema = makeSchema();
