import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { technicalAssessmentsUpdateWithoutApprovalRequestsInputObjectSchema as technicalAssessmentsUpdateWithoutApprovalRequestsInputObjectSchema } from './technicalAssessmentsUpdateWithoutApprovalRequestsInput.schema';
import { technicalAssessmentsUncheckedUpdateWithoutApprovalRequestsInputObjectSchema as technicalAssessmentsUncheckedUpdateWithoutApprovalRequestsInputObjectSchema } from './technicalAssessmentsUncheckedUpdateWithoutApprovalRequestsInput.schema';
import { technicalAssessmentsCreateWithoutApprovalRequestsInputObjectSchema as technicalAssessmentsCreateWithoutApprovalRequestsInputObjectSchema } from './technicalAssessmentsCreateWithoutApprovalRequestsInput.schema';
import { technicalAssessmentsUncheckedCreateWithoutApprovalRequestsInputObjectSchema as technicalAssessmentsUncheckedCreateWithoutApprovalRequestsInputObjectSchema } from './technicalAssessmentsUncheckedCreateWithoutApprovalRequestsInput.schema';
import { technicalAssessmentsWhereInputObjectSchema as technicalAssessmentsWhereInputObjectSchema } from './technicalAssessmentsWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => technicalAssessmentsUpdateWithoutApprovalRequestsInputObjectSchema), z.lazy(() => technicalAssessmentsUncheckedUpdateWithoutApprovalRequestsInputObjectSchema)]),
  create: z.union([z.lazy(() => technicalAssessmentsCreateWithoutApprovalRequestsInputObjectSchema), z.lazy(() => technicalAssessmentsUncheckedCreateWithoutApprovalRequestsInputObjectSchema)]),
  where: z.lazy(() => technicalAssessmentsWhereInputObjectSchema).optional()
}).strict();
export const technicalAssessmentsUpsertWithoutApprovalRequestsInputObjectSchema: z.ZodType<Prisma.technicalAssessmentsUpsertWithoutApprovalRequestsInput> = makeSchema() as unknown as z.ZodType<Prisma.technicalAssessmentsUpsertWithoutApprovalRequestsInput>;
export const technicalAssessmentsUpsertWithoutApprovalRequestsInputObjectZodSchema = makeSchema();
