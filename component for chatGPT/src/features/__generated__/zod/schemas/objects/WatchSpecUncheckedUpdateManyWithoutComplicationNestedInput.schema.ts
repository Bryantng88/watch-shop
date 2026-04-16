import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecCreateWithoutComplicationInputObjectSchema as WatchSpecCreateWithoutComplicationInputObjectSchema } from './WatchSpecCreateWithoutComplicationInput.schema';
import { WatchSpecUncheckedCreateWithoutComplicationInputObjectSchema as WatchSpecUncheckedCreateWithoutComplicationInputObjectSchema } from './WatchSpecUncheckedCreateWithoutComplicationInput.schema';
import { WatchSpecCreateOrConnectWithoutComplicationInputObjectSchema as WatchSpecCreateOrConnectWithoutComplicationInputObjectSchema } from './WatchSpecCreateOrConnectWithoutComplicationInput.schema';
import { WatchSpecUpsertWithWhereUniqueWithoutComplicationInputObjectSchema as WatchSpecUpsertWithWhereUniqueWithoutComplicationInputObjectSchema } from './WatchSpecUpsertWithWhereUniqueWithoutComplicationInput.schema';
import { WatchSpecWhereUniqueInputObjectSchema as WatchSpecWhereUniqueInputObjectSchema } from './WatchSpecWhereUniqueInput.schema';
import { WatchSpecUpdateWithWhereUniqueWithoutComplicationInputObjectSchema as WatchSpecUpdateWithWhereUniqueWithoutComplicationInputObjectSchema } from './WatchSpecUpdateWithWhereUniqueWithoutComplicationInput.schema';
import { WatchSpecUpdateManyWithWhereWithoutComplicationInputObjectSchema as WatchSpecUpdateManyWithWhereWithoutComplicationInputObjectSchema } from './WatchSpecUpdateManyWithWhereWithoutComplicationInput.schema';
import { WatchSpecScalarWhereInputObjectSchema as WatchSpecScalarWhereInputObjectSchema } from './WatchSpecScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchSpecCreateWithoutComplicationInputObjectSchema), z.lazy(() => WatchSpecCreateWithoutComplicationInputObjectSchema).array(), z.lazy(() => WatchSpecUncheckedCreateWithoutComplicationInputObjectSchema), z.lazy(() => WatchSpecUncheckedCreateWithoutComplicationInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WatchSpecCreateOrConnectWithoutComplicationInputObjectSchema), z.lazy(() => WatchSpecCreateOrConnectWithoutComplicationInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => WatchSpecUpsertWithWhereUniqueWithoutComplicationInputObjectSchema), z.lazy(() => WatchSpecUpsertWithWhereUniqueWithoutComplicationInputObjectSchema).array()]).optional(),
  set: z.union([z.lazy(() => WatchSpecWhereUniqueInputObjectSchema), z.lazy(() => WatchSpecWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => WatchSpecWhereUniqueInputObjectSchema), z.lazy(() => WatchSpecWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => WatchSpecWhereUniqueInputObjectSchema), z.lazy(() => WatchSpecWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => WatchSpecWhereUniqueInputObjectSchema), z.lazy(() => WatchSpecWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => WatchSpecUpdateWithWhereUniqueWithoutComplicationInputObjectSchema), z.lazy(() => WatchSpecUpdateWithWhereUniqueWithoutComplicationInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => WatchSpecUpdateManyWithWhereWithoutComplicationInputObjectSchema), z.lazy(() => WatchSpecUpdateManyWithWhereWithoutComplicationInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => WatchSpecScalarWhereInputObjectSchema), z.lazy(() => WatchSpecScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const WatchSpecUncheckedUpdateManyWithoutComplicationNestedInputObjectSchema: z.ZodType<Prisma.WatchSpecUncheckedUpdateManyWithoutComplicationNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecUncheckedUpdateManyWithoutComplicationNestedInput>;
export const WatchSpecUncheckedUpdateManyWithoutComplicationNestedInputObjectZodSchema = makeSchema();
