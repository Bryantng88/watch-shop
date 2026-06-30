import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TimelineEntrySelectObjectSchema as TimelineEntrySelectObjectSchema } from './objects/TimelineEntrySelect.schema';
import { TimelineEntryWhereUniqueInputObjectSchema as TimelineEntryWhereUniqueInputObjectSchema } from './objects/TimelineEntryWhereUniqueInput.schema';

export const TimelineEntryFindUniqueSchema: z.ZodType<Prisma.TimelineEntryFindUniqueArgs> = z.object({ select: TimelineEntrySelectObjectSchema.optional(),  where: TimelineEntryWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TimelineEntryFindUniqueArgs>;

export const TimelineEntryFindUniqueZodSchema = z.object({ select: TimelineEntrySelectObjectSchema.optional(),  where: TimelineEntryWhereUniqueInputObjectSchema }).strict();