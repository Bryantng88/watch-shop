import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { approvalRequestsWhereUniqueInputObjectSchema as approvalRequestsWhereUniqueInputObjectSchema } from './approvalRequestsWhereUniqueInput.schema';
import { approvalRequestsUpdateWithoutTechnicalAssessmentsInputObjectSchema as approvalRequestsUpdateWithoutTechnicalAssessmentsInputObjectSchema } from './approvalRequestsUpdateWithoutTechnicalAssessmentsInput.schema';
import { approvalRequestsUncheckedUpdateWithoutTechnicalAssessmentsInputObjectSchema as approvalRequestsUncheckedUpdateWithoutTechnicalAssessmentsInputObjectSchema } from './approvalRequestsUncheckedUpdateWithoutTechnicalAssessmentsInput.schema';
import { approvalRequestsCreateWithoutTechnicalAssessmentsInputObjectSchema as approvalRequestsCreateWithoutTechnicalAssessmentsInputObjectSchema } from './approvalRequestsCreateWithoutTechnicalAssessmentsInput.schema';
import { approvalRequestsUncheckedCreateWithoutTechnicalAssessmentsInputObjectSchema as approvalRequestsUncheckedCreateWithoutTechnicalAssessmentsInputObjectSchema } from './approvalRequestsUncheckedCreateWithoutTechnicalAssessmentsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => approvalRequestsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => approvalRequestsUpdateWithoutTechnicalAssessmentsInputObjectSchema), z.lazy(() => approvalRequestsUncheckedUpdateWithoutTechnicalAssessmentsInputObjectSchema)]),
  create: z.union([z.lazy(() => approvalRequestsCreateWithoutTechnicalAssessmentsInputObjectSchema), z.lazy(() => approvalRequestsUncheckedCreateWithoutTechnicalAssessmentsInputObjectSchema)])
}).strict();
export const approvalRequestsUpsertWithWhereUniqueWithoutTechnicalAssessmentsInputObjectSchema: z.ZodType<Prisma.approvalRequestsUpsertWithWhereUniqueWithoutTechnicalAssessmentsInput> = makeSchema() as unknown as z.ZodType<Prisma.approvalRequestsUpsertWithWhereUniqueWithoutTechnicalAssessmentsInput>;
export const approvalRequestsUpsertWithWhereUniqueWithoutTechnicalAssessmentsInputObjectZodSchema = makeSchema();
