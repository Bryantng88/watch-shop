import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TimelineEntrySelectObjectSchema as TimelineEntrySelectObjectSchema } from './objects/TimelineEntrySelect.schema';
import { TimelineEntryCreateManyInputObjectSchema as TimelineEntryCreateManyInputObjectSchema } from './objects/TimelineEntryCreateManyInput.schema';

export const TimelineEntryCreateManyAndReturnSchema: z.ZodType<Prisma.TimelineEntryCreateManyAndReturnArgs> = z.object({ select: TimelineEntrySelectObjectSchema.optional(), data: z.union([ TimelineEntryCreateManyInputObjectSchema, z.array(TimelineEntryCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.TimelineEntryCreateManyAndReturnArgs>;

export const TimelineEntryCreateManyAndReturnZodSchema = z.object({ select: TimelineEntrySelectObjectSchema.optional(), data: z.union([ TimelineEntryCreateManyInputObjectSchema, z.array(TimelineEntryCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();