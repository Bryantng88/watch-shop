import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { GenderSchema } from '../enums/Gender.schema'

const makeSchema = () => z.object({
  set: GenderSchema.optional()
}).strict();
export const EnumGenderFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumGenderFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumGenderFieldUpdateOperationsInput>;
export const EnumGenderFieldUpdateOperationsInputObjectZodSchema = makeSchema();
