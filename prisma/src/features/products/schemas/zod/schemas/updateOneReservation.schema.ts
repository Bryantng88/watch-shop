import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ReservationSelectObjectSchema as ReservationSelectObjectSchema } from './objects/ReservationSelect.schema';
import { ReservationIncludeObjectSchema as ReservationIncludeObjectSchema } from './objects/ReservationInclude.schema';
import { ReservationUpdateInputObjectSchema as ReservationUpdateInputObjectSchema } from './objects/ReservationUpdateInput.schema';
import { ReservationUncheckedUpdateInputObjectSchema as ReservationUncheckedUpdateInputObjectSchema } from './objects/ReservationUncheckedUpdateInput.schema';
import { ReservationWhereUniqueInputObjectSchema as ReservationWhereUniqueInputObjectSchema } from './objects/ReservationWhereUniqueInput.schema';

export const ReservationUpdateOneSchema: z.ZodType<Prisma.ReservationUpdateArgs> = z.object({ select: ReservationSelectObjectSchema.optional(), include: ReservationIncludeObjectSchema.optional(), data: z.union([ReservationUpdateInputObjectSchema, ReservationUncheckedUpdateInputObjectSchema]), where: ReservationWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ReservationUpdateArgs>;

export const ReservationUpdateOneZodSchema = z.object({ select: ReservationSelectObjectSchema.optional(), include: ReservationIncludeObjectSchema.optional(), data: z.union([ReservationUpdateInputObjectSchema, ReservationUncheckedUpdateInputObjectSchema]), where: ReservationWhereUniqueInputObjectSchema }).strict();