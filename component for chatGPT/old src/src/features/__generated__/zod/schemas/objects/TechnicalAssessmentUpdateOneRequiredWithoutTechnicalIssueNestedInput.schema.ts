import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalAssessmentCreateWithoutTechnicalIssueInputObjectSchema as TechnicalAssessmentCreateWithoutTechnicalIssueInputObjectSchema } from './TechnicalAssessmentCreateWithoutTechnicalIssueInput.schema';
import { TechnicalAssessmentUncheckedCreateWithoutTechnicalIssueInputObjectSchema as TechnicalAssessmentUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './TechnicalAssessmentUncheckedCreateWithoutTechnicalIssueInput.schema';
import { TechnicalAssessmentCreateOrConnectWithoutTechnicalIssueInputObjectSchema as TechnicalAssessmentCreateOrConnectWithoutTechnicalIssueInputObjectSchema } from './TechnicalAssessmentCreateOrConnectWithoutTechnicalIssueInput.schema';
import { TechnicalAssessmentUpsertWithoutTechnicalIssueInputObjectSchema as TechnicalAssessmentUpsertWithoutTechnicalIssueInputObjectSchema } from './TechnicalAssessmentUpsertWithoutTechnicalIssueInput.schema';
import { TechnicalAssessmentWhereUniqueInputObjectSchema as TechnicalAssessmentWhereUniqueInputObjectSchema } from './TechnicalAssessmentWhereUniqueInput.schema';
import { TechnicalAssessmentUpdateToOneWithWhereWithoutTechnicalIssueInputObjectSchema as TechnicalAssessmentUpdateToOneWithWhereWithoutTechnicalIssueInputObjectSchema } from './TechnicalAssessmentUpdateToOneWithWhereWithoutTechnicalIssueInput.schema';
import { TechnicalAssessmentUpdateWithoutTechnicalIssueInputObjectSchema as TechnicalAssessmentUpdateWithoutTechnicalIssueInputObjectSchema } from './TechnicalAssessmentUpdateWithoutTechnicalIssueInput.schema';
import { TechnicalAssessmentUncheckedUpdateWithoutTechnicalIssueInputObjectSchema as TechnicalAssessmentUncheckedUpdateWithoutTechnicalIssueInputObjectSchema } from './TechnicalAssessmentUncheckedUpdateWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TechnicalAssessmentCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => TechnicalAssessmentUncheckedCreateWithoutTechnicalIssueInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TechnicalAssessmentCreateOrConnectWithoutTechnicalIssueInputObjectSchema).optional(),
  upsert: z.lazy(() => TechnicalAssessmentUpsertWithoutTechnicalIssueInputObjectSchema).optional(),
  connect: z.lazy(() => TechnicalAssessmentWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => TechnicalAssessmentUpdateToOneWithWhereWithoutTechnicalIssueInputObjectSchema), z.lazy(() => TechnicalAssessmentUpdateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => TechnicalAssessmentUncheckedUpdateWithoutTechnicalIssueInputObjectSchema)]).optional()
}).strict();
export const TechnicalAssessmentUpdateOneRequiredWithoutTechnicalIssueNestedInputObjectSchema: z.ZodType<Prisma.TechnicalAssessmentUpdateOneRequiredWithoutTechnicalIssueNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentUpdateOneRequiredWithoutTechnicalIssueNestedInput>;
export const TechnicalAssessmentUpdateOneRequiredWithoutTechnicalIssueNestedInputObjectZodSchema = makeSchema();
