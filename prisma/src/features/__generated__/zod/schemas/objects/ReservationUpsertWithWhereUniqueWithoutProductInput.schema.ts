import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ReservationWhereUniqueInputObjectSchema as ReservationWhereUniqueInputObjectSchema } from './ReservationWhereUniqueInput.schema';
import { ReservationUpdateWithoutProductInputObjectSchema as ReservationUpdateWithoutProductInputObjectSchema } from './ReservationUpdateWithoutProductInput.schema';
import { ReservationUncheckedUpdateWithoutProductInputObjectSchema as ReservationUncheckedUpdateWithoutProductInputObjectSchema } from './ReservationUncheckedUpdateWithoutProductInput.schema';
import { ReservationCreateWithoutProductInputObjectSchema as ReservationCreateWithoutProductInputObjectSchema } from './ReservationCreateWithoutProductInput.schema';
import { ReservationUncheckedCreateWithoutProductInputObjectSchema as ReservationUncheckedCreateWithoutProductInputObjectSchema } from './ReservationUncheckedCreateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ReservationWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ReservationUpdateWithoutProductInputObjectSchema), z.lazy(() => ReservationUncheckedUpdateWithoutProductInputObjectSchema)]),
  create: z.union([z.lazy(() => ReservationCreateWithoutProductInputObjectSchema), z.lazy(() => ReservationUncheckedCreateWithoutProductInputObjectSchema)])
}).strict();
export const ReservationUpsertWithWhereUniqueWithoutProductInputObjectSchema: z.ZodType<Prisma.ReservationUpsertWithWhereUniqueWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ReservationUpsertWithWhereUniqueWithoutProductInput>;
export const ReservationUpsertWithWhereUniqueWithoutProductInputObjectZodSchema = makeSchema();
