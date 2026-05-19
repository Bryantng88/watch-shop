import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentCreateWithoutOrderInputObjectSchema as ShipmentCreateWithoutOrderInputObjectSchema } from './ShipmentCreateWithoutOrderInput.schema';
import { ShipmentUncheckedCreateWithoutOrderInputObjectSchema as ShipmentUncheckedCreateWithoutOrderInputObjectSchema } from './ShipmentUncheckedCreateWithoutOrderInput.schema';
import { ShipmentCreateOrConnectWithoutOrderInputObjectSchema as ShipmentCreateOrConnectWithoutOrderInputObjectSchema } from './ShipmentCreateOrConnectWithoutOrderInput.schema';
import { ShipmentCreateManyOrderInputEnvelopeObjectSchema as ShipmentCreateManyOrderInputEnvelopeObjectSchema } from './ShipmentCreateManyOrderInputEnvelope.schema';
import { ShipmentWhereUniqueInputObjectSchema as ShipmentWhereUniqueInputObjectSchema } from './ShipmentWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ShipmentCreateWithoutOrderInputObjectSchema), z.lazy(() => ShipmentCreateWithoutOrderInputObjectSchema).array(), z.lazy(() => ShipmentUncheckedCreateWithoutOrderInputObjectSchema), z.lazy(() => ShipmentUncheckedCreateWithoutOrderInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ShipmentCreateOrConnectWithoutOrderInputObjectSchema), z.lazy(() => ShipmentCreateOrConnectWithoutOrderInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ShipmentCreateManyOrderInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ShipmentWhereUniqueInputObjectSchema), z.lazy(() => ShipmentWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ShipmentUncheckedCreateNestedManyWithoutOrderInputObjectSchema: z.ZodType<Prisma.ShipmentUncheckedCreateNestedManyWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentUncheckedCreateNestedManyWithoutOrderInput>;
export const ShipmentUncheckedCreateNestedManyWithoutOrderInputObjectZodSchema = makeSchema();
