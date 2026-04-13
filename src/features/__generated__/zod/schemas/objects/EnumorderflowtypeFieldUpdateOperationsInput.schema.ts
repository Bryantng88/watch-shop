import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { orderflowtypeSchema } from '../enums/orderflowtype.schema'

const makeSchema = () => z.object({
  set: orderflowtypeSchema.optional()
}).strict();
export const EnumorderflowtypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumorderflowtypeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumorderflowtypeFieldUpdateOperationsInput>;
export const EnumorderflowtypeFieldUpdateOperationsInputObjectZodSchema = makeSchema();
