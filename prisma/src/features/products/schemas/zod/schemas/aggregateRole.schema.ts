import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { RoleOrderByWithRelationInputObjectSchema as RoleOrderByWithRelationInputObjectSchema } from './objects/RoleOrderByWithRelationInput.schema';
import { RoleWhereInputObjectSchema as RoleWhereInputObjectSchema } from './objects/RoleWhereInput.schema';
import { RoleWhereUniqueInputObjectSchema as RoleWhereUniqueInputObjectSchema } from './objects/RoleWhereUniqueInput.schema';
import { RoleCountAggregateInputObjectSchema as RoleCountAggregateInputObjectSchema } from './objects/RoleCountAggregateInput.schema';
import { RoleMinAggregateInputObjectSchema as RoleMinAggregateInputObjectSchema } from './objects/RoleMinAggregateInput.schema';
import { RoleMaxAggregateInputObjectSchema as RoleMaxAggregateInputObjectSchema } from './objects/RoleMaxAggregateInput.schema';

export const RoleAggregateSchema: z.ZodType<Prisma.RoleAggregateArgs> = z.object({ orderBy: z.union([RoleOrderByWithRelationInputObjectSchema, RoleOrderByWithRelationInputObjectSchema.array()]).optional(), where: RoleWhereInputObjectSchema.optional(), cursor: RoleWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), RoleCountAggregateInputObjectSchema ]).optional(), _min: RoleMinAggregateInputObjectSchema.optional(), _max: RoleMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.RoleAggregateArgs>;

export const RoleAggregateZodSchema = z.object({ orderBy: z.union([RoleOrderByWithRelationInputObjectSchema, RoleOrderByWithRelationInputObjectSchema.array()]).optional(), where: RoleWhereInputObjectSchema.optional(), cursor: RoleWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), RoleCountAggregateInputObjectSchema ]).optional(), _min: RoleMinAggregateInputObjectSchema.optional(), _max: RoleMaxAggregateInputObjectSchema.optional() }).strict();