import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { WorkCaseUpdateOneRequiredWithoutActivitiesNestedInputObjectSchema as WorkCaseUpdateOneRequiredWithoutActivitiesNestedInputObjectSchema } from './WorkCaseUpdateOneRequiredWithoutActivitiesNestedInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  action: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  note: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  metadata: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  workCase: z.lazy(() => WorkCaseUpdateOneRequiredWithoutActivitiesNestedInputObjectSchema).optional()
}).strict();
export const WorkCaseActivityUpdateWithoutActorInputObjectSchema: z.ZodType<Prisma.WorkCaseActivityUpdateWithoutActorInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseActivityUpdateWithoutActorInput>;
export const WorkCaseActivityUpdateWithoutActorInputObjectZodSchema = makeSchema();
