import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskWhereInputObjectSchema as TaskWhereInputObjectSchema } from './objects/TaskWhereInput.schema';
import { TaskOrderByWithAggregationInputObjectSchema as TaskOrderByWithAggregationInputObjectSchema } from './objects/TaskOrderByWithAggregationInput.schema';
import { TaskScalarWhereWithAggregatesInputObjectSchema as TaskScalarWhereWithAggregatesInputObjectSchema } from './objects/TaskScalarWhereWithAggregatesInput.schema';
import { TaskScalarFieldEnumSchema } from './enums/TaskScalarFieldEnum.schema';
import { TaskCountAggregateInputObjectSchema as TaskCountAggregateInputObjectSchema } from './objects/TaskCountAggregateInput.schema';
import { TaskMinAggregateInputObjectSchema as TaskMinAggregateInputObjectSchema } from './objects/TaskMinAggregateInput.schema';
import { TaskMaxAggregateInputObjectSchema as TaskMaxAggregateInputObjectSchema } from './objects/TaskMaxAggregateInput.schema';

export const TaskGroupBySchema: z.ZodType<Prisma.TaskGroupByArgs> = z.object({ where: TaskWhereInputObjectSchema.optional(), orderBy: z.union([TaskOrderByWithAggregationInputObjectSchema, TaskOrderByWithAggregationInputObjectSchema.array()]).optional(), having: TaskScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(TaskScalarFieldEnumSchema), _count: z.union([ z.literal(true), TaskCountAggregateInputObjectSchema ]).optional(), _min: TaskMinAggregateInputObjectSchema.optional(), _max: TaskMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TaskGroupByArgs>;

export const TaskGroupByZodSchema = z.object({ where: TaskWhereInputObjectSchema.optional(), orderBy: z.union([TaskOrderByWithAggregationInputObjectSchema, TaskOrderByWithAggregationInputObjectSchema.array()]).optional(), having: TaskScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(TaskScalarFieldEnumSchema), _count: z.union([ z.literal(true), TaskCountAggregateInputObjectSchema ]).optional(), _min: TaskMinAggregateInputObjectSchema.optional(), _max: TaskMaxAggregateInputObjectSchema.optional() }).strict();