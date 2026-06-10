import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkCaseOrderByWithRelationInputObjectSchema as WorkCaseOrderByWithRelationInputObjectSchema } from './objects/WorkCaseOrderByWithRelationInput.schema';
import { WorkCaseWhereInputObjectSchema as WorkCaseWhereInputObjectSchema } from './objects/WorkCaseWhereInput.schema';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './objects/WorkCaseWhereUniqueInput.schema';
import { WorkCaseCountAggregateInputObjectSchema as WorkCaseCountAggregateInputObjectSchema } from './objects/WorkCaseCountAggregateInput.schema';

export const WorkCaseCountSchema: z.ZodType<Prisma.WorkCaseCountArgs> = z.object({ orderBy: z.union([WorkCaseOrderByWithRelationInputObjectSchema, WorkCaseOrderByWithRelationInputObjectSchema.array()]).optional(), where: WorkCaseWhereInputObjectSchema.optional(), cursor: WorkCaseWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), WorkCaseCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.WorkCaseCountArgs>;

export const WorkCaseCountZodSchema = z.object({ orderBy: z.union([WorkCaseOrderByWithRelationInputObjectSchema, WorkCaseOrderByWithRelationInputObjectSchema.array()]).optional(), where: WorkCaseWhereInputObjectSchema.optional(), cursor: WorkCaseWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), WorkCaseCountAggregateInputObjectSchema ]).optional() }).strict();