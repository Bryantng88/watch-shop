import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierStatusHistoryScalarWhereInputObjectSchema as CarrierStatusHistoryScalarWhereInputObjectSchema } from './CarrierStatusHistoryScalarWhereInput.schema';
import { CarrierStatusHistoryUpdateManyMutationInputObjectSchema as CarrierStatusHistoryUpdateManyMutationInputObjectSchema } from './CarrierStatusHistoryUpdateManyMutationInput.schema';
import { CarrierStatusHistoryUncheckedUpdateManyWithoutShipmentInputObjectSchema as CarrierStatusHistoryUncheckedUpdateManyWithoutShipmentInputObjectSchema } from './CarrierStatusHistoryUncheckedUpdateManyWithoutShipmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CarrierStatusHistoryScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => CarrierStatusHistoryUpdateManyMutationInputObjectSchema), z.lazy(() => CarrierStatusHistoryUncheckedUpdateManyWithoutShipmentInputObjectSchema)])
}).strict();
export const CarrierStatusHistoryUpdateManyWithWhereWithoutShipmentInputObjectSchema: z.ZodType<Prisma.CarrierStatusHistoryUpdateManyWithWhereWithoutShipmentInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierStatusHistoryUpdateManyWithWhereWithoutShipmentInput>;
export const CarrierStatusHistoryUpdateManyWithWhereWithoutShipmentInputObjectZodSchema = makeSchema();
