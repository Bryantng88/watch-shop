import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierStatusHistoryCreateWithoutShipmentInputObjectSchema as CarrierStatusHistoryCreateWithoutShipmentInputObjectSchema } from './CarrierStatusHistoryCreateWithoutShipmentInput.schema';
import { CarrierStatusHistoryUncheckedCreateWithoutShipmentInputObjectSchema as CarrierStatusHistoryUncheckedCreateWithoutShipmentInputObjectSchema } from './CarrierStatusHistoryUncheckedCreateWithoutShipmentInput.schema';
import { CarrierStatusHistoryCreateOrConnectWithoutShipmentInputObjectSchema as CarrierStatusHistoryCreateOrConnectWithoutShipmentInputObjectSchema } from './CarrierStatusHistoryCreateOrConnectWithoutShipmentInput.schema';
import { CarrierStatusHistoryUpsertWithWhereUniqueWithoutShipmentInputObjectSchema as CarrierStatusHistoryUpsertWithWhereUniqueWithoutShipmentInputObjectSchema } from './CarrierStatusHistoryUpsertWithWhereUniqueWithoutShipmentInput.schema';
import { CarrierStatusHistoryCreateManyShipmentInputEnvelopeObjectSchema as CarrierStatusHistoryCreateManyShipmentInputEnvelopeObjectSchema } from './CarrierStatusHistoryCreateManyShipmentInputEnvelope.schema';
import { CarrierStatusHistoryWhereUniqueInputObjectSchema as CarrierStatusHistoryWhereUniqueInputObjectSchema } from './CarrierStatusHistoryWhereUniqueInput.schema';
import { CarrierStatusHistoryUpdateWithWhereUniqueWithoutShipmentInputObjectSchema as CarrierStatusHistoryUpdateWithWhereUniqueWithoutShipmentInputObjectSchema } from './CarrierStatusHistoryUpdateWithWhereUniqueWithoutShipmentInput.schema';
import { CarrierStatusHistoryUpdateManyWithWhereWithoutShipmentInputObjectSchema as CarrierStatusHistoryUpdateManyWithWhereWithoutShipmentInputObjectSchema } from './CarrierStatusHistoryUpdateManyWithWhereWithoutShipmentInput.schema';
import { CarrierStatusHistoryScalarWhereInputObjectSchema as CarrierStatusHistoryScalarWhereInputObjectSchema } from './CarrierStatusHistoryScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CarrierStatusHistoryCreateWithoutShipmentInputObjectSchema), z.lazy(() => CarrierStatusHistoryCreateWithoutShipmentInputObjectSchema).array(), z.lazy(() => CarrierStatusHistoryUncheckedCreateWithoutShipmentInputObjectSchema), z.lazy(() => CarrierStatusHistoryUncheckedCreateWithoutShipmentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CarrierStatusHistoryCreateOrConnectWithoutShipmentInputObjectSchema), z.lazy(() => CarrierStatusHistoryCreateOrConnectWithoutShipmentInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => CarrierStatusHistoryUpsertWithWhereUniqueWithoutShipmentInputObjectSchema), z.lazy(() => CarrierStatusHistoryUpsertWithWhereUniqueWithoutShipmentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CarrierStatusHistoryCreateManyShipmentInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => CarrierStatusHistoryWhereUniqueInputObjectSchema), z.lazy(() => CarrierStatusHistoryWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => CarrierStatusHistoryWhereUniqueInputObjectSchema), z.lazy(() => CarrierStatusHistoryWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => CarrierStatusHistoryWhereUniqueInputObjectSchema), z.lazy(() => CarrierStatusHistoryWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => CarrierStatusHistoryWhereUniqueInputObjectSchema), z.lazy(() => CarrierStatusHistoryWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => CarrierStatusHistoryUpdateWithWhereUniqueWithoutShipmentInputObjectSchema), z.lazy(() => CarrierStatusHistoryUpdateWithWhereUniqueWithoutShipmentInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => CarrierStatusHistoryUpdateManyWithWhereWithoutShipmentInputObjectSchema), z.lazy(() => CarrierStatusHistoryUpdateManyWithWhereWithoutShipmentInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => CarrierStatusHistoryScalarWhereInputObjectSchema), z.lazy(() => CarrierStatusHistoryScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const CarrierStatusHistoryUpdateManyWithoutShipmentNestedInputObjectSchema: z.ZodType<Prisma.CarrierStatusHistoryUpdateManyWithoutShipmentNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierStatusHistoryUpdateManyWithoutShipmentNestedInput>;
export const CarrierStatusHistoryUpdateManyWithoutShipmentNestedInputObjectZodSchema = makeSchema();
