import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { paymentstatusSchema } from '../enums/paymentstatus.schema'

const makeSchema = () => z.object({
  set: paymentstatusSchema.optional()
}).strict();
export const NullableEnumpaymentstatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumpaymentstatusFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumpaymentstatusFieldUpdateOperationsInput>;
export const NullableEnumpaymentstatusFieldUpdateOperationsInputObjectZodSchema = makeSchema();
