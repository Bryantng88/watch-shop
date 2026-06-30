import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TimelineContainerTypeSchema } from '../enums/TimelineContainerType.schema';
import { TimelineSourceTypeSchema } from '../enums/TimelineSourceType.schema'

const makeSchema = () => z.object({
  containerType: TimelineContainerTypeSchema,
  containerId: z.string(),
  sourceType: TimelineSourceTypeSchema,
  sourceId: z.string()
}).strict();
export const TimelineEntryContainerTypeContainerIdSourceTypeSourceIdCompoundUniqueInputObjectSchema: z.ZodType<Prisma.TimelineEntryContainerTypeContainerIdSourceTypeSourceIdCompoundUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.TimelineEntryContainerTypeContainerIdSourceTypeSourceIdCompoundUniqueInput>;
export const TimelineEntryContainerTypeContainerIdSourceTypeSourceIdCompoundUniqueInputObjectZodSchema = makeSchema();
