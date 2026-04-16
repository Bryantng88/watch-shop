import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueUpdateWithoutTechnicalAssessmentInputObjectSchema as TechnicalIssueUpdateWithoutTechnicalAssessmentInputObjectSchema } from './TechnicalIssueUpdateWithoutTechnicalAssessmentInput.schema';
import { TechnicalIssueUncheckedUpdateWithoutTechnicalAssessmentInputObjectSchema as TechnicalIssueUncheckedUpdateWithoutTechnicalAssessmentInputObjectSchema } from './TechnicalIssueUncheckedUpdateWithoutTechnicalAssessmentInput.schema';
import { TechnicalIssueCreateWithoutTechnicalAssessmentInputObjectSchema as TechnicalIssueCreateWithoutTechnicalAssessmentInputObjectSchema } from './TechnicalIssueCreateWithoutTechnicalAssessmentInput.schema';
import { TechnicalIssueUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema as TechnicalIssueUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutTechnicalAssessmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TechnicalIssueUpdateWithoutTechnicalAssessmentInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedUpdateWithoutTechnicalAssessmentInputObjectSchema)]),
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutTechnicalAssessmentInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema)])
}).strict();
export const TechnicalIssueUpsertWithWhereUniqueWithoutTechnicalAssessmentInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpsertWithWhereUniqueWithoutTechnicalAssessmentInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpsertWithWhereUniqueWithoutTechnicalAssessmentInput>;
export const TechnicalIssueUpsertWithWhereUniqueWithoutTechnicalAssessmentInputObjectZodSchema = makeSchema();
