import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentWhereUniqueInputObjectSchema as ShipmentWhereUniqueInputObjectSchema } from './ShipmentWhereUniqueInput.schema';
import { ShipmentCreateWithoutCarrierStatusHistoryInputObjectSchema as ShipmentCreateWithoutCarrierStatusHistoryInputObjectSchema } from './ShipmentCreateWithoutCarrierStatusHistoryInput.schema';
import { ShipmentUncheckedCreateWithoutCarrierStatusHistoryInputObjectSchema as ShipmentUncheckedCreateWithoutCarrierStatusHistoryInputObjectSchema } from './ShipmentUncheckedCreateWithoutCarrierStatusHistoryInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ShipmentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ShipmentCreateWithoutCarrierStatusHistoryInputObjectSchema), z.lazy(() => ShipmentUncheckedCreateWithoutCarrierStatusHistoryInputObjectSchema)])
}).strict();
export const ShipmentCreateOrConnectWithoutCarrierStatusHistoryInputObjectSchema: z.ZodType<Prisma.ShipmentCreateOrConnectWithoutCarrierStatusHistoryInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentCreateOrConnectWithoutCarrierStatusHistoryInput>;
export const ShipmentCreateOrConnectWithoutCarrierStatusHistoryInputObjectZodSchema = makeSchema();
