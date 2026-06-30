import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TimelineEntrySelectObjectSchema as TimelineEntrySelectObjectSchema } from './objects/TimelineEntrySelect.schema';
import { TimelineEntryWhereUniqueInputObjectSchema as TimelineEntryWhereUniqueInputObjectSchema } from './objects/TimelineEntryWhereUniqueInput.schema';

export const TimelineEntryDeleteOneSchema: z.ZodType<Prisma.TimelineEntryDeleteArgs> = z.object({ select: TimelineEntrySelectObjectSchema.optional(),  where: TimelineEntryWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TimelineEntryDeleteArgs>;

export const TimelineEntryDeleteOneZodSchema = z.object({ select: TimelineEntrySelectObjectSchema.optional(),  where: TimelineEntryWhereUniqueInputObjectSchema }).strict();