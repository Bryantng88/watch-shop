import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierRequestCreateWithoutShipmentInputObjectSchema as CarrierRequestCreateWithoutShipmentInputObjectSchema } from './CarrierRequestCreateWithoutShipmentInput.schema';
import { CarrierRequestUncheckedCreateWithoutShipmentInputObjectSchema as CarrierRequestUncheckedCreateWithoutShipmentInputObjectSchema } from './CarrierRequestUncheckedCreateWithoutShipmentInput.schema';
import { CarrierRequestCreateOrConnectWithoutShipmentInputObjectSchema as CarrierRequestCreateOrConnectWithoutShipmentInputObjectSchema } from './CarrierRequestCreateOrConnectWithoutShipmentInput.schema';
import { CarrierRequestUpsertWithWhereUniqueWithoutShipmentInputObjectSchema as CarrierRequestUpsertWithWhereUniqueWithoutShipmentInputObjectSchema } from './CarrierRequestUpsertWithWhereUniqueWithoutShipmentInput.schema';
import { CarrierRequestCreateManyShipmentInputEnvelopeObjectSchema as CarrierRequestCreateManyShipmentInputEnvelopeObjectSchema } from './CarrierRequestCreateManyShipmentInputEnvelope.schema';
import { CarrierRequestWhereUniqueInputObjectSchema as CarrierRequestWhereUniqueInputObjectSchema } from './CarrierRequestWhereUniqueInput.schema';
import { CarrierRequestUpdateWithWhereUniqueWithoutShipmentInputObjectSchema as CarrierRequestUpdateWithWhereUniqueWithoutShipmentInputObjectSchema } from './CarrierRequestUpdateWithWhereUniqueWithoutShipmentInput.schema';
import { CarrierRequestUpdateManyWithWhereWithoutShipmentInputObjectSchema as CarrierRequestUpdateManyWithWhereWithoutShipmentInputObjectSchema } from './CarrierRequestUpdateManyWithWhereWithoutShipmentInput.schema';
import { CarrierRequestScalarWhereInputObjectSchema as CarrierRequestScalarWhereInputObjectSchema } from './CarrierRequestScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CarrierRequestCreateWithoutShipmentInputObjectSchema), z.lazy(() => CarrierRequestCreateWithoutShipmentInputObjectSchema).array(), z.lazy(() => CarrierRequestUncheckedCreateWithoutShipmentInputObjectSchema), z.lazy(() => CarrierRequestUncheckedCreateWithoutShipmentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CarrierRequestCreateOrConnectWithoutShipmentInputObjectSchema), z.lazy(() => CarrierRequestCreateOrConnectWithoutShipmentInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => CarrierRequestUpsertWithWhereUniqueWithoutShipmentInputObjectSchema), z.lazy(() => CarrierRequestUpsertWithWhereUniqueWithoutShipmentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CarrierRequestCreateManyShipmentInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => CarrierRequestWhereUniqueInputObjectSchema), z.lazy(() => CarrierRequestWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => CarrierRequestWhereUniqueInputObjectSchema), z.lazy(() => CarrierRequestWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => CarrierRequestWhereUniqueInputObjectSchema), z.lazy(() => CarrierRequestWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => CarrierRequestWhereUniqueInputObjectSchema), z.lazy(() => CarrierRequestWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => CarrierRequestUpdateWithWhereUniqueWithoutShipmentInputObjectSchema), z.lazy(() => CarrierRequestUpdateWithWhereUniqueWithoutShipmentInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => CarrierRequestUpdateManyWithWhereWithoutShipmentInputObjectSchema), z.lazy(() => CarrierRequestUpdateManyWithWhereWithoutShipmentInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => CarrierRequestScalarWhereInputObjectSchema), z.lazy(() => CarrierRequestScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const CarrierRequestUncheckedUpdateManyWithoutShipmentNestedInputObjectSchema: z.ZodType<Prisma.CarrierRequestUncheckedUpdateManyWithoutShipmentNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierRequestUncheckedUpdateManyWithoutShipmentNestedInput>;
export const CarrierRequestUncheckedUpdateManyWithoutShipmentNestedInputObjectZodSchema = makeSchema();
