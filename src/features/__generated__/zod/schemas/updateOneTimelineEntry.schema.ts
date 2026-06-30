import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TimelineEntrySelectObjectSchema as TimelineEntrySelectObjectSchema } from './objects/TimelineEntrySelect.schema';
import { TimelineEntryUpdateInputObjectSchema as TimelineEntryUpdateInputObjectSchema } from './objects/TimelineEntryUpdateInput.schema';
import { TimelineEntryUncheckedUpdateInputObjectSchema as TimelineEntryUncheckedUpdateInputObjectSchema } from './objects/TimelineEntryUncheckedUpdateInput.schema';
import { TimelineEntryWhereUniqueInputObjectSchema as TimelineEntryWhereUniqueInputObjectSchema } from './objects/TimelineEntryWhereUniqueInput.schema';

export const TimelineEntryUpdateOneSchema: z.ZodType<Prisma.TimelineEntryUpdateArgs> = z.object({ select: TimelineEntrySelectObjectSchema.optional(),  data: z.union([TimelineEntryUpdateInputObjectSchema, TimelineEntryUncheckedUpdateInputObjectSchema]), where: TimelineEntryWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TimelineEntryUpdateArgs>;

export const TimelineEntryUpdateOneZodSchema = z.object({ select: TimelineEntrySelectObjectSchema.optional(),  data: z.union([TimelineEntryUpdateInputObjectSchema, TimelineEntryUncheckedUpdateInputObjectSchema]), where: TimelineEntryWhereUniqueInputObjectSchema }).strict();