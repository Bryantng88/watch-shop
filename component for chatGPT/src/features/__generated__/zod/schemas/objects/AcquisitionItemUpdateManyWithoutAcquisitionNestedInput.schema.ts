import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemCreateWithoutAcquisitionInputObjectSchema as AcquisitionItemCreateWithoutAcquisitionInputObjectSchema } from './AcquisitionItemCreateWithoutAcquisitionInput.schema';
import { AcquisitionItemUncheckedCreateWithoutAcquisitionInputObjectSchema as AcquisitionItemUncheckedCreateWithoutAcquisitionInputObjectSchema } from './AcquisitionItemUncheckedCreateWithoutAcquisitionInput.schema';
import { AcquisitionItemCreateOrConnectWithoutAcquisitionInputObjectSchema as AcquisitionItemCreateOrConnectWithoutAcquisitionInputObjectSchema } from './AcquisitionItemCreateOrConnectWithoutAcquisitionInput.schema';
import { AcquisitionItemUpsertWithWhereUniqueWithoutAcquisitionInputObjectSchema as AcquisitionItemUpsertWithWhereUniqueWithoutAcquisitionInputObjectSchema } from './AcquisitionItemUpsertWithWhereUniqueWithoutAcquisitionInput.schema';
import { AcquisitionItemCreateManyAcquisitionInputEnvelopeObjectSchema as AcquisitionItemCreateManyAcquisitionInputEnvelopeObjectSchema } from './AcquisitionItemCreateManyAcquisitionInputEnvelope.schema';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './AcquisitionItemWhereUniqueInput.schema';
import { AcquisitionItemUpdateWithWhereUniqueWithoutAcquisitionInputObjectSchema as AcquisitionItemUpdateWithWhereUniqueWithoutAcquisitionInputObjectSchema } from './AcquisitionItemUpdateWithWhereUniqueWithoutAcquisitionInput.schema';
import { AcquisitionItemUpdateManyWithWhereWithoutAcquisitionInputObjectSchema as AcquisitionItemUpdateManyWithWhereWithoutAcquisitionInputObjectSchema } from './AcquisitionItemUpdateManyWithWhereWithoutAcquisitionInput.schema';
import { AcquisitionItemScalarWhereInputObjectSchema as AcquisitionItemScalarWhereInputObjectSchema } from './AcquisitionItemScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AcquisitionItemCreateWithoutAcquisitionInputObjectSchema), z.lazy(() => AcquisitionItemCreateWithoutAcquisitionInputObjectSchema).array(), z.lazy(() => AcquisitionItemUncheckedCreateWithoutAcquisitionInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedCreateWithoutAcquisitionInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AcquisitionItemCreateOrConnectWithoutAcquisitionInputObjectSchema), z.lazy(() => AcquisitionItemCreateOrConnectWithoutAcquisitionInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => AcquisitionItemUpsertWithWhereUniqueWithoutAcquisitionInputObjectSchema), z.lazy(() => AcquisitionItemUpsertWithWhereUniqueWithoutAcquisitionInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AcquisitionItemCreateManyAcquisitionInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => AcquisitionItemUpdateWithWhereUniqueWithoutAcquisitionInputObjectSchema), z.lazy(() => AcquisitionItemUpdateWithWhereUniqueWithoutAcquisitionInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => AcquisitionItemUpdateManyWithWhereWithoutAcquisitionInputObjectSchema), z.lazy(() => AcquisitionItemUpdateManyWithWhereWithoutAcquisitionInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => AcquisitionItemScalarWhereInputObjectSchema), z.lazy(() => AcquisitionItemScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const AcquisitionItemUpdateManyWithoutAcquisitionNestedInputObjectSchema: z.ZodType<Prisma.AcquisitionItemUpdateManyWithoutAcquisitionNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemUpdateManyWithoutAcquisitionNestedInput>;
export const AcquisitionItemUpdateManyWithoutAcquisitionNestedInputObjectZodSchema = makeSchema();
