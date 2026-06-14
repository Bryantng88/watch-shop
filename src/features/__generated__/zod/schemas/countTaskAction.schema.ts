import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskActionOrderByWithRelationInputObjectSchema as TaskActionOrderByWithRelationInputObjectSchema } from './objects/TaskActionOrderByWithRelationInput.schema';
import { TaskActionWhereInputObjectSchema as TaskActionWhereInputObjectSchema } from './objects/TaskActionWhereInput.schema';
import { TaskActionWhereUniqueInputObjectSchema as TaskActionWhereUniqueInputObjectSchema } from './objects/TaskActionWhereUniqueInput.schema';
import { TaskActionCountAggregateInputObjectSchema as TaskActionCountAggregateInputObjectSchema } from './objects/TaskActionCountAggregateInput.schema';

export const TaskActionCountSchema: z.ZodType<Prisma.TaskActionCountArgs> = z.object({ orderBy: z.union([TaskActionOrderByWithRelationInputObjectSchema, TaskActionOrderByWithRelationInputObjectSchema.array()]).optional(), where: TaskActionWhereInputObjectSchema.optional(), cursor: TaskActionWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), TaskActionCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.TaskActionCountArgs>;

export const TaskActionCountZodSchema = z.object({ orderBy: z.union([TaskActionOrderByWithRelationInputObjectSchema, TaskActionOrderByWithRelationInputObjectSchema.array()]).optional(), where: TaskActionWhereInputObjectSchema.optional(), cursor: TaskActionWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), TaskActionCountAggregateInputObjectSchema ]).optional() }).strict();