import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ReservationWhereUniqueInputObjectSchema as ReservationWhereUniqueInputObjectSchema } from './ReservationWhereUniqueInput.schema';
import { ReservationUpdateWithoutProductInputObjectSchema as ReservationUpdateWithoutProductInputObjectSchema } from './ReservationUpdateWithoutProductInput.schema';
import { ReservationUncheckedUpdateWithoutProductInputObjectSchema as ReservationUncheckedUpdateWithoutProductInputObjectSchema } from './ReservationUncheckedUpdateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ReservationWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ReservationUpdateWithoutProductInputObjectSchema), z.lazy(() => ReservationUncheckedUpdateWithoutProductInputObjectSchema)])
}).strict();
export const ReservationUpdateWithWhereUniqueWithoutProductInputObjectSchema: z.ZodType<Prisma.ReservationUpdateWithWhereUniqueWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ReservationUpdateWithWhereUniqueWithoutProductInput>;
export const ReservationUpdateWithWhereUniqueWithoutProductInputObjectZodSchema = makeSchema();
