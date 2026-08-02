import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapClaspTypeSchema } from '../enums/StrapClaspType.schema'

const makeSchema = () => z.object({
  set: StrapClaspTypeSchema.optional()
}).strict();
export const NullableEnumStrapClaspTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumStrapClaspTypeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumStrapClaspTypeFieldUpdateOperationsInput>;
export const NullableEnumStrapClaspTypeFieldUpdateOperationsInputObjectZodSchema = makeSchema();
