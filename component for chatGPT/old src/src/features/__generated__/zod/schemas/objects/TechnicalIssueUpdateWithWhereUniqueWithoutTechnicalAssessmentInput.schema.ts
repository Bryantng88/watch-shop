import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueUpdateWithoutTechnicalAssessmentInputObjectSchema as TechnicalIssueUpdateWithoutTechnicalAssessmentInputObjectSchema } from './TechnicalIssueUpdateWithoutTechnicalAssessmentInput.schema';
import { TechnicalIssueUncheckedUpdateWithoutTechnicalAssessmentInputObjectSchema as TechnicalIssueUncheckedUpdateWithoutTechnicalAssessmentInputObjectSchema } from './TechnicalIssueUncheckedUpdateWithoutTechnicalAssessmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TechnicalIssueUpdateWithoutTechnicalAssessmentInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedUpdateWithoutTechnicalAssessmentInputObjectSchema)])
}).strict();
export const TechnicalIssueUpdateWithWhereUniqueWithoutTechnicalAssessmentInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpdateWithWhereUniqueWithoutTechnicalAssessmentInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpdateWithWhereUniqueWithoutTechnicalAssessmentInput>;
export const TechnicalIssueUpdateWithWhereUniqueWithoutTechnicalAssessmentInputObjectZodSchema = makeSchema();
