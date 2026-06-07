import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchCreateWithoutTaskInputObjectSchema as WatchCreateWithoutTaskInputObjectSchema } from './WatchCreateWithoutTaskInput.schema';
import { WatchUncheckedCreateWithoutTaskInputObjectSchema as WatchUncheckedCreateWithoutTaskInputObjectSchema } from './WatchUncheckedCreateWithoutTaskInput.schema';
import { WatchCreateOrConnectWithoutTaskInputObjectSchema as WatchCreateOrConnectWithoutTaskInputObjectSchema } from './WatchCreateOrConnectWithoutTaskInput.schema';
import { WatchUpsertWithoutTaskInputObjectSchema as WatchUpsertWithoutTaskInputObjectSchema } from './WatchUpsertWithoutTaskInput.schema';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './WatchWhereInput.schema';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './WatchWhereUniqueInput.schema';
import { WatchUpdateToOneWithWhereWithoutTaskInputObjectSchema as WatchUpdateToOneWithWhereWithoutTaskInputObjectSchema } from './WatchUpdateToOneWithWhereWithoutTaskInput.schema';
import { WatchUpdateWithoutTaskInputObjectSchema as WatchUpdateWithoutTaskInputObjectSchema } from './WatchUpdateWithoutTaskInput.schema';
import { WatchUncheckedUpdateWithoutTaskInputObjectSchema as WatchUncheckedUpdateWithoutTaskInputObjectSchema } from './WatchUncheckedUpdateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchCreateWithoutTaskInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutTaskInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WatchCreateOrConnectWithoutTaskInputObjectSchema).optional(),
  upsert: z.lazy(() => WatchUpsertWithoutTaskInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => WatchWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => WatchWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => WatchWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => WatchUpdateToOneWithWhereWithoutTaskInputObjectSchema), z.lazy(() => WatchUpdateWithoutTaskInputObjectSchema), z.lazy(() => WatchUncheckedUpdateWithoutTaskInputObjectSchema)]).optional()
}).strict();
export const WatchUpdateOneWithoutTaskNestedInputObjectSchema: z.ZodType<Prisma.WatchUpdateOneWithoutTaskNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchUpdateOneWithoutTaskNestedInput>;
export const WatchUpdateOneWithoutTaskNestedInputObjectZodSchema = makeSchema();
