import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapSchema } from '../enums/Strap.schema'

const makeSchema = () => z.object({
  set: StrapSchema.optional()
}).strict();
export const EnumStrapFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumStrapFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumStrapFieldUpdateOperationsInput>;
export const EnumStrapFieldUpdateOperationsInputObjectZodSchema = makeSchema();
