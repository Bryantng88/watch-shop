import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierRequestWhereUniqueInputObjectSchema as CarrierRequestWhereUniqueInputObjectSchema } from './CarrierRequestWhereUniqueInput.schema';
import { CarrierRequestUpdateWithoutShipmentInputObjectSchema as CarrierRequestUpdateWithoutShipmentInputObjectSchema } from './CarrierRequestUpdateWithoutShipmentInput.schema';
import { CarrierRequestUncheckedUpdateWithoutShipmentInputObjectSchema as CarrierRequestUncheckedUpdateWithoutShipmentInputObjectSchema } from './CarrierRequestUncheckedUpdateWithoutShipmentInput.schema';
import { CarrierRequestCreateWithoutShipmentInputObjectSchema as CarrierRequestCreateWithoutShipmentInputObjectSchema } from './CarrierRequestCreateWithoutShipmentInput.schema';
import { CarrierRequestUncheckedCreateWithoutShipmentInputObjectSchema as CarrierRequestUncheckedCreateWithoutShipmentInputObjectSchema } from './CarrierRequestUncheckedCreateWithoutShipmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CarrierRequestWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => CarrierRequestUpdateWithoutShipmentInputObjectSchema), z.lazy(() => CarrierRequestUncheckedUpdateWithoutShipmentInputObjectSchema)]),
  create: z.union([z.lazy(() => CarrierRequestCreateWithoutShipmentInputObjectSchema), z.lazy(() => CarrierRequestUncheckedCreateWithoutShipmentInputObjectSchema)])
}).strict();
export const CarrierRequestUpsertWithWhereUniqueWithoutShipmentInputObjectSchema: z.ZodType<Prisma.CarrierRequestUpsertWithWhereUniqueWithoutShipmentInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierRequestUpsertWithWhereUniqueWithoutShipmentInput>;
export const CarrierRequestUpsertWithWhereUniqueWithoutShipmentInputObjectZodSchema = makeSchema();
