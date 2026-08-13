import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentUpdateWithoutCarrierChargesInputObjectSchema as ShipmentUpdateWithoutCarrierChargesInputObjectSchema } from './ShipmentUpdateWithoutCarrierChargesInput.schema';
import { ShipmentUncheckedUpdateWithoutCarrierChargesInputObjectSchema as ShipmentUncheckedUpdateWithoutCarrierChargesInputObjectSchema } from './ShipmentUncheckedUpdateWithoutCarrierChargesInput.schema';
import { ShipmentCreateWithoutCarrierChargesInputObjectSchema as ShipmentCreateWithoutCarrierChargesInputObjectSchema } from './ShipmentCreateWithoutCarrierChargesInput.schema';
import { ShipmentUncheckedCreateWithoutCarrierChargesInputObjectSchema as ShipmentUncheckedCreateWithoutCarrierChargesInputObjectSchema } from './ShipmentUncheckedCreateWithoutCarrierChargesInput.schema';
import { ShipmentWhereInputObjectSchema as ShipmentWhereInputObjectSchema } from './ShipmentWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ShipmentUpdateWithoutCarrierChargesInputObjectSchema), z.lazy(() => ShipmentUncheckedUpdateWithoutCarrierChargesInputObjectSchema)]),
  create: z.union([z.lazy(() => ShipmentCreateWithoutCarrierChargesInputObjectSchema), z.lazy(() => ShipmentUncheckedCreateWithoutCarrierChargesInputObjectSchema)]),
  where: z.lazy(() => ShipmentWhereInputObjectSchema).optional()
}).strict();
export const ShipmentUpsertWithoutCarrierChargesInputObjectSchema: z.ZodType<Prisma.ShipmentUpsertWithoutCarrierChargesInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentUpsertWithoutCarrierChargesInput>;
export const ShipmentUpsertWithoutCarrierChargesInputObjectZodSchema = makeSchema();
