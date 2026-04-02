import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { approvalRequestsWhereUniqueInputObjectSchema as approvalRequestsWhereUniqueInputObjectSchema } from './approvalRequestsWhereUniqueInput.schema';
import { approvalRequestsCreateWithoutTechnicalAssessmentsInputObjectSchema as approvalRequestsCreateWithoutTechnicalAssessmentsInputObjectSchema } from './approvalRequestsCreateWithoutTechnicalAssessmentsInput.schema';
import { approvalRequestsUncheckedCreateWithoutTechnicalAssessmentsInputObjectSchema as approvalRequestsUncheckedCreateWithoutTechnicalAssessmentsInputObjectSchema } from './approvalRequestsUncheckedCreateWithoutTechnicalAssessmentsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => approvalRequestsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => approvalRequestsCreateWithoutTechnicalAssessmentsInputObjectSchema), z.lazy(() => approvalRequestsUncheckedCreateWithoutTechnicalAssessmentsInputObjectSchema)])
}).strict();
export const approvalRequestsCreateOrConnectWithoutTechnicalAssessmentsInputObjectSchema: z.ZodType<Prisma.approvalRequestsCreateOrConnectWithoutTechnicalAssessmentsInput> = makeSchema() as unknown as z.ZodType<Prisma.approvalRequestsCreateOrConnectWithoutTechnicalAssessmentsInput>;
export const approvalRequestsCreateOrConnectWithoutTechnicalAssessmentsInputObjectZodSchema = makeSchema();
