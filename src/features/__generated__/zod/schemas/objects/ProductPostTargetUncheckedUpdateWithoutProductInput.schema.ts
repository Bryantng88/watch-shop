import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema'

const makeSchema = () => z.object({
  postTargetId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const ProductPostTargetUncheckedUpdateWithoutProductInputObjectSchema: z.ZodType<Prisma.ProductPostTargetUncheckedUpdateWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetUncheckedUpdateWithoutProductInput>;
export const ProductPostTargetUncheckedUpdateWithoutProductInputObjectZodSchema = makeSchema();
