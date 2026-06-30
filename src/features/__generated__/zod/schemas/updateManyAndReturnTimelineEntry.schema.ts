import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TimelineEntrySelectObjectSchema as TimelineEntrySelectObjectSchema } from './objects/TimelineEntrySelect.schema';
import { TimelineEntryUpdateManyMutationInputObjectSchema as TimelineEntryUpdateManyMutationInputObjectSchema } from './objects/TimelineEntryUpdateManyMutationInput.schema';
import { TimelineEntryWhereInputObjectSchema as TimelineEntryWhereInputObjectSchema } from './objects/TimelineEntryWhereInput.schema';

export const TimelineEntryUpdateManyAndReturnSchema: z.ZodType<Prisma.TimelineEntryUpdateManyAndReturnArgs> = z.object({ select: TimelineEntrySelectObjectSchema.optional(), data: TimelineEntryUpdateManyMutationInputObjectSchema, where: TimelineEntryWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TimelineEntryUpdateManyAndReturnArgs>;

export const TimelineEntryUpdateManyAndReturnZodSchema = z.object({ select: TimelineEntrySelectObjectSchema.optional(), data: TimelineEntryUpdateManyMutationInputObjectSchema, where: TimelineEntryWhereInputObjectSchema.optional() }).strict();