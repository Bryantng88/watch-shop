import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { NullableDecimalFieldUpdateOperationsInputObjectSchema as NullableDecimalFieldUpdateOperationsInputObjectSchema } from './NullableDecimalFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { ProductVariantUpdateOneWithoutMaintenancePartNestedInputObjectSchema as ProductVariantUpdateOneWithoutMaintenancePartNestedInputObjectSchema } from './ProductVariantUpdateOneWithoutMaintenancePartNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  quantity: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  unitCost: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  notes: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  variant: z.lazy(() => ProductVariantUpdateOneWithoutMaintenancePartNestedInputObjectSchema).optional()
}).strict();
export const MaintenancePartUpdateWithoutRecordInputObjectSchema: z.ZodType<Prisma.MaintenancePartUpdateWithoutRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartUpdateWithoutRecordInput>;
export const MaintenancePartUpdateWithoutRecordInputObjectZodSchema = makeSchema();
