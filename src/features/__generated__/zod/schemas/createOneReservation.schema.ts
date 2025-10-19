import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ReservationSelectObjectSchema as ReservationSelectObjectSchema } from './objects/ReservationSelect.schema';
import { ReservationIncludeObjectSchema as ReservationIncludeObjectSchema } from './objects/ReservationInclude.schema';
import { ReservationCreateInputObjectSchema as ReservationCreateInputObjectSchema } from './objects/ReservationCreateInput.schema';
import { ReservationUncheckedCreateInputObjectSchema as ReservationUncheckedCreateInputObjectSchema } from './objects/ReservationUncheckedCreateInput.schema';

export const ReservationCreateOneSchema: z.ZodType<Prisma.ReservationCreateArgs> = z.object({ select: ReservationSelectObjectSchema.optional(), include: ReservationIncludeObjectSchema.optional(), data: z.union([ReservationCreateInputObjectSchema, ReservationUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.ReservationCreateArgs>;

export const ReservationCreateOneZodSchema = z.object({ select: ReservationSelectObjectSchema.optional(), include: ReservationIncludeObjectSchema.optional(), data: z.union([ReservationCreateInputObjectSchema, ReservationUncheckedCreateInputObjectSchema]) }).strict();