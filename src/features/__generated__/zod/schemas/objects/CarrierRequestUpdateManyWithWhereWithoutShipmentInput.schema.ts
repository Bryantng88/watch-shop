import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierRequestScalarWhereInputObjectSchema as CarrierRequestScalarWhereInputObjectSchema } from './CarrierRequestScalarWhereInput.schema';
import { CarrierRequestUpdateManyMutationInputObjectSchema as CarrierRequestUpdateManyMutationInputObjectSchema } from './CarrierRequestUpdateManyMutationInput.schema';
import { CarrierRequestUncheckedUpdateManyWithoutShipmentInputObjectSchema as CarrierRequestUncheckedUpdateManyWithoutShipmentInputObjectSchema } from './CarrierRequestUncheckedUpdateManyWithoutShipmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CarrierRequestScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => CarrierRequestUpdateManyMutationInputObjectSchema), z.lazy(() => CarrierRequestUncheckedUpdateManyWithoutShipmentInputObjectSchema)])
}).strict();
export const CarrierRequestUpdateManyWithWhereWithoutShipmentInputObjectSchema: z.ZodType<Prisma.CarrierRequestUpdateManyWithWhereWithoutShipmentInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierRequestUpdateManyWithWhereWithoutShipmentInput>;
export const CarrierRequestUpdateManyWithWhereWithoutShipmentInputObjectZodSchema = makeSchema();
