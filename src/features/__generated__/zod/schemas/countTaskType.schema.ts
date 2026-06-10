import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskTypeOrderByWithRelationInputObjectSchema as TaskTypeOrderByWithRelationInputObjectSchema } from './objects/TaskTypeOrderByWithRelationInput.schema';
import { TaskTypeWhereInputObjectSchema as TaskTypeWhereInputObjectSchema } from './objects/TaskTypeWhereInput.schema';
import { TaskTypeWhereUniqueInputObjectSchema as TaskTypeWhereUniqueInputObjectSchema } from './objects/TaskTypeWhereUniqueInput.schema';
import { TaskTypeCountAggregateInputObjectSchema as TaskTypeCountAggregateInputObjectSchema } from './objects/TaskTypeCountAggregateInput.schema';

export const TaskTypeCountSchema: z.ZodType<Prisma.TaskTypeCountArgs> = z.object({ orderBy: z.union([TaskTypeOrderByWithRelationInputObjectSchema, TaskTypeOrderByWithRelationInputObjectSchema.array()]).optional(), where: TaskTypeWhereInputObjectSchema.optional(), cursor: TaskTypeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), TaskTypeCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.TaskTypeCountArgs>;

export const TaskTypeCountZodSchema = z.object({ orderBy: z.union([TaskTypeOrderByWithRelationInputObjectSchema, TaskTypeOrderByWithRelationInputObjectSchema.array()]).optional(), where: TaskTypeWhereInputObjectSchema.optional(), cursor: TaskTypeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), TaskTypeCountAggregateInputObjectSchema ]).optional() }).strict();