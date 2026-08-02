import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapOriginTypeSchema } from '../enums/StrapOriginType.schema'

const makeSchema = () => z.object({
  set: StrapOriginTypeSchema.optional()
}).strict();
export const EnumStrapOriginTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumStrapOriginTypeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumStrapOriginTypeFieldUpdateOperationsInput>;
export const EnumStrapOriginTypeFieldUpdateOperationsInputObjectZodSchema = makeSchema();
