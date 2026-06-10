import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema';
import { WorkCaseCreateWithoutActivitiesInputObjectSchema as WorkCaseCreateWithoutActivitiesInputObjectSchema } from './WorkCaseCreateWithoutActivitiesInput.schema';
import { WorkCaseUncheckedCreateWithoutActivitiesInputObjectSchema as WorkCaseUncheckedCreateWithoutActivitiesInputObjectSchema } from './WorkCaseUncheckedCreateWithoutActivitiesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WorkCaseCreateWithoutActivitiesInputObjectSchema), z.lazy(() => WorkCaseUncheckedCreateWithoutActivitiesInputObjectSchema)])
}).strict();
export const WorkCaseCreateOrConnectWithoutActivitiesInputObjectSchema: z.ZodType<Prisma.WorkCaseCreateOrConnectWithoutActivitiesInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCreateOrConnectWithoutActivitiesInput>;
export const WorkCaseCreateOrConnectWithoutActivitiesInputObjectZodSchema = makeSchema();
