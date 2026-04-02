import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { approvalRequestsWhereUniqueInputObjectSchema as approvalRequestsWhereUniqueInputObjectSchema } from './approvalRequestsWhereUniqueInput.schema';
import { approvalRequestsUpdateWithoutTechnicalAssessmentsInputObjectSchema as approvalRequestsUpdateWithoutTechnicalAssessmentsInputObjectSchema } from './approvalRequestsUpdateWithoutTechnicalAssessmentsInput.schema';
import { approvalRequestsUncheckedUpdateWithoutTechnicalAssessmentsInputObjectSchema as approvalRequestsUncheckedUpdateWithoutTechnicalAssessmentsInputObjectSchema } from './approvalRequestsUncheckedUpdateWithoutTechnicalAssessmentsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => approvalRequestsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => approvalRequestsUpdateWithoutTechnicalAssessmentsInputObjectSchema), z.lazy(() => approvalRequestsUncheckedUpdateWithoutTechnicalAssessmentsInputObjectSchema)])
}).strict();
export const approvalRequestsUpdateWithWhereUniqueWithoutTechnicalAssessmentsInputObjectSchema: z.ZodType<Prisma.approvalRequestsUpdateWithWhereUniqueWithoutTechnicalAssessmentsInput> = makeSchema() as unknown as z.ZodType<Prisma.approvalRequestsUpdateWithWhereUniqueWithoutTechnicalAssessmentsInput>;
export const approvalRequestsUpdateWithWhereUniqueWithoutTechnicalAssessmentsInputObjectZodSchema = makeSchema();
