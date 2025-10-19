import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ReservationWhereInputObjectSchema as ReservationWhereInputObjectSchema } from './objects/ReservationWhereInput.schema';

export const ReservationDeleteManySchema: z.ZodType<Prisma.ReservationDeleteManyArgs> = z.object({ where: ReservationWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ReservationDeleteManyArgs>;

export const ReservationDeleteManyZodSchema = z.object({ where: ReservationWhereInputObjectSchema.optional() }).strict();