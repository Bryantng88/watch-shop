import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { reservetypeSchema } from '../enums/reservetype.schema'

const makeSchema = () => z.object({
  set: reservetypeSchema.optional()
}).strict();
export const NullableEnumreservetypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumreservetypeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumreservetypeFieldUpdateOperationsInput>;
export const NullableEnumreservetypeFieldUpdateOperationsInputObjectZodSchema = makeSchema();
