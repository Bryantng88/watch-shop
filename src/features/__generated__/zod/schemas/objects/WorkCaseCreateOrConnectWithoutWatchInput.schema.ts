import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema';
import { WorkCaseCreateWithoutWatchInputObjectSchema as WorkCaseCreateWithoutWatchInputObjectSchema } from './WorkCaseCreateWithoutWatchInput.schema';
import { WorkCaseUncheckedCreateWithoutWatchInputObjectSchema as WorkCaseUncheckedCreateWithoutWatchInputObjectSchema } from './WorkCaseUncheckedCreateWithoutWatchInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WorkCaseCreateWithoutWatchInputObjectSchema), z.lazy(() => WorkCaseUncheckedCreateWithoutWatchInputObjectSchema)])
}).strict();
export const WorkCaseCreateOrConnectWithoutWatchInputObjectSchema: z.ZodType<Prisma.WorkCaseCreateOrConnectWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCreateOrConnectWithoutWatchInput>;
export const WorkCaseCreateOrConnectWithoutWatchInputObjectZodSchema = makeSchema();
