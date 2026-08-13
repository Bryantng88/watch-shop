import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentWhereInputObjectSchema as ShipmentWhereInputObjectSchema } from './ShipmentWhereInput.schema';
import { ShipmentUpdateWithoutCarrierChargesInputObjectSchema as ShipmentUpdateWithoutCarrierChargesInputObjectSchema } from './ShipmentUpdateWithoutCarrierChargesInput.schema';
import { ShipmentUncheckedUpdateWithoutCarrierChargesInputObjectSchema as ShipmentUncheckedUpdateWithoutCarrierChargesInputObjectSchema } from './ShipmentUncheckedUpdateWithoutCarrierChargesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ShipmentWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ShipmentUpdateWithoutCarrierChargesInputObjectSchema), z.lazy(() => ShipmentUncheckedUpdateWithoutCarrierChargesInputObjectSchema)])
}).strict();
export const ShipmentUpdateToOneWithWhereWithoutCarrierChargesInputObjectSchema: z.ZodType<Prisma.ShipmentUpdateToOneWithWhereWithoutCarrierChargesInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentUpdateToOneWithWhereWithoutCarrierChargesInput>;
export const ShipmentUpdateToOneWithWhereWithoutCarrierChargesInputObjectZodSchema = makeSchema();
