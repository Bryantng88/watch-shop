import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowActionOrderByWithRelationInputObjectSchema as WorkflowActionOrderByWithRelationInputObjectSchema } from './objects/WorkflowActionOrderByWithRelationInput.schema';
import { WorkflowActionWhereInputObjectSchema as WorkflowActionWhereInputObjectSchema } from './objects/WorkflowActionWhereInput.schema';
import { WorkflowActionWhereUniqueInputObjectSchema as WorkflowActionWhereUniqueInputObjectSchema } from './objects/WorkflowActionWhereUniqueInput.schema';
import { WorkflowActionCountAggregateInputObjectSchema as WorkflowActionCountAggregateInputObjectSchema } from './objects/WorkflowActionCountAggregateInput.schema';

export const WorkflowActionCountSchema: z.ZodType<Prisma.WorkflowActionCountArgs> = z.object({ orderBy: z.union([WorkflowActionOrderByWithRelationInputObjectSchema, WorkflowActionOrderByWithRelationInputObjectSchema.array()]).optional(), where: WorkflowActionWhereInputObjectSchema.optional(), cursor: WorkflowActionWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), WorkflowActionCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.WorkflowActionCountArgs>;

export const WorkflowActionCountZodSchema = z.object({ orderBy: z.union([WorkflowActionOrderByWithRelationInputObjectSchema, WorkflowActionOrderByWithRelationInputObjectSchema.array()]).optional(), where: WorkflowActionWhereInputObjectSchema.optional(), cursor: WorkflowActionWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), WorkflowActionCountAggregateInputObjectSchema ]).optional() }).strict();