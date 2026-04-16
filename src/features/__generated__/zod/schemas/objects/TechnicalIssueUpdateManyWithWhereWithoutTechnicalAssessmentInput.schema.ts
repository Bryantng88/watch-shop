import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueScalarWhereInputObjectSchema as TechnicalIssueScalarWhereInputObjectSchema } from './TechnicalIssueScalarWhereInput.schema';
import { TechnicalIssueUpdateManyMutationInputObjectSchema as TechnicalIssueUpdateManyMutationInputObjectSchema } from './TechnicalIssueUpdateManyMutationInput.schema';
import { TechnicalIssueUncheckedUpdateManyWithoutTechnicalAssessmentInputObjectSchema as TechnicalIssueUncheckedUpdateManyWithoutTechnicalAssessmentInputObjectSchema } from './TechnicalIssueUncheckedUpdateManyWithoutTechnicalAssessmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TechnicalIssueUpdateManyMutationInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedUpdateManyWithoutTechnicalAssessmentInputObjectSchema)])
}).strict();
export const TechnicalIssueUpdateManyWithWhereWithoutTechnicalAssessmentInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpdateManyWithWhereWithoutTechnicalAssessmentInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpdateManyWithWhereWithoutTechnicalAssessmentInput>;
export const TechnicalIssueUpdateManyWithWhereWithoutTechnicalAssessmentInputObjectZodSchema = makeSchema();
