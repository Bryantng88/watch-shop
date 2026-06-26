import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AppTagLinkOrderByWithRelationInputObjectSchema as AppTagLinkOrderByWithRelationInputObjectSchema } from './objects/AppTagLinkOrderByWithRelationInput.schema';
import { AppTagLinkWhereInputObjectSchema as AppTagLinkWhereInputObjectSchema } from './objects/AppTagLinkWhereInput.schema';
import { AppTagLinkWhereUniqueInputObjectSchema as AppTagLinkWhereUniqueInputObjectSchema } from './objects/AppTagLinkWhereUniqueInput.schema';
import { AppTagLinkCountAggregateInputObjectSchema as AppTagLinkCountAggregateInputObjectSchema } from './objects/AppTagLinkCountAggregateInput.schema';

export const AppTagLinkCountSchema: z.ZodType<Prisma.AppTagLinkCountArgs> = z.object({ orderBy: z.union([AppTagLinkOrderByWithRelationInputObjectSchema, AppTagLinkOrderByWithRelationInputObjectSchema.array()]).optional(), where: AppTagLinkWhereInputObjectSchema.optional(), cursor: AppTagLinkWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), AppTagLinkCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.AppTagLinkCountArgs>;

export const AppTagLinkCountZodSchema = z.object({ orderBy: z.union([AppTagLinkOrderByWithRelationInputObjectSchema, AppTagLinkOrderByWithRelationInputObjectSchema.array()]).optional(), where: AppTagLinkWhereInputObjectSchema.optional(), cursor: AppTagLinkWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), AppTagLinkCountAggregateInputObjectSchema ]).optional() }).strict();