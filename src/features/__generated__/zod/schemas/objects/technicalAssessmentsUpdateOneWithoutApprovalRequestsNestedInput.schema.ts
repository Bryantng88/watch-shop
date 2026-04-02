import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { technicalAssessmentsCreateWithoutApprovalRequestsInputObjectSchema as technicalAssessmentsCreateWithoutApprovalRequestsInputObjectSchema } from './technicalAssessmentsCreateWithoutApprovalRequestsInput.schema';
import { technicalAssessmentsUncheckedCreateWithoutApprovalRequestsInputObjectSchema as technicalAssessmentsUncheckedCreateWithoutApprovalRequestsInputObjectSchema } from './technicalAssessmentsUncheckedCreateWithoutApprovalRequestsInput.schema';
import { technicalAssessmentsCreateOrConnectWithoutApprovalRequestsInputObjectSchema as technicalAssessmentsCreateOrConnectWithoutApprovalRequestsInputObjectSchema } from './technicalAssessmentsCreateOrConnectWithoutApprovalRequestsInput.schema';
import { technicalAssessmentsUpsertWithoutApprovalRequestsInputObjectSchema as technicalAssessmentsUpsertWithoutApprovalRequestsInputObjectSchema } from './technicalAssessmentsUpsertWithoutApprovalRequestsInput.schema';
import { technicalAssessmentsWhereInputObjectSchema as technicalAssessmentsWhereInputObjectSchema } from './technicalAssessmentsWhereInput.schema';
import { technicalAssessmentsWhereUniqueInputObjectSchema as technicalAssessmentsWhereUniqueInputObjectSchema } from './technicalAssessmentsWhereUniqueInput.schema';
import { technicalAssessmentsUpdateToOneWithWhereWithoutApprovalRequestsInputObjectSchema as technicalAssessmentsUpdateToOneWithWhereWithoutApprovalRequestsInputObjectSchema } from './technicalAssessmentsUpdateToOneWithWhereWithoutApprovalRequestsInput.schema';
import { technicalAssessmentsUpdateWithoutApprovalRequestsInputObjectSchema as technicalAssessmentsUpdateWithoutApprovalRequestsInputObjectSchema } from './technicalAssessmentsUpdateWithoutApprovalRequestsInput.schema';
import { technicalAssessmentsUncheckedUpdateWithoutApprovalRequestsInputObjectSchema as technicalAssessmentsUncheckedUpdateWithoutApprovalRequestsInputObjectSchema } from './technicalAssessmentsUncheckedUpdateWithoutApprovalRequestsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => technicalAssessmentsCreateWithoutApprovalRequestsInputObjectSchema), z.lazy(() => technicalAssessmentsUncheckedCreateWithoutApprovalRequestsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => technicalAssessmentsCreateOrConnectWithoutApprovalRequestsInputObjectSchema).optional(),
  upsert: z.lazy(() => technicalAssessmentsUpsertWithoutApprovalRequestsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => technicalAssessmentsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => technicalAssessmentsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => technicalAssessmentsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => technicalAssessmentsUpdateToOneWithWhereWithoutApprovalRequestsInputObjectSchema), z.lazy(() => technicalAssessmentsUpdateWithoutApprovalRequestsInputObjectSchema), z.lazy(() => technicalAssessmentsUncheckedUpdateWithoutApprovalRequestsInputObjectSchema)]).optional()
}).strict();
export const technicalAssessmentsUpdateOneWithoutApprovalRequestsNestedInputObjectSchema: z.ZodType<Prisma.technicalAssessmentsUpdateOneWithoutApprovalRequestsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.technicalAssessmentsUpdateOneWithoutApprovalRequestsNestedInput>;
export const technicalAssessmentsUpdateOneWithoutApprovalRequestsNestedInputObjectZodSchema = makeSchema();
