import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalAssessmentCreateWithoutTechnicalIssueInputObjectSchema as TechnicalAssessmentCreateWithoutTechnicalIssueInputObjectSchema } from './TechnicalAssessmentCreateWithoutTechnicalIssueInput.schema';
import { TechnicalAssessmentUncheckedCreateWithoutTechnicalIssueInputObjectSchema as TechnicalAssessmentUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './TechnicalAssessmentUncheckedCreateWithoutTechnicalIssueInput.schema';
import { TechnicalAssessmentCreateOrConnectWithoutTechnicalIssueInputObjectSchema as TechnicalAssessmentCreateOrConnectWithoutTechnicalIssueInputObjectSchema } from './TechnicalAssessmentCreateOrConnectWithoutTechnicalIssueInput.schema';
import { TechnicalAssessmentWhereUniqueInputObjectSchema as TechnicalAssessmentWhereUniqueInputObjectSchema } from './TechnicalAssessmentWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TechnicalAssessmentCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => TechnicalAssessmentUncheckedCreateWithoutTechnicalIssueInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TechnicalAssessmentCreateOrConnectWithoutTechnicalIssueInputObjectSchema).optional(),
  connect: z.lazy(() => TechnicalAssessmentWhereUniqueInputObjectSchema).optional()
}).strict();
export const TechnicalAssessmentCreateNestedOneWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.TechnicalAssessmentCreateNestedOneWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentCreateNestedOneWithoutTechnicalIssueInput>;
export const TechnicalAssessmentCreateNestedOneWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
