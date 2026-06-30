import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TimelineEntryCreateManyInputObjectSchema as TimelineEntryCreateManyInputObjectSchema } from './objects/TimelineEntryCreateManyInput.schema';

export const TimelineEntryCreateManySchema: z.ZodType<Prisma.TimelineEntryCreateManyArgs> = z.object({ data: z.union([ TimelineEntryCreateManyInputObjectSchema, z.array(TimelineEntryCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.TimelineEntryCreateManyArgs>;

export const TimelineEntryCreateManyZodSchema = z.object({ data: z.union([ TimelineEntryCreateManyInputObjectSchema, z.array(TimelineEntryCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();