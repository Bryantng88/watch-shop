import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseCreateWithoutActivitiesInputObjectSchema as WorkCaseCreateWithoutActivitiesInputObjectSchema } from './WorkCaseCreateWithoutActivitiesInput.schema';
import { WorkCaseUncheckedCreateWithoutActivitiesInputObjectSchema as WorkCaseUncheckedCreateWithoutActivitiesInputObjectSchema } from './WorkCaseUncheckedCreateWithoutActivitiesInput.schema';
import { WorkCaseCreateOrConnectWithoutActivitiesInputObjectSchema as WorkCaseCreateOrConnectWithoutActivitiesInputObjectSchema } from './WorkCaseCreateOrConnectWithoutActivitiesInput.schema';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkCaseCreateWithoutActivitiesInputObjectSchema), z.lazy(() => WorkCaseUncheckedCreateWithoutActivitiesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WorkCaseCreateOrConnectWithoutActivitiesInputObjectSchema).optional(),
  connect: z.lazy(() => WorkCaseWhereUniqueInputObjectSchema).optional()
}).strict();
export const WorkCaseCreateNestedOneWithoutActivitiesInputObjectSchema: z.ZodType<Prisma.WorkCaseCreateNestedOneWithoutActivitiesInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCreateNestedOneWithoutActivitiesInput>;
export const WorkCaseCreateNestedOneWithoutActivitiesInputObjectZodSchema = makeSchema();
