import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ReservationStatusSchema } from '../enums/ReservationStatus.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  orderId: z.string().optional().nullable(),
  status: ReservationStatusSchema.optional(),
  depositAmt: z.number().optional().nullable(),
  expiresAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const ReservationUncheckedCreateWithoutProductInputObjectSchema: z.ZodType<Prisma.ReservationUncheckedCreateWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ReservationUncheckedCreateWithoutProductInput>;
export const ReservationUncheckedCreateWithoutProductInputObjectZodSchema = makeSchema();
