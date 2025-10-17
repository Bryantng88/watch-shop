import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemCreateWithoutProductInputObjectSchema as AcquisitionItemCreateWithoutProductInputObjectSchema } from './AcquisitionItemCreateWithoutProductInput.schema';
import { AcquisitionItemUncheckedCreateWithoutProductInputObjectSchema as AcquisitionItemUncheckedCreateWithoutProductInputObjectSchema } from './AcquisitionItemUncheckedCreateWithoutProductInput.schema';
import { AcquisitionItemCreateOrConnectWithoutProductInputObjectSchema as AcquisitionItemCreateOrConnectWithoutProductInputObjectSchema } from './AcquisitionItemCreateOrConnectWithoutProductInput.schema';
import { AcquisitionItemUpsertWithWhereUniqueWithoutProductInputObjectSchema as AcquisitionItemUpsertWithWhereUniqueWithoutProductInputObjectSchema } from './AcquisitionItemUpsertWithWhereUniqueWithoutProductInput.schema';
import { AcquisitionItemCreateManyProductInputEnvelopeObjectSchema as AcquisitionItemCreateManyProductInputEnvelopeObjectSchema } from './AcquisitionItemCreateManyProductInputEnvelope.schema';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './AcquisitionItemWhereUniqueInput.schema';
import { AcquisitionItemUpdateWithWhereUniqueWithoutProductInputObjectSchema as AcquisitionItemUpdateWithWhereUniqueWithoutProductInputObjectSchema } from './AcquisitionItemUpdateWithWhereUniqueWithoutProductInput.schema';
import { AcquisitionItemUpdateManyWithWhereWithoutProductInputObjectSchema as AcquisitionItemUpdateManyWithWhereWithoutProductInputObjectSchema } from './AcquisitionItemUpdateManyWithWhereWithoutProductInput.schema';
import { AcquisitionItemScalarWhereInputObjectSchema as AcquisitionItemScalarWhereInputObjectSchema } from './AcquisitionItemScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AcquisitionItemCreateWithoutProductInputObjectSchema), z.lazy(() => AcquisitionItemCreateWithoutProductInputObjectSchema).array(), z.lazy(() => AcquisitionItemUncheckedCreateWithoutProductInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedCreateWithoutProductInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AcquisitionItemCreateOrConnectWithoutProductInputObjectSchema), z.lazy(() => AcquisitionItemCreateOrConnectWithoutProductInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => AcquisitionItemUpsertWithWhereUniqueWithoutProductInputObjectSchema), z.lazy(() => AcquisitionItemUpsertWithWhereUniqueWithoutProductInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AcquisitionItemCreateManyProductInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => AcquisitionItemUpdateWithWhereUniqueWithoutProductInputObjectSchema), z.lazy(() => AcquisitionItemUpdateWithWhereUniqueWithoutProductInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => AcquisitionItemUpdateManyWithWhereWithoutProductInputObjectSchema), z.lazy(() => AcquisitionItemUpdateManyWithWhereWithoutProductInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => AcquisitionItemScalarWhereInputObjectSchema), z.lazy(() => AcquisitionItemScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const AcquisitionItemUncheckedUpdateManyWithoutProductNestedInputObjectSchema: z.ZodType<Prisma.AcquisitionItemUncheckedUpdateManyWithoutProductNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemUncheckedUpdateManyWithoutProductNestedInput>;
export const AcquisitionItemUncheckedUpdateManyWithoutProductNestedInputObjectZodSchema = makeSchema();
