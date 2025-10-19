import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ReservationSelectObjectSchema as ReservationSelectObjectSchema } from './objects/ReservationSelect.schema';
import { ReservationCreateManyInputObjectSchema as ReservationCreateManyInputObjectSchema } from './objects/ReservationCreateManyInput.schema';

export const ReservationCreateManyAndReturnSchema: z.ZodType<Prisma.ReservationCreateManyAndReturnArgs> = z.object({ select: ReservationSelectObjectSchema.optional(), data: z.union([ ReservationCreateManyInputObjectSchema, z.array(ReservationCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ReservationCreateManyAndReturnArgs>;

export const ReservationCreateManyAndReturnZodSchema = z.object({ select: ReservationSelectObjectSchema.optional(), data: z.union([ ReservationCreateManyInputObjectSchema, z.array(ReservationCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();