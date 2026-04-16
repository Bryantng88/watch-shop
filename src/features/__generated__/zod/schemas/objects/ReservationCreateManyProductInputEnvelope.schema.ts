import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ReservationCreateManyProductInputObjectSchema as ReservationCreateManyProductInputObjectSchema } from './ReservationCreateManyProductInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => ReservationCreateManyProductInputObjectSchema), z.lazy(() => ReservationCreateManyProductInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const ReservationCreateManyProductInputEnvelopeObjectSchema: z.ZodType<Prisma.ReservationCreateManyProductInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.ReservationCreateManyProductInputEnvelope>;
export const ReservationCreateManyProductInputEnvelopeObjectZodSchema = makeSchema();
