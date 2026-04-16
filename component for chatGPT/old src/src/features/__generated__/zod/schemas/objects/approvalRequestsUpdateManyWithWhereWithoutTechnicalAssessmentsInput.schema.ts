import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { approvalRequestsScalarWhereInputObjectSchema as approvalRequestsScalarWhereInputObjectSchema } from './approvalRequestsScalarWhereInput.schema';
import { approvalRequestsUpdateManyMutationInputObjectSchema as approvalRequestsUpdateManyMutationInputObjectSchema } from './approvalRequestsUpdateManyMutationInput.schema';
import { approvalRequestsUncheckedUpdateManyWithoutTechnicalAssessmentsInputObjectSchema as approvalRequestsUncheckedUpdateManyWithoutTechnicalAssessmentsInputObjectSchema } from './approvalRequestsUncheckedUpdateManyWithoutTechnicalAssessmentsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => approvalRequestsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => approvalRequestsUpdateManyMutationInputObjectSchema), z.lazy(() => approvalRequestsUncheckedUpdateManyWithoutTechnicalAssessmentsInputObjectSchema)])
}).strict();
export const approvalRequestsUpdateManyWithWhereWithoutTechnicalAssessmentsInputObjectSchema: z.ZodType<Prisma.approvalRequestsUpdateManyWithWhereWithoutTechnicalAssessmentsInput> = makeSchema() as unknown as z.ZodType<Prisma.approvalRequestsUpdateManyWithWhereWithoutTechnicalAssessmentsInput>;
export const approvalRequestsUpdateManyWithWhereWithoutTechnicalAssessmentsInputObjectZodSchema = makeSchema();
