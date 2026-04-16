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
export const ReservationCreateManyProductInputObjectSchema: z.ZodType<Prisma.ReservationCreateManyProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ReservationCreateManyProductInput>;
export const ReservationCreateManyProductInputObjectZodSchema = makeSchema();
