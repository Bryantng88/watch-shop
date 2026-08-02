import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapOriginTypeSchema } from '../enums/StrapOriginType.schema'

const makeSchema = () => z.object({
  set: StrapOriginTypeSchema.optional()
}).strict();
export const NullableEnumStrapOriginTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumStrapOriginTypeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumStrapOriginTypeFieldUpdateOperationsInput>;
export const NullableEnumStrapOriginTypeFieldUpdateOperationsInputObjectZodSchema = makeSchema();
