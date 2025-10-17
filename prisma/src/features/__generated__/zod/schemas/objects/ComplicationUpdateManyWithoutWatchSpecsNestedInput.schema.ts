import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ComplicationCreateWithoutWatchSpecsInputObjectSchema as ComplicationCreateWithoutWatchSpecsInputObjectSchema } from './ComplicationCreateWithoutWatchSpecsInput.schema';
import { ComplicationUncheckedCreateWithoutWatchSpecsInputObjectSchema as ComplicationUncheckedCreateWithoutWatchSpecsInputObjectSchema } from './ComplicationUncheckedCreateWithoutWatchSpecsInput.schema';
import { ComplicationCreateOrConnectWithoutWatchSpecsInputObjectSchema as ComplicationCreateOrConnectWithoutWatchSpecsInputObjectSchema } from './ComplicationCreateOrConnectWithoutWatchSpecsInput.schema';
import { ComplicationUpsertWithWhereUniqueWithoutWatchSpecsInputObjectSchema as ComplicationUpsertWithWhereUniqueWithoutWatchSpecsInputObjectSchema } from './ComplicationUpsertWithWhereUniqueWithoutWatchSpecsInput.schema';
import { ComplicationWhereUniqueInputObjectSchema as ComplicationWhereUniqueInputObjectSchema } from './ComplicationWhereUniqueInput.schema';
import { ComplicationUpdateWithWhereUniqueWithoutWatchSpecsInputObjectSchema as ComplicationUpdateWithWhereUniqueWithoutWatchSpecsInputObjectSchema } from './ComplicationUpdateWithWhereUniqueWithoutWatchSpecsInput.schema';
import { ComplicationUpdateManyWithWhereWithoutWatchSpecsInputObjectSchema as ComplicationUpdateManyWithWhereWithoutWatchSpecsInputObjectSchema } from './ComplicationUpdateManyWithWhereWithoutWatchSpecsInput.schema';
import { ComplicationScalarWhereInputObjectSchema as ComplicationScalarWhereInputObjectSchema } from './ComplicationScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ComplicationCreateWithoutWatchSpecsInputObjectSchema), z.lazy(() => ComplicationCreateWithoutWatchSpecsInputObjectSchema).array(), z.lazy(() => ComplicationUncheckedCreateWithoutWatchSpecsInputObjectSchema), z.lazy(() => ComplicationUncheckedCreateWithoutWatchSpecsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ComplicationCreateOrConnectWithoutWatchSpecsInputObjectSchema), z.lazy(() => ComplicationCreateOrConnectWithoutWatchSpecsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ComplicationUpsertWithWhereUniqueWithoutWatchSpecsInputObjectSchema), z.lazy(() => ComplicationUpsertWithWhereUniqueWithoutWatchSpecsInputObjectSchema).array()]).optional(),
  set: z.union([z.lazy(() => ComplicationWhereUniqueInputObjectSchema), z.lazy(() => ComplicationWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ComplicationWhereUniqueInputObjectSchema), z.lazy(() => ComplicationWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ComplicationWhereUniqueInputObjectSchema), z.lazy(() => ComplicationWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ComplicationWhereUniqueInputObjectSchema), z.lazy(() => ComplicationWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ComplicationUpdateWithWhereUniqueWithoutWatchSpecsInputObjectSchema), z.lazy(() => ComplicationUpdateWithWhereUniqueWithoutWatchSpecsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ComplicationUpdateManyWithWhereWithoutWatchSpecsInputObjectSchema), z.lazy(() => ComplicationUpdateManyWithWhereWithoutWatchSpecsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ComplicationScalarWhereInputObjectSchema), z.lazy(() => ComplicationScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ComplicationUpdateManyWithoutWatchSpecsNestedInputObjectSchema: z.ZodType<Prisma.ComplicationUpdateManyWithoutWatchSpecsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ComplicationUpdateManyWithoutWatchSpecsNestedInput>;
export const ComplicationUpdateManyWithoutWatchSpecsNestedInputObjectZodSchema = makeSchema();
