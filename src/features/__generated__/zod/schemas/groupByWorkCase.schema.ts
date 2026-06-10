import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkCaseWhereInputObjectSchema as WorkCaseWhereInputObjectSchema } from './objects/WorkCaseWhereInput.schema';
import { WorkCaseOrderByWithAggregationInputObjectSchema as WorkCaseOrderByWithAggregationInputObjectSchema } from './objects/WorkCaseOrderByWithAggregationInput.schema';
import { WorkCaseScalarWhereWithAggregatesInputObjectSchema as WorkCaseScalarWhereWithAggregatesInputObjectSchema } from './objects/WorkCaseScalarWhereWithAggregatesInput.schema';
import { WorkCaseScalarFieldEnumSchema } from './enums/WorkCaseScalarFieldEnum.schema';
import { WorkCaseCountAggregateInputObjectSchema as WorkCaseCountAggregateInputObjectSchema } from './objects/WorkCaseCountAggregateInput.schema';
import { WorkCaseMinAggregateInputObjectSchema as WorkCaseMinAggregateInputObjectSchema } from './objects/WorkCaseMinAggregateInput.schema';
import { WorkCaseMaxAggregateInputObjectSchema as WorkCaseMaxAggregateInputObjectSchema } from './objects/WorkCaseMaxAggregateInput.schema';

export const WorkCaseGroupBySchema: z.ZodType<Prisma.WorkCaseGroupByArgs> = z.object({ where: WorkCaseWhereInputObjectSchema.optional(), orderBy: z.union([WorkCaseOrderByWithAggregationInputObjectSchema, WorkCaseOrderByWithAggregationInputObjectSchema.array()]).optional(), having: WorkCaseScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(WorkCaseScalarFieldEnumSchema), _count: z.union([ z.literal(true), WorkCaseCountAggregateInputObjectSchema ]).optional(), _min: WorkCaseMinAggregateInputObjectSchema.optional(), _max: WorkCaseMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WorkCaseGroupByArgs>;

export const WorkCaseGroupByZodSchema = z.object({ where: WorkCaseWhereInputObjectSchema.optional(), orderBy: z.union([WorkCaseOrderByWithAggregationInputObjectSchema, WorkCaseOrderByWithAggregationInputObjectSchema.array()]).optional(), having: WorkCaseScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(WorkCaseScalarFieldEnumSchema), _count: z.union([ z.literal(true), WorkCaseCountAggregateInputObjectSchema ]).optional(), _min: WorkCaseMinAggregateInputObjectSchema.optional(), _max: WorkCaseMaxAggregateInputObjectSchema.optional() }).strict();