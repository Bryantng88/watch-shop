import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaOperationCreateWithoutMediaObjectInputObjectSchema as MediaOperationCreateWithoutMediaObjectInputObjectSchema } from './MediaOperationCreateWithoutMediaObjectInput.schema';
import { MediaOperationUncheckedCreateWithoutMediaObjectInputObjectSchema as MediaOperationUncheckedCreateWithoutMediaObjectInputObjectSchema } from './MediaOperationUncheckedCreateWithoutMediaObjectInput.schema';
import { MediaOperationCreateOrConnectWithoutMediaObjectInputObjectSchema as MediaOperationCreateOrConnectWithoutMediaObjectInputObjectSchema } from './MediaOperationCreateOrConnectWithoutMediaObjectInput.schema';
import { MediaOperationUpsertWithWhereUniqueWithoutMediaObjectInputObjectSchema as MediaOperationUpsertWithWhereUniqueWithoutMediaObjectInputObjectSchema } from './MediaOperationUpsertWithWhereUniqueWithoutMediaObjectInput.schema';
import { MediaOperationCreateManyMediaObjectInputEnvelopeObjectSchema as MediaOperationCreateManyMediaObjectInputEnvelopeObjectSchema } from './MediaOperationCreateManyMediaObjectInputEnvelope.schema';
import { MediaOperationWhereUniqueInputObjectSchema as MediaOperationWhereUniqueInputObjectSchema } from './MediaOperationWhereUniqueInput.schema';
import { MediaOperationUpdateWithWhereUniqueWithoutMediaObjectInputObjectSchema as MediaOperationUpdateWithWhereUniqueWithoutMediaObjectInputObjectSchema } from './MediaOperationUpdateWithWhereUniqueWithoutMediaObjectInput.schema';
import { MediaOperationUpdateManyWithWhereWithoutMediaObjectInputObjectSchema as MediaOperationUpdateManyWithWhereWithoutMediaObjectInputObjectSchema } from './MediaOperationUpdateManyWithWhereWithoutMediaObjectInput.schema';
import { MediaOperationScalarWhereInputObjectSchema as MediaOperationScalarWhereInputObjectSchema } from './MediaOperationScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MediaOperationCreateWithoutMediaObjectInputObjectSchema), z.lazy(() => MediaOperationCreateWithoutMediaObjectInputObjectSchema).array(), z.lazy(() => MediaOperationUncheckedCreateWithoutMediaObjectInputObjectSchema), z.lazy(() => MediaOperationUncheckedCreateWithoutMediaObjectInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => MediaOperationCreateOrConnectWithoutMediaObjectInputObjectSchema), z.lazy(() => MediaOperationCreateOrConnectWithoutMediaObjectInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => MediaOperationUpsertWithWhereUniqueWithoutMediaObjectInputObjectSchema), z.lazy(() => MediaOperationUpsertWithWhereUniqueWithoutMediaObjectInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => MediaOperationCreateManyMediaObjectInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => MediaOperationWhereUniqueInputObjectSchema), z.lazy(() => MediaOperationWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => MediaOperationWhereUniqueInputObjectSchema), z.lazy(() => MediaOperationWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => MediaOperationWhereUniqueInputObjectSchema), z.lazy(() => MediaOperationWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => MediaOperationWhereUniqueInputObjectSchema), z.lazy(() => MediaOperationWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => MediaOperationUpdateWithWhereUniqueWithoutMediaObjectInputObjectSchema), z.lazy(() => MediaOperationUpdateWithWhereUniqueWithoutMediaObjectInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => MediaOperationUpdateManyWithWhereWithoutMediaObjectInputObjectSchema), z.lazy(() => MediaOperationUpdateManyWithWhereWithoutMediaObjectInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => MediaOperationScalarWhereInputObjectSchema), z.lazy(() => MediaOperationScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const MediaOperationUpdateManyWithoutMediaObjectNestedInputObjectSchema: z.ZodType<Prisma.MediaOperationUpdateManyWithoutMediaObjectNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaOperationUpdateManyWithoutMediaObjectNestedInput>;
export const MediaOperationUpdateManyWithoutMediaObjectNestedInputObjectZodSchema = makeSchema();
