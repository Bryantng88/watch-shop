import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ReservationSelectObjectSchema as ReservationSelectObjectSchema } from './objects/ReservationSelect.schema';
import { ReservationUpdateManyMutationInputObjectSchema as ReservationUpdateManyMutationInputObjectSchema } from './objects/ReservationUpdateManyMutationInput.schema';
import { ReservationWhereInputObjectSchema as ReservationWhereInputObjectSchema } from './objects/ReservationWhereInput.schema';

export const ReservationUpdateManyAndReturnSchema: z.ZodType<Prisma.ReservationUpdateManyAndReturnArgs> = z.object({ select: ReservationSelectObjectSchema.optional(), data: ReservationUpdateManyMutationInputObjectSchema, where: ReservationWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ReservationUpdateManyAndReturnArgs>;

export const ReservationUpdateManyAndReturnZodSchema = z.object({ select: ReservationSelectObjectSchema.optional(), data: ReservationUpdateManyMutationInputObjectSchema, where: ReservationWhereInputObjectSchema.optional() }).strict();