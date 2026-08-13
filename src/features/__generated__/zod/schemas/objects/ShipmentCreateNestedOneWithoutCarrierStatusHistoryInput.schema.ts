import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentCreateWithoutCarrierStatusHistoryInputObjectSchema as ShipmentCreateWithoutCarrierStatusHistoryInputObjectSchema } from './ShipmentCreateWithoutCarrierStatusHistoryInput.schema';
import { ShipmentUncheckedCreateWithoutCarrierStatusHistoryInputObjectSchema as ShipmentUncheckedCreateWithoutCarrierStatusHistoryInputObjectSchema } from './ShipmentUncheckedCreateWithoutCarrierStatusHistoryInput.schema';
import { ShipmentCreateOrConnectWithoutCarrierStatusHistoryInputObjectSchema as ShipmentCreateOrConnectWithoutCarrierStatusHistoryInputObjectSchema } from './ShipmentCreateOrConnectWithoutCarrierStatusHistoryInput.schema';
import { ShipmentWhereUniqueInputObjectSchema as ShipmentWhereUniqueInputObjectSchema } from './ShipmentWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ShipmentCreateWithoutCarrierStatusHistoryInputObjectSchema), z.lazy(() => ShipmentUncheckedCreateWithoutCarrierStatusHistoryInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ShipmentCreateOrConnectWithoutCarrierStatusHistoryInputObjectSchema).optional(),
  connect: z.lazy(() => ShipmentWhereUniqueInputObjectSchema).optional()
}).strict();
export const ShipmentCreateNestedOneWithoutCarrierStatusHistoryInputObjectSchema: z.ZodType<Prisma.ShipmentCreateNestedOneWithoutCarrierStatusHistoryInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentCreateNestedOneWithoutCarrierStatusHistoryInput>;
export const ShipmentCreateNestedOneWithoutCarrierStatusHistoryInputObjectZodSchema = makeSchema();
