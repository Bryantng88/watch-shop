import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentWhereInputObjectSchema as ShipmentWhereInputObjectSchema } from './ShipmentWhereInput.schema';
import { ShipmentUpdateWithoutCarrierStatusHistoryInputObjectSchema as ShipmentUpdateWithoutCarrierStatusHistoryInputObjectSchema } from './ShipmentUpdateWithoutCarrierStatusHistoryInput.schema';
import { ShipmentUncheckedUpdateWithoutCarrierStatusHistoryInputObjectSchema as ShipmentUncheckedUpdateWithoutCarrierStatusHistoryInputObjectSchema } from './ShipmentUncheckedUpdateWithoutCarrierStatusHistoryInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ShipmentWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ShipmentUpdateWithoutCarrierStatusHistoryInputObjectSchema), z.lazy(() => ShipmentUncheckedUpdateWithoutCarrierStatusHistoryInputObjectSchema)])
}).strict();
export const ShipmentUpdateToOneWithWhereWithoutCarrierStatusHistoryInputObjectSchema: z.ZodType<Prisma.ShipmentUpdateToOneWithWhereWithoutCarrierStatusHistoryInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentUpdateToOneWithWhereWithoutCarrierStatusHistoryInput>;
export const ShipmentUpdateToOneWithWhereWithoutCarrierStatusHistoryInputObjectZodSchema = makeSchema();
