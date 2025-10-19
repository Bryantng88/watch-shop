import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionItemOrderByWithRelationInputObjectSchema as AcquisitionItemOrderByWithRelationInputObjectSchema } from './objects/AcquisitionItemOrderByWithRelationInput.schema';
import { AcquisitionItemWhereInputObjectSchema as AcquisitionItemWhereInputObjectSchema } from './objects/AcquisitionItemWhereInput.schema';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './objects/AcquisitionItemWhereUniqueInput.schema';
import { AcquisitionItemCountAggregateInputObjectSchema as AcquisitionItemCountAggregateInputObjectSchema } from './objects/AcquisitionItemCountAggregateInput.schema';

export const AcquisitionItemCountSchema: z.ZodType<Prisma.AcquisitionItemCountArgs> = z.object({ orderBy: z.union([AcquisitionItemOrderByWithRelationInputObjectSchema, AcquisitionItemOrderByWithRelationInputObjectSchema.array()]).optional(), where: AcquisitionItemWhereInputObjectSchema.optional(), cursor: AcquisitionItemWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), AcquisitionItemCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.AcquisitionItemCountArgs>;

export const AcquisitionItemCountZodSchema = z.object({ orderBy: z.union([AcquisitionItemOrderByWithRelationInputObjectSchema, AcquisitionItemOrderByWithRelationInputObjectSchema.array()]).optional(), where: AcquisitionItemWhereInputObjectSchema.optional(), cursor: AcquisitionItemWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), AcquisitionItemCountAggregateInputObjectSchema ]).optional() }).strict();