import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ReservationUpdateManyMutationInputObjectSchema as ReservationUpdateManyMutationInputObjectSchema } from './objects/ReservationUpdateManyMutationInput.schema';
import { ReservationWhereInputObjectSchema as ReservationWhereInputObjectSchema } from './objects/ReservationWhereInput.schema';

export const ReservationUpdateManySchema: z.ZodType<Prisma.ReservationUpdateManyArgs> = z.object({ data: ReservationUpdateManyMutationInputObjectSchema, where: ReservationWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ReservationUpdateManyArgs>;

export const ReservationUpdateManyZodSchema = z.object({ data: ReservationUpdateManyMutationInputObjectSchema, where: ReservationWhereInputObjectSchema.optional() }).strict();