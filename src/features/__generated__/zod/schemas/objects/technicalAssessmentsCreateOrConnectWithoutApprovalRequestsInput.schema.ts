import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { technicalAssessmentsWhereUniqueInputObjectSchema as technicalAssessmentsWhereUniqueInputObjectSchema } from './technicalAssessmentsWhereUniqueInput.schema';
import { technicalAssessmentsCreateWithoutApprovalRequestsInputObjectSchema as technicalAssessmentsCreateWithoutApprovalRequestsInputObjectSchema } from './technicalAssessmentsCreateWithoutApprovalRequestsInput.schema';
import { technicalAssessmentsUncheckedCreateWithoutApprovalRequestsInputObjectSchema as technicalAssessmentsUncheckedCreateWithoutApprovalRequestsInputObjectSchema } from './technicalAssessmentsUncheckedCreateWithoutApprovalRequestsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => technicalAssessmentsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => technicalAssessmentsCreateWithoutApprovalRequestsInputObjectSchema), z.lazy(() => technicalAssessmentsUncheckedCreateWithoutApprovalRequestsInputObjectSchema)])
}).strict();
export const technicalAssessmentsCreateOrConnectWithoutApprovalRequestsInputObjectSchema: z.ZodType<Prisma.technicalAssessmentsCreateOrConnectWithoutApprovalRequestsInput> = makeSchema() as unknown as z.ZodType<Prisma.technicalAssessmentsCreateOrConnectWithoutApprovalRequestsInput>;
export const technicalAssessmentsCreateOrConnectWithoutApprovalRequestsInputObjectZodSchema = makeSchema();
