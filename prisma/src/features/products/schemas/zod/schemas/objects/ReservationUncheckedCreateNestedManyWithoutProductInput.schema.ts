import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ReservationCreateWithoutProductInputObjectSchema as ReservationCreateWithoutProductInputObjectSchema } from './ReservationCreateWithoutProductInput.schema';
import { ReservationUncheckedCreateWithoutProductInputObjectSchema as ReservationUncheckedCreateWithoutProductInputObjectSchema } from './ReservationUncheckedCreateWithoutProductInput.schema';
import { ReservationCreateOrConnectWithoutProductInputObjectSchema as ReservationCreateOrConnectWithoutProductInputObjectSchema } from './ReservationCreateOrConnectWithoutProductInput.schema';
import { ReservationCreateManyProductInputEnvelopeObjectSchema as ReservationCreateManyProductInputEnvelopeObjectSchema } from './ReservationCreateManyProductInputEnvelope.schema';
import { ReservationWhereUniqueInputObjectSchema as ReservationWhereUniqueInputObjectSchema } from './ReservationWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ReservationCreateWithoutProductInputObjectSchema), z.lazy(() => ReservationCreateWithoutProductInputObjectSchema).array(), z.lazy(() => ReservationUncheckedCreateWithoutProductInputObjectSchema), z.lazy(() => ReservationUncheckedCreateWithoutProductInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ReservationCreateOrConnectWithoutProductInputObjectSchema), z.lazy(() => ReservationCreateOrConnectWithoutProductInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ReservationCreateManyProductInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ReservationWhereUniqueInputObjectSchema), z.lazy(() => ReservationWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ReservationUncheckedCreateNestedManyWithoutProductInputObjectSchema: z.ZodType<Prisma.ReservationUncheckedCreateNestedManyWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ReservationUncheckedCreateNestedManyWithoutProductInput>;
export const ReservationUncheckedCreateNestedManyWithoutProductInputObjectZodSchema = makeSchema();
