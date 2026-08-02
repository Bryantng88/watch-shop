import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapLengthClassSchema } from '../enums/StrapLengthClass.schema'

const makeSchema = () => z.object({
  set: StrapLengthClassSchema.optional()
}).strict();
export const NullableEnumStrapLengthClassFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumStrapLengthClassFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumStrapLengthClassFieldUpdateOperationsInput>;
export const NullableEnumStrapLengthClassFieldUpdateOperationsInputObjectZodSchema = makeSchema();
