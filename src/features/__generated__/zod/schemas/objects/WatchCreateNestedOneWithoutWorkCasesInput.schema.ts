import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchCreateWithoutWorkCasesInputObjectSchema as WatchCreateWithoutWorkCasesInputObjectSchema } from './WatchCreateWithoutWorkCasesInput.schema';
import { WatchUncheckedCreateWithoutWorkCasesInputObjectSchema as WatchUncheckedCreateWithoutWorkCasesInputObjectSchema } from './WatchUncheckedCreateWithoutWorkCasesInput.schema';
import { WatchCreateOrConnectWithoutWorkCasesInputObjectSchema as WatchCreateOrConnectWithoutWorkCasesInputObjectSchema } from './WatchCreateOrConnectWithoutWorkCasesInput.schema';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './WatchWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchCreateWithoutWorkCasesInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutWorkCasesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WatchCreateOrConnectWithoutWorkCasesInputObjectSchema).optional(),
  connect: z.lazy(() => WatchWhereUniqueInputObjectSchema).optional()
}).strict();
export const WatchCreateNestedOneWithoutWorkCasesInputObjectSchema: z.ZodType<Prisma.WatchCreateNestedOneWithoutWorkCasesInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchCreateNestedOneWithoutWorkCasesInput>;
export const WatchCreateNestedOneWithoutWorkCasesInputObjectZodSchema = makeSchema();
