import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentUpdateWithoutCarrierRequestsInputObjectSchema as ShipmentUpdateWithoutCarrierRequestsInputObjectSchema } from './ShipmentUpdateWithoutCarrierRequestsInput.schema';
import { ShipmentUncheckedUpdateWithoutCarrierRequestsInputObjectSchema as ShipmentUncheckedUpdateWithoutCarrierRequestsInputObjectSchema } from './ShipmentUncheckedUpdateWithoutCarrierRequestsInput.schema';
import { ShipmentCreateWithoutCarrierRequestsInputObjectSchema as ShipmentCreateWithoutCarrierRequestsInputObjectSchema } from './ShipmentCreateWithoutCarrierRequestsInput.schema';
import { ShipmentUncheckedCreateWithoutCarrierRequestsInputObjectSchema as ShipmentUncheckedCreateWithoutCarrierRequestsInputObjectSchema } from './ShipmentUncheckedCreateWithoutCarrierRequestsInput.schema';
import { ShipmentWhereInputObjectSchema as ShipmentWhereInputObjectSchema } from './ShipmentWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ShipmentUpdateWithoutCarrierRequestsInputObjectSchema), z.lazy(() => ShipmentUncheckedUpdateWithoutCarrierRequestsInputObjectSchema)]),
  create: z.union([z.lazy(() => ShipmentCreateWithoutCarrierRequestsInputObjectSchema), z.lazy(() => ShipmentUncheckedCreateWithoutCarrierRequestsInputObjectSchema)]),
  where: z.lazy(() => ShipmentWhereInputObjectSchema).optional()
}).strict();
export const ShipmentUpsertWithoutCarrierRequestsInputObjectSchema: z.ZodType<Prisma.ShipmentUpsertWithoutCarrierRequestsInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentUpsertWithoutCarrierRequestsInput>;
export const ShipmentUpsertWithoutCarrierRequestsInputObjectZodSchema = makeSchema();
