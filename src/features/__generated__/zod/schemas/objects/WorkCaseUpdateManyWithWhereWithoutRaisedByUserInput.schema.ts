import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseScalarWhereInputObjectSchema as WorkCaseScalarWhereInputObjectSchema } from './WorkCaseScalarWhereInput.schema';
import { WorkCaseUpdateManyMutationInputObjectSchema as WorkCaseUpdateManyMutationInputObjectSchema } from './WorkCaseUpdateManyMutationInput.schema';
import { WorkCaseUncheckedUpdateManyWithoutRaisedByUserInputObjectSchema as WorkCaseUncheckedUpdateManyWithoutRaisedByUserInputObjectSchema } from './WorkCaseUncheckedUpdateManyWithoutRaisedByUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => WorkCaseUpdateManyMutationInputObjectSchema), z.lazy(() => WorkCaseUncheckedUpdateManyWithoutRaisedByUserInputObjectSchema)])
}).strict();
export const WorkCaseUpdateManyWithWhereWithoutRaisedByUserInputObjectSchema: z.ZodType<Prisma.WorkCaseUpdateManyWithWhereWithoutRaisedByUserInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUpdateManyWithWhereWithoutRaisedByUserInput>;
export const WorkCaseUpdateManyWithWhereWithoutRaisedByUserInputObjectZodSchema = makeSchema();
