import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentCreateWithoutCarrierChargesInputObjectSchema as ShipmentCreateWithoutCarrierChargesInputObjectSchema } from './ShipmentCreateWithoutCarrierChargesInput.schema';
import { ShipmentUncheckedCreateWithoutCarrierChargesInputObjectSchema as ShipmentUncheckedCreateWithoutCarrierChargesInputObjectSchema } from './ShipmentUncheckedCreateWithoutCarrierChargesInput.schema';
import { ShipmentCreateOrConnectWithoutCarrierChargesInputObjectSchema as ShipmentCreateOrConnectWithoutCarrierChargesInputObjectSchema } from './ShipmentCreateOrConnectWithoutCarrierChargesInput.schema';
import { ShipmentUpsertWithoutCarrierChargesInputObjectSchema as ShipmentUpsertWithoutCarrierChargesInputObjectSchema } from './ShipmentUpsertWithoutCarrierChargesInput.schema';
import { ShipmentWhereUniqueInputObjectSchema as ShipmentWhereUniqueInputObjectSchema } from './ShipmentWhereUniqueInput.schema';
import { ShipmentUpdateToOneWithWhereWithoutCarrierChargesInputObjectSchema as ShipmentUpdateToOneWithWhereWithoutCarrierChargesInputObjectSchema } from './ShipmentUpdateToOneWithWhereWithoutCarrierChargesInput.schema';
import { ShipmentUpdateWithoutCarrierChargesInputObjectSchema as ShipmentUpdateWithoutCarrierChargesInputObjectSchema } from './ShipmentUpdateWithoutCarrierChargesInput.schema';
import { ShipmentUncheckedUpdateWithoutCarrierChargesInputObjectSchema as ShipmentUncheckedUpdateWithoutCarrierChargesInputObjectSchema } from './ShipmentUncheckedUpdateWithoutCarrierChargesInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ShipmentCreateWithoutCarrierChargesInputObjectSchema), z.lazy(() => ShipmentUncheckedCreateWithoutCarrierChargesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ShipmentCreateOrConnectWithoutCarrierChargesInputObjectSchema).optional(),
  upsert: z.lazy(() => ShipmentUpsertWithoutCarrierChargesInputObjectSchema).optional(),
  connect: z.lazy(() => ShipmentWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ShipmentUpdateToOneWithWhereWithoutCarrierChargesInputObjectSchema), z.lazy(() => ShipmentUpdateWithoutCarrierChargesInputObjectSchema), z.lazy(() => ShipmentUncheckedUpdateWithoutCarrierChargesInputObjectSchema)]).optional()
}).strict();
export const ShipmentUpdateOneRequiredWithoutCarrierChargesNestedInputObjectSchema: z.ZodType<Prisma.ShipmentUpdateOneRequiredWithoutCarrierChargesNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentUpdateOneRequiredWithoutCarrierChargesNestedInput>;
export const ShipmentUpdateOneRequiredWithoutCarrierChargesNestedInputObjectZodSchema = makeSchema();
