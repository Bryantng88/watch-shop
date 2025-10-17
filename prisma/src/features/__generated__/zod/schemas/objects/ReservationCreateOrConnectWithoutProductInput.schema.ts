import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ReservationWhereUniqueInputObjectSchema as ReservationWhereUniqueInputObjectSchema } from './ReservationWhereUniqueInput.schema';
import { ReservationCreateWithoutProductInputObjectSchema as ReservationCreateWithoutProductInputObjectSchema } from './ReservationCreateWithoutProductInput.schema';
import { ReservationUncheckedCreateWithoutProductInputObjectSchema as ReservationUncheckedCreateWithoutProductInputObjectSchema } from './ReservationUncheckedCreateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ReservationWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ReservationCreateWithoutProductInputObjectSchema), z.lazy(() => ReservationUncheckedCreateWithoutProductInputObjectSchema)])
}).strict();
export const ReservationCreateOrConnectWithoutProductInputObjectSchema: z.ZodType<Prisma.ReservationCreateOrConnectWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ReservationCreateOrConnectWithoutProductInput>;
export const ReservationCreateOrConnectWithoutProductInputObjectZodSchema = makeSchema();
