import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapClaspTypeSchema } from '../enums/StrapClaspType.schema'

const makeSchema = () => z.object({
  set: StrapClaspTypeSchema.optional()
}).strict();
export const EnumStrapClaspTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumStrapClaspTypeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumStrapClaspTypeFieldUpdateOperationsInput>;
export const EnumStrapClaspTypeFieldUpdateOperationsInputObjectZodSchema = makeSchema();
