import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseActivityScalarWhereInputObjectSchema as WorkCaseActivityScalarWhereInputObjectSchema } from './WorkCaseActivityScalarWhereInput.schema';
import { WorkCaseActivityUpdateManyMutationInputObjectSchema as WorkCaseActivityUpdateManyMutationInputObjectSchema } from './WorkCaseActivityUpdateManyMutationInput.schema';
import { WorkCaseActivityUncheckedUpdateManyWithoutWorkCaseInputObjectSchema as WorkCaseActivityUncheckedUpdateManyWithoutWorkCaseInputObjectSchema } from './WorkCaseActivityUncheckedUpdateManyWithoutWorkCaseInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseActivityScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => WorkCaseActivityUpdateManyMutationInputObjectSchema), z.lazy(() => WorkCaseActivityUncheckedUpdateManyWithoutWorkCaseInputObjectSchema)])
}).strict();
export const WorkCaseActivityUpdateManyWithWhereWithoutWorkCaseInputObjectSchema: z.ZodType<Prisma.WorkCaseActivityUpdateManyWithWhereWithoutWorkCaseInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseActivityUpdateManyWithWhereWithoutWorkCaseInput>;
export const WorkCaseActivityUpdateManyWithWhereWithoutWorkCaseInputObjectZodSchema = makeSchema();
