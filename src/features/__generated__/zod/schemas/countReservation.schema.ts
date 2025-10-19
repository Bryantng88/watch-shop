import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ReservationOrderByWithRelationInputObjectSchema as ReservationOrderByWithRelationInputObjectSchema } from './objects/ReservationOrderByWithRelationInput.schema';
import { ReservationWhereInputObjectSchema as ReservationWhereInputObjectSchema } from './objects/ReservationWhereInput.schema';
import { ReservationWhereUniqueInputObjectSchema as ReservationWhereUniqueInputObjectSchema } from './objects/ReservationWhereUniqueInput.schema';
import { ReservationCountAggregateInputObjectSchema as ReservationCountAggregateInputObjectSchema } from './objects/ReservationCountAggregateInput.schema';

export const ReservationCountSchema: z.ZodType<Prisma.ReservationCountArgs> = z.object({ orderBy: z.union([ReservationOrderByWithRelationInputObjectSchema, ReservationOrderByWithRelationInputObjectSchema.array()]).optional(), where: ReservationWhereInputObjectSchema.optional(), cursor: ReservationWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ReservationCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.ReservationCountArgs>;

export const ReservationCountZodSchema = z.object({ orderBy: z.union([ReservationOrderByWithRelationInputObjectSchema, ReservationOrderByWithRelationInputObjectSchema.array()]).optional(), where: ReservationWhereInputObjectSchema.optional(), cursor: ReservationWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ReservationCountAggregateInputObjectSchema ]).optional() }).strict();