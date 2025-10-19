import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ReservationCreateWithoutProductInputObjectSchema as ReservationCreateWithoutProductInputObjectSchema } from './ReservationCreateWithoutProductInput.schema';
import { ReservationUncheckedCreateWithoutProductInputObjectSchema as ReservationUncheckedCreateWithoutProductInputObjectSchema } from './ReservationUncheckedCreateWithoutProductInput.schema';
import { ReservationCreateOrConnectWithoutProductInputObjectSchema as ReservationCreateOrConnectWithoutProductInputObjectSchema } from './ReservationCreateOrConnectWithoutProductInput.schema';
import { ReservationUpsertWithWhereUniqueWithoutProductInputObjectSchema as ReservationUpsertWithWhereUniqueWithoutProductInputObjectSchema } from './ReservationUpsertWithWhereUniqueWithoutProductInput.schema';
import { ReservationCreateManyProductInputEnvelopeObjectSchema as ReservationCreateManyProductInputEnvelopeObjectSchema } from './ReservationCreateManyProductInputEnvelope.schema';
import { ReservationWhereUniqueInputObjectSchema as ReservationWhereUniqueInputObjectSchema } from './ReservationWhereUniqueInput.schema';
import { ReservationUpdateWithWhereUniqueWithoutProductInputObjectSchema as ReservationUpdateWithWhereUniqueWithoutProductInputObjectSchema } from './ReservationUpdateWithWhereUniqueWithoutProductInput.schema';
import { ReservationUpdateManyWithWhereWithoutProductInputObjectSchema as ReservationUpdateManyWithWhereWithoutProductInputObjectSchema } from './ReservationUpdateManyWithWhereWithoutProductInput.schema';
import { ReservationScalarWhereInputObjectSchema as ReservationScalarWhereInputObjectSchema } from './ReservationScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ReservationCreateWithoutProductInputObjectSchema), z.lazy(() => ReservationCreateWithoutProductInputObjectSchema).array(), z.lazy(() => ReservationUncheckedCreateWithoutProductInputObjectSchema), z.lazy(() => ReservationUncheckedCreateWithoutProductInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ReservationCreateOrConnectWithoutProductInputObjectSchema), z.lazy(() => ReservationCreateOrConnectWithoutProductInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ReservationUpsertWithWhereUniqueWithoutProductInputObjectSchema), z.lazy(() => ReservationUpsertWithWhereUniqueWithoutProductInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ReservationCreateManyProductInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ReservationWhereUniqueInputObjectSchema), z.lazy(() => ReservationWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ReservationWhereUniqueInputObjectSchema), z.lazy(() => ReservationWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ReservationWhereUniqueInputObjectSchema), z.lazy(() => ReservationWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ReservationWhereUniqueInputObjectSchema), z.lazy(() => ReservationWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ReservationUpdateWithWhereUniqueWithoutProductInputObjectSchema), z.lazy(() => ReservationUpdateWithWhereUniqueWithoutProductInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ReservationUpdateManyWithWhereWithoutProductInputObjectSchema), z.lazy(() => ReservationUpdateManyWithWhereWithoutProductInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ReservationScalarWhereInputObjectSchema), z.lazy(() => ReservationScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ReservationUncheckedUpdateManyWithoutProductNestedInputObjectSchema: z.ZodType<Prisma.ReservationUncheckedUpdateManyWithoutProductNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ReservationUncheckedUpdateManyWithoutProductNestedInput>;
export const ReservationUncheckedUpdateManyWithoutProductNestedInputObjectZodSchema = makeSchema();
