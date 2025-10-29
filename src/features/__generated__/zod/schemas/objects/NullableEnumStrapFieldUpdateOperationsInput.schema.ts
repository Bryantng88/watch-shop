import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapSchema } from '../enums/Strap.schema'

const makeSchema = () => z.object({
  set: StrapSchema.optional()
}).strict();
export const NullableEnumStrapFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumStrapFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumStrapFieldUpdateOperationsInput>;
export const NullableEnumStrapFieldUpdateOperationsInputObjectZodSchema = makeSchema();
