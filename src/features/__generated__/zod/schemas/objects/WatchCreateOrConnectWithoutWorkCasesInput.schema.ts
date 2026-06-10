import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './WatchWhereUniqueInput.schema';
import { WatchCreateWithoutWorkCasesInputObjectSchema as WatchCreateWithoutWorkCasesInputObjectSchema } from './WatchCreateWithoutWorkCasesInput.schema';
import { WatchUncheckedCreateWithoutWorkCasesInputObjectSchema as WatchUncheckedCreateWithoutWorkCasesInputObjectSchema } from './WatchUncheckedCreateWithoutWorkCasesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WatchCreateWithoutWorkCasesInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutWorkCasesInputObjectSchema)])
}).strict();
export const WatchCreateOrConnectWithoutWorkCasesInputObjectSchema: z.ZodType<Prisma.WatchCreateOrConnectWithoutWorkCasesInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchCreateOrConnectWithoutWorkCasesInput>;
export const WatchCreateOrConnectWithoutWorkCasesInputObjectZodSchema = makeSchema();
