import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema as NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { AcquisitionItemUpdateOneRequiredWithoutAcquisitionSpecJobNestedInputObjectSchema as AcquisitionItemUpdateOneRequiredWithoutAcquisitionSpecJobNestedInputObjectSchema } from './AcquisitionItemUpdateOneRequiredWithoutAcquisitionSpecJobNestedInput.schema';
import { ProductUpdateOneRequiredWithoutAcquisitionSpecJobNestedInputObjectSchema as ProductUpdateOneRequiredWithoutAcquisitionSpecJobNestedInputObjectSchema } from './ProductUpdateOneRequiredWithoutAcquisitionSpecJobNestedInput.schema';
import { AcquisitionSpecJobLogUpdateManyWithoutAcquisitionSpecJobNestedInputObjectSchema as AcquisitionSpecJobLogUpdateManyWithoutAcquisitionSpecJobNestedInputObjectSchema } from './AcquisitionSpecJobLogUpdateManyWithoutAcquisitionSpecJobNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  attempts: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  lastError: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  startedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  finishedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  runAfter: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  priority: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  acquisitionItem: z.lazy(() => AcquisitionItemUpdateOneRequiredWithoutAcquisitionSpecJobNestedInputObjectSchema).optional(),
  product: z.lazy(() => ProductUpdateOneRequiredWithoutAcquisitionSpecJobNestedInputObjectSchema).optional(),
  logs: z.lazy(() => AcquisitionSpecJobLogUpdateManyWithoutAcquisitionSpecJobNestedInputObjectSchema).optional()
}).strict();
export const AcquisitionSpecJobUpdateInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobUpdateInput>;
export const AcquisitionSpecJobUpdateInputObjectZodSchema = makeSchema();
