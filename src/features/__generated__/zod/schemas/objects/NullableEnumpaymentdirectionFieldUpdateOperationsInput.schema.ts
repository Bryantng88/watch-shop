import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { paymentdirectionSchema } from '../enums/paymentdirection.schema'

const makeSchema = () => z.object({
  set: paymentdirectionSchema.optional()
}).strict();
export const NullableEnumpaymentdirectionFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumpaymentdirectionFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumpaymentdirectionFieldUpdateOperationsInput>;
export const NullableEnumpaymentdirectionFieldUpdateOperationsInputObjectZodSchema = makeSchema();
