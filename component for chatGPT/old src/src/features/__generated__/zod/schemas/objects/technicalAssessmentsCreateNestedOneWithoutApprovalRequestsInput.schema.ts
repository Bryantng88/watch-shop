import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { technicalAssessmentsCreateWithoutApprovalRequestsInputObjectSchema as technicalAssessmentsCreateWithoutApprovalRequestsInputObjectSchema } from './technicalAssessmentsCreateWithoutApprovalRequestsInput.schema';
import { technicalAssessmentsUncheckedCreateWithoutApprovalRequestsInputObjectSchema as technicalAssessmentsUncheckedCreateWithoutApprovalRequestsInputObjectSchema } from './technicalAssessmentsUncheckedCreateWithoutApprovalRequestsInput.schema';
import { technicalAssessmentsCreateOrConnectWithoutApprovalRequestsInputObjectSchema as technicalAssessmentsCreateOrConnectWithoutApprovalRequestsInputObjectSchema } from './technicalAssessmentsCreateOrConnectWithoutApprovalRequestsInput.schema';
import { technicalAssessmentsWhereUniqueInputObjectSchema as technicalAssessmentsWhereUniqueInputObjectSchema } from './technicalAssessmentsWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => technicalAssessmentsCreateWithoutApprovalRequestsInputObjectSchema), z.lazy(() => technicalAssessmentsUncheckedCreateWithoutApprovalRequestsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => technicalAssessmentsCreateOrConnectWithoutApprovalRequestsInputObjectSchema).optional(),
  connect: z.lazy(() => technicalAssessmentsWhereUniqueInputObjectSchema).optional()
}).strict();
export const technicalAssessmentsCreateNestedOneWithoutApprovalRequestsInputObjectSchema: z.ZodType<Prisma.technicalAssessmentsCreateNestedOneWithoutApprovalRequestsInput> = makeSchema() as unknown as z.ZodType<Prisma.technicalAssessmentsCreateNestedOneWithoutApprovalRequestsInput>;
export const technicalAssessmentsCreateNestedOneWithoutApprovalRequestsInputObjectZodSchema = makeSchema();
