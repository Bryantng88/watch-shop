import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentCreateWithoutOrderInputObjectSchema as ShipmentCreateWithoutOrderInputObjectSchema } from './ShipmentCreateWithoutOrderInput.schema';
import { ShipmentUncheckedCreateWithoutOrderInputObjectSchema as ShipmentUncheckedCreateWithoutOrderInputObjectSchema } from './ShipmentUncheckedCreateWithoutOrderInput.schema';
import { ShipmentCreateOrConnectWithoutOrderInputObjectSchema as ShipmentCreateOrConnectWithoutOrderInputObjectSchema } from './ShipmentCreateOrConnectWithoutOrderInput.schema';
import { ShipmentUpsertWithWhereUniqueWithoutOrderInputObjectSchema as ShipmentUpsertWithWhereUniqueWithoutOrderInputObjectSchema } from './ShipmentUpsertWithWhereUniqueWithoutOrderInput.schema';
import { ShipmentCreateManyOrderInputEnvelopeObjectSchema as ShipmentCreateManyOrderInputEnvelopeObjectSchema } from './ShipmentCreateManyOrderInputEnvelope.schema';
import { ShipmentWhereUniqueInputObjectSchema as ShipmentWhereUniqueInputObjectSchema } from './ShipmentWhereUniqueInput.schema';
import { ShipmentUpdateWithWhereUniqueWithoutOrderInputObjectSchema as ShipmentUpdateWithWhereUniqueWithoutOrderInputObjectSchema } from './ShipmentUpdateWithWhereUniqueWithoutOrderInput.schema';
import { ShipmentUpdateManyWithWhereWithoutOrderInputObjectSchema as ShipmentUpdateManyWithWhereWithoutOrderInputObjectSchema } from './ShipmentUpdateManyWithWhereWithoutOrderInput.schema';
import { ShipmentScalarWhereInputObjectSchema as ShipmentScalarWhereInputObjectSchema } from './ShipmentScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ShipmentCreateWithoutOrderInputObjectSchema), z.lazy(() => ShipmentCreateWithoutOrderInputObjectSchema).array(), z.lazy(() => ShipmentUncheckedCreateWithoutOrderInputObjectSchema), z.lazy(() => ShipmentUncheckedCreateWithoutOrderInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ShipmentCreateOrConnectWithoutOrderInputObjectSchema), z.lazy(() => ShipmentCreateOrConnectWithoutOrderInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ShipmentUpsertWithWhereUniqueWithoutOrderInputObjectSchema), z.lazy(() => ShipmentUpsertWithWhereUniqueWithoutOrderInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ShipmentCreateManyOrderInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ShipmentWhereUniqueInputObjectSchema), z.lazy(() => ShipmentWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ShipmentWhereUniqueInputObjectSchema), z.lazy(() => ShipmentWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ShipmentWhereUniqueInputObjectSchema), z.lazy(() => ShipmentWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ShipmentWhereUniqueInputObjectSchema), z.lazy(() => ShipmentWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ShipmentUpdateWithWhereUniqueWithoutOrderInputObjectSchema), z.lazy(() => ShipmentUpdateWithWhereUniqueWithoutOrderInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ShipmentUpdateManyWithWhereWithoutOrderInputObjectSchema), z.lazy(() => ShipmentUpdateManyWithWhereWithoutOrderInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ShipmentScalarWhereInputObjectSchema), z.lazy(() => ShipmentScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ShipmentUncheckedUpdateManyWithoutOrderNestedInputObjectSchema: z.ZodType<Prisma.ShipmentUncheckedUpdateManyWithoutOrderNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentUncheckedUpdateManyWithoutOrderNestedInput>;
export const ShipmentUncheckedUpdateManyWithoutOrderNestedInputObjectZodSchema = makeSchema();
