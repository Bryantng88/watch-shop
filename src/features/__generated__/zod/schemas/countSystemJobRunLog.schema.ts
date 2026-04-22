import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SystemJobRunLogOrderByWithRelationInputObjectSchema as SystemJobRunLogOrderByWithRelationInputObjectSchema } from './objects/SystemJobRunLogOrderByWithRelationInput.schema';
import { SystemJobRunLogWhereInputObjectSchema as SystemJobRunLogWhereInputObjectSchema } from './objects/SystemJobRunLogWhereInput.schema';
import { SystemJobRunLogWhereUniqueInputObjectSchema as SystemJobRunLogWhereUniqueInputObjectSchema } from './objects/SystemJobRunLogWhereUniqueInput.schema';
import { SystemJobRunLogCountAggregateInputObjectSchema as SystemJobRunLogCountAggregateInputObjectSchema } from './objects/SystemJobRunLogCountAggregateInput.schema';

export const SystemJobRunLogCountSchema: z.ZodType<Prisma.SystemJobRunLogCountArgs> = z.object({ orderBy: z.union([SystemJobRunLogOrderByWithRelationInputObjectSchema, SystemJobRunLogOrderByWithRelationInputObjectSchema.array()]).optional(), where: SystemJobRunLogWhereInputObjectSchema.optional(), cursor: SystemJobRunLogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), SystemJobRunLogCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.SystemJobRunLogCountArgs>;

export const SystemJobRunLogCountZodSchema = z.object({ orderBy: z.union([SystemJobRunLogOrderByWithRelationInputObjectSchema, SystemJobRunLogOrderByWithRelationInputObjectSchema.array()]).optional(), where: SystemJobRunLogWhereInputObjectSchema.optional(), cursor: SystemJobRunLogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), SystemJobRunLogCountAggregateInputObjectSchema ]).optional() }).strict();