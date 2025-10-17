import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ReservationSelectObjectSchema as ReservationSelectObjectSchema } from './ReservationSelect.schema';
import { ReservationIncludeObjectSchema as ReservationIncludeObjectSchema } from './ReservationInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => ReservationSelectObjectSchema).optional(),
  include: z.lazy(() => ReservationIncludeObjectSchema).optional()
}).strict();
export const ReservationArgsObjectSchema = makeSchema();
export const ReservationArgsObjectZodSchema = makeSchema();
