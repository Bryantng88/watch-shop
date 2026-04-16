import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchCreateWithoutProductInputObjectSchema as WatchCreateWithoutProductInputObjectSchema } from './WatchCreateWithoutProductInput.schema';
import { WatchUncheckedCreateWithoutProductInputObjectSchema as WatchUncheckedCreateWithoutProductInputObjectSchema } from './WatchUncheckedCreateWithoutProductInput.schema';
import { WatchCreateOrConnectWithoutProductInputObjectSchema as WatchCreateOrConnectWithoutProductInputObjectSchema } from './WatchCreateOrConnectWithoutProductInput.schema';
import { WatchUpsertWithoutProductInputObjectSchema as WatchUpsertWithoutProductInputObjectSchema } from './WatchUpsertWithoutProductInput.schema';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './WatchWhereInput.schema';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './WatchWhereUniqueInput.schema';
import { WatchUpdateToOneWithWhereWithoutProductInputObjectSchema as WatchUpdateToOneWithWhereWithoutProductInputObjectSchema } from './WatchUpdateToOneWithWhereWithoutProductInput.schema';
import { WatchUpdateWithoutProductInputObjectSchema as WatchUpdateWithoutProductInputObjectSchema } from './WatchUpdateWithoutProductInput.schema';
import { WatchUncheckedUpdateWithoutProductInputObjectSchema as WatchUncheckedUpdateWithoutProductInputObjectSchema } from './WatchUncheckedUpdateWithoutProductInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchCreateWithoutProductInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutProductInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WatchCreateOrConnectWithoutProductInputObjectSchema).optional(),
  upsert: z.lazy(() => WatchUpsertWithoutProductInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => WatchWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => WatchWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => WatchWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => WatchUpdateToOneWithWhereWithoutProductInputObjectSchema), z.lazy(() => WatchUpdateWithoutProductInputObjectSchema), z.lazy(() => WatchUncheckedUpdateWithoutProductInputObjectSchema)]).optional()
}).strict();
export const WatchUncheckedUpdateOneWithoutProductNestedInputObjectSchema: z.ZodType<Prisma.WatchUncheckedUpdateOneWithoutProductNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchUncheckedUpdateOneWithoutProductNestedInput>;
export const WatchUncheckedUpdateOneWithoutProductNestedInputObjectZodSchema = makeSchema();
