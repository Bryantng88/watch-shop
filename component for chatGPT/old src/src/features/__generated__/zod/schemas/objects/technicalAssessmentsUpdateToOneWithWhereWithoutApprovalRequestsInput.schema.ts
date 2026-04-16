import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { technicalAssessmentsWhereInputObjectSchema as technicalAssessmentsWhereInputObjectSchema } from './technicalAssessmentsWhereInput.schema';
import { technicalAssessmentsUpdateWithoutApprovalRequestsInputObjectSchema as technicalAssessmentsUpdateWithoutApprovalRequestsInputObjectSchema } from './technicalAssessmentsUpdateWithoutApprovalRequestsInput.schema';
import { technicalAssessmentsUncheckedUpdateWithoutApprovalRequestsInputObjectSchema as technicalAssessmentsUncheckedUpdateWithoutApprovalRequestsInputObjectSchema } from './technicalAssessmentsUncheckedUpdateWithoutApprovalRequestsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => technicalAssessmentsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => technicalAssessmentsUpdateWithoutApprovalRequestsInputObjectSchema), z.lazy(() => technicalAssessmentsUncheckedUpdateWithoutApprovalRequestsInputObjectSchema)])
}).strict();
export const technicalAssessmentsUpdateToOneWithWhereWithoutApprovalRequestsInputObjectSchema: z.ZodType<Prisma.technicalAssessmentsUpdateToOneWithWhereWithoutApprovalRequestsInput> = makeSchema() as unknown as z.ZodType<Prisma.technicalAssessmentsUpdateToOneWithWhereWithoutApprovalRequestsInput>;
export const technicalAssessmentsUpdateToOneWithWhereWithoutApprovalRequestsInputObjectZodSchema = makeSchema();
