import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentCreateWithoutCarrierChargesInputObjectSchema as ShipmentCreateWithoutCarrierChargesInputObjectSchema } from './ShipmentCreateWithoutCarrierChargesInput.schema';
import { ShipmentUncheckedCreateWithoutCarrierChargesInputObjectSchema as ShipmentUncheckedCreateWithoutCarrierChargesInputObjectSchema } from './ShipmentUncheckedCreateWithoutCarrierChargesInput.schema';
import { ShipmentCreateOrConnectWithoutCarrierChargesInputObjectSchema as ShipmentCreateOrConnectWithoutCarrierChargesInputObjectSchema } from './ShipmentCreateOrConnectWithoutCarrierChargesInput.schema';
import { ShipmentWhereUniqueInputObjectSchema as ShipmentWhereUniqueInputObjectSchema } from './ShipmentWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ShipmentCreateWithoutCarrierChargesInputObjectSchema), z.lazy(() => ShipmentUncheckedCreateWithoutCarrierChargesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ShipmentCreateOrConnectWithoutCarrierChargesInputObjectSchema).optional(),
  connect: z.lazy(() => ShipmentWhereUniqueInputObjectSchema).optional()
}).strict();
export const ShipmentCreateNestedOneWithoutCarrierChargesInputObjectSchema: z.ZodType<Prisma.ShipmentCreateNestedOneWithoutCarrierChargesInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentCreateNestedOneWithoutCarrierChargesInput>;
export const ShipmentCreateNestedOneWithoutCarrierChargesInputObjectZodSchema = makeSchema();
