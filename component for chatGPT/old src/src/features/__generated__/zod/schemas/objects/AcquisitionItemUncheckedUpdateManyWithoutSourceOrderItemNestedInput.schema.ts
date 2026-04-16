import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemCreateWithoutSourceOrderItemInputObjectSchema as AcquisitionItemCreateWithoutSourceOrderItemInputObjectSchema } from './AcquisitionItemCreateWithoutSourceOrderItemInput.schema';
import { AcquisitionItemUncheckedCreateWithoutSourceOrderItemInputObjectSchema as AcquisitionItemUncheckedCreateWithoutSourceOrderItemInputObjectSchema } from './AcquisitionItemUncheckedCreateWithoutSourceOrderItemInput.schema';
import { AcquisitionItemCreateOrConnectWithoutSourceOrderItemInputObjectSchema as AcquisitionItemCreateOrConnectWithoutSourceOrderItemInputObjectSchema } from './AcquisitionItemCreateOrConnectWithoutSourceOrderItemInput.schema';
import { AcquisitionItemUpsertWithWhereUniqueWithoutSourceOrderItemInputObjectSchema as AcquisitionItemUpsertWithWhereUniqueWithoutSourceOrderItemInputObjectSchema } from './AcquisitionItemUpsertWithWhereUniqueWithoutSourceOrderItemInput.schema';
import { AcquisitionItemCreateManySourceOrderItemInputEnvelopeObjectSchema as AcquisitionItemCreateManySourceOrderItemInputEnvelopeObjectSchema } from './AcquisitionItemCreateManySourceOrderItemInputEnvelope.schema';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './AcquisitionItemWhereUniqueInput.schema';
import { AcquisitionItemUpdateWithWhereUniqueWithoutSourceOrderItemInputObjectSchema as AcquisitionItemUpdateWithWhereUniqueWithoutSourceOrderItemInputObjectSchema } from './AcquisitionItemUpdateWithWhereUniqueWithoutSourceOrderItemInput.schema';
import { AcquisitionItemUpdateManyWithWhereWithoutSourceOrderItemInputObjectSchema as AcquisitionItemUpdateManyWithWhereWithoutSourceOrderItemInputObjectSchema } from './AcquisitionItemUpdateManyWithWhereWithoutSourceOrderItemInput.schema';
import { AcquisitionItemScalarWhereInputObjectSchema as AcquisitionItemScalarWhereInputObjectSchema } from './AcquisitionItemScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AcquisitionItemCreateWithoutSourceOrderItemInputObjectSchema), z.lazy(() => AcquisitionItemCreateWithoutSourceOrderItemInputObjectSchema).array(), z.lazy(() => AcquisitionItemUncheckedCreateWithoutSourceOrderItemInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedCreateWithoutSourceOrderItemInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AcquisitionItemCreateOrConnectWithoutSourceOrderItemInputObjectSchema), z.lazy(() => AcquisitionItemCreateOrConnectWithoutSourceOrderItemInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => AcquisitionItemUpsertWithWhereUniqueWithoutSourceOrderItemInputObjectSchema), z.lazy(() => AcquisitionItemUpsertWithWhereUniqueWithoutSourceOrderItemInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AcquisitionItemCreateManySourceOrderItemInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => AcquisitionItemUpdateWithWhereUniqueWithoutSourceOrderItemInputObjectSchema), z.lazy(() => AcquisitionItemUpdateWithWhereUniqueWithoutSourceOrderItemInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => AcquisitionItemUpdateManyWithWhereWithoutSourceOrderItemInputObjectSchema), z.lazy(() => AcquisitionItemUpdateManyWithWhereWithoutSourceOrderItemInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => AcquisitionItemScalarWhereInputObjectSchema), z.lazy(() => AcquisitionItemScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const AcquisitionItemUncheckedUpdateManyWithoutSourceOrderItemNestedInputObjectSchema: z.ZodType<Prisma.AcquisitionItemUncheckedUpdateManyWithoutSourceOrderItemNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemUncheckedUpdateManyWithoutSourceOrderItemNestedInput>;
export const AcquisitionItemUncheckedUpdateManyWithoutSourceOrderItemNestedInputObjectZodSchema = makeSchema();
