import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { GoldColorSchema } from '../enums/GoldColor.schema'

const makeSchema = () => z.object({
  set: GoldColorSchema.optional()
}).strict();
export const NullableEnumGoldColorFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumGoldColorFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumGoldColorFieldUpdateOperationsInput>;
export const NullableEnumGoldColorFieldUpdateOperationsInputObjectZodSchema = makeSchema();
