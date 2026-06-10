import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema';
import { WorkCaseUpdateWithoutWatchInputObjectSchema as WorkCaseUpdateWithoutWatchInputObjectSchema } from './WorkCaseUpdateWithoutWatchInput.schema';
import { WorkCaseUncheckedUpdateWithoutWatchInputObjectSchema as WorkCaseUncheckedUpdateWithoutWatchInputObjectSchema } from './WorkCaseUncheckedUpdateWithoutWatchInput.schema';
import { WorkCaseCreateWithoutWatchInputObjectSchema as WorkCaseCreateWithoutWatchInputObjectSchema } from './WorkCaseCreateWithoutWatchInput.schema';
import { WorkCaseUncheckedCreateWithoutWatchInputObjectSchema as WorkCaseUncheckedCreateWithoutWatchInputObjectSchema } from './WorkCaseUncheckedCreateWithoutWatchInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => WorkCaseUpdateWithoutWatchInputObjectSchema), z.lazy(() => WorkCaseUncheckedUpdateWithoutWatchInputObjectSchema)]),
  create: z.union([z.lazy(() => WorkCaseCreateWithoutWatchInputObjectSchema), z.lazy(() => WorkCaseUncheckedCreateWithoutWatchInputObjectSchema)])
}).strict();
export const WorkCaseUpsertWithWhereUniqueWithoutWatchInputObjectSchema: z.ZodType<Prisma.WorkCaseUpsertWithWhereUniqueWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUpsertWithWhereUniqueWithoutWatchInput>;
export const WorkCaseUpsertWithWhereUniqueWithoutWatchInputObjectZodSchema = makeSchema();
