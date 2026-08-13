import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentCreateWithoutCarrierRequestsInputObjectSchema as ShipmentCreateWithoutCarrierRequestsInputObjectSchema } from './ShipmentCreateWithoutCarrierRequestsInput.schema';
import { ShipmentUncheckedCreateWithoutCarrierRequestsInputObjectSchema as ShipmentUncheckedCreateWithoutCarrierRequestsInputObjectSchema } from './ShipmentUncheckedCreateWithoutCarrierRequestsInput.schema';
import { ShipmentCreateOrConnectWithoutCarrierRequestsInputObjectSchema as ShipmentCreateOrConnectWithoutCarrierRequestsInputObjectSchema } from './ShipmentCreateOrConnectWithoutCarrierRequestsInput.schema';
import { ShipmentWhereUniqueInputObjectSchema as ShipmentWhereUniqueInputObjectSchema } from './ShipmentWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ShipmentCreateWithoutCarrierRequestsInputObjectSchema), z.lazy(() => ShipmentUncheckedCreateWithoutCarrierRequestsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ShipmentCreateOrConnectWithoutCarrierRequestsInputObjectSchema).optional(),
  connect: z.lazy(() => ShipmentWhereUniqueInputObjectSchema).optional()
}).strict();
export const ShipmentCreateNestedOneWithoutCarrierRequestsInputObjectSchema: z.ZodType<Prisma.ShipmentCreateNestedOneWithoutCarrierRequestsInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentCreateNestedOneWithoutCarrierRequestsInput>;
export const ShipmentCreateNestedOneWithoutCarrierRequestsInputObjectZodSchema = makeSchema();
