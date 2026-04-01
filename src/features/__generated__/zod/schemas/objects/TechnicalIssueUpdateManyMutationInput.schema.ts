import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { TechnicalIssueTypeSchema } from '../enums/TechnicalIssueType.schema';
import { EnumTechnicalIssueTypeFieldUpdateOperationsInputObjectSchema as EnumTechnicalIssueTypeFieldUpdateOperationsInputObjectSchema } from './EnumTechnicalIssueTypeFieldUpdateOperationsInput.schema';
import { TechnicalActionModeSchema } from '../enums/TechnicalActionMode.schema';
import { EnumTechnicalActionModeFieldUpdateOperationsInputObjectSchema as EnumTechnicalActionModeFieldUpdateOperationsInputObjectSchema } from './EnumTechnicalActionModeFieldUpdateOperationsInput.schema';
import { NullableDecimalFieldUpdateOperationsInputObjectSchema as NullableDecimalFieldUpdateOperationsInputObjectSchema } from './NullableDecimalFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  area: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  issueType: z.union([TechnicalIssueTypeSchema, z.lazy(() => EnumTechnicalIssueTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  actionMode: z.union([TechnicalActionModeSchema, z.lazy(() => EnumTechnicalActionModeFieldUpdateOperationsInputObjectSchema)]).optional(),
  note: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  estimatedCost: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  sortOrder: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const TechnicalIssueUpdateManyMutationInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpdateManyMutationInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpdateManyMutationInput>;
export const TechnicalIssueUpdateManyMutationInputObjectZodSchema = makeSchema();
