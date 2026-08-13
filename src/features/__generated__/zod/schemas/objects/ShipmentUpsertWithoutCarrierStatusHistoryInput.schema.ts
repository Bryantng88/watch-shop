import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentUpdateWithoutCarrierStatusHistoryInputObjectSchema as ShipmentUpdateWithoutCarrierStatusHistoryInputObjectSchema } from './ShipmentUpdateWithoutCarrierStatusHistoryInput.schema';
import { ShipmentUncheckedUpdateWithoutCarrierStatusHistoryInputObjectSchema as ShipmentUncheckedUpdateWithoutCarrierStatusHistoryInputObjectSchema } from './ShipmentUncheckedUpdateWithoutCarrierStatusHistoryInput.schema';
import { ShipmentCreateWithoutCarrierStatusHistoryInputObjectSchema as ShipmentCreateWithoutCarrierStatusHistoryInputObjectSchema } from './ShipmentCreateWithoutCarrierStatusHistoryInput.schema';
import { ShipmentUncheckedCreateWithoutCarrierStatusHistoryInputObjectSchema as ShipmentUncheckedCreateWithoutCarrierStatusHistoryInputObjectSchema } from './ShipmentUncheckedCreateWithoutCarrierStatusHistoryInput.schema';
import { ShipmentWhereInputObjectSchema as ShipmentWhereInputObjectSchema } from './ShipmentWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ShipmentUpdateWithoutCarrierStatusHistoryInputObjectSchema), z.lazy(() => ShipmentUncheckedUpdateWithoutCarrierStatusHistoryInputObjectSchema)]),
  create: z.union([z.lazy(() => ShipmentCreateWithoutCarrierStatusHistoryInputObjectSchema), z.lazy(() => ShipmentUncheckedCreateWithoutCarrierStatusHistoryInputObjectSchema)]),
  where: z.lazy(() => ShipmentWhereInputObjectSchema).optional()
}).strict();
export const ShipmentUpsertWithoutCarrierStatusHistoryInputObjectSchema: z.ZodType<Prisma.ShipmentUpsertWithoutCarrierStatusHistoryInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentUpsertWithoutCarrierStatusHistoryInput>;
export const ShipmentUpsertWithoutCarrierStatusHistoryInputObjectZodSchema = makeSchema();
