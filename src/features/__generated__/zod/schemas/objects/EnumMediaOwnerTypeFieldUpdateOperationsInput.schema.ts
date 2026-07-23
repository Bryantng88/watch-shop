import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaOwnerTypeSchema } from '../enums/MediaOwnerType.schema'

const makeSchema = () => z.object({
  set: MediaOwnerTypeSchema.optional()
}).strict();
export const EnumMediaOwnerTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumMediaOwnerTypeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumMediaOwnerTypeFieldUpdateOperationsInput>;
export const EnumMediaOwnerTypeFieldUpdateOperationsInputObjectZodSchema = makeSchema();
