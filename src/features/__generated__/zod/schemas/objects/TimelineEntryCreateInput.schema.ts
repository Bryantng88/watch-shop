import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TimelineContainerTypeSchema } from '../enums/TimelineContainerType.schema';
import { TimelineSourceTypeSchema } from '../enums/TimelineSourceType.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  containerType: TimelineContainerTypeSchema,
  containerId: z.string(),
  sourceType: TimelineSourceTypeSchema,
  sourceId: z.string(),
  occurredAt: z.coerce.date(),
  actorUserId: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  bodySnapshot: z.string().optional().nullable(),
  visibility: z.string().optional(),
  metadataJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional()
}).strict();
export const TimelineEntryCreateInputObjectSchema: z.ZodType<Prisma.TimelineEntryCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.TimelineEntryCreateInput>;
export const TimelineEntryCreateInputObjectZodSchema = makeSchema();
