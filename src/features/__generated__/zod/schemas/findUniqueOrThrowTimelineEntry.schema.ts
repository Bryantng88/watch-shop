import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TimelineEntrySelectObjectSchema as TimelineEntrySelectObjectSchema } from './objects/TimelineEntrySelect.schema';
import { TimelineEntryWhereUniqueInputObjectSchema as TimelineEntryWhereUniqueInputObjectSchema } from './objects/TimelineEntryWhereUniqueInput.schema';

export const TimelineEntryFindUniqueOrThrowSchema: z.ZodType<Prisma.TimelineEntryFindUniqueOrThrowArgs> = z.object({ select: TimelineEntrySelectObjectSchema.optional(),  where: TimelineEntryWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TimelineEntryFindUniqueOrThrowArgs>;

export const TimelineEntryFindUniqueOrThrowZodSchema = z.object({ select: TimelineEntrySelectObjectSchema.optional(),  where: TimelineEntryWhereUniqueInputObjectSchema }).strict();