import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemCreateWithoutVariantInputObjectSchema as AcquisitionItemCreateWithoutVariantInputObjectSchema } from './AcquisitionItemCreateWithoutVariantInput.schema';
import { AcquisitionItemUncheckedCreateWithoutVariantInputObjectSchema as AcquisitionItemUncheckedCreateWithoutVariantInputObjectSchema } from './AcquisitionItemUncheckedCreateWithoutVariantInput.schema';
import { AcquisitionItemCreateOrConnectWithoutVariantInputObjectSchema as AcquisitionItemCreateOrConnectWithoutVariantInputObjectSchema } from './AcquisitionItemCreateOrConnectWithoutVariantInput.schema';
import { AcquisitionItemUpsertWithWhereUniqueWithoutVariantInputObjectSchema as AcquisitionItemUpsertWithWhereUniqueWithoutVariantInputObjectSchema } from './AcquisitionItemUpsertWithWhereUniqueWithoutVariantInput.schema';
import { AcquisitionItemCreateManyVariantInputEnvelopeObjectSchema as AcquisitionItemCreateManyVariantInputEnvelopeObjectSchema } from './AcquisitionItemCreateManyVariantInputEnvelope.schema';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './AcquisitionItemWhereUniqueInput.schema';
import { AcquisitionItemUpdateWithWhereUniqueWithoutVariantInputObjectSchema as AcquisitionItemUpdateWithWhereUniqueWithoutVariantInputObjectSchema } from './AcquisitionItemUpdateWithWhereUniqueWithoutVariantInput.schema';
import { AcquisitionItemUpdateManyWithWhereWithoutVariantInputObjectSchema as AcquisitionItemUpdateManyWithWhereWithoutVariantInputObjectSchema } from './AcquisitionItemUpdateManyWithWhereWithoutVariantInput.schema';
import { AcquisitionItemScalarWhereInputObjectSchema as AcquisitionItemScalarWhereInputObjectSchema } from './AcquisitionItemScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AcquisitionItemCreateWithoutVariantInputObjectSchema), z.lazy(() => AcquisitionItemCreateWithoutVariantInputObjectSchema).array(), z.lazy(() => AcquisitionItemUncheckedCreateWithoutVariantInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedCreateWithoutVariantInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AcquisitionItemCreateOrConnectWithoutVariantInputObjectSchema), z.lazy(() => AcquisitionItemCreateOrConnectWithoutVariantInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => AcquisitionItemUpsertWithWhereUniqueWithoutVariantInputObjectSchema), z.lazy(() => AcquisitionItemUpsertWithWhereUniqueWithoutVariantInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AcquisitionItemCreateManyVariantInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => AcquisitionItemUpdateWithWhereUniqueWithoutVariantInputObjectSchema), z.lazy(() => AcquisitionItemUpdateWithWhereUniqueWithoutVariantInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => AcquisitionItemUpdateManyWithWhereWithoutVariantInputObjectSchema), z.lazy(() => AcquisitionItemUpdateManyWithWhereWithoutVariantInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => AcquisitionItemScalarWhereInputObjectSchema), z.lazy(() => AcquisitionItemScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const AcquisitionItemUpdateManyWithoutVariantNestedInputObjectSchema: z.ZodType<Prisma.AcquisitionItemUpdateManyWithoutVariantNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemUpdateManyWithoutVariantNestedInput>;
export const AcquisitionItemUpdateManyWithoutVariantNestedInputObjectZodSchema = makeSchema();
