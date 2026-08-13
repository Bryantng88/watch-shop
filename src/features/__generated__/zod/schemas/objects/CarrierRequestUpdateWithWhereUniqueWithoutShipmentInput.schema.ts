import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierRequestWhereUniqueInputObjectSchema as CarrierRequestWhereUniqueInputObjectSchema } from './CarrierRequestWhereUniqueInput.schema';
import { CarrierRequestUpdateWithoutShipmentInputObjectSchema as CarrierRequestUpdateWithoutShipmentInputObjectSchema } from './CarrierRequestUpdateWithoutShipmentInput.schema';
import { CarrierRequestUncheckedUpdateWithoutShipmentInputObjectSchema as CarrierRequestUncheckedUpdateWithoutShipmentInputObjectSchema } from './CarrierRequestUncheckedUpdateWithoutShipmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CarrierRequestWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => CarrierRequestUpdateWithoutShipmentInputObjectSchema), z.lazy(() => CarrierRequestUncheckedUpdateWithoutShipmentInputObjectSchema)])
}).strict();
export const CarrierRequestUpdateWithWhereUniqueWithoutShipmentInputObjectSchema: z.ZodType<Prisma.CarrierRequestUpdateWithWhereUniqueWithoutShipmentInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierRequestUpdateWithWhereUniqueWithoutShipmentInput>;
export const CarrierRequestUpdateWithWhereUniqueWithoutShipmentInputObjectZodSchema = makeSchema();
