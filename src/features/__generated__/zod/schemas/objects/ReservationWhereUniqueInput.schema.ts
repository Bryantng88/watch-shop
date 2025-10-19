import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const ReservationWhereUniqueInputObjectSchema: z.ZodType<Prisma.ReservationWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.ReservationWhereUniqueInput>;
export const ReservationWhereUniqueInputObjectZodSchema = makeSchema();
