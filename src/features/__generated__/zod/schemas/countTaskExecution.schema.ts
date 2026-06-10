import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskExecutionOrderByWithRelationInputObjectSchema as TaskExecutionOrderByWithRelationInputObjectSchema } from './objects/TaskExecutionOrderByWithRelationInput.schema';
import { TaskExecutionWhereInputObjectSchema as TaskExecutionWhereInputObjectSchema } from './objects/TaskExecutionWhereInput.schema';
import { TaskExecutionWhereUniqueInputObjectSchema as TaskExecutionWhereUniqueInputObjectSchema } from './objects/TaskExecutionWhereUniqueInput.schema';
import { TaskExecutionCountAggregateInputObjectSchema as TaskExecutionCountAggregateInputObjectSchema } from './objects/TaskExecutionCountAggregateInput.schema';

export const TaskExecutionCountSchema: z.ZodType<Prisma.TaskExecutionCountArgs> = z.object({ orderBy: z.union([TaskExecutionOrderByWithRelationInputObjectSchema, TaskExecutionOrderByWithRelationInputObjectSchema.array()]).optional(), where: TaskExecutionWhereInputObjectSchema.optional(), cursor: TaskExecutionWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), TaskExecutionCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.TaskExecutionCountArgs>;

export const TaskExecutionCountZodSchema = z.object({ orderBy: z.union([TaskExecutionOrderByWithRelationInputObjectSchema, TaskExecutionOrderByWithRelationInputObjectSchema.array()]).optional(), where: TaskExecutionWhereInputObjectSchema.optional(), cursor: TaskExecutionWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), TaskExecutionCountAggregateInputObjectSchema ]).optional() }).strict();