import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { LengthLabelSchema } from '../enums/LengthLabel.schema'

const makeSchema = () => z.object({
  set: LengthLabelSchema.optional()
}).strict();
export const NullableEnumLengthLabelFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumLengthLabelFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumLengthLabelFieldUpdateOperationsInput>;
export const NullableEnumLengthLabelFieldUpdateOperationsInputObjectZodSchema = makeSchema();
