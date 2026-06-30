import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TimelineEntryWhereInputObjectSchema as TimelineEntryWhereInputObjectSchema } from './objects/TimelineEntryWhereInput.schema';

export const TimelineEntryDeleteManySchema: z.ZodType<Prisma.TimelineEntryDeleteManyArgs> = z.object({ where: TimelineEntryWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TimelineEntryDeleteManyArgs>;

export const TimelineEntryDeleteManyZodSchema = z.object({ where: TimelineEntryWhereInputObjectSchema.optional() }).strict();