import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { TechnicalIssueUncheckedUpdateManyWithoutTechnicalDetailCatalogNestedInputObjectSchema as TechnicalIssueUncheckedUpdateManyWithoutTechnicalDetailCatalogNestedInputObjectSchema } from './TechnicalIssueUncheckedUpdateManyWithoutTechnicalDetailCatalogNestedInput.schema';
import { TaskActionUncheckedUpdateManyWithoutTechnicalDetailCatalogNestedInputObjectSchema as TaskActionUncheckedUpdateManyWithoutTechnicalDetailCatalogNestedInputObjectSchema } from './TaskActionUncheckedUpdateManyWithoutTechnicalDetailCatalogNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  area: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  code: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  sortOrder: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  isActive: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  technicalIssues: z.lazy(() => TechnicalIssueUncheckedUpdateManyWithoutTechnicalDetailCatalogNestedInputObjectSchema).optional(),
  taskAction: z.lazy(() => TaskActionUncheckedUpdateManyWithoutTechnicalDetailCatalogNestedInputObjectSchema).optional()
}).strict();
export const TechnicalDetailCatalogUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.TechnicalDetailCatalogUncheckedUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogUncheckedUpdateInput>;
export const TechnicalDetailCatalogUncheckedUpdateInputObjectZodSchema = makeSchema();
