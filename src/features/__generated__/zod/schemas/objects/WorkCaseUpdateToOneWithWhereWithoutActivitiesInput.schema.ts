import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseWhereInputObjectSchema as WorkCaseWhereInputObjectSchema } from './WorkCaseWhereInput.schema';
import { WorkCaseUpdateWithoutActivitiesInputObjectSchema as WorkCaseUpdateWithoutActivitiesInputObjectSchema } from './WorkCaseUpdateWithoutActivitiesInput.schema';
import { WorkCaseUncheckedUpdateWithoutActivitiesInputObjectSchema as WorkCaseUncheckedUpdateWithoutActivitiesInputObjectSchema } from './WorkCaseUncheckedUpdateWithoutActivitiesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => WorkCaseUpdateWithoutActivitiesInputObjectSchema), z.lazy(() => WorkCaseUncheckedUpdateWithoutActivitiesInputObjectSchema)])
}).strict();
export const WorkCaseUpdateToOneWithWhereWithoutActivitiesInputObjectSchema: z.ZodType<Prisma.WorkCaseUpdateToOneWithWhereWithoutActivitiesInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUpdateToOneWithWhereWithoutActivitiesInput>;
export const WorkCaseUpdateToOneWithWhereWithoutActivitiesInputObjectZodSchema = makeSchema();
