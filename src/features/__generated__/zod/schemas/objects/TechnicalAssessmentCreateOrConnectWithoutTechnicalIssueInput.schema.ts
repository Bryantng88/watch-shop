import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalAssessmentWhereUniqueInputObjectSchema as TechnicalAssessmentWhereUniqueInputObjectSchema } from './TechnicalAssessmentWhereUniqueInput.schema';
import { TechnicalAssessmentCreateWithoutTechnicalIssueInputObjectSchema as TechnicalAssessmentCreateWithoutTechnicalIssueInputObjectSchema } from './TechnicalAssessmentCreateWithoutTechnicalIssueInput.schema';
import { TechnicalAssessmentUncheckedCreateWithoutTechnicalIssueInputObjectSchema as TechnicalAssessmentUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './TechnicalAssessmentUncheckedCreateWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalAssessmentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TechnicalAssessmentCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => TechnicalAssessmentUncheckedCreateWithoutTechnicalIssueInputObjectSchema)])
}).strict();
export const TechnicalAssessmentCreateOrConnectWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.TechnicalAssessmentCreateOrConnectWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentCreateOrConnectWithoutTechnicalIssueInput>;
export const TechnicalAssessmentCreateOrConnectWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
