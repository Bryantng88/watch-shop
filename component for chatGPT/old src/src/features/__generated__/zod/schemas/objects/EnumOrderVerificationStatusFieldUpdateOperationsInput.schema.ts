import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderVerificationStatusSchema } from '../enums/OrderVerificationStatus.schema'

const makeSchema = () => z.object({
  set: OrderVerificationStatusSchema.optional()
}).strict();
export const EnumOrderVerificationStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumOrderVerificationStatusFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumOrderVerificationStatusFieldUpdateOperationsInput>;
export const EnumOrderVerificationStatusFieldUpdateOperationsInputObjectZodSchema = makeSchema();
