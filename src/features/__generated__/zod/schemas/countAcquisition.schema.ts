import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionOrderByWithRelationInputObjectSchema as AcquisitionOrderByWithRelationInputObjectSchema } from './objects/AcquisitionOrderByWithRelationInput.schema';
import { AcquisitionWhereInputObjectSchema as AcquisitionWhereInputObjectSchema } from './objects/AcquisitionWhereInput.schema';
import { AcquisitionWhereUniqueInputObjectSchema as AcquisitionWhereUniqueInputObjectSchema } from './objects/AcquisitionWhereUniqueInput.schema';
import { AcquisitionCountAggregateInputObjectSchema as AcquisitionCountAggregateInputObjectSchema } from './objects/AcquisitionCountAggregateInput.schema';

export const AcquisitionCountSchema: z.ZodType<Prisma.AcquisitionCountArgs> = z.object({ orderBy: z.union([AcquisitionOrderByWithRelationInputObjectSchema, AcquisitionOrderByWithRelationInputObjectSchema.array()]).optional(), where: AcquisitionWhereInputObjectSchema.optional(), cursor: AcquisitionWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), AcquisitionCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.AcquisitionCountArgs>;

export const AcquisitionCountZodSchema = z.object({ orderBy: z.union([AcquisitionOrderByWithRelationInputObjectSchema, AcquisitionOrderByWithRelationInputObjectSchema.array()]).optional(), where: AcquisitionWhereInputObjectSchema.optional(), cursor: AcquisitionWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), AcquisitionCountAggregateInputObjectSchema ]).optional() }).strict();