import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentWhereUniqueInputObjectSchema as ShipmentWhereUniqueInputObjectSchema } from './ShipmentWhereUniqueInput.schema';
import { ShipmentCreateWithoutOrderInputObjectSchema as ShipmentCreateWithoutOrderInputObjectSchema } from './ShipmentCreateWithoutOrderInput.schema';
import { ShipmentUncheckedCreateWithoutOrderInputObjectSchema as ShipmentUncheckedCreateWithoutOrderInputObjectSchema } from './ShipmentUncheckedCreateWithoutOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ShipmentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ShipmentCreateWithoutOrderInputObjectSchema), z.lazy(() => ShipmentUncheckedCreateWithoutOrderInputObjectSchema)])
}).strict();
export const ShipmentCreateOrConnectWithoutOrderInputObjectSchema: z.ZodType<Prisma.ShipmentCreateOrConnectWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentCreateOrConnectWithoutOrderInput>;
export const ShipmentCreateOrConnectWithoutOrderInputObjectZodSchema = makeSchema();
