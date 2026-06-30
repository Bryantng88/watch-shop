import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TimelineEntryUpdateManyMutationInputObjectSchema as TimelineEntryUpdateManyMutationInputObjectSchema } from './objects/TimelineEntryUpdateManyMutationInput.schema';
import { TimelineEntryWhereInputObjectSchema as TimelineEntryWhereInputObjectSchema } from './objects/TimelineEntryWhereInput.schema';

export const TimelineEntryUpdateManySchema: z.ZodType<Prisma.TimelineEntryUpdateManyArgs> = z.object({ data: TimelineEntryUpdateManyMutationInputObjectSchema, where: TimelineEntryWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TimelineEntryUpdateManyArgs>;

export const TimelineEntryUpdateManyZodSchema = z.object({ data: TimelineEntryUpdateManyMutationInputObjectSchema, where: TimelineEntryWhereInputObjectSchema.optional() }).strict();