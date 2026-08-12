import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionCreateWithoutSourceOrderInputObjectSchema as AcquisitionCreateWithoutSourceOrderInputObjectSchema } from './AcquisitionCreateWithoutSourceOrderInput.schema';
import { AcquisitionUncheckedCreateWithoutSourceOrderInputObjectSchema as AcquisitionUncheckedCreateWithoutSourceOrderInputObjectSchema } from './AcquisitionUncheckedCreateWithoutSourceOrderInput.schema';
import { AcquisitionCreateOrConnectWithoutSourceOrderInputObjectSchema as AcquisitionCreateOrConnectWithoutSourceOrderInputObjectSchema } from './AcquisitionCreateOrConnectWithoutSourceOrderInput.schema';
import { AcquisitionUpsertWithWhereUniqueWithoutSourceOrderInputObjectSchema as AcquisitionUpsertWithWhereUniqueWithoutSourceOrderInputObjectSchema } from './AcquisitionUpsertWithWhereUniqueWithoutSourceOrderInput.schema';
import { AcquisitionCreateManySourceOrderInputEnvelopeObjectSchema as AcquisitionCreateManySourceOrderInputEnvelopeObjectSchema } from './AcquisitionCreateManySourceOrderInputEnvelope.schema';
import { AcquisitionWhereUniqueInputObjectSchema as AcquisitionWhereUniqueInputObjectSchema } from './AcquisitionWhereUniqueInput.schema';
import { AcquisitionUpdateWithWhereUniqueWithoutSourceOrderInputObjectSchema as AcquisitionUpdateWithWhereUniqueWithoutSourceOrderInputObjectSchema } from './AcquisitionUpdateWithWhereUniqueWithoutSourceOrderInput.schema';
import { AcquisitionUpdateManyWithWhereWithoutSourceOrderInputObjectSchema as AcquisitionUpdateManyWithWhereWithoutSourceOrderInputObjectSchema } from './AcquisitionUpdateManyWithWhereWithoutSourceOrderInput.schema';
import { AcquisitionScalarWhereInputObjectSchema as AcquisitionScalarWhereInputObjectSchema } from './AcquisitionScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AcquisitionCreateWithoutSourceOrderInputObjectSchema), z.lazy(() => AcquisitionCreateWithoutSourceOrderInputObjectSchema).array(), z.lazy(() => AcquisitionUncheckedCreateWithoutSourceOrderInputObjectSchema), z.lazy(() => AcquisitionUncheckedCreateWithoutSourceOrderInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AcquisitionCreateOrConnectWithoutSourceOrderInputObjectSchema), z.lazy(() => AcquisitionCreateOrConnectWithoutSourceOrderInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => AcquisitionUpsertWithWhereUniqueWithoutSourceOrderInputObjectSchema), z.lazy(() => AcquisitionUpsertWithWhereUniqueWithoutSourceOrderInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AcquisitionCreateManySourceOrderInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => AcquisitionWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => AcquisitionWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => AcquisitionWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => AcquisitionWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => AcquisitionUpdateWithWhereUniqueWithoutSourceOrderInputObjectSchema), z.lazy(() => AcquisitionUpdateWithWhereUniqueWithoutSourceOrderInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => AcquisitionUpdateManyWithWhereWithoutSourceOrderInputObjectSchema), z.lazy(() => AcquisitionUpdateManyWithWhereWithoutSourceOrderInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => AcquisitionScalarWhereInputObjectSchema), z.lazy(() => AcquisitionScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const AcquisitionUpdateManyWithoutSourceOrderNestedInputObjectSchema: z.ZodType<Prisma.AcquisitionUpdateManyWithoutSourceOrderNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionUpdateManyWithoutSourceOrderNestedInput>;
export const AcquisitionUpdateManyWithoutSourceOrderNestedInputObjectZodSchema = makeSchema();
