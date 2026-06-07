import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskOrderByWithRelationInputObjectSchema as TaskOrderByWithRelationInputObjectSchema } from './objects/TaskOrderByWithRelationInput.schema';
import { TaskWhereInputObjectSchema as TaskWhereInputObjectSchema } from './objects/TaskWhereInput.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './objects/TaskWhereUniqueInput.schema';
import { TaskCountAggregateInputObjectSchema as TaskCountAggregateInputObjectSchema } from './objects/TaskCountAggregateInput.schema';

export const TaskCountSchema: z.ZodType<Prisma.TaskCountArgs> = z.object({ orderBy: z.union([TaskOrderByWithRelationInputObjectSchema, TaskOrderByWithRelationInputObjectSchema.array()]).optional(), where: TaskWhereInputObjectSchema.optional(), cursor: TaskWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), TaskCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.TaskCountArgs>;

export const TaskCountZodSchema = z.object({ orderBy: z.union([TaskOrderByWithRelationInputObjectSchema, TaskOrderByWithRelationInputObjectSchema.array()]).optional(), where: TaskWhereInputObjectSchema.optional(), cursor: TaskWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), TaskCountAggregateInputObjectSchema ]).optional() }).strict();