import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueCreateWithoutTechnicalAssessmentInputObjectSchema as TechnicalIssueCreateWithoutTechnicalAssessmentInputObjectSchema } from './TechnicalIssueCreateWithoutTechnicalAssessmentInput.schema';
import { TechnicalIssueUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema as TechnicalIssueUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutTechnicalAssessmentInput.schema';
import { TechnicalIssueCreateOrConnectWithoutTechnicalAssessmentInputObjectSchema as TechnicalIssueCreateOrConnectWithoutTechnicalAssessmentInputObjectSchema } from './TechnicalIssueCreateOrConnectWithoutTechnicalAssessmentInput.schema';
import { TechnicalIssueCreateManyTechnicalAssessmentInputEnvelopeObjectSchema as TechnicalIssueCreateManyTechnicalAssessmentInputEnvelopeObjectSchema } from './TechnicalIssueCreateManyTechnicalAssessmentInputEnvelope.schema';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutTechnicalAssessmentInputObjectSchema), z.lazy(() => TechnicalIssueCreateWithoutTechnicalAssessmentInputObjectSchema).array(), z.lazy(() => TechnicalIssueUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TechnicalIssueCreateOrConnectWithoutTechnicalAssessmentInputObjectSchema), z.lazy(() => TechnicalIssueCreateOrConnectWithoutTechnicalAssessmentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TechnicalIssueCreateManyTechnicalAssessmentInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TechnicalIssueCreateNestedManyWithoutTechnicalAssessmentInputObjectSchema: z.ZodType<Prisma.TechnicalIssueCreateNestedManyWithoutTechnicalAssessmentInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueCreateNestedManyWithoutTechnicalAssessmentInput>;
export const TechnicalIssueCreateNestedManyWithoutTechnicalAssessmentInputObjectZodSchema = makeSchema();
