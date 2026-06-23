import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemOrderByWithRelationInputObjectSchema as TaskItemOrderByWithRelationInputObjectSchema } from './objects/TaskItemOrderByWithRelationInput.schema';
import { TaskItemWhereInputObjectSchema as TaskItemWhereInputObjectSchema } from './objects/TaskItemWhereInput.schema';
import { TaskItemWhereUniqueInputObjectSchema as TaskItemWhereUniqueInputObjectSchema } from './objects/TaskItemWhereUniqueInput.schema';
import { TaskItemCountAggregateInputObjectSchema as TaskItemCountAggregateInputObjectSchema } from './objects/TaskItemCountAggregateInput.schema';

export const TaskItemCountSchema: z.ZodType<Prisma.TaskItemCountArgs> = z.object({ orderBy: z.union([TaskItemOrderByWithRelationInputObjectSchema, TaskItemOrderByWithRelationInputObjectSchema.array()]).optional(), where: TaskItemWhereInputObjectSchema.optional(), cursor: TaskItemWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), TaskItemCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.TaskItemCountArgs>;

export const TaskItemCountZodSchema = z.object({ orderBy: z.union([TaskItemOrderByWithRelationInputObjectSchema, TaskItemOrderByWithRelationInputObjectSchema.array()]).optional(), where: TaskItemWhereInputObjectSchema.optional(), cursor: TaskItemWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), TaskItemCountAggregateInputObjectSchema ]).optional() }).strict();