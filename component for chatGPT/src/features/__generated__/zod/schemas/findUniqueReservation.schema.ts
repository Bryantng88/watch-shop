import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ReservationSelectObjectSchema as ReservationSelectObjectSchema } from './objects/ReservationSelect.schema';
import { ReservationIncludeObjectSchema as ReservationIncludeObjectSchema } from './objects/ReservationInclude.schema';
import { ReservationWhereUniqueInputObjectSchema as ReservationWhereUniqueInputObjectSchema } from './objects/ReservationWhereUniqueInput.schema';

export const ReservationFindUniqueSchema: z.ZodType<Prisma.ReservationFindUniqueArgs> = z.object({ select: ReservationSelectObjectSchema.optional(), include: ReservationIncludeObjectSchema.optional(), where: ReservationWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ReservationFindUniqueArgs>;

export const ReservationFindUniqueZodSchema = z.object({ select: ReservationSelectObjectSchema.optional(), include: ReservationIncludeObjectSchema.optional(), where: ReservationWhereUniqueInputObjectSchema }).strict();