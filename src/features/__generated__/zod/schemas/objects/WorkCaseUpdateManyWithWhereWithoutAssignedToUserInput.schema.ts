import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseScalarWhereInputObjectSchema as WorkCaseScalarWhereInputObjectSchema } from './WorkCaseScalarWhereInput.schema';
import { WorkCaseUpdateManyMutationInputObjectSchema as WorkCaseUpdateManyMutationInputObjectSchema } from './WorkCaseUpdateManyMutationInput.schema';
import { WorkCaseUncheckedUpdateManyWithoutAssignedToUserInputObjectSchema as WorkCaseUncheckedUpdateManyWithoutAssignedToUserInputObjectSchema } from './WorkCaseUncheckedUpdateManyWithoutAssignedToUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => WorkCaseUpdateManyMutationInputObjectSchema), z.lazy(() => WorkCaseUncheckedUpdateManyWithoutAssignedToUserInputObjectSchema)])
}).strict();
export const WorkCaseUpdateManyWithWhereWithoutAssignedToUserInputObjectSchema: z.ZodType<Prisma.WorkCaseUpdateManyWithWhereWithoutAssignedToUserInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUpdateManyWithWhereWithoutAssignedToUserInput>;
export const WorkCaseUpdateManyWithWhereWithoutAssignedToUserInputObjectZodSchema = makeSchema();
