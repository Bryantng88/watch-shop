import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseActivityScalarWhereInputObjectSchema as WorkCaseActivityScalarWhereInputObjectSchema } from './WorkCaseActivityScalarWhereInput.schema';
import { WorkCaseActivityUpdateManyMutationInputObjectSchema as WorkCaseActivityUpdateManyMutationInputObjectSchema } from './WorkCaseActivityUpdateManyMutationInput.schema';
import { WorkCaseActivityUncheckedUpdateManyWithoutActorInputObjectSchema as WorkCaseActivityUncheckedUpdateManyWithoutActorInputObjectSchema } from './WorkCaseActivityUncheckedUpdateManyWithoutActorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseActivityScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => WorkCaseActivityUpdateManyMutationInputObjectSchema), z.lazy(() => WorkCaseActivityUncheckedUpdateManyWithoutActorInputObjectSchema)])
}).strict();
export const WorkCaseActivityUpdateManyWithWhereWithoutActorInputObjectSchema: z.ZodType<Prisma.WorkCaseActivityUpdateManyWithWhereWithoutActorInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseActivityUpdateManyWithWhereWithoutActorInput>;
export const WorkCaseActivityUpdateManyWithWhereWithoutActorInputObjectZodSchema = makeSchema();
