import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalAssessmentWhereInputObjectSchema as TechnicalAssessmentWhereInputObjectSchema } from './TechnicalAssessmentWhereInput.schema';
import { TechnicalAssessmentUpdateWithoutTechnicalIssueInputObjectSchema as TechnicalAssessmentUpdateWithoutTechnicalIssueInputObjectSchema } from './TechnicalAssessmentUpdateWithoutTechnicalIssueInput.schema';
import { TechnicalAssessmentUncheckedUpdateWithoutTechnicalIssueInputObjectSchema as TechnicalAssessmentUncheckedUpdateWithoutTechnicalIssueInputObjectSchema } from './TechnicalAssessmentUncheckedUpdateWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalAssessmentWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => TechnicalAssessmentUpdateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => TechnicalAssessmentUncheckedUpdateWithoutTechnicalIssueInputObjectSchema)])
}).strict();
export const TechnicalAssessmentUpdateToOneWithWhereWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.TechnicalAssessmentUpdateToOneWithWhereWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentUpdateToOneWithWhereWithoutTechnicalIssueInput>;
export const TechnicalAssessmentUpdateToOneWithWhereWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
