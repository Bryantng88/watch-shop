import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TimelineEntrySelectObjectSchema as TimelineEntrySelectObjectSchema } from './objects/TimelineEntrySelect.schema';
import { TimelineEntryCreateInputObjectSchema as TimelineEntryCreateInputObjectSchema } from './objects/TimelineEntryCreateInput.schema';
import { TimelineEntryUncheckedCreateInputObjectSchema as TimelineEntryUncheckedCreateInputObjectSchema } from './objects/TimelineEntryUncheckedCreateInput.schema';

export const TimelineEntryCreateOneSchema: z.ZodType<Prisma.TimelineEntryCreateArgs> = z.object({ select: TimelineEntrySelectObjectSchema.optional(),  data: z.union([TimelineEntryCreateInputObjectSchema, TimelineEntryUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.TimelineEntryCreateArgs>;

export const TimelineEntryCreateOneZodSchema = z.object({ select: TimelineEntrySelectObjectSchema.optional(),  data: z.union([TimelineEntryCreateInputObjectSchema, TimelineEntryUncheckedCreateInputObjectSchema]) }).strict();