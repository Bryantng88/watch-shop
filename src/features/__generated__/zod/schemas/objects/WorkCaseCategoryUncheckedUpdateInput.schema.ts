import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { WorkCaseScopeSchema } from '../enums/WorkCaseScope.schema';
import { EnumWorkCaseScopeFieldUpdateOperationsInputObjectSchema as EnumWorkCaseScopeFieldUpdateOperationsInputObjectSchema } from './EnumWorkCaseScopeFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { WorkCaseUncheckedUpdateManyWithoutCategoryNestedInputObjectSchema as WorkCaseUncheckedUpdateManyWithoutCategoryNestedInputObjectSchema } from './WorkCaseUncheckedUpdateManyWithoutCategoryNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  code: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  scope: z.union([WorkCaseScopeSchema, z.lazy(() => EnumWorkCaseScopeFieldUpdateOperationsInputObjectSchema)]).optional(),
  isActive: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  sortOrder: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  workCases: z.lazy(() => WorkCaseUncheckedUpdateManyWithoutCategoryNestedInputObjectSchema).optional()
}).strict();
export const WorkCaseCategoryUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.WorkCaseCategoryUncheckedUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCategoryUncheckedUpdateInput>;
export const WorkCaseCategoryUncheckedUpdateInputObjectZodSchema = makeSchema();
