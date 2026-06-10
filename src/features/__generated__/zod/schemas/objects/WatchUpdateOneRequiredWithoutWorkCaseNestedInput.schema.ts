import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchCreateWithoutWorkCaseInputObjectSchema as WatchCreateWithoutWorkCaseInputObjectSchema } from './WatchCreateWithoutWorkCaseInput.schema';
import { WatchUncheckedCreateWithoutWorkCaseInputObjectSchema as WatchUncheckedCreateWithoutWorkCaseInputObjectSchema } from './WatchUncheckedCreateWithoutWorkCaseInput.schema';
import { WatchCreateOrConnectWithoutWorkCaseInputObjectSchema as WatchCreateOrConnectWithoutWorkCaseInputObjectSchema } from './WatchCreateOrConnectWithoutWorkCaseInput.schema';
import { WatchUpsertWithoutWorkCaseInputObjectSchema as WatchUpsertWithoutWorkCaseInputObjectSchema } from './WatchUpsertWithoutWorkCaseInput.schema';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './WatchWhereUniqueInput.schema';
import { WatchUpdateToOneWithWhereWithoutWorkCaseInputObjectSchema as WatchUpdateToOneWithWhereWithoutWorkCaseInputObjectSchema } from './WatchUpdateToOneWithWhereWithoutWorkCaseInput.schema';
import { WatchUpdateWithoutWorkCaseInputObjectSchema as WatchUpdateWithoutWorkCaseInputObjectSchema } from './WatchUpdateWithoutWorkCaseInput.schema';
import { WatchUncheckedUpdateWithoutWorkCaseInputObjectSchema as WatchUncheckedUpdateWithoutWorkCaseInputObjectSchema } from './WatchUncheckedUpdateWithoutWorkCaseInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchCreateWithoutWorkCaseInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutWorkCaseInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WatchCreateOrConnectWithoutWorkCaseInputObjectSchema).optional(),
  upsert: z.lazy(() => WatchUpsertWithoutWorkCaseInputObjectSchema).optional(),
  connect: z.lazy(() => WatchWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => WatchUpdateToOneWithWhereWithoutWorkCaseInputObjectSchema), z.lazy(() => WatchUpdateWithoutWorkCaseInputObjectSchema), z.lazy(() => WatchUncheckedUpdateWithoutWorkCaseInputObjectSchema)]).optional()
}).strict();
export const WatchUpdateOneRequiredWithoutWorkCaseNestedInputObjectSchema: z.ZodType<Prisma.WatchUpdateOneRequiredWithoutWorkCaseNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchUpdateOneRequiredWithoutWorkCaseNestedInput>;
export const WatchUpdateOneRequiredWithoutWorkCaseNestedInputObjectZodSchema = makeSchema();
