import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseUpdateWithoutActivitiesInputObjectSchema as WorkCaseUpdateWithoutActivitiesInputObjectSchema } from './WorkCaseUpdateWithoutActivitiesInput.schema';
import { WorkCaseUncheckedUpdateWithoutActivitiesInputObjectSchema as WorkCaseUncheckedUpdateWithoutActivitiesInputObjectSchema } from './WorkCaseUncheckedUpdateWithoutActivitiesInput.schema';
import { WorkCaseCreateWithoutActivitiesInputObjectSchema as WorkCaseCreateWithoutActivitiesInputObjectSchema } from './WorkCaseCreateWithoutActivitiesInput.schema';
import { WorkCaseUncheckedCreateWithoutActivitiesInputObjectSchema as WorkCaseUncheckedCreateWithoutActivitiesInputObjectSchema } from './WorkCaseUncheckedCreateWithoutActivitiesInput.schema';
import { WorkCaseWhereInputObjectSchema as WorkCaseWhereInputObjectSchema } from './WorkCaseWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => WorkCaseUpdateWithoutActivitiesInputObjectSchema), z.lazy(() => WorkCaseUncheckedUpdateWithoutActivitiesInputObjectSchema)]),
  create: z.union([z.lazy(() => WorkCaseCreateWithoutActivitiesInputObjectSchema), z.lazy(() => WorkCaseUncheckedCreateWithoutActivitiesInputObjectSchema)]),
  where: z.lazy(() => WorkCaseWhereInputObjectSchema).optional()
}).strict();
export const WorkCaseUpsertWithoutActivitiesInputObjectSchema: z.ZodType<Prisma.WorkCaseUpsertWithoutActivitiesInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUpsertWithoutActivitiesInput>;
export const WorkCaseUpsertWithoutActivitiesInputObjectZodSchema = makeSchema();
