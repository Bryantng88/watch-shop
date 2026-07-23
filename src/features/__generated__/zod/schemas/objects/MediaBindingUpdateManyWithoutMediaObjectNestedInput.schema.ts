import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaBindingCreateWithoutMediaObjectInputObjectSchema as MediaBindingCreateWithoutMediaObjectInputObjectSchema } from './MediaBindingCreateWithoutMediaObjectInput.schema';
import { MediaBindingUncheckedCreateWithoutMediaObjectInputObjectSchema as MediaBindingUncheckedCreateWithoutMediaObjectInputObjectSchema } from './MediaBindingUncheckedCreateWithoutMediaObjectInput.schema';
import { MediaBindingCreateOrConnectWithoutMediaObjectInputObjectSchema as MediaBindingCreateOrConnectWithoutMediaObjectInputObjectSchema } from './MediaBindingCreateOrConnectWithoutMediaObjectInput.schema';
import { MediaBindingUpsertWithWhereUniqueWithoutMediaObjectInputObjectSchema as MediaBindingUpsertWithWhereUniqueWithoutMediaObjectInputObjectSchema } from './MediaBindingUpsertWithWhereUniqueWithoutMediaObjectInput.schema';
import { MediaBindingCreateManyMediaObjectInputEnvelopeObjectSchema as MediaBindingCreateManyMediaObjectInputEnvelopeObjectSchema } from './MediaBindingCreateManyMediaObjectInputEnvelope.schema';
import { MediaBindingWhereUniqueInputObjectSchema as MediaBindingWhereUniqueInputObjectSchema } from './MediaBindingWhereUniqueInput.schema';
import { MediaBindingUpdateWithWhereUniqueWithoutMediaObjectInputObjectSchema as MediaBindingUpdateWithWhereUniqueWithoutMediaObjectInputObjectSchema } from './MediaBindingUpdateWithWhereUniqueWithoutMediaObjectInput.schema';
import { MediaBindingUpdateManyWithWhereWithoutMediaObjectInputObjectSchema as MediaBindingUpdateManyWithWhereWithoutMediaObjectInputObjectSchema } from './MediaBindingUpdateManyWithWhereWithoutMediaObjectInput.schema';
import { MediaBindingScalarWhereInputObjectSchema as MediaBindingScalarWhereInputObjectSchema } from './MediaBindingScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MediaBindingCreateWithoutMediaObjectInputObjectSchema), z.lazy(() => MediaBindingCreateWithoutMediaObjectInputObjectSchema).array(), z.lazy(() => MediaBindingUncheckedCreateWithoutMediaObjectInputObjectSchema), z.lazy(() => MediaBindingUncheckedCreateWithoutMediaObjectInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => MediaBindingCreateOrConnectWithoutMediaObjectInputObjectSchema), z.lazy(() => MediaBindingCreateOrConnectWithoutMediaObjectInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => MediaBindingUpsertWithWhereUniqueWithoutMediaObjectInputObjectSchema), z.lazy(() => MediaBindingUpsertWithWhereUniqueWithoutMediaObjectInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => MediaBindingCreateManyMediaObjectInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => MediaBindingWhereUniqueInputObjectSchema), z.lazy(() => MediaBindingWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => MediaBindingWhereUniqueInputObjectSchema), z.lazy(() => MediaBindingWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => MediaBindingWhereUniqueInputObjectSchema), z.lazy(() => MediaBindingWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => MediaBindingWhereUniqueInputObjectSchema), z.lazy(() => MediaBindingWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => MediaBindingUpdateWithWhereUniqueWithoutMediaObjectInputObjectSchema), z.lazy(() => MediaBindingUpdateWithWhereUniqueWithoutMediaObjectInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => MediaBindingUpdateManyWithWhereWithoutMediaObjectInputObjectSchema), z.lazy(() => MediaBindingUpdateManyWithWhereWithoutMediaObjectInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => MediaBindingScalarWhereInputObjectSchema), z.lazy(() => MediaBindingScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const MediaBindingUpdateManyWithoutMediaObjectNestedInputObjectSchema: z.ZodType<Prisma.MediaBindingUpdateManyWithoutMediaObjectNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaBindingUpdateManyWithoutMediaObjectNestedInput>;
export const MediaBindingUpdateManyWithoutMediaObjectNestedInputObjectZodSchema = makeSchema();
