import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentCreateWithoutCarrierRequestsInputObjectSchema as ShipmentCreateWithoutCarrierRequestsInputObjectSchema } from './ShipmentCreateWithoutCarrierRequestsInput.schema';
import { ShipmentUncheckedCreateWithoutCarrierRequestsInputObjectSchema as ShipmentUncheckedCreateWithoutCarrierRequestsInputObjectSchema } from './ShipmentUncheckedCreateWithoutCarrierRequestsInput.schema';
import { ShipmentCreateOrConnectWithoutCarrierRequestsInputObjectSchema as ShipmentCreateOrConnectWithoutCarrierRequestsInputObjectSchema } from './ShipmentCreateOrConnectWithoutCarrierRequestsInput.schema';
import { ShipmentUpsertWithoutCarrierRequestsInputObjectSchema as ShipmentUpsertWithoutCarrierRequestsInputObjectSchema } from './ShipmentUpsertWithoutCarrierRequestsInput.schema';
import { ShipmentWhereUniqueInputObjectSchema as ShipmentWhereUniqueInputObjectSchema } from './ShipmentWhereUniqueInput.schema';
import { ShipmentUpdateToOneWithWhereWithoutCarrierRequestsInputObjectSchema as ShipmentUpdateToOneWithWhereWithoutCarrierRequestsInputObjectSchema } from './ShipmentUpdateToOneWithWhereWithoutCarrierRequestsInput.schema';
import { ShipmentUpdateWithoutCarrierRequestsInputObjectSchema as ShipmentUpdateWithoutCarrierRequestsInputObjectSchema } from './ShipmentUpdateWithoutCarrierRequestsInput.schema';
import { ShipmentUncheckedUpdateWithoutCarrierRequestsInputObjectSchema as ShipmentUncheckedUpdateWithoutCarrierRequestsInputObjectSchema } from './ShipmentUncheckedUpdateWithoutCarrierRequestsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ShipmentCreateWithoutCarrierRequestsInputObjectSchema), z.lazy(() => ShipmentUncheckedCreateWithoutCarrierRequestsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ShipmentCreateOrConnectWithoutCarrierRequestsInputObjectSchema).optional(),
  upsert: z.lazy(() => ShipmentUpsertWithoutCarrierRequestsInputObjectSchema).optional(),
  connect: z.lazy(() => ShipmentWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ShipmentUpdateToOneWithWhereWithoutCarrierRequestsInputObjectSchema), z.lazy(() => ShipmentUpdateWithoutCarrierRequestsInputObjectSchema), z.lazy(() => ShipmentUncheckedUpdateWithoutCarrierRequestsInputObjectSchema)]).optional()
}).strict();
export const ShipmentUpdateOneRequiredWithoutCarrierRequestsNestedInputObjectSchema: z.ZodType<Prisma.ShipmentUpdateOneRequiredWithoutCarrierRequestsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentUpdateOneRequiredWithoutCarrierRequestsNestedInput>;
export const ShipmentUpdateOneRequiredWithoutCarrierRequestsNestedInputObjectZodSchema = makeSchema();
