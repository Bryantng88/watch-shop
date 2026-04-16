import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalAssessmentUpdateWithoutTechnicalIssueInputObjectSchema as TechnicalAssessmentUpdateWithoutTechnicalIssueInputObjectSchema } from './TechnicalAssessmentUpdateWithoutTechnicalIssueInput.schema';
import { TechnicalAssessmentUncheckedUpdateWithoutTechnicalIssueInputObjectSchema as TechnicalAssessmentUncheckedUpdateWithoutTechnicalIssueInputObjectSchema } from './TechnicalAssessmentUncheckedUpdateWithoutTechnicalIssueInput.schema';
import { TechnicalAssessmentCreateWithoutTechnicalIssueInputObjectSchema as TechnicalAssessmentCreateWithoutTechnicalIssueInputObjectSchema } from './TechnicalAssessmentCreateWithoutTechnicalIssueInput.schema';
import { TechnicalAssessmentUncheckedCreateWithoutTechnicalIssueInputObjectSchema as TechnicalAssessmentUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './TechnicalAssessmentUncheckedCreateWithoutTechnicalIssueInput.schema';
import { TechnicalAssessmentWhereInputObjectSchema as TechnicalAssessmentWhereInputObjectSchema } from './TechnicalAssessmentWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => TechnicalAssessmentUpdateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => TechnicalAssessmentUncheckedUpdateWithoutTechnicalIssueInputObjectSchema)]),
  create: z.union([z.lazy(() => TechnicalAssessmentCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => TechnicalAssessmentUncheckedCreateWithoutTechnicalIssueInputObjectSchema)]),
  where: z.lazy(() => TechnicalAssessmentWhereInputObjectSchema).optional()
}).strict();
export const TechnicalAssessmentUpsertWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.TechnicalAssessmentUpsertWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentUpsertWithoutTechnicalIssueInput>;
export const TechnicalAssessmentUpsertWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
