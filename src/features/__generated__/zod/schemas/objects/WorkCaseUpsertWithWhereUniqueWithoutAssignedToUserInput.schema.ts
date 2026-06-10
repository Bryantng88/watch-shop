import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema';
import { WorkCaseUpdateWithoutAssignedToUserInputObjectSchema as WorkCaseUpdateWithoutAssignedToUserInputObjectSchema } from './WorkCaseUpdateWithoutAssignedToUserInput.schema';
import { WorkCaseUncheckedUpdateWithoutAssignedToUserInputObjectSchema as WorkCaseUncheckedUpdateWithoutAssignedToUserInputObjectSchema } from './WorkCaseUncheckedUpdateWithoutAssignedToUserInput.schema';
import { WorkCaseCreateWithoutAssignedToUserInputObjectSchema as WorkCaseCreateWithoutAssignedToUserInputObjectSchema } from './WorkCaseCreateWithoutAssignedToUserInput.schema';
import { WorkCaseUncheckedCreateWithoutAssignedToUserInputObjectSchema as WorkCaseUncheckedCreateWithoutAssignedToUserInputObjectSchema } from './WorkCaseUncheckedCreateWithoutAssignedToUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => WorkCaseUpdateWithoutAssignedToUserInputObjectSchema), z.lazy(() => WorkCaseUncheckedUpdateWithoutAssignedToUserInputObjectSchema)]),
  create: z.union([z.lazy(() => WorkCaseCreateWithoutAssignedToUserInputObjectSchema), z.lazy(() => WorkCaseUncheckedCreateWithoutAssignedToUserInputObjectSchema)])
}).strict();
export const WorkCaseUpsertWithWhereUniqueWithoutAssignedToUserInputObjectSchema: z.ZodType<Prisma.WorkCaseUpsertWithWhereUniqueWithoutAssignedToUserInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUpsertWithWhereUniqueWithoutAssignedToUserInput>;
export const WorkCaseUpsertWithWhereUniqueWithoutAssignedToUserInputObjectZodSchema = makeSchema();
