import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkCaseOrderByWithRelationInputObjectSchema as WorkCaseOrderByWithRelationInputObjectSchema } from './objects/WorkCaseOrderByWithRelationInput.schema';
import { WorkCaseWhereInputObjectSchema as WorkCaseWhereInputObjectSchema } from './objects/WorkCaseWhereInput.schema';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './objects/WorkCaseWhereUniqueInput.schema';
import { WorkCaseCountAggregateInputObjectSchema as WorkCaseCountAggregateInputObjectSchema } from './objects/WorkCaseCountAggregateInput.schema';
import { WorkCaseMinAggregateInputObjectSchema as WorkCaseMinAggregateInputObjectSchema } from './objects/WorkCaseMinAggregateInput.schema';
import { WorkCaseMaxAggregateInputObjectSchema as WorkCaseMaxAggregateInputObjectSchema } from './objects/WorkCaseMaxAggregateInput.schema';

export const WorkCaseAggregateSchema: z.ZodType<Prisma.WorkCaseAggregateArgs> = z.object({ orderBy: z.union([WorkCaseOrderByWithRelationInputObjectSchema, WorkCaseOrderByWithRelationInputObjectSchema.array()]).optional(), where: WorkCaseWhereInputObjectSchema.optional(), cursor: WorkCaseWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), WorkCaseCountAggregateInputObjectSchema ]).optional(), _min: WorkCaseMinAggregateInputObjectSchema.optional(), _max: WorkCaseMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WorkCaseAggregateArgs>;

export const WorkCaseAggregateZodSchema = z.object({ orderBy: z.union([WorkCaseOrderByWithRelationInputObjectSchema, WorkCaseOrderByWithRelationInputObjectSchema.array()]).optional(), where: WorkCaseWhereInputObjectSchema.optional(), cursor: WorkCaseWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), WorkCaseCountAggregateInputObjectSchema ]).optional(), _min: WorkCaseMinAggregateInputObjectSchema.optional(), _max: WorkCaseMaxAggregateInputObjectSchema.optional() }).strict();