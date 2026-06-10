import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchCreateWithoutWorkCaseInputObjectSchema as WatchCreateWithoutWorkCaseInputObjectSchema } from './WatchCreateWithoutWorkCaseInput.schema';
import { WatchUncheckedCreateWithoutWorkCaseInputObjectSchema as WatchUncheckedCreateWithoutWorkCaseInputObjectSchema } from './WatchUncheckedCreateWithoutWorkCaseInput.schema';
import { WatchCreateOrConnectWithoutWorkCaseInputObjectSchema as WatchCreateOrConnectWithoutWorkCaseInputObjectSchema } from './WatchCreateOrConnectWithoutWorkCaseInput.schema';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './WatchWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchCreateWithoutWorkCaseInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutWorkCaseInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WatchCreateOrConnectWithoutWorkCaseInputObjectSchema).optional(),
  connect: z.lazy(() => WatchWhereUniqueInputObjectSchema).optional()
}).strict();
export const WatchCreateNestedOneWithoutWorkCaseInputObjectSchema: z.ZodType<Prisma.WatchCreateNestedOneWithoutWorkCaseInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchCreateNestedOneWithoutWorkCaseInput>;
export const WatchCreateNestedOneWithoutWorkCaseInputObjectZodSchema = makeSchema();
