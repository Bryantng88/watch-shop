import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemCreateWithoutOrderItemInputObjectSchema as AcquisitionItemCreateWithoutOrderItemInputObjectSchema } from './AcquisitionItemCreateWithoutOrderItemInput.schema';
import { AcquisitionItemUncheckedCreateWithoutOrderItemInputObjectSchema as AcquisitionItemUncheckedCreateWithoutOrderItemInputObjectSchema } from './AcquisitionItemUncheckedCreateWithoutOrderItemInput.schema';
import { AcquisitionItemCreateOrConnectWithoutOrderItemInputObjectSchema as AcquisitionItemCreateOrConnectWithoutOrderItemInputObjectSchema } from './AcquisitionItemCreateOrConnectWithoutOrderItemInput.schema';
import { AcquisitionItemUpsertWithWhereUniqueWithoutOrderItemInputObjectSchema as AcquisitionItemUpsertWithWhereUniqueWithoutOrderItemInputObjectSchema } from './AcquisitionItemUpsertWithWhereUniqueWithoutOrderItemInput.schema';
import { AcquisitionItemCreateManyOrderItemInputEnvelopeObjectSchema as AcquisitionItemCreateManyOrderItemInputEnvelopeObjectSchema } from './AcquisitionItemCreateManyOrderItemInputEnvelope.schema';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './AcquisitionItemWhereUniqueInput.schema';
import { AcquisitionItemUpdateWithWhereUniqueWithoutOrderItemInputObjectSchema as AcquisitionItemUpdateWithWhereUniqueWithoutOrderItemInputObjectSchema } from './AcquisitionItemUpdateWithWhereUniqueWithoutOrderItemInput.schema';
import { AcquisitionItemUpdateManyWithWhereWithoutOrderItemInputObjectSchema as AcquisitionItemUpdateManyWithWhereWithoutOrderItemInputObjectSchema } from './AcquisitionItemUpdateManyWithWhereWithoutOrderItemInput.schema';
import { AcquisitionItemScalarWhereInputObjectSchema as AcquisitionItemScalarWhereInputObjectSchema } from './AcquisitionItemScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AcquisitionItemCreateWithoutOrderItemInputObjectSchema), z.lazy(() => AcquisitionItemCreateWithoutOrderItemInputObjectSchema).array(), z.lazy(() => AcquisitionItemUncheckedCreateWithoutOrderItemInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedCreateWithoutOrderItemInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AcquisitionItemCreateOrConnectWithoutOrderItemInputObjectSchema), z.lazy(() => AcquisitionItemCreateOrConnectWithoutOrderItemInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => AcquisitionItemUpsertWithWhereUniqueWithoutOrderItemInputObjectSchema), z.lazy(() => AcquisitionItemUpsertWithWhereUniqueWithoutOrderItemInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AcquisitionItemCreateManyOrderItemInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => AcquisitionItemUpdateWithWhereUniqueWithoutOrderItemInputObjectSchema), z.lazy(() => AcquisitionItemUpdateWithWhereUniqueWithoutOrderItemInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => AcquisitionItemUpdateManyWithWhereWithoutOrderItemInputObjectSchema), z.lazy(() => AcquisitionItemUpdateManyWithWhereWithoutOrderItemInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => AcquisitionItemScalarWhereInputObjectSchema), z.lazy(() => AcquisitionItemScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const AcquisitionItemUncheckedUpdateManyWithoutOrderItemNestedInputObjectSchema: z.ZodType<Prisma.AcquisitionItemUncheckedUpdateManyWithoutOrderItemNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemUncheckedUpdateManyWithoutOrderItemNestedInput>;
export const AcquisitionItemUncheckedUpdateManyWithoutOrderItemNestedInputObjectZodSchema = makeSchema();
