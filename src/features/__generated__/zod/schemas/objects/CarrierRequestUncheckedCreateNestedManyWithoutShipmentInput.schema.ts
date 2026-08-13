import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierRequestCreateWithoutShipmentInputObjectSchema as CarrierRequestCreateWithoutShipmentInputObjectSchema } from './CarrierRequestCreateWithoutShipmentInput.schema';
import { CarrierRequestUncheckedCreateWithoutShipmentInputObjectSchema as CarrierRequestUncheckedCreateWithoutShipmentInputObjectSchema } from './CarrierRequestUncheckedCreateWithoutShipmentInput.schema';
import { CarrierRequestCreateOrConnectWithoutShipmentInputObjectSchema as CarrierRequestCreateOrConnectWithoutShipmentInputObjectSchema } from './CarrierRequestCreateOrConnectWithoutShipmentInput.schema';
import { CarrierRequestCreateManyShipmentInputEnvelopeObjectSchema as CarrierRequestCreateManyShipmentInputEnvelopeObjectSchema } from './CarrierRequestCreateManyShipmentInputEnvelope.schema';
import { CarrierRequestWhereUniqueInputObjectSchema as CarrierRequestWhereUniqueInputObjectSchema } from './CarrierRequestWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CarrierRequestCreateWithoutShipmentInputObjectSchema), z.lazy(() => CarrierRequestCreateWithoutShipmentInputObjectSchema).array(), z.lazy(() => CarrierRequestUncheckedCreateWithoutShipmentInputObjectSchema), z.lazy(() => CarrierRequestUncheckedCreateWithoutShipmentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CarrierRequestCreateOrConnectWithoutShipmentInputObjectSchema), z.lazy(() => CarrierRequestCreateOrConnectWithoutShipmentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CarrierRequestCreateManyShipmentInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => CarrierRequestWhereUniqueInputObjectSchema), z.lazy(() => CarrierRequestWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const CarrierRequestUncheckedCreateNestedManyWithoutShipmentInputObjectSchema: z.ZodType<Prisma.CarrierRequestUncheckedCreateNestedManyWithoutShipmentInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierRequestUncheckedCreateNestedManyWithoutShipmentInput>;
export const CarrierRequestUncheckedCreateNestedManyWithoutShipmentInputObjectZodSchema = makeSchema();
