import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseScalarWhereInputObjectSchema as WorkCaseScalarWhereInputObjectSchema } from './WorkCaseScalarWhereInput.schema';
import { WorkCaseUpdateManyMutationInputObjectSchema as WorkCaseUpdateManyMutationInputObjectSchema } from './WorkCaseUpdateManyMutationInput.schema';
import { WorkCaseUncheckedUpdateManyWithoutWatchInputObjectSchema as WorkCaseUncheckedUpdateManyWithoutWatchInputObjectSchema } from './WorkCaseUncheckedUpdateManyWithoutWatchInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => WorkCaseUpdateManyMutationInputObjectSchema), z.lazy(() => WorkCaseUncheckedUpdateManyWithoutWatchInputObjectSchema)])
}).strict();
export const WorkCaseUpdateManyWithWhereWithoutWatchInputObjectSchema: z.ZodType<Prisma.WorkCaseUpdateManyWithWhereWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUpdateManyWithWhereWithoutWatchInput>;
export const WorkCaseUpdateManyWithWhereWithoutWatchInputObjectZodSchema = makeSchema();
