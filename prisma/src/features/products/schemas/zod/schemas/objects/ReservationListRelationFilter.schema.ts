import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ReservationWhereInputObjectSchema as ReservationWhereInputObjectSchema } from './ReservationWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => ReservationWhereInputObjectSchema).optional(),
  some: z.lazy(() => ReservationWhereInputObjectSchema).optional(),
  none: z.lazy(() => ReservationWhereInputObjectSchema).optional()
}).strict();
export const ReservationListRelationFilterObjectSchema: z.ZodType<Prisma.ReservationListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.ReservationListRelationFilter>;
export const ReservationListRelationFilterObjectZodSchema = makeSchema();
