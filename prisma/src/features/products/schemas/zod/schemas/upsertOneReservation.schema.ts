import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ReservationSelectObjectSchema as ReservationSelectObjectSchema } from './objects/ReservationSelect.schema';
import { ReservationIncludeObjectSchema as ReservationIncludeObjectSchema } from './objects/ReservationInclude.schema';
import { ReservationWhereUniqueInputObjectSchema as ReservationWhereUniqueInputObjectSchema } from './objects/ReservationWhereUniqueInput.schema';
import { ReservationCreateInputObjectSchema as ReservationCreateInputObjectSchema } from './objects/ReservationCreateInput.schema';
import { ReservationUncheckedCreateInputObjectSchema as ReservationUncheckedCreateInputObjectSchema } from './objects/ReservationUncheckedCreateInput.schema';
import { ReservationUpdateInputObjectSchema as ReservationUpdateInputObjectSchema } from './objects/ReservationUpdateInput.schema';
import { ReservationUncheckedUpdateInputObjectSchema as ReservationUncheckedUpdateInputObjectSchema } from './objects/ReservationUncheckedUpdateInput.schema';

export const ReservationUpsertOneSchema: z.ZodType<Prisma.ReservationUpsertArgs> = z.object({ select: ReservationSelectObjectSchema.optional(), include: ReservationIncludeObjectSchema.optional(), where: ReservationWhereUniqueInputObjectSchema, create: z.union([ ReservationCreateInputObjectSchema, ReservationUncheckedCreateInputObjectSchema ]), update: z.union([ ReservationUpdateInputObjectSchema, ReservationUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.ReservationUpsertArgs>;

export const ReservationUpsertOneZodSchema = z.object({ select: ReservationSelectObjectSchema.optional(), include: ReservationIncludeObjectSchema.optional(), where: ReservationWhereUniqueInputObjectSchema, create: z.union([ ReservationCreateInputObjectSchema, ReservationUncheckedCreateInputObjectSchema ]), update: z.union([ ReservationUpdateInputObjectSchema, ReservationUncheckedUpdateInputObjectSchema ]) }).strict();