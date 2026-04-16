import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { GlassSchema } from '../enums/Glass.schema'

const makeSchema = () => z.object({
  set: GlassSchema.optional()
}).strict();
export const NullableEnumGlassFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumGlassFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumGlassFieldUpdateOperationsInput>;
export const NullableEnumGlassFieldUpdateOperationsInputObjectZodSchema = makeSchema();
