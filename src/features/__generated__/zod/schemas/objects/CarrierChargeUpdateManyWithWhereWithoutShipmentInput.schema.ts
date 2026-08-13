import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierChargeScalarWhereInputObjectSchema as CarrierChargeScalarWhereInputObjectSchema } from './CarrierChargeScalarWhereInput.schema';
import { CarrierChargeUpdateManyMutationInputObjectSchema as CarrierChargeUpdateManyMutationInputObjectSchema } from './CarrierChargeUpdateManyMutationInput.schema';
import { CarrierChargeUncheckedUpdateManyWithoutShipmentInputObjectSchema as CarrierChargeUncheckedUpdateManyWithoutShipmentInputObjectSchema } from './CarrierChargeUncheckedUpdateManyWithoutShipmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CarrierChargeScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => CarrierChargeUpdateManyMutationInputObjectSchema), z.lazy(() => CarrierChargeUncheckedUpdateManyWithoutShipmentInputObjectSchema)])
}).strict();
export const CarrierChargeUpdateManyWithWhereWithoutShipmentInputObjectSchema: z.ZodType<Prisma.CarrierChargeUpdateManyWithWhereWithoutShipmentInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierChargeUpdateManyWithWhereWithoutShipmentInput>;
export const CarrierChargeUpdateManyWithWhereWithoutShipmentInputObjectZodSchema = makeSchema();
