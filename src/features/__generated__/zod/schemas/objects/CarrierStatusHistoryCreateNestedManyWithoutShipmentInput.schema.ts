import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierStatusHistoryCreateWithoutShipmentInputObjectSchema as CarrierStatusHistoryCreateWithoutShipmentInputObjectSchema } from './CarrierStatusHistoryCreateWithoutShipmentInput.schema';
import { CarrierStatusHistoryUncheckedCreateWithoutShipmentInputObjectSchema as CarrierStatusHistoryUncheckedCreateWithoutShipmentInputObjectSchema } from './CarrierStatusHistoryUncheckedCreateWithoutShipmentInput.schema';
import { CarrierStatusHistoryCreateOrConnectWithoutShipmentInputObjectSchema as CarrierStatusHistoryCreateOrConnectWithoutShipmentInputObjectSchema } from './CarrierStatusHistoryCreateOrConnectWithoutShipmentInput.schema';
import { CarrierStatusHistoryCreateManyShipmentInputEnvelopeObjectSchema as CarrierStatusHistoryCreateManyShipmentInputEnvelopeObjectSchema } from './CarrierStatusHistoryCreateManyShipmentInputEnvelope.schema';
import { CarrierStatusHistoryWhereUniqueInputObjectSchema as CarrierStatusHistoryWhereUniqueInputObjectSchema } from './CarrierStatusHistoryWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CarrierStatusHistoryCreateWithoutShipmentInputObjectSchema), z.lazy(() => CarrierStatusHistoryCreateWithoutShipmentInputObjectSchema).array(), z.lazy(() => CarrierStatusHistoryUncheckedCreateWithoutShipmentInputObjectSchema), z.lazy(() => CarrierStatusHistoryUncheckedCreateWithoutShipmentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CarrierStatusHistoryCreateOrConnectWithoutShipmentInputObjectSchema), z.lazy(() => CarrierStatusHistoryCreateOrConnectWithoutShipmentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CarrierStatusHistoryCreateManyShipmentInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => CarrierStatusHistoryWhereUniqueInputObjectSchema), z.lazy(() => CarrierStatusHistoryWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const CarrierStatusHistoryCreateNestedManyWithoutShipmentInputObjectSchema: z.ZodType<Prisma.CarrierStatusHistoryCreateNestedManyWithoutShipmentInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierStatusHistoryCreateNestedManyWithoutShipmentInput>;
export const CarrierStatusHistoryCreateNestedManyWithoutShipmentInputObjectZodSchema = makeSchema();
