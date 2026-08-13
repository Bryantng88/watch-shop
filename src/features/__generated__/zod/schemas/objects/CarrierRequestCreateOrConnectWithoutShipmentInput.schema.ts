import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierRequestWhereUniqueInputObjectSchema as CarrierRequestWhereUniqueInputObjectSchema } from './CarrierRequestWhereUniqueInput.schema';
import { CarrierRequestCreateWithoutShipmentInputObjectSchema as CarrierRequestCreateWithoutShipmentInputObjectSchema } from './CarrierRequestCreateWithoutShipmentInput.schema';
import { CarrierRequestUncheckedCreateWithoutShipmentInputObjectSchema as CarrierRequestUncheckedCreateWithoutShipmentInputObjectSchema } from './CarrierRequestUncheckedCreateWithoutShipmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CarrierRequestWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => CarrierRequestCreateWithoutShipmentInputObjectSchema), z.lazy(() => CarrierRequestUncheckedCreateWithoutShipmentInputObjectSchema)])
}).strict();
export const CarrierRequestCreateOrConnectWithoutShipmentInputObjectSchema: z.ZodType<Prisma.CarrierRequestCreateOrConnectWithoutShipmentInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierRequestCreateOrConnectWithoutShipmentInput>;
export const CarrierRequestCreateOrConnectWithoutShipmentInputObjectZodSchema = makeSchema();
