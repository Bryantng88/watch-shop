import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseScalarWhereInputObjectSchema as WorkCaseScalarWhereInputObjectSchema } from './WorkCaseScalarWhereInput.schema';
import { WorkCaseUpdateManyMutationInputObjectSchema as WorkCaseUpdateManyMutationInputObjectSchema } from './WorkCaseUpdateManyMutationInput.schema';
import { WorkCaseUncheckedUpdateManyWithoutOrderInputObjectSchema as WorkCaseUncheckedUpdateManyWithoutOrderInputObjectSchema } from './WorkCaseUncheckedUpdateManyWithoutOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => WorkCaseUpdateManyMutationInputObjectSchema), z.lazy(() => WorkCaseUncheckedUpdateManyWithoutOrderInputObjectSchema)])
}).strict();
export const WorkCaseUpdateManyWithWhereWithoutOrderInputObjectSchema: z.ZodType<Prisma.WorkCaseUpdateManyWithWhereWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUpdateManyWithWhereWithoutOrderInput>;
export const WorkCaseUpdateManyWithWhereWithoutOrderInputObjectZodSchema = makeSchema();
