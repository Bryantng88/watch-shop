import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TechnicalIssueOrderByWithRelationInputObjectSchema as TechnicalIssueOrderByWithRelationInputObjectSchema } from './objects/TechnicalIssueOrderByWithRelationInput.schema';
import { TechnicalIssueWhereInputObjectSchema as TechnicalIssueWhereInputObjectSchema } from './objects/TechnicalIssueWhereInput.schema';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './objects/TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueCountAggregateInputObjectSchema as TechnicalIssueCountAggregateInputObjectSchema } from './objects/TechnicalIssueCountAggregateInput.schema';

export const TechnicalIssueCountSchema: z.ZodType<Prisma.TechnicalIssueCountArgs> = z.object({ orderBy: z.union([TechnicalIssueOrderByWithRelationInputObjectSchema, TechnicalIssueOrderByWithRelationInputObjectSchema.array()]).optional(), where: TechnicalIssueWhereInputObjectSchema.optional(), cursor: TechnicalIssueWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), TechnicalIssueCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.TechnicalIssueCountArgs>;

export const TechnicalIssueCountZodSchema = z.object({ orderBy: z.union([TechnicalIssueOrderByWithRelationInputObjectSchema, TechnicalIssueOrderByWithRelationInputObjectSchema.array()]).optional(), where: TechnicalIssueWhereInputObjectSchema.optional(), cursor: TechnicalIssueWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), TechnicalIssueCountAggregateInputObjectSchema ]).optional() }).strict();