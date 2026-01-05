import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentCreateWithoutOrderInputObjectSchema as ShipmentCreateWithoutOrderInputObjectSchema } from './ShipmentCreateWithoutOrderInput.schema';
import { ShipmentUncheckedCreateWithoutOrderInputObjectSchema as ShipmentUncheckedCreateWithoutOrderInputObjectSchema } from './ShipmentUncheckedCreateWithoutOrderInput.schema';
import { ShipmentCreateOrConnectWithoutOrderInputObjectSchema as ShipmentCreateOrConnectWithoutOrderInputObjectSchema } from './ShipmentCreateOrConnectWithoutOrderInput.schema';
import { ShipmentWhereUniqueInputObjectSchema as ShipmentWhereUniqueInputObjectSchema } from './ShipmentWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ShipmentCreateWithoutOrderInputObjectSchema), z.lazy(() => ShipmentUncheckedCreateWithoutOrderInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ShipmentCreateOrConnectWithoutOrderInputObjectSchema).optional(),
  connect: z.lazy(() => ShipmentWhereUniqueInputObjectSchema).optional()
}).strict();
export const ShipmentCreateNestedOneWithoutOrderInputObjectSchema: z.ZodType<Prisma.ShipmentCreateNestedOneWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentCreateNestedOneWithoutOrderInput>;
export const ShipmentCreateNestedOneWithoutOrderInputObjectZodSchema = makeSchema();
