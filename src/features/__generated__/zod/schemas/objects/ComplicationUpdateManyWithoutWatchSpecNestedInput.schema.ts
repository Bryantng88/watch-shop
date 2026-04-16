import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ComplicationCreateWithoutWatchSpecInputObjectSchema as ComplicationCreateWithoutWatchSpecInputObjectSchema } from './ComplicationCreateWithoutWatchSpecInput.schema';
import { ComplicationUncheckedCreateWithoutWatchSpecInputObjectSchema as ComplicationUncheckedCreateWithoutWatchSpecInputObjectSchema } from './ComplicationUncheckedCreateWithoutWatchSpecInput.schema';
import { ComplicationCreateOrConnectWithoutWatchSpecInputObjectSchema as ComplicationCreateOrConnectWithoutWatchSpecInputObjectSchema } from './ComplicationCreateOrConnectWithoutWatchSpecInput.schema';
import { ComplicationUpsertWithWhereUniqueWithoutWatchSpecInputObjectSchema as ComplicationUpsertWithWhereUniqueWithoutWatchSpecInputObjectSchema } from './ComplicationUpsertWithWhereUniqueWithoutWatchSpecInput.schema';
import { ComplicationWhereUniqueInputObjectSchema as ComplicationWhereUniqueInputObjectSchema } from './ComplicationWhereUniqueInput.schema';
import { ComplicationUpdateWithWhereUniqueWithoutWatchSpecInputObjectSchema as ComplicationUpdateWithWhereUniqueWithoutWatchSpecInputObjectSchema } from './ComplicationUpdateWithWhereUniqueWithoutWatchSpecInput.schema';
import { ComplicationUpdateManyWithWhereWithoutWatchSpecInputObjectSchema as ComplicationUpdateManyWithWhereWithoutWatchSpecInputObjectSchema } from './ComplicationUpdateManyWithWhereWithoutWatchSpecInput.schema';
import { ComplicationScalarWhereInputObjectSchema as ComplicationScalarWhereInputObjectSchema } from './ComplicationScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ComplicationCreateWithoutWatchSpecInputObjectSchema), z.lazy(() => ComplicationCreateWithoutWatchSpecInputObjectSchema).array(), z.lazy(() => ComplicationUncheckedCreateWithoutWatchSpecInputObjectSchema), z.lazy(() => ComplicationUncheckedCreateWithoutWatchSpecInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ComplicationCreateOrConnectWithoutWatchSpecInputObjectSchema), z.lazy(() => ComplicationCreateOrConnectWithoutWatchSpecInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ComplicationUpsertWithWhereUniqueWithoutWatchSpecInputObjectSchema), z.lazy(() => ComplicationUpsertWithWhereUniqueWithoutWatchSpecInputObjectSchema).array()]).optional(),
  set: z.union([z.lazy(() => ComplicationWhereUniqueInputObjectSchema), z.lazy(() => ComplicationWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ComplicationWhereUniqueInputObjectSchema), z.lazy(() => ComplicationWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ComplicationWhereUniqueInputObjectSchema), z.lazy(() => ComplicationWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ComplicationWhereUniqueInputObjectSchema), z.lazy(() => ComplicationWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ComplicationUpdateWithWhereUniqueWithoutWatchSpecInputObjectSchema), z.lazy(() => ComplicationUpdateWithWhereUniqueWithoutWatchSpecInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ComplicationUpdateManyWithWhereWithoutWatchSpecInputObjectSchema), z.lazy(() => ComplicationUpdateManyWithWhereWithoutWatchSpecInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ComplicationScalarWhereInputObjectSchema), z.lazy(() => ComplicationScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ComplicationUpdateManyWithoutWatchSpecNestedInputObjectSchema: z.ZodType<Prisma.ComplicationUpdateManyWithoutWatchSpecNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ComplicationUpdateManyWithoutWatchSpecNestedInput>;
export const ComplicationUpdateManyWithoutWatchSpecNestedInputObjectZodSchema = makeSchema();
