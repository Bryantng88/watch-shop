import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TimelineEntryOrderByWithRelationInputObjectSchema as TimelineEntryOrderByWithRelationInputObjectSchema } from './objects/TimelineEntryOrderByWithRelationInput.schema';
import { TimelineEntryWhereInputObjectSchema as TimelineEntryWhereInputObjectSchema } from './objects/TimelineEntryWhereInput.schema';
import { TimelineEntryWhereUniqueInputObjectSchema as TimelineEntryWhereUniqueInputObjectSchema } from './objects/TimelineEntryWhereUniqueInput.schema';
import { TimelineEntryCountAggregateInputObjectSchema as TimelineEntryCountAggregateInputObjectSchema } from './objects/TimelineEntryCountAggregateInput.schema';

export const TimelineEntryCountSchema: z.ZodType<Prisma.TimelineEntryCountArgs> = z.object({ orderBy: z.union([TimelineEntryOrderByWithRelationInputObjectSchema, TimelineEntryOrderByWithRelationInputObjectSchema.array()]).optional(), where: TimelineEntryWhereInputObjectSchema.optional(), cursor: TimelineEntryWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), TimelineEntryCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.TimelineEntryCountArgs>;

export const TimelineEntryCountZodSchema = z.object({ orderBy: z.union([TimelineEntryOrderByWithRelationInputObjectSchema, TimelineEntryOrderByWithRelationInputObjectSchema.array()]).optional(), where: TimelineEntryWhereInputObjectSchema.optional(), cursor: TimelineEntryWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), TimelineEntryCountAggregateInputObjectSchema ]).optional() }).strict();