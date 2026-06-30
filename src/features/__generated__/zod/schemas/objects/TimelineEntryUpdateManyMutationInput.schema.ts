import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { TimelineContainerTypeSchema } from '../enums/TimelineContainerType.schema';
import { EnumTimelineContainerTypeFieldUpdateOperationsInputObjectSchema as EnumTimelineContainerTypeFieldUpdateOperationsInputObjectSchema } from './EnumTimelineContainerTypeFieldUpdateOperationsInput.schema';
import { TimelineSourceTypeSchema } from '../enums/TimelineSourceType.schema';
import { EnumTimelineSourceTypeFieldUpdateOperationsInputObjectSchema as EnumTimelineSourceTypeFieldUpdateOperationsInputObjectSchema } from './EnumTimelineSourceTypeFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  containerType: z.union([TimelineContainerTypeSchema, z.lazy(() => EnumTimelineContainerTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  containerId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  sourceType: z.union([TimelineSourceTypeSchema, z.lazy(() => EnumTimelineSourceTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  sourceId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  occurredAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  actorUserId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  title: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  bodySnapshot: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  visibility: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  metadataJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const TimelineEntryUpdateManyMutationInputObjectSchema: z.ZodType<Prisma.TimelineEntryUpdateManyMutationInput> = makeSchema() as unknown as z.ZodType<Prisma.TimelineEntryUpdateManyMutationInput>;
export const TimelineEntryUpdateManyMutationInputObjectZodSchema = makeSchema();
