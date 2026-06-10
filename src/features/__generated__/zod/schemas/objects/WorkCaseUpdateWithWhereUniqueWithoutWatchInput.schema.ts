import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema';
import { WorkCaseUpdateWithoutWatchInputObjectSchema as WorkCaseUpdateWithoutWatchInputObjectSchema } from './WorkCaseUpdateWithoutWatchInput.schema';
import { WorkCaseUncheckedUpdateWithoutWatchInputObjectSchema as WorkCaseUncheckedUpdateWithoutWatchInputObjectSchema } from './WorkCaseUncheckedUpdateWithoutWatchInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => WorkCaseUpdateWithoutWatchInputObjectSchema), z.lazy(() => WorkCaseUncheckedUpdateWithoutWatchInputObjectSchema)])
}).strict();
export const WorkCaseUpdateWithWhereUniqueWithoutWatchInputObjectSchema: z.ZodType<Prisma.WorkCaseUpdateWithWhereUniqueWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUpdateWithWhereUniqueWithoutWatchInput>;
export const WorkCaseUpdateWithWhereUniqueWithoutWatchInputObjectZodSchema = makeSchema();
