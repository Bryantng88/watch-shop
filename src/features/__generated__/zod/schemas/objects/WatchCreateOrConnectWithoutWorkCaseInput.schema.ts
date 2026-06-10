import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './WatchWhereUniqueInput.schema';
import { WatchCreateWithoutWorkCaseInputObjectSchema as WatchCreateWithoutWorkCaseInputObjectSchema } from './WatchCreateWithoutWorkCaseInput.schema';
import { WatchUncheckedCreateWithoutWorkCaseInputObjectSchema as WatchUncheckedCreateWithoutWorkCaseInputObjectSchema } from './WatchUncheckedCreateWithoutWorkCaseInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WatchCreateWithoutWorkCaseInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutWorkCaseInputObjectSchema)])
}).strict();
export const WatchCreateOrConnectWithoutWorkCaseInputObjectSchema: z.ZodType<Prisma.WatchCreateOrConnectWithoutWorkCaseInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchCreateOrConnectWithoutWorkCaseInput>;
export const WatchCreateOrConnectWithoutWorkCaseInputObjectZodSchema = makeSchema();
