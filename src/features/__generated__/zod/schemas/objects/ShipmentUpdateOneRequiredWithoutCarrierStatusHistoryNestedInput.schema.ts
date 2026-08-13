import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentCreateWithoutCarrierStatusHistoryInputObjectSchema as ShipmentCreateWithoutCarrierStatusHistoryInputObjectSchema } from './ShipmentCreateWithoutCarrierStatusHistoryInput.schema';
import { ShipmentUncheckedCreateWithoutCarrierStatusHistoryInputObjectSchema as ShipmentUncheckedCreateWithoutCarrierStatusHistoryInputObjectSchema } from './ShipmentUncheckedCreateWithoutCarrierStatusHistoryInput.schema';
import { ShipmentCreateOrConnectWithoutCarrierStatusHistoryInputObjectSchema as ShipmentCreateOrConnectWithoutCarrierStatusHistoryInputObjectSchema } from './ShipmentCreateOrConnectWithoutCarrierStatusHistoryInput.schema';
import { ShipmentUpsertWithoutCarrierStatusHistoryInputObjectSchema as ShipmentUpsertWithoutCarrierStatusHistoryInputObjectSchema } from './ShipmentUpsertWithoutCarrierStatusHistoryInput.schema';
import { ShipmentWhereUniqueInputObjectSchema as ShipmentWhereUniqueInputObjectSchema } from './ShipmentWhereUniqueInput.schema';
import { ShipmentUpdateToOneWithWhereWithoutCarrierStatusHistoryInputObjectSchema as ShipmentUpdateToOneWithWhereWithoutCarrierStatusHistoryInputObjectSchema } from './ShipmentUpdateToOneWithWhereWithoutCarrierStatusHistoryInput.schema';
import { ShipmentUpdateWithoutCarrierStatusHistoryInputObjectSchema as ShipmentUpdateWithoutCarrierStatusHistoryInputObjectSchema } from './ShipmentUpdateWithoutCarrierStatusHistoryInput.schema';
import { ShipmentUncheckedUpdateWithoutCarrierStatusHistoryInputObjectSchema as ShipmentUncheckedUpdateWithoutCarrierStatusHistoryInputObjectSchema } from './ShipmentUncheckedUpdateWithoutCarrierStatusHistoryInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ShipmentCreateWithoutCarrierStatusHistoryInputObjectSchema), z.lazy(() => ShipmentUncheckedCreateWithoutCarrierStatusHistoryInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ShipmentCreateOrConnectWithoutCarrierStatusHistoryInputObjectSchema).optional(),
  upsert: z.lazy(() => ShipmentUpsertWithoutCarrierStatusHistoryInputObjectSchema).optional(),
  connect: z.lazy(() => ShipmentWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ShipmentUpdateToOneWithWhereWithoutCarrierStatusHistoryInputObjectSchema), z.lazy(() => ShipmentUpdateWithoutCarrierStatusHistoryInputObjectSchema), z.lazy(() => ShipmentUncheckedUpdateWithoutCarrierStatusHistoryInputObjectSchema)]).optional()
}).strict();
export const ShipmentUpdateOneRequiredWithoutCarrierStatusHistoryNestedInputObjectSchema: z.ZodType<Prisma.ShipmentUpdateOneRequiredWithoutCarrierStatusHistoryNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentUpdateOneRequiredWithoutCarrierStatusHistoryNestedInput>;
export const ShipmentUpdateOneRequiredWithoutCarrierStatusHistoryNestedInputObjectZodSchema = makeSchema();
