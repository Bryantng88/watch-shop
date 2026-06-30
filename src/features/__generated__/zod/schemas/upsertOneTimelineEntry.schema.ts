import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TimelineEntrySelectObjectSchema as TimelineEntrySelectObjectSchema } from './objects/TimelineEntrySelect.schema';
import { TimelineEntryWhereUniqueInputObjectSchema as TimelineEntryWhereUniqueInputObjectSchema } from './objects/TimelineEntryWhereUniqueInput.schema';
import { TimelineEntryCreateInputObjectSchema as TimelineEntryCreateInputObjectSchema } from './objects/TimelineEntryCreateInput.schema';
import { TimelineEntryUncheckedCreateInputObjectSchema as TimelineEntryUncheckedCreateInputObjectSchema } from './objects/TimelineEntryUncheckedCreateInput.schema';
import { TimelineEntryUpdateInputObjectSchema as TimelineEntryUpdateInputObjectSchema } from './objects/TimelineEntryUpdateInput.schema';
import { TimelineEntryUncheckedUpdateInputObjectSchema as TimelineEntryUncheckedUpdateInputObjectSchema } from './objects/TimelineEntryUncheckedUpdateInput.schema';

export const TimelineEntryUpsertOneSchema: z.ZodType<Prisma.TimelineEntryUpsertArgs> = z.object({ select: TimelineEntrySelectObjectSchema.optional(),  where: TimelineEntryWhereUniqueInputObjectSchema, create: z.union([ TimelineEntryCreateInputObjectSchema, TimelineEntryUncheckedCreateInputObjectSchema ]), update: z.union([ TimelineEntryUpdateInputObjectSchema, TimelineEntryUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.TimelineEntryUpsertArgs>;

export const TimelineEntryUpsertOneZodSchema = z.object({ select: TimelineEntrySelectObjectSchema.optional(),  where: TimelineEntryWhereUniqueInputObjectSchema, create: z.union([ TimelineEntryCreateInputObjectSchema, TimelineEntryUncheckedCreateInputObjectSchema ]), update: z.union([ TimelineEntryUpdateInputObjectSchema, TimelineEntryUncheckedUpdateInputObjectSchema ]) }).strict();