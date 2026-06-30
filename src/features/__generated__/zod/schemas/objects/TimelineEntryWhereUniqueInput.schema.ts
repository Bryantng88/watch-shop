import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TimelineEntryContainerTypeContainerIdSourceTypeSourceIdCompoundUniqueInputObjectSchema as TimelineEntryContainerTypeContainerIdSourceTypeSourceIdCompoundUniqueInputObjectSchema } from './TimelineEntryContainerTypeContainerIdSourceTypeSourceIdCompoundUniqueInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  containerType_containerId_sourceType_sourceId: z.lazy(() => TimelineEntryContainerTypeContainerIdSourceTypeSourceIdCompoundUniqueInputObjectSchema).optional()
}).strict();
export const TimelineEntryWhereUniqueInputObjectSchema: z.ZodType<Prisma.TimelineEntryWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.TimelineEntryWhereUniqueInput>;
export const TimelineEntryWhereUniqueInputObjectZodSchema = makeSchema();
