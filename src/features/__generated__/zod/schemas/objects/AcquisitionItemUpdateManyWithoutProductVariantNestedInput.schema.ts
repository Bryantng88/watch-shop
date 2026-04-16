import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemCreateWithoutProductVariantInputObjectSchema as AcquisitionItemCreateWithoutProductVariantInputObjectSchema } from './AcquisitionItemCreateWithoutProductVariantInput.schema';
import { AcquisitionItemUncheckedCreateWithoutProductVariantInputObjectSchema as AcquisitionItemUncheckedCreateWithoutProductVariantInputObjectSchema } from './AcquisitionItemUncheckedCreateWithoutProductVariantInput.schema';
import { AcquisitionItemCreateOrConnectWithoutProductVariantInputObjectSchema as AcquisitionItemCreateOrConnectWithoutProductVariantInputObjectSchema } from './AcquisitionItemCreateOrConnectWithoutProductVariantInput.schema';
import { AcquisitionItemUpsertWithWhereUniqueWithoutProductVariantInputObjectSchema as AcquisitionItemUpsertWithWhereUniqueWithoutProductVariantInputObjectSchema } from './AcquisitionItemUpsertWithWhereUniqueWithoutProductVariantInput.schema';
import { AcquisitionItemCreateManyProductVariantInputEnvelopeObjectSchema as AcquisitionItemCreateManyProductVariantInputEnvelopeObjectSchema } from './AcquisitionItemCreateManyProductVariantInputEnvelope.schema';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './AcquisitionItemWhereUniqueInput.schema';
import { AcquisitionItemUpdateWithWhereUniqueWithoutProductVariantInputObjectSchema as AcquisitionItemUpdateWithWhereUniqueWithoutProductVariantInputObjectSchema } from './AcquisitionItemUpdateWithWhereUniqueWithoutProductVariantInput.schema';
import { AcquisitionItemUpdateManyWithWhereWithoutProductVariantInputObjectSchema as AcquisitionItemUpdateManyWithWhereWithoutProductVariantInputObjectSchema } from './AcquisitionItemUpdateManyWithWhereWithoutProductVariantInput.schema';
import { AcquisitionItemScalarWhereInputObjectSchema as AcquisitionItemScalarWhereInputObjectSchema } from './AcquisitionItemScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AcquisitionItemCreateWithoutProductVariantInputObjectSchema), z.lazy(() => AcquisitionItemCreateWithoutProductVariantInputObjectSchema).array(), z.lazy(() => AcquisitionItemUncheckedCreateWithoutProductVariantInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedCreateWithoutProductVariantInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AcquisitionItemCreateOrConnectWithoutProductVariantInputObjectSchema), z.lazy(() => AcquisitionItemCreateOrConnectWithoutProductVariantInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => AcquisitionItemUpsertWithWhereUniqueWithoutProductVariantInputObjectSchema), z.lazy(() => AcquisitionItemUpsertWithWhereUniqueWithoutProductVariantInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AcquisitionItemCreateManyProductVariantInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => AcquisitionItemUpdateWithWhereUniqueWithoutProductVariantInputObjectSchema), z.lazy(() => AcquisitionItemUpdateWithWhereUniqueWithoutProductVariantInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => AcquisitionItemUpdateManyWithWhereWithoutProductVariantInputObjectSchema), z.lazy(() => AcquisitionItemUpdateManyWithWhereWithoutProductVariantInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => AcquisitionItemScalarWhereInputObjectSchema), z.lazy(() => AcquisitionItemScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const AcquisitionItemUpdateManyWithoutProductVariantNestedInputObjectSchema: z.ZodType<Prisma.AcquisitionItemUpdateManyWithoutProductVariantNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemUpdateManyWithoutProductVariantNestedInput>;
export const AcquisitionItemUpdateManyWithoutProductVariantNestedInputObjectZodSchema = makeSchema();
