import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ReservationStatusSchema } from '../enums/ReservationStatus.schema';
import { ProductCreateNestedOneWithoutReservationInputObjectSchema as ProductCreateNestedOneWithoutReservationInputObjectSchema } from './ProductCreateNestedOneWithoutReservationInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  orderId: z.string().optional().nullable(),
  status: ReservationStatusSchema.optional(),
  depositAmt: z.number().optional().nullable(),
  expiresAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  product: z.lazy(() => ProductCreateNestedOneWithoutReservationInputObjectSchema).optional()
}).strict();
export const ReservationCreateInputObjectSchema: z.ZodType<Prisma.ReservationCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.ReservationCreateInput>;
export const ReservationCreateInputObjectZodSchema = makeSchema();
