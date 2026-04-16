import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueCreateWithoutTechnicalAssessmentInputObjectSchema as TechnicalIssueCreateWithoutTechnicalAssessmentInputObjectSchema } from './TechnicalIssueCreateWithoutTechnicalAssessmentInput.schema';
import { TechnicalIssueUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema as TechnicalIssueUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutTechnicalAssessmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutTechnicalAssessmentInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema)])
}).strict();
export const TechnicalIssueCreateOrConnectWithoutTechnicalAssessmentInputObjectSchema: z.ZodType<Prisma.TechnicalIssueCreateOrConnectWithoutTechnicalAssessmentInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueCreateOrConnectWithoutTechnicalAssessmentInput>;
export const TechnicalIssueCreateOrConnectWithoutTechnicalAssessmentInputObjectZodSchema = makeSchema();
