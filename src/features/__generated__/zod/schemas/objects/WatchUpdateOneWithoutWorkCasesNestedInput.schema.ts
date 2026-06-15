import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchCreateWithoutWorkCasesInputObjectSchema as WatchCreateWithoutWorkCasesInputObjectSchema } from './WatchCreateWithoutWorkCasesInput.schema';
import { WatchUncheckedCreateWithoutWorkCasesInputObjectSchema as WatchUncheckedCreateWithoutWorkCasesInputObjectSchema } from './WatchUncheckedCreateWithoutWorkCasesInput.schema';
import { WatchCreateOrConnectWithoutWorkCasesInputObjectSchema as WatchCreateOrConnectWithoutWorkCasesInputObjectSchema } from './WatchCreateOrConnectWithoutWorkCasesInput.schema';
import { WatchUpsertWithoutWorkCasesInputObjectSchema as WatchUpsertWithoutWorkCasesInputObjectSchema } from './WatchUpsertWithoutWorkCasesInput.schema';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './WatchWhereInput.schema';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './WatchWhereUniqueInput.schema';
import { WatchUpdateToOneWithWhereWithoutWorkCasesInputObjectSchema as WatchUpdateToOneWithWhereWithoutWorkCasesInputObjectSchema } from './WatchUpdateToOneWithWhereWithoutWorkCasesInput.schema';
import { WatchUpdateWithoutWorkCasesInputObjectSchema as WatchUpdateWithoutWorkCasesInputObjectSchema } from './WatchUpdateWithoutWorkCasesInput.schema';
import { WatchUncheckedUpdateWithoutWorkCasesInputObjectSchema as WatchUncheckedUpdateWithoutWorkCasesInputObjectSchema } from './WatchUncheckedUpdateWithoutWorkCasesInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchCreateWithoutWorkCasesInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutWorkCasesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WatchCreateOrConnectWithoutWorkCasesInputObjectSchema).optional(),
  upsert: z.lazy(() => WatchUpsertWithoutWorkCasesInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => WatchWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => WatchWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => WatchWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => WatchUpdateToOneWithWhereWithoutWorkCasesInputObjectSchema), z.lazy(() => WatchUpdateWithoutWorkCasesInputObjectSchema), z.lazy(() => WatchUncheckedUpdateWithoutWorkCasesInputObjectSchema)]).optional()
}).strict();
export const WatchUpdateOneWithoutWorkCasesNestedInputObjectSchema: z.ZodType<Prisma.WatchUpdateOneWithoutWorkCasesNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchUpdateOneWithoutWorkCasesNestedInput>;
export const WatchUpdateOneWithoutWorkCasesNestedInputObjectZodSchema = makeSchema();
