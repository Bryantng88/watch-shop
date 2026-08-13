import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierChargeCreateWithoutShipmentInputObjectSchema as CarrierChargeCreateWithoutShipmentInputObjectSchema } from './CarrierChargeCreateWithoutShipmentInput.schema';
import { CarrierChargeUncheckedCreateWithoutShipmentInputObjectSchema as CarrierChargeUncheckedCreateWithoutShipmentInputObjectSchema } from './CarrierChargeUncheckedCreateWithoutShipmentInput.schema';
import { CarrierChargeCreateOrConnectWithoutShipmentInputObjectSchema as CarrierChargeCreateOrConnectWithoutShipmentInputObjectSchema } from './CarrierChargeCreateOrConnectWithoutShipmentInput.schema';
import { CarrierChargeUpsertWithWhereUniqueWithoutShipmentInputObjectSchema as CarrierChargeUpsertWithWhereUniqueWithoutShipmentInputObjectSchema } from './CarrierChargeUpsertWithWhereUniqueWithoutShipmentInput.schema';
import { CarrierChargeCreateManyShipmentInputEnvelopeObjectSchema as CarrierChargeCreateManyShipmentInputEnvelopeObjectSchema } from './CarrierChargeCreateManyShipmentInputEnvelope.schema';
import { CarrierChargeWhereUniqueInputObjectSchema as CarrierChargeWhereUniqueInputObjectSchema } from './CarrierChargeWhereUniqueInput.schema';
import { CarrierChargeUpdateWithWhereUniqueWithoutShipmentInputObjectSchema as CarrierChargeUpdateWithWhereUniqueWithoutShipmentInputObjectSchema } from './CarrierChargeUpdateWithWhereUniqueWithoutShipmentInput.schema';
import { CarrierChargeUpdateManyWithWhereWithoutShipmentInputObjectSchema as CarrierChargeUpdateManyWithWhereWithoutShipmentInputObjectSchema } from './CarrierChargeUpdateManyWithWhereWithoutShipmentInput.schema';
import { CarrierChargeScalarWhereInputObjectSchema as CarrierChargeScalarWhereInputObjectSchema } from './CarrierChargeScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CarrierChargeCreateWithoutShipmentInputObjectSchema), z.lazy(() => CarrierChargeCreateWithoutShipmentInputObjectSchema).array(), z.lazy(() => CarrierChargeUncheckedCreateWithoutShipmentInputObjectSchema), z.lazy(() => CarrierChargeUncheckedCreateWithoutShipmentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CarrierChargeCreateOrConnectWithoutShipmentInputObjectSchema), z.lazy(() => CarrierChargeCreateOrConnectWithoutShipmentInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => CarrierChargeUpsertWithWhereUniqueWithoutShipmentInputObjectSchema), z.lazy(() => CarrierChargeUpsertWithWhereUniqueWithoutShipmentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CarrierChargeCreateManyShipmentInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => CarrierChargeWhereUniqueInputObjectSchema), z.lazy(() => CarrierChargeWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => CarrierChargeWhereUniqueInputObjectSchema), z.lazy(() => CarrierChargeWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => CarrierChargeWhereUniqueInputObjectSchema), z.lazy(() => CarrierChargeWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => CarrierChargeWhereUniqueInputObjectSchema), z.lazy(() => CarrierChargeWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => CarrierChargeUpdateWithWhereUniqueWithoutShipmentInputObjectSchema), z.lazy(() => CarrierChargeUpdateWithWhereUniqueWithoutShipmentInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => CarrierChargeUpdateManyWithWhereWithoutShipmentInputObjectSchema), z.lazy(() => CarrierChargeUpdateManyWithWhereWithoutShipmentInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => CarrierChargeScalarWhereInputObjectSchema), z.lazy(() => CarrierChargeScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const CarrierChargeUncheckedUpdateManyWithoutShipmentNestedInputObjectSchema: z.ZodType<Prisma.CarrierChargeUncheckedUpdateManyWithoutShipmentNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierChargeUncheckedUpdateManyWithoutShipmentNestedInput>;
export const CarrierChargeUncheckedUpdateManyWithoutShipmentNestedInputObjectZodSchema = makeSchema();
