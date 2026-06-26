import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagLinkCreateWithoutTagInputObjectSchema as AppTagLinkCreateWithoutTagInputObjectSchema } from './AppTagLinkCreateWithoutTagInput.schema';
import { AppTagLinkUncheckedCreateWithoutTagInputObjectSchema as AppTagLinkUncheckedCreateWithoutTagInputObjectSchema } from './AppTagLinkUncheckedCreateWithoutTagInput.schema';
import { AppTagLinkCreateOrConnectWithoutTagInputObjectSchema as AppTagLinkCreateOrConnectWithoutTagInputObjectSchema } from './AppTagLinkCreateOrConnectWithoutTagInput.schema';
import { AppTagLinkUpsertWithWhereUniqueWithoutTagInputObjectSchema as AppTagLinkUpsertWithWhereUniqueWithoutTagInputObjectSchema } from './AppTagLinkUpsertWithWhereUniqueWithoutTagInput.schema';
import { AppTagLinkCreateManyTagInputEnvelopeObjectSchema as AppTagLinkCreateManyTagInputEnvelopeObjectSchema } from './AppTagLinkCreateManyTagInputEnvelope.schema';
import { AppTagLinkWhereUniqueInputObjectSchema as AppTagLinkWhereUniqueInputObjectSchema } from './AppTagLinkWhereUniqueInput.schema';
import { AppTagLinkUpdateWithWhereUniqueWithoutTagInputObjectSchema as AppTagLinkUpdateWithWhereUniqueWithoutTagInputObjectSchema } from './AppTagLinkUpdateWithWhereUniqueWithoutTagInput.schema';
import { AppTagLinkUpdateManyWithWhereWithoutTagInputObjectSchema as AppTagLinkUpdateManyWithWhereWithoutTagInputObjectSchema } from './AppTagLinkUpdateManyWithWhereWithoutTagInput.schema';
import { AppTagLinkScalarWhereInputObjectSchema as AppTagLinkScalarWhereInputObjectSchema } from './AppTagLinkScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AppTagLinkCreateWithoutTagInputObjectSchema), z.lazy(() => AppTagLinkCreateWithoutTagInputObjectSchema).array(), z.lazy(() => AppTagLinkUncheckedCreateWithoutTagInputObjectSchema), z.lazy(() => AppTagLinkUncheckedCreateWithoutTagInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AppTagLinkCreateOrConnectWithoutTagInputObjectSchema), z.lazy(() => AppTagLinkCreateOrConnectWithoutTagInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => AppTagLinkUpsertWithWhereUniqueWithoutTagInputObjectSchema), z.lazy(() => AppTagLinkUpsertWithWhereUniqueWithoutTagInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AppTagLinkCreateManyTagInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => AppTagLinkWhereUniqueInputObjectSchema), z.lazy(() => AppTagLinkWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => AppTagLinkWhereUniqueInputObjectSchema), z.lazy(() => AppTagLinkWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => AppTagLinkWhereUniqueInputObjectSchema), z.lazy(() => AppTagLinkWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => AppTagLinkWhereUniqueInputObjectSchema), z.lazy(() => AppTagLinkWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => AppTagLinkUpdateWithWhereUniqueWithoutTagInputObjectSchema), z.lazy(() => AppTagLinkUpdateWithWhereUniqueWithoutTagInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => AppTagLinkUpdateManyWithWhereWithoutTagInputObjectSchema), z.lazy(() => AppTagLinkUpdateManyWithWhereWithoutTagInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => AppTagLinkScalarWhereInputObjectSchema), z.lazy(() => AppTagLinkScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const AppTagLinkUncheckedUpdateManyWithoutTagNestedInputObjectSchema: z.ZodType<Prisma.AppTagLinkUncheckedUpdateManyWithoutTagNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagLinkUncheckedUpdateManyWithoutTagNestedInput>;
export const AppTagLinkUncheckedUpdateManyWithoutTagNestedInputObjectZodSchema = makeSchema();
