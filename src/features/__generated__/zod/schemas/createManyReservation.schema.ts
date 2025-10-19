import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ReservationCreateManyInputObjectSchema as ReservationCreateManyInputObjectSchema } from './objects/ReservationCreateManyInput.schema';

export const ReservationCreateManySchema: z.ZodType<Prisma.ReservationCreateManyArgs> = z.object({ data: z.union([ ReservationCreateManyInputObjectSchema, z.array(ReservationCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ReservationCreateManyArgs>;

export const ReservationCreateManyZodSchema = z.object({ data: z.union([ ReservationCreateManyInputObjectSchema, z.array(ReservationCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();