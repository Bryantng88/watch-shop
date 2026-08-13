import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentWhereInputObjectSchema as ShipmentWhereInputObjectSchema } from './ShipmentWhereInput.schema';
import { ShipmentUpdateWithoutCarrierRequestsInputObjectSchema as ShipmentUpdateWithoutCarrierRequestsInputObjectSchema } from './ShipmentUpdateWithoutCarrierRequestsInput.schema';
import { ShipmentUncheckedUpdateWithoutCarrierRequestsInputObjectSchema as ShipmentUncheckedUpdateWithoutCarrierRequestsInputObjectSchema } from './ShipmentUncheckedUpdateWithoutCarrierRequestsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ShipmentWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ShipmentUpdateWithoutCarrierRequestsInputObjectSchema), z.lazy(() => ShipmentUncheckedUpdateWithoutCarrierRequestsInputObjectSchema)])
}).strict();
export const ShipmentUpdateToOneWithWhereWithoutCarrierRequestsInputObjectSchema: z.ZodType<Prisma.ShipmentUpdateToOneWithWhereWithoutCarrierRequestsInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentUpdateToOneWithWhereWithoutCarrierRequestsInput>;
export const ShipmentUpdateToOneWithWhereWithoutCarrierRequestsInputObjectZodSchema = makeSchema();
