import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PartVariantSpecOrderByWithRelationInputObjectSchema as PartVariantSpecOrderByWithRelationInputObjectSchema } from './objects/PartVariantSpecOrderByWithRelationInput.schema';
import { PartVariantSpecWhereInputObjectSchema as PartVariantSpecWhereInputObjectSchema } from './objects/PartVariantSpecWhereInput.schema';
import { PartVariantSpecWhereUniqueInputObjectSchema as PartVariantSpecWhereUniqueInputObjectSchema } from './objects/PartVariantSpecWhereUniqueInput.schema';
import { PartVariantSpecCountAggregateInputObjectSchema as PartVariantSpecCountAggregateInputObjectSchema } from './objects/PartVariantSpecCountAggregateInput.schema';

export const PartVariantSpecCountSchema: z.ZodType<Prisma.PartVariantSpecCountArgs> = z.object({ orderBy: z.union([PartVariantSpecOrderByWithRelationInputObjectSchema, PartVariantSpecOrderByWithRelationInputObjectSchema.array()]).optional(), where: PartVariantSpecWhereInputObjectSchema.optional(), cursor: PartVariantSpecWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), PartVariantSpecCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.PartVariantSpecCountArgs>;

export const PartVariantSpecCountZodSchema = z.object({ orderBy: z.union([PartVariantSpecOrderByWithRelationInputObjectSchema, PartVariantSpecOrderByWithRelationInputObjectSchema.array()]).optional(), where: PartVariantSpecWhereInputObjectSchema.optional(), cursor: PartVariantSpecWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), PartVariantSpecCountAggregateInputObjectSchema ]).optional() }).strict();