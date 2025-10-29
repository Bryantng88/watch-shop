import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { GenderSchema } from '../enums/Gender.schema'

const makeSchema = () => z.object({
  set: GenderSchema.optional()
}).strict();
export const NullableEnumGenderFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumGenderFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumGenderFieldUpdateOperationsInput>;
export const NullableEnumGenderFieldUpdateOperationsInputObjectZodSchema = makeSchema();
