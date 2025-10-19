import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { GlassSchema } from '../enums/Glass.schema'

const makeSchema = () => z.object({
  set: GlassSchema.optional()
}).strict();
export const EnumGlassFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumGlassFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumGlassFieldUpdateOperationsInput>;
export const EnumGlassFieldUpdateOperationsInputObjectZodSchema = makeSchema();
