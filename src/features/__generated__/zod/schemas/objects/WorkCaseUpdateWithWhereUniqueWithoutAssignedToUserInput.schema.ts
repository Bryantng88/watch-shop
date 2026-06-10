import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema';
import { WorkCaseUpdateWithoutAssignedToUserInputObjectSchema as WorkCaseUpdateWithoutAssignedToUserInputObjectSchema } from './WorkCaseUpdateWithoutAssignedToUserInput.schema';
import { WorkCaseUncheckedUpdateWithoutAssignedToUserInputObjectSchema as WorkCaseUncheckedUpdateWithoutAssignedToUserInputObjectSchema } from './WorkCaseUncheckedUpdateWithoutAssignedToUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => WorkCaseUpdateWithoutAssignedToUserInputObjectSchema), z.lazy(() => WorkCaseUncheckedUpdateWithoutAssignedToUserInputObjectSchema)])
}).strict();
export const WorkCaseUpdateWithWhereUniqueWithoutAssignedToUserInputObjectSchema: z.ZodType<Prisma.WorkCaseUpdateWithWhereUniqueWithoutAssignedToUserInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUpdateWithWhereUniqueWithoutAssignedToUserInput>;
export const WorkCaseUpdateWithWhereUniqueWithoutAssignedToUserInputObjectZodSchema = makeSchema();
