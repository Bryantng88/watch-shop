import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentWhereUniqueInputObjectSchema as ShipmentWhereUniqueInputObjectSchema } from './ShipmentWhereUniqueInput.schema';
import { ShipmentCreateWithoutCarrierChargesInputObjectSchema as ShipmentCreateWithoutCarrierChargesInputObjectSchema } from './ShipmentCreateWithoutCarrierChargesInput.schema';
import { ShipmentUncheckedCreateWithoutCarrierChargesInputObjectSchema as ShipmentUncheckedCreateWithoutCarrierChargesInputObjectSchema } from './ShipmentUncheckedCreateWithoutCarrierChargesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ShipmentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ShipmentCreateWithoutCarrierChargesInputObjectSchema), z.lazy(() => ShipmentUncheckedCreateWithoutCarrierChargesInputObjectSchema)])
}).strict();
export const ShipmentCreateOrConnectWithoutCarrierChargesInputObjectSchema: z.ZodType<Prisma.ShipmentCreateOrConnectWithoutCarrierChargesInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentCreateOrConnectWithoutCarrierChargesInput>;
export const ShipmentCreateOrConnectWithoutCarrierChargesInputObjectZodSchema = makeSchema();
