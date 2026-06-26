import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagOwnerTypeSchema } from '../enums/AppTagOwnerType.schema'

const makeSchema = () => z.object({
  set: AppTagOwnerTypeSchema.optional()
}).strict();
export const NullableEnumAppTagOwnerTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumAppTagOwnerTypeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumAppTagOwnerTypeFieldUpdateOperationsInput>;
export const NullableEnumAppTagOwnerTypeFieldUpdateOperationsInputObjectZodSchema = makeSchema();
