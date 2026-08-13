import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentWhereUniqueInputObjectSchema as ShipmentWhereUniqueInputObjectSchema } from './ShipmentWhereUniqueInput.schema';
import { ShipmentCreateWithoutCarrierRequestsInputObjectSchema as ShipmentCreateWithoutCarrierRequestsInputObjectSchema } from './ShipmentCreateWithoutCarrierRequestsInput.schema';
import { ShipmentUncheckedCreateWithoutCarrierRequestsInputObjectSchema as ShipmentUncheckedCreateWithoutCarrierRequestsInputObjectSchema } from './ShipmentUncheckedCreateWithoutCarrierRequestsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ShipmentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ShipmentCreateWithoutCarrierRequestsInputObjectSchema), z.lazy(() => ShipmentUncheckedCreateWithoutCarrierRequestsInputObjectSchema)])
}).strict();
export const ShipmentCreateOrConnectWithoutCarrierRequestsInputObjectSchema: z.ZodType<Prisma.ShipmentCreateOrConnectWithoutCarrierRequestsInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentCreateOrConnectWithoutCarrierRequestsInput>;
export const ShipmentCreateOrConnectWithoutCarrierRequestsInputObjectZodSchema = makeSchema();
